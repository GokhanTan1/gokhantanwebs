import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatUrl(url: string): string {
  if (!url) return url;
  
  // URL'yi temizle
  let cleanUrl = url.trim().replace(/^(http:\/\/|www\.)/, '');
  
  // Eğer https:// ile başlamıyorsa ekle
  if (!cleanUrl.startsWith('https://')) {
    cleanUrl = 'https://' + cleanUrl;
  }
  
  return cleanUrl;
}
