import { supabase } from "@/lib/supabase/client";

export async function getAllRooms() {
  try {
    const { data, error } = await supabase
      .from("rooms")
      .select("*")
      .eq("status", "AVAILABLE");

    if (error) throw error;

    return data || [];
  } catch (error) {
    console.error("Error fetching rooms:", error);
    return [];
  }
}

export async function getRoomById(roomId: string) {
  try {
    const { data, error } = await supabase
      .from("rooms")
      .select("*")
      .eq("id", roomId)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return null;
      }
      throw error;
    }

    return data;
  } catch (error) {
    console.error("Error fetching room:", error);
    return null;
  }
}

export async function createRoom(roomData: {
  title: string;
  description?: string;
  priceNGN: number;
  capacity: number;
  amenities?: string[];
  images?: string[];
}) {
  try {
    const roomId = `room-${Date.now()}`;

    const { data, error } = await supabase.from("rooms").insert({
      id: roomId,
      title: roomData.title,
      description: roomData.description || "",
      priceNGN: roomData.priceNGN,
      capacity: roomData.capacity,
      amenities: roomData.amenities || [],
      images: roomData.images || [],
      status: "AVAILABLE",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    if (error) throw error;

    return { id: roomId, ...roomData, status: "AVAILABLE" };
  } catch (error) {
    console.error("Error creating room:", error);
    throw error;
  }
}

export async function updateRoom(
  roomId: string,
  updates: Partial<{
    title: string;
    description: string;
    priceNGN: number;
    capacity: number;
    amenities: string[];
    images: string[];
    status: string;
  }>,
) {
  try {
    const { data, error } = await supabase
      .from("rooms")
      .update({
        ...updates,
        updatedAt: new Date().toISOString(),
      })
      .eq("id", roomId);

    if (error) throw error;

    return data;
  } catch (error) {
    console.error("Error updating room:", error);
    throw error;
  }
}

export async function getRoomsByCapacity(capacity: number) {
  try {
    const { data, error } = await supabase
      .from("rooms")
      .select("*")
      .gte("capacity", capacity)
      .eq("status", "AVAILABLE");

    if (error) throw error;

    return data || [];
  } catch (error) {
    console.error("Error fetching rooms by capacity:", error);
    return [];
  }
}

export async function deleteRoom(roomId: string) {
  try {
    const { error } = await supabase.from("rooms").delete().eq("id", roomId);

    if (error) throw error;

    return { success: true };
  } catch (error) {
    console.error("Error deleting room:", error);
    throw error;
  }
}
