
const BASE_URL = import.meta.env.VITE_API_URL || "";

export async function compareProduct(query) {
  const response = await fetch(`${BASE_URL}/api/compare`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query: query.trim() }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Something went wrong. Please try again.");
  }

  return data.data;
}

export async function getSuggestions() {
  const response = await fetch(`${BASE_URL}/api/suggestions`);
  const data = await response.json();
  return data.suggestions || [];
}

export async function checkHealth() {
  const response = await fetch(`${BASE_URL}/health`);
  return response.ok;
}
