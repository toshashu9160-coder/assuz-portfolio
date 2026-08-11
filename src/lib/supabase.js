import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

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
  if (!supabase) return null;

  const { data: { publicUrl } } = supabase.storage
    .from(BUCKET_NAME)
    .getPublicUrl(path);

  return publicUrl;
}

export function getImageUrl(projectName, imageName) {
  if (!supabase) return `/projects/${projectName}/${imageName}`;

  return getPublicUrl(`projects/${projectName}/${imageName}`);
}

export function getWorkImageUrl(imageName) {
  if (!supabase) return `/works/${imageName}`;

  return getPublicUrl(`works/${imageName}`);
}

export function getProjectCoverUrl(projectName) {
  if (!supabase) return `/projects/${projectName}/1.png`;

  return getPublicUrl(`projects/${projectName}/1.png`);
}