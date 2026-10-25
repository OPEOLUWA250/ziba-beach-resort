import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { ROOM_CATALOG } from "@/lib/room-catalog";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Room names come from the shared room catalogue.
export function getRoomName(roomId: string): string {
  return ROOM_CATALOG[roomId]?.name || roomId;
}
