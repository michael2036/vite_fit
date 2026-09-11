// GitHub Pages has no server-side routing: any URL that isn't exactly the
// deployed index (e.g. a refreshed/bookmarked/shared link) gets served the
// static file at 404.html instead. CoupleFit has no client-side router either
// (navigation is an in-memory appState machine, not URL-driven), so the
// correct 404 page is simply the same built index.html — it boots the app
// from wherever the visitor landed instead of GitHub's default 404 page.
import { copyFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const distDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', 'dist');
const indexPath = path.join(distDir, 'index.html');
const notFoundPath = path.join(distDir, '404.html');

if (!existsSync(indexPath)) {
  console.error(`postbuild: expected ${indexPath} to exist — did the build step run?`);
  process.exit(1);
}

await copyFile(indexPath, notFoundPath);
console.log('postbuild: copied dist/index.html -> dist/404.html for GitHub Pages');
