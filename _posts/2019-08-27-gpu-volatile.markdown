---
layout:     post
title:      "Pytorch加速数据读取"
subtitle:   "加速训练——提高GPU利用率"
date:       2019-08-27 00:00:00
author:     "Tian"
categories: Skill
header-img: "img/post-bg-pytorch.jpg"
header-mask: 0.2
catalog: true
tags:
    - 训练技巧
    - Code
typora-root-url: ../
---

## 需求

最近在训练coco数据集，训练集就有11万张，训练一个epoch就要将近100分钟，训练100个epoch，就需要7天！这实在是太慢了。

经过观察，发现训练时GPU利用率不是很稳定，每训练5秒，利用率都要从100%掉到0%一两秒，初步判断是数据读取那块出现了瓶颈。于是经过调研和实验，制定了下列解决方案。

## 解决方案

### （1）prefetch_generator

使用[prefetch_generator](https://pypi.org/project/prefetch_generator/)库在后台加载下一batch的数据。

**安装：**

```bash
pip install prefetch_generator
```

**使用：**

```python
# 新建DataLoaderX类
from torch.utils.data import DataLoader
from prefetch_generator import BackgroundGenerator

class DataLoaderX(DataLoader):

    def __iter__(self):
        return BackgroundGenerator(super().__iter__())
```

然后用`DataLoaderX`替换原本的`DataLoader`。

**提速原因：**

> 原本Pytorch默认的DataLoader会创建一些worker线程来预读取新的数据，但是除非这些线程的数据全部都被清空，这些线程才会读下一批数据。
>
> 使用prefetch_generator，我们可以保证线程不会等待，每个线程都总有至少一个数据在加载。

### （2）data_prefetcher 

使用[data_prefetcher](https://github.com/NVIDIA/apex/blob/master/examples/imagenet/main_amp.py#L256)新开cuda stream来拷贝tensor到gpu。

**使用：**

```python
class DataPrefetcher():
    def __init__(self, loader, opt):
        self.loader = iter(loader)
        self.opt = opt
        self.stream = torch.cuda.Stream()
        # With Amp, it isn't necessary to manually convert data to half.
        # if args.fp16:
        #     self.mean = self.mean.half()
        #     self.std = self.std.half()
        self.preload()

    def preload(self):
        try:
            self.batch = next(self.loader)
        except StopIteration:
            self.batch = None
            return
        with torch.cuda.stream(self.stream):
            for k in self.batch:
                if k != 'meta':
                    self.batch[k] = self.batch[k].to(device=self.opt.device, non_blocking=True)

            # With Amp, it isn't necessary to manually convert data to half.
            # if args.fp16:
            #     self.next_input = self.next_input.half()
            # else:
            #     self.next_input = self.next_input.float()

    def next(self):
        torch.cuda.current_stream().wait_stream(self.stream)
        batch = self.batch
        self.preload()
        return batch
```

然后对训练代码做改造：

```python
# ----改造前----
for iter_id, batch in enumerate(data_loader):
    if iter_id >= num_iters:
        break
    for k in batch:
        if k != 'meta':
            batch[k] = batch[k].to(device=opt.device, non_blocking=True)
    run_step()
    
# ----改造后----
prefetcher = DataPrefetcher(data_loader, opt)
batch = prefetcher.next()
iter_id = 0
while batch is not None:
    iter_id += 1
    if iter_id >= num_iters:
        break
    run_step()
    batch = prefetcher.next()
```

**提速原因：**

>默认情况下，Pytorch将所有涉及到GPU的操作（比如内核操作，cpu->gpu，gpu->cpu）都排入同一个stream（default stream）中，并对同一个流的操作序列化，它们永远不会并行。要想并行，两个操作必须位于不同的stream中。
>
>而前向传播位于default stream中，因此，要想将下一个batch数据的预读取（涉及cpu->gpu）与当前batch的前向传播并行处理，就必须：
>
>1. cpu上的数据batch必须pinned;
>2. 预读取操作必须在另一个stream上进行
>
>上面的data_prefetcher类满足这两个要求。
>
>注意dataloader必须设置pin_memory=True来满足第一个条件。

### （3）把内存当硬盘

把数据放内存里，降低io延迟。

**使用：**

```bash
sudo mount tmpfs /path/to/your/data -t tmpfs -o size=30G
```

然后把数据放挂载的目录下，即可。

- `size`指定的是tmpfs动态大小的上限，实际大小根据实际使用情况而定；
- 数据不一定放在物理内存中，系统根据情况，有可能放在`swap`的页面，`swap`一般是在系统盘；
- 重启或者断电后数据全部清空。

如果想系统启动时自动挂载，可以编辑`/etc/fstab`，在最后添加如下内容：

```bash
mount tmpfs in /tmp/
tmpfs /tmp tmpfs size=30G 0 0
```

### （4）设置num_worker

`DataLoader`的`num_worker`如果设置太小，则不能充分利用多线程提速，如果设置太大，会造成线程阻塞，或者撑爆内存，反而导致训练变慢甚至程序崩溃。

他的大小和具体的硬件和软件都有关系，所以没有一个统一的标准，可以通过一些简单的实验来确定。

我的经验是设置成cpu的核心数或者gpu的数量比较合适。

### （5）优化数据预处理

主要有两个方面：

1. 尽量简化预处理的操作，使用numpy、opencv等优化过的库，多多利用向量化代码，提升代码运行效率；
2. 尽量缩减数据大小，不要传输无用信息。

### （6）其他

1. 使用`TFRecord`或者`LMDB`等，减少小文件的读写；
2. 使用`apex.DistributedDataParallel`替代`torch.DataParallel`，使用`apex`进行加速；
3. 使用`dali`库，在gpu上直接进行数据预处理。

## 实验

分别用不同的提速方法做实验，来定量地分析提速的效果。为了快速实验，采用了5000张的小批量训练集，确保一次epoch的训练时间很短。

**实验一：**

![1](/img/in-post/2019-08-27-gpu-volatile/1.png)

在hdd硬盘上，用同样的参数、同样的数据，分别用不同的优化方法，训练两个epoch，记录训练的时间。

优化方法分别是：

- `original`：默认dataloader，不优化
- `(1)prefetcher_generator`：只用prefetcher_generator库优化
- `(2)data_prefetcher`：只用data_prefetcher优化
- `(1)+(2)`：同时用`prefetcher_generator`和`data_prefetcher`优化

最后将得到的时间，除以不优化时的训练时间。

从图中可以观察到：

1. (1)和(2)两种优化方法都差不多有10%左右的训练时间的缩短；
2. (1)(2)同时使用，并没有进一步缩短训练时间，反而不如只使用一种优化方法。

**实验二：**

![2](/img/in-post/2019-08-27-gpu-volatile/2.png)

用同样的参数、同样的数据，用默认的dataloader，数据分别在hdd、ssd和tmpfs内存上进行训练两个epoch，记录训练时间。

最后时间统一除以在hdd上的训练时间。

从图中可以观察到：

1. 将数据从hdd挪到ssd或者内存上，训练时间都有14%左右的缩短；
2. 在tmpfs上训练并不比在ssd上快，可能的原因是数据太大，训练时并没有放在物理内存上，而是放在`swap`上，而这台机器`swap`也是在ssd上，所以速度差不多。

**实验三：**

![3](/img/in-post/2019-08-27-gpu-volatile/3.png)

优化数据预处理代码，尽量用向量化代码，缩减数据传输大小，分别在hdd上，用默认dataloader训练。

如图，训练时间缩短了接近34%！可见，在之前的代码中，主要是预处理部分拖慢了整体的训练速度。

## 总结

以上定量地分析了各加速方法的效果，当然如果各方法都用上，最后的加速比例不是简单叠加的。

最后，我将数据放在ssd上、用了(1)或者(2)的优化方法、优化了数据预处理代码后，最后使得训练时间缩短了39%！也就是说，如果原来训练一个模型需要7天，现在需要4天半，节省了2天半的时间。

所谓磨刀不误砍柴工，建议大家在正式训练前，花一点时间排查一下训练的瓶颈，尽量提升训练的速度，这是一劳永逸的，将在后面节省大量的时间，是非常值得的。



## 参考

- [Should we use BackgroundGenerator when we've had DataLoader?](https://github.com/IgorSusmelj/pytorch-styleguide/issues/5#) 

- [Dose data_prefetcher() really speed up training?](https://github.com/NVIDIA/apex/issues/304#)

- [如何给你PyTorch里的Dataloader打鸡血](https://zhuanlan.zhihu.com/p/66145913)

- [把内存当硬盘，提速你的linux系统](https://www.jianshu.com/p/6f9b200671bb)

- [Guidelines for assigning num_workers to DataLoader](https://discuss.pytorch.org/t/guidelines-for-assigning-num-workers-to-dataloader/813)

- [How to prefetch data when processing with GPU?](https://discuss.pytorch.org/t/how-to-prefetch-data-when-processing-with-gpu/548)
