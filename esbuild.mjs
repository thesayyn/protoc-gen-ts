import { build } from 'esbuild';
import glob from 'fast-glob';

await build({
    // entryPoints: await glob(`src/**/!(*.d).ts`),
    entryPoints: [ 'src/index.ts' ],
    outdir: 'lib',
    outbase: 'src',
    bundle: true,
    sourcemap: true,
    minify: false,
    format: 'cjs',
    target: [ 'esnext' ],
    external: [
        'fs',
        'path',
        'os',
        'crypto',
        'buffer',
        'inspector',
    ],
});