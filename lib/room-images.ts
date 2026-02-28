// Room folder mapping with actual image counts
// Maps room IDs to their image folder names and carousel image counts
const ROOM_IMAGE_CONFIG: {
  [key: string]: { folder: string; carouselCount: number };
} = {
  room01: { folder: "beach-facing-room", carouselCount: 7 },
  room02: { folder: "beach-facing-family-room-partial", carouselCount: 5 },
  room03: { folder: "beach-facing-family-room-full", carouselCount: 3 },
  room04: { folder: "beach-facing-connecting-room", carouselCount: 5 },
  room05: { folder: "beach-facing-suite", carouselCount: 5 },
  room06: { folder: "two-bedroom-apartment", carouselCount: 10 },
  room07: { folder: "overwater-terrace-room", carouselCount: 9 },
  room08: { folder: "overwater-terrace-suite", carouselCount: 5 },
  room09: { folder: "ziba-black", carouselCount: 7 },
};

/**
 * Get the hero image path for a room
 * @param roomId - The room ID (e.g., "room01")
 * @returns The path to the hero image
 */
export function getRoomHeroImage(roomId: string): string {
  const config = ROOM_IMAGE_CONFIG[roomId];
  if (!config) return "/Ziba-hero.jpg"; // Fallback

  const heroFileName = `${config.folder}-hero.jpg`;
  return `/ziba-rooms/${config.folder}/${heroFileName}`;
}

/**
 * Get all carousel images for a room (excludes hero image)
 * Dynamically generates the correct number of images based on room configuration
 * @param roomId - The room ID (e.g., "room01")
 * @returns Array of image paths for the carousel
 */
export function getRoomCarouselImages(roomId: string): string[] {
  const config = ROOM_IMAGE_CONFIG[roomId];
  if (!config) return [];

  const images: string[] = [];
  for (let i = 1; i <= config.carouselCount; i++) {
    const imageName = `${config.folder}-${i}.jpg`;
    images.push(`/ziba-rooms/${config.folder}/${imageName}`);
  }

  return images;
}

/**
 * Get both hero and carousel images for a room
 * @param roomId - The room ID
 * @returns Object containing hero image and carousel images
 */
export function getRoomImages(roomId: string) {
  return {
    hero: getRoomHeroImage(roomId),
    carousel: getRoomCarouselImages(roomId),
  };
}

/**
 * Get all images (hero + carousel) in a single array
 * @param roomId - The room ID
 * @returns Array of all images for the room
 */
export function getAllRoomImages(roomId: string): string[] {
  return [getRoomHeroImage(roomId), ...getRoomCarouselImages(roomId)];
}

/**
 * Get the number of carousel images for a room
 * @param roomId - The room ID
 * @returns Number of carousel images
 */
export function getRoomImageCount(roomId: string): number {
  const config = ROOM_IMAGE_CONFIG[roomId];
  return config?.carouselCount || 0;
}
