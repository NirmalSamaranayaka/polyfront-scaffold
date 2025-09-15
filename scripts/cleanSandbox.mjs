import fs from 'fs/promises';
import path from 'path';

const sandboxDir = path.resolve('sandbox');
const heavyFolders = ['node_modules', 'dist', 'build', '.cache', 'logs'];

// Recursively delete a folder in parallel
async function removeDirParallel(dir) {
  try {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    await Promise.all(
      entries.map(async (entry) => {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
          await removeDirParallel(fullPath); // recursive
        } else {
          await fs.unlink(fullPath).catch(() => {}); // delete file
        }
      })
    );
    await fs.rmdir(dir).catch(() => {}); // remove empty directory
  } catch {}
}

async function cleanSandbox() {
  try {
    // Step 1: Delete heavy folders in parallel
    await Promise.all(
      heavyFolders.map(folder => removeDirParallel(path.join(sandboxDir, folder)))
    );

    // Step 2: Delete remaining entries in sandbox in parallel
    const remaining = await fs.readdir(sandboxDir);
    await Promise.all(
      remaining.map(entry => removeDirParallel(path.join(sandboxDir, entry)))
    );

    // Step 3: Remove sandbox folder itself
    await fs.rmdir(sandboxDir).catch(() => {});

    console.log('✅ Sandbox fully cleared SUPER FAST with parallel deletion!');
  } catch (err) {
    console.error('❌ Failed to clean sandbox:', err);
    process.exit(1);
  }
}

cleanSandbox();
