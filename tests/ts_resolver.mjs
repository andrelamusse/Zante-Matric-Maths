import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import esbuild from 'esbuild';

export async function resolve(specifier, context, nextResolve) {
  try {
    const res = await nextResolve(specifier, context);
    if (res.url && (res.url.endsWith('.ts') || res.url.endsWith('.tsx'))) {
      return {
        format: 'module',
        url: res.url,
        shortCircuit: true,
      };
    }
    return res;
  } catch (err) {
    if (
      err.code === 'ERR_MODULE_NOT_FOUND' &&
      (specifier.startsWith('./') ||
        specifier.startsWith('../') ||
        specifier.startsWith('@/'))
    ) {
      const parentUrl = context.parentURL;
      if (parentUrl && parentUrl.startsWith('file://')) {
        let basePath;
        if (specifier.startsWith('@/')) {
          basePath = path.resolve('src', specifier.slice(2));
        } else {
          const parentDir = path.dirname(fileURLToPath(parentUrl));
          basePath = path.resolve(parentDir, specifier);
        }
        for (const ext of ['.ts', '.tsx', '.js', '/index.ts', '/index.js']) {
          const candidate = basePath + ext;
          if (fs.existsSync(candidate) && fs.statSync(candidate).isFile()) {
            return {
              url: pathToFileURL(candidate).href,
              format: 'module',
              shortCircuit: true,
            };
          }
        }
      }
    }
    throw err;
  }
}

export async function load(url, context, nextLoad) {
  if (url.startsWith('file://') && (url.endsWith('.ts') || url.endsWith('.tsx'))) {
    const filePath = fileURLToPath(url);
    const source = fs.readFileSync(filePath, 'utf-8');
    const isTsx = url.endsWith('.tsx');
    const transformed = esbuild.transformSync(source, {
      loader: isTsx ? 'tsx' : 'ts',
      format: 'esm',
      target: 'esnext',
      sourcemap: 'inline',
    });
    return {
      format: 'module',
      source: transformed.code,
      shortCircuit: true,
    };
  }
  return nextLoad(url, context);
}
