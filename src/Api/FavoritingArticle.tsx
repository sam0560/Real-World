export const FavoriteServices = async (slug: string | undefined, favorite: boolean) => {
  const jwtToken = localStorage.getItem("jwtToken");

  if (!jwtToken) {
    throw new Error("User is not authenticated");
  }

  const url = `https://api.realworld.io/api/articles/${slug}/favorite`;
  const method = favorite ? "POST" : "DELETE";

  const res = await fetch(url, {
    method,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${jwtToken}`,
    },
  });

  if (!res.ok) {
    throw new Error(`Failed to ${favorite ? "favorite" : "unfavorite"} article`);
  }

  const result = await res.json();
  return result.article;
};
