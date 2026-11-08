/**
 * Storage Functions Module (storage.ts)
 * 
 * Local storage integration mock.
 * Updated to remove Supabase dependency.
 */

export function validateFile(data: unknown) {
  if (!data) return { valid: false, error: 'No data provided' };
  return { valid: true };
}

export async function storagePut(key: string, _data: unknown) {
  console.warn("Mock Storage Put:", key);
  return {
    success: true,
    url: `/uploads/${key}`,
    key: key,
  };
}

export async function storageGet(_key: string) {
  return null;
}

export async function storageDelete(key: string) {
  console.warn("Mock Storage Delete:", key);
}

export async function generateSignedUrl(key: string) {
  return `/uploads/${key}`;
}

export async function storageExists(_key: string) {
  return true;
}
