// Read-only room catalogue queries (public data; safe in the browser).
// Room writes go through admin-only API routes on the service-role client.
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
