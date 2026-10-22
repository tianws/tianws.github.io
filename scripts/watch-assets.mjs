import { spawn } from 'node:child_process';
import { watch } from 'node:fs';

const configurations = {
    css: { directory: 'less', matches: name => name.endsWith('.less'), task: 'build:css' },
    js: { directory: 'js', matches: name => name === 'hux-blog.js', task: 'build:js' },
};
const configuration = configurations[process.argv[2]];
if (!configuration) {
    console.error('Usage: node scripts/watch-assets.mjs <css|js>');
    process.exit(1);
}

let child;
let timer;
let pending = false;
let stopping = false;

function build() {
    if (stopping) return;
    if (child) {
        pending = true;
        return;
    }
    pending = false;
    child = spawn('npm', ['run', configuration.task], { stdio: 'inherit' });
    child.on('error', error => console.error(`Build failed: ${error.message}`));
    child.on('close', code => {
        child = undefined;
        if (code !== 0 && !stopping) console.error(`Build exited with code ${code}; waiting for the next change.`);
        if (pending) build();
    });
}

const watcher = watch(configuration.directory, (_event, filename) => {
    if (filename && !configuration.matches(filename.toString())) return;
    clearTimeout(timer);
    timer = setTimeout(build, 100);
});
console.log(`Watching ${configuration.directory} for ${configuration.task}`);

for (const signal of ['SIGINT', 'SIGTERM']) {
    process.on(signal, () => {
        stopping = true;
        clearTimeout(timer);
        watcher.close();
        child?.kill(signal);
    });
}
