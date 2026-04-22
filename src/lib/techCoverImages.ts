/** Imágenes Unsplash (tech / productividad) para cabeceras de tarjetas cuando no hay `coverImage` en datos. */
export const TECH_COVER_IMAGE_URLS = [
  "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=960&q=80",
  "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=960&q=80",
  "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=960&q=80",
  "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=960&q=80",
  "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=960&q=80",
  "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=960&q=80",
  "https://images.unsplash.com/photo-1504639725590-34d0984388bd?auto=format&fit=crop&w=960&q=80",
  "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=960&q=80",
  "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=960&q=80",
  "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=960&q=80",
  "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=960&q=80",
  "https://images.unsplash.com/photo-1555949963-aa79dcee981c?auto=format&fit=crop&w=960&q=80",
] as const;

export function techCoverImageForKey(key: string): string {
  let h = 0;
  for (let i = 0; i < key.length; i++) h = (h * 31 + key.charCodeAt(i)) >>> 0;
  return TECH_COVER_IMAGE_URLS[h % TECH_COVER_IMAGE_URLS.length];
}
