interface Experience {
  id: string;
  name: string;
  price_per_person: number;
  category: "day-pass" | "honeymoon" | "team-building";
  description?: string;
  age_group?: string;
  available: boolean;
  created_at?: string;
}

export async function getAllExperiences(): Promise<Experience[]> {
  try {
    const response = await fetch("/api/admin/experiences", {
      method: "GET",
    });

    if (!response.ok) throw new Error("Failed to fetch experiences");

    const data = await response.json();
    return data || [];
  } catch (error) {
    console.error("Error fetching experiences:", error);
    return [];
  }
}

export async function getExperienceById(
  id: string,
): Promise<Experience | null> {
  const experiences = await getAllExperiences();
  return experiences.find((exp) => exp.id === id) || null;
}

export async function createExperience(
  experience: Omit<Experience, "id" | "created_at">,
): Promise<{ success: boolean; error?: string }> {
  try {
    const response = await fetch("/api/admin/experiences", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: experience.name,
        description: experience.description,
        pricePerPerson: experience.price_per_person,
        category: experience.category,
        ageGroup: experience.age_group,
        available: experience.available,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to create experience");
    }

    return { success: true };
  } catch (error: any) {
    console.error("Error creating experience:", error);
    return { success: false, error: error.message };
  }
}

export async function updateExperience(
  id: string,
  experience: Partial<Omit<Experience, "id" | "created_at">>,
): Promise<{ success: boolean; error?: string }> {
  try {
    const response = await fetch(`/api/admin/experiences/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: experience.name,
        description: experience.description,
        pricePerPerson: experience.price_per_person,
        category: experience.category,
        ageGroup: experience.age_group,
        available: experience.available,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to update experience");
    }

    return { success: true };
  } catch (error: any) {
    console.error("Error updating experience:", error);
    return { success: false, error: error.message };
  }
}

export async function deleteExperience(
  id: string,
): Promise<{ success: boolean; error?: string }> {
  try {
    const response = await fetch(`/api/admin/experiences/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to delete experience");
    }

    return { success: true };
  } catch (error: any) {
    console.error("Error deleting experience:", error);
    return { success: false, error: error.message };
  }
}
