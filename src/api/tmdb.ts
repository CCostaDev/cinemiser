import axios from "axios";

type DiscoverFilters = {
  withGenres?: string; // "1,6,7"
  minRating?: number; // vote_average.gte
  maxRuntime?: number; // with_runtime.lte
  fromDate?: string; // "YYYY-MM-DD"
};

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

export async function discoverMovies(filters: DiscoverFilters) {
  const response = await tmdb.get("/discover/movie", {
    params: {
      with_genres: filters.withGenres,
      "vote_average.gte": filters.minRating,
      "with_runtime.lte": filters.maxRuntime,
      "primary_release_date.gte": filters.fromDate,
      include_adult: false,
      language: "en-GB",
      sort_by: "popularity.desc",
    },
  });

  return response.data;
}

export async function getMovieDetails(id: number) {
  const response = await tmdb.get(`/movie/${id}`, {
    params: {
      append_to_response: "credits,videos",
      language: "en-GB",
    },
  });

  return response.data;
}

export function getPosterUrl(path: string | null, size: string = "w500") {
  if (!path) return null;
  return `https://image.tmdb.org/t/p/${size}${path}`;
}

export default tmdb;
