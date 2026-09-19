const git = require('isomorphic-git');
const fs = require('fs');
const http = require('isomorphic-git/http/node');
const path = require('path');

const dir = path.join(__dirname, '..');

async function pushToGithub(repoUrl, username, token) {
  console.log('Initializing local git repository...');
  await git.init({ fs, dir });

  console.log('Staging files...');
  const files = await git.listFiles({ fs, dir });
  console.log(`Found ${files.length} existing tracked files.`);

  // Custom recursive file walker ignoring node_modules and .next
  async function stageDirectory(currentDir, relativePath = '') {
    const entries = fs.readdirSync(currentDir, { withFileTypes: true });
    for (const entry of entries) {
      if (['node_modules', '.next', '.git'].includes(entry.name)) continue;
      const fullPath = path.join(currentDir, entry.name);
      const relPath = relativePath ? `${relativePath}/${entry.name}` : entry.name;

      if (entry.isDirectory()) {
        await stageDirectory(fullPath, relPath);
      } else {
        await git.add({ fs, dir, filepath: relPath });
      }
    }
  }

  await stageDirectory(dir);
  console.log('Files staged successfully.');

  console.log('Creating initial commit...');
  const sha = await git.commit({
    fs,
    dir,
    author: {
      name: username || 'EduGestion Developer',
      email: 'dev@edugestion-africa.com',
    },
    message: 'Initial commit: EduGestion Africa Fullstack Supabase application',
  });
  console.log('Commit created:', sha);

  if (repoUrl && token) {
    console.log(`Pushing to ${repoUrl}...`);
    const pushResult = await git.push({
      fs,
      http,
      dir,
      remote: 'origin',
      url: repoUrl,
      onAuth: () => ({ username: token, password: '' }),
    });
    console.log('Push complete:', pushResult);
  } else {
    console.log('Repository committed locally. Ready to push once GitHub URL and Token are provided.');
  }
}

// Get arguments from command line if provided
const args = process.argv.slice(2);
const repoUrl = args[0];
const token = args[1];
const username = args[2];

pushToGithub(repoUrl, username, token).catch(console.error);
