// Upload videos to Supabase storage
// Run: node scripts/upload-videos.js

import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const SUPABASE_URL = 'https://nsvyzdkxfkcxqbirbsqw.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5zdnl6ZGt4ZmtjeHFiaXJic3F3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ0ODYzMzMsImV4cCI6MjEwMDA2MjMzM30.3dDXLOgTwlWEXD2tXLxHdAEErW8onbtqhQpC4DnODYY';
const BUCKET = 'portfolio-images';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const videosDir = path.join(__dirname, '..', 'public', 'projects', 'projects', 'Videos');

const videoFiles = [
  { file: '1111.mp4',   storagePath: 'videos/1111.mp4' },
  { file: '222222.mp4', storagePath: 'videos/222222.mp4' },
  { file: '3333.mp4',   storagePath: 'videos/3333.mp4' },
];

async function uploadVideo(localFile, storagePath) {
  const filePath = path.join(videosDir, localFile);
  const fileBuffer = fs.readFileSync(filePath);
  const fileSize = fs.statSync(filePath).size;

  console.log(`\nUploading ${localFile} (${(fileSize / 1024 / 1024).toFixed(1)} MB)...`);

  const { data, error } = await supabase.storage
    .from(BUCKET)
    .upload(storagePath, fileBuffer, {
      contentType: 'video/mp4',
      cacheControl: '31536000',
      upsert: true,
    });

  if (error) {
    console.error(`  ❌ Error uploading ${localFile}:`, error.message);
    return null;
  }

  const { data: { publicUrl } } = supabase.storage
    .from(BUCKET)
    .getPublicUrl(storagePath);

  console.log(`  ✅ Uploaded! Public URL:`);
  console.log(`     ${publicUrl}`);
  return publicUrl;
}

async function main() {
  console.log('🎬 Starting video uploads to Supabase...');
  console.log(`   Bucket: ${BUCKET}`);
  console.log(`   Project: ${SUPABASE_URL}`);

  const results = [];
  for (const v of videoFiles) {
    const url = await uploadVideo(v.file, v.storagePath);
    results.push({ file: v.file, url });
  }

  console.log('\n\n📋 Summary:');
  results.forEach(r => {
    if (r.url) console.log(`  ✅ ${r.file} → ${r.url}`);
    else console.log(`  ❌ ${r.file} → FAILED`);
  });
  console.log('\nDone!');
}

main().catch(console.error);
