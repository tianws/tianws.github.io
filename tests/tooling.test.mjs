import assert from 'node:assert/strict';
import { execFile, spawn } from 'node:child_process';
import { once } from 'node:events';
import { mkdtemp, mkdir, readFile, readdir, rename, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { setTimeout as delay } from 'node:timers/promises';
import { fileURLToPath } from 'node:url';
import { promisify } from 'node:util';
import test from 'node:test';
import sharp from 'sharp';

const exec = promisify(execFile);
const optimize = fileURLToPath(new URL('../scripts/optimize-images.mjs', import.meta.url));
const watch = fileURLToPath(new URL('../scripts/watch-assets.mjs', import.meta.url));

async function workspace(t) {
    const root = await mkdtemp(join(tmpdir(), 'blog-tooling-'));
    t.after(() => rm(root, { recursive: true, force: true }));
    return root;
}

async function until(predicate) {
    const deadline = Date.now() + 10000;
    while (Date.now() < deadline) {
        if (await predicate()) return;
        await delay(50);
    }
    assert.fail('Timed out waiting for the expected build result');
}

test('image optimization preserves paths, transparency and GIF animation', async t => {
    const root = await workspace(t);
    const input = join(root, 'source');
    const output = join(root, 'output');
    await mkdir(join(input, '中文 images'), { recursive: true });
    const still = sharp({ create: { width: 8, height: 6, channels: 4, background: '#ff000080' } });
    await still.clone().jpeg().toFile(join(input, '中文 images/photo.JPG'));
    await still.clone().png().toFile(join(input, 'transparent.png'));
    await still.clone().jpeg().withMetadata({ orientation: 6 }).toFile(join(input, 'rotated.jpg'));
    const frames = Buffer.from([
        ...Array(4).fill([255, 0, 0]).flat(), ...Array(4).fill([0, 0, 255]).flat(),
    ]);
    await sharp(frames, { raw: { width: 2, height: 4, channels: 3, pageHeight: 2 } })
        .gif({ loop: 2, delay: [100, 200] }).toFile(join(input, 'animated.gif'));
    await writeFile(join(input, 'ignored.txt'), 'not an image');
    await exec(process.execPath, [optimize, input, output]);
    for (const path of ['中文 images/photo.JPG', '中文 images/photo.webp', 'transparent.png', 'transparent.webp']) {
        const metadata = await sharp(join(output, path)).metadata();
        assert.equal(metadata.width, 8);
        assert.equal(metadata.height, 6);
        if (path.startsWith('transparent')) assert.equal(metadata.hasAlpha, true);
    }
    const animation = await sharp(join(output, 'animated.gif'), { animated: true }).metadata();
    assert.equal(animation.pages, 2);
    assert.equal(animation.loop, 2);
    assert.deepEqual(animation.delay, [100, 200]);
    for (const name of ['rotated.jpg', 'rotated.webp']) {
        const metadata = await sharp(join(output, name)).metadata();
        assert.equal(metadata.width, 6);
        assert.equal(metadata.height, 8);
    }
    assert.deepEqual((await readdir(output)).sort(), ['animated.gif', 'rotated.jpg', 'rotated.webp', 'transparent.png', 'transparent.webp', '中文 images'].sort());
});

test('invalid image input fails without overwriting an existing image', async t => {
    const root = await workspace(t);
    const input = join(root, 'source');
    const output = join(root, 'output');
    await mkdir(input);
    await mkdir(output);
    await writeFile(join(input, 'photo.jpg'), 'corrupt image');
    await writeFile(join(output, 'photo.jpg'), 'existing image');
    await assert.rejects(exec(process.execPath, [optimize, input, output]));
    assert.equal(await readFile(join(output, 'photo.jpg'), 'utf8'), 'existing image');
    assert.deepEqual(await readdir(output), ['photo.jpg']);
    await assert.rejects(exec(process.execPath, [optimize, join(root, 'missing'), output]));
    await assert.rejects(exec(process.execPath, [optimize, input, join(input, 'output')]));
});

for (const [mode, source, ignored] of [
    ['css', 'less/sample.less', 'less/notes.txt'],
    ['js', 'js/hux-blog.js', 'js/hux-blog.min.js'],
]) {
    test(`${mode} watcher handles saves and atomic replacements without watching build output`, async t => {
        const root = await workspace(t);
        await mkdir(join(root, mode === 'css' ? 'less' : 'js'));
        await writeFile(join(root, source), 'initial');
        await writeFile(join(root, 'package.json'), JSON.stringify({
            scripts: { [`build:${mode}`]: `node build.mjs ${source}` },
        }));
        await writeFile(join(root, 'build.mjs'), `
            import { readFileSync, writeFileSync, appendFileSync } from 'node:fs';
            writeFileSync('result.txt', readFileSync(process.argv[2]));
            appendFileSync('builds.log', 'built\\n');
        `);
        const child = spawn(process.execPath, [watch, mode], { cwd: root, stdio: ['ignore', 'pipe', 'pipe'] });
        let logs = '';
        child.stdout.on('data', data => { logs += data; });
        child.stderr.on('data', data => { logs += data; });
        t.after(async () => {
            if (child.exitCode === null && child.signalCode === null) {
                const exited = once(child, 'exit');
                child.kill('SIGTERM');
                await exited;
            }
        });
        await until(() => logs.includes('Watching'));
        const result = () => readFile(join(root, 'result.txt'), 'utf8').catch(() => '');
        await writeFile(join(root, source), 'first save');
        await until(async () => await result() === 'first save');
        await writeFile(join(root, 'replacement'), 'atomic save');
        await rename(join(root, 'replacement'), join(root, source));
        await until(async () => await result() === 'atomic save');
        await delay(300);
        const builds = await readFile(join(root, 'builds.log'), 'utf8');
        await writeFile(join(root, ignored), 'generated or unrelated file');
        await delay(400);
        assert.equal(await readFile(join(root, 'builds.log'), 'utf8'), builds);
    });
}
