import axios from "axios";

const tmdb = axios.create({
  baseURL: "https://api.themoviedb.org/3",
  params: {
    api_key: import.meta.env.VITE_TMDB_API_KEY,
  },
});

export async function getGenres() {
  const response = await tmdb.get("/genre/movie/list");
  return response.data.genres;
}

export default tmdb;
