const fs = require('fs');
const path = require('path');

const repoRoot = path.resolve(__dirname, '..');
const outputPath = path.join(repoRoot, 'js', 'site-content.js');

const tiers = [
  { folder: '0platinum', label: 'Platinum' },
  { folder: '1gold', label: 'Gold' },
  { folder: '2silver', label: 'Silver' },
  { folder: '3bronze', label: 'Bronze' },
  { folder: '4supporter', label: 'Supporter' }
];

const sponsorExtensions = new Set(['.png', '.jpg', '.jpeg', '.webp', '.svg']);
const mediaExtensions = new Set(['.png', '.jpg', '.jpeg', '.webp']);
const videoExtensions = new Set(['.mp4', '.webm']);

function listFiles(dirPath, allowedExts) {
  if (!fs.existsSync(dirPath)) {
    return [];
  }

  return fs
    .readdirSync(dirPath, { withFileTypes: true })
    .filter((entry) => entry.isFile())
    .map((entry) => entry.name)
    .filter((fileName) => allowedExts.has(path.extname(fileName).toLowerCase()))
    .sort((a, b) => a.localeCompare(b));
}

function collectSponsors() {
  const sponsorRoot = path.join(repoRoot, 'img', 'sponsorship_logos');

  return tiers.flatMap((tier) => {
    const tierDir = path.join(sponsorRoot, tier.folder);
    const tierFiles = listFiles(tierDir, sponsorExtensions);
    return tierFiles.map((fileName) => `${tier.folder}/${fileName}`);
  });
}

function collectMedia() {
  const mediaDir = path.join(repoRoot, 'img', 'media_gallery');
  return listFiles(mediaDir, mediaExtensions);
}

function collectVideos() {
  const videosDir = path.join(repoRoot, 'vid');
  return listFiles(videosDir, videoExtensions);
}

function generateContentModule() {
  const payload = {
    sponsorTiers: tiers,
    sponsors: collectSponsors(),
    media: collectMedia(),
    videos: collectVideos()
  };

  const content = `window.FORMULAU_CONTENT = ${JSON.stringify(payload, null, 2)};\n`;
  fs.writeFileSync(outputPath, content, 'utf8');
}

generateContentModule();
console.log('Updated js/site-content.js from media folders.');
