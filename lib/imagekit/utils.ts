import ImageKit from 'imagekit-javascript';

// Initialize ImageKit
const imagekit = new ImageKit({
  publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY!,
  urlEndpoint: process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT!,
});

export interface UploadResponse {
  url: string;
  fileId: string;
  name: string;
  size: number;
  filePath: string;
}

/**
 * Upload image to ImageKit
 * @param file - File object to upload
 * @param folder - Folder path in ImageKit (e.g., 'products', 'variants')
 * @returns Upload response with URL
 */
export async function uploadToImageKit(
  file: File,
  folder: string = 'products'
): Promise<UploadResponse> {
  try {
    // Get authentication parameters from your backend
    const authResponse = await fetch('/api/imagekit/auth');
    const authData = await authResponse.json();

    // Upload file
    const result = await imagekit.upload({
      file: file,
      fileName: `${Date.now()}_${file.name}`,
      folder: folder,
      useUniqueFileName: true,
      ...authData,
    });

    return {
      url: result.url,
      fileId: result.fileId,
      name: result.name,
      size: result.size,
      filePath: result.filePath,
    };
  } catch (error) {
    console.error('ImageKit upload error:', error);
    throw new Error('Failed to upload image');
  }
}

/**
 * Upload multiple images to ImageKit
 * @param files - Array of File objects
 * @param folder - Folder path in ImageKit
 * @returns Array of upload responses
 */
export async function uploadMultipleToImageKit(
  files: File[],
  folder: string = 'products'
): Promise<UploadResponse[]> {
  const uploadPromises = files.map((file) => uploadToImageKit(file, folder));
  return Promise.all(uploadPromises);
}

/**
 * Delete image from ImageKit
 * @param fileId - ImageKit file ID
 */
export async function deleteFromImageKit(fileId: string): Promise<void> {
  try {
    await fetch('/api/imagekit/delete', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ fileId }),
    });
  } catch (error) {
    console.error('ImageKit delete error:', error);
    throw new Error('Failed to delete image');
  }
}

/**
 * Get optimized image URL with transformations
 * @param url - Original ImageKit URL
 * @param transformations - Transformation options
 */
export function getOptimizedImageUrl(
  url: string,
  transformations: {
    width?: number;
    height?: number;
    quality?: number;
    format?: 'auto' | 'webp' | 'jpg' | 'png';
  } = {}
): string {
  const { width, height, quality = 80, format = 'auto' } = transformations;
  
  let transformation = `tr:q-${quality},f-${format}`;
  
  if (width) transformation += `,w-${width}`;
  if (height) transformation += `,h-${height}`;
  
  // Insert transformation before the file path
  const urlParts = url.split('/');
  const endpointIndex = urlParts.findIndex((part) => 
    part.includes(process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT || '')
  );
  
  if (endpointIndex !== -1) {
    urlParts.splice(endpointIndex + 1, 0, transformation);
    return urlParts.join('/');
  }
  
  return url;
}