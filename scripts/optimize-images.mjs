import { mkdir, readdir, rename, rm } from 'node:fs/promises';
import { dirname, extname, join, relative, resolve, sep } from 'node:path';
import sharp from 'sharp';

const source = resolve(process.argv[2] ?? '_source_images');
const destination = resolve(process.argv[3] ?? 'img');
const formats = new Map([
    ['.jpg', 'jpeg'], ['.jpeg', 'jpeg'], ['.png', 'png'], ['.gif', 'gif'],
]);

async function* images(directory) {
    for (const entry of await readdir(directory, { withFileTypes: true })) {
        const path = join(directory, entry.name);
        if (entry.isDirectory()) yield* images(path);
        else if (entry.isFile() && formats.has(extname(path).toLowerCase())) yield path;
    }
}

async function writeImage(pipeline, path) {
    const temporary = `${path}.${process.pid}.tmp`;
    await mkdir(dirname(path), { recursive: true });
    try {
        await pipeline.toFile(temporary);
        await rename(temporary, path);
    } finally {
        await rm(temporary, { force: true });
    }
}

try {
    if (destination === source || destination.startsWith(source + sep)) {
        throw new Error('The output directory must be outside the source directory.');
    }
    let count = 0;
    for await (const input of images(source)) {
        const output = join(destination, relative(source, input));
        const format = formats.get(extname(input).toLowerCase());
        const image = sharp(input, { animated: format === 'gif' }).autoOrient();
        const optimized = format === 'jpeg'
            ? image.clone().jpeg({ quality: 80, mozjpeg: true })
            : format === 'png'
                ? image.clone().png({ palette: true, quality: 90, effort: 7 })
                : image.clone().gif({ effort: 7 });
        await writeImage(optimized, output);
        if (format !== 'gif') {
            await writeImage(image.clone().webp({ quality: 80 }), output.slice(0, -extname(output).length) + '.webp');
        }
        console.log(`Optimized ${relative(source, input)}`);
        count++;
    }
    console.log(`Image optimization complete (${count} images).`);
} catch (error) {
    console.error(`Image optimization failed: ${error.message}`);
    process.exitCode = 1;
}
