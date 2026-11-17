import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Hardcoded public base — videos are public and don't need auth
export const SUPABASE_PUBLIC_BASE = 'https://nsvyzdkxfkcxqbirbsqw.supabase.co/storage/v1/object/public/portfolio-images';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase credentials not configured. Using local images.');
}

export const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

export const BUCKET_NAME = 'portfolio-images';

export async function uploadImage(file, path) {
  if (!supabase) return null;

  const { data, error } = await supabase.storage
    .from(BUCKET_NAME)
    .upload(path, file, {
      cacheControl: '3600',
      upsert: true
    });

  if (error) {
    console.error('Upload error:', error);
    return null;
  }

  const { data: { publicUrl } } = supabase.storage
    .from(BUCKET_NAME)
    .getPublicUrl(data.path);

  return publicUrl;
}

export async function uploadImages(files, folder) {
  if (!supabase) return [];

  const uploads = Array.from(files).map(async (file, index) => {
    const ext = file.name.split('.').pop();
    const path = `${folder}/${Date.now()}-${index}.${ext}`;
    return uploadImage(file, path);
  });

  return Promise.all(uploads);
}

export function getPublicUrl(path) {
  // Always use the hardcoded base so it works even without env vars
  return `${SUPABASE_PUBLIC_BASE}/${path}`;
}

export function getImageUrl(projectName, imageName) {
  return getPublicUrl(`projects/${projectName}/${imageName}`);
}

export function getWorkImageUrl(imageName) {
  return getPublicUrl(`works/${imageName}`);
}

export function getProjectCoverUrl(projectName) {
  return getPublicUrl(`projects/${projectName}/1.png`);
}

export function getVideoUrl(fileName) {
  return getPublicUrl(`videos/${fileName}`);
}