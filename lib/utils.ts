import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Room name mapping
const ROOM_NAMES: { [key: string]: string } = {
  room01: "Beach Facing Room",
  room02: "Beach Facing Family Room",
  room03: "Beach Facing Family Room",
  room04: "Beach Facing Connecting Room",
  room05: "Beach Facing Suite",
  room06: "Two Bedroom Apartment",
  room07: "Overwater Terrace Room",
  room08: "Overwater Terrace Suite",
  room09: "Ziba Black",
};

export function getRoomName(roomId: string): string {
  return ROOM_NAMES[roomId] || roomId;
}
