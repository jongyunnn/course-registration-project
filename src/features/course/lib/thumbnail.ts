export const THUMBNAIL_URLS = [
  "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=225&fit=crop",
  "https://images.unsplash.com/photo-1488190211105-8b0e65b80b4e?w=400&h=225&fit=crop",
  "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400&h=225&fit=crop",
  "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400&h=225&fit=crop",
  "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&h=225&fit=crop",
];

export function getThumbnailUrl(courseId: string): string {
  const index = courseId.charCodeAt(0) % THUMBNAIL_URLS.length;
  return THUMBNAIL_URLS[index];
}
