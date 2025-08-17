import api from "./api"; // your axios instance

export const getCategories = async () => {
  try {
    const response = await api.get("/categories/");
    // Return the actual array of categories
    return response.data.results || [];
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
};
