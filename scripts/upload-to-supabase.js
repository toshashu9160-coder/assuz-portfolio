import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY in .env');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);
const bucketName = 'portfolio-images';

const publicDir = path.resolve('public');

async function uploadDirectory(dir, basePath = '') {
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    const relativePath = path.join(basePath, entry.name).replace(/\\/g, '/');

    if (entry.isDirectory()) {
      await uploadDirectory(fullPath, relativePath);
    } else if (entry.isFile()) {
      const fileBuffer = fs.readFileSync(fullPath);
      const contentType = getContentType(entry.name);

      console.log(`Uploading: ${relativePath}`);

      const { error } = await supabase.storage
        .from(bucketName)
        .upload(relativePath, fileBuffer, {
          contentType,
          upsert: true
        });

      if (error) {
        console.error(`Error uploading ${relativePath}:`, error.message);
      } else {
        console.log(`✓ ${relativePath}`);
      }
    }
  }
}

function getContentType(filename) {
  const ext = path.extname(filename).toLowerCase();
  const types = {
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.webp': 'image/webp',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.mp4': 'video/mp4',
    '.webm': 'video/webm',
    '.mov': 'video/quicktime'
  };
  return types[ext] || 'application/octet-stream';
}

async function main() {
  console.log('Starting upload to Supabase Storage...');
  console.log(`Bucket: ${bucketName}`);
  console.log(`Source: ${publicDir}\n`);

  const { data: buckets } = await supabase.storage.listBuckets();
  const bucketExists = buckets?.some(b => b.name === bucketName);

  if (!bucketExists) {
    console.error(`Bucket "${bucketName}" does not exist.`);
    console.log('Create it in Supabase Dashboard → Storage → Create Bucket');
    console.log('Name: portfolio-images | Public bucket: ✓');
    process.exit(1);
  }

  console.log(`Using existing bucket: ${bucketName}\n`);
  await uploadDirectory(publicDir);
  console.log('\nUpload complete!');

  const { data: files } = await supabase.storage.from(bucketName).list('', { limit: 1000 });
  console.log(`\nTotal files in bucket: ${files?.length || 0}`);
}

main().catch(console.error);