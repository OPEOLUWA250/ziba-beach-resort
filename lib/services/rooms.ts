import { supabase } from "@/lib/supabase/client";

export async function getAllRooms() {
  try {
    // Fetch ALL rooms including fully-booked (for customer display with badge)
    const { data, error } = await supabase
      .from("rooms")
      .select("*")
      .order("id", { ascending: true });

    if (error) throw error;

    console.log("Fetched all rooms from Supabase:", data);
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
  pricengn: number;
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
      pricengn: roomData.pricengn,
      capacity: roomData.capacity,
      amenities: roomData.amenities || [],
      images: roomData.images || [],
      status: "available",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    if (error) throw error;

    return { id: roomId, ...roomData, status: "available" };
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
    pricengn: number;
    capacity: number;
    amenities: string[];
    images: string[];
    status: string;
  }>,
) {
  try {
    // Normalize status to lowercase if provided
    const updateData = {
      ...updates,
      status: updates.status?.toLowerCase(),
      updatedAt: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from("rooms")
      .update(updateData)
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
      .neq("status", "fully-booked")
      .order("id", { ascending: true });

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
