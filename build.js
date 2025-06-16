import esbuild from 'esbuild';

esbuild.build({
    entryPoints: ['index.js'],
    bundle: true,
    platform: 'node',
    outfile: 'bin/kvman',
    format: 'esm',
    banner: {
        js: '#!/usr/bin/env node',
    },
}).then(() => {
    console.log('Build complete!');
});
