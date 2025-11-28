import { useEffect, useState } from "react";
import { getGenres, discoverMovies, getPosterUrl } from "./api/tmdb";

function App() {
  const [genres, setGenres] = useState<{ id: number; name: string }[]>([]);
  const [selectedGenreIds, setSelectedGenreIds] = useState<number[]>([]);
  const [minRating, setMinRating] = useState(7);
  const [maxRuntime, setMaxRuntime] = useState(120);
  const [yearsBack, setYearsBack] = useState<"any" | "1" | "3" | "5" | "10">(
    "any"
  );

  type MovieSummary = {
    id: number;
    title: string;
    overview: string;
    poster_path: string | null;
    backdrop_path: string | null;
    vote_average: number;
    release_date: string;
    genre_ids?: number[];
  };

  const [movie, setMovie] = useState<MovieSummary | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadGenres() {
      const genres = await getGenres();
      setGenres(genres);
      console.log("Genres:", genres);
    }
    loadGenres();
  }, []);

  function toggleGenre(id: number) {
    setSelectedGenreIds((current) => {
      if (current.includes(id)) {
        // remove if already selected
        return current.filter((genreId) => genreId !== id);
      } else {
        // add if not selected
        return [...current, id];
      }
    });
  }

  async function handleFindMovie() {
    try {
      setIsLoading(true);
      setError(null);

      // 1. build genre string: "1,6,7"
      const withGenres =
        selectedGenreIds.length > 0 ? selectedGenreIds.join(",") : undefined;

      // 2. convert yearsBack into a string "YYYY-MM-DD"
      let fromDate: string | undefined = undefined;
      if (yearsBack !== "any") {
        const years = Number(yearsBack);
        const now = new Date();
        const past = new Date();
        past.setFullYear(now.getFullYear() - years);
        fromDate = past.toISOString().slice(0, 10); // the first 10 chars = date
      }

      // 3. call TMDB discover
      const data = await discoverMovies({
        withGenres,
        minRating,
        maxRuntime,
        fromDate,
      });

      const results: MovieSummary[] = data.results;

      if (!results || results.length === 0) {
        setMovie(null);
        setError(
          "No movies found with those filters. Try relaxing them a bit."
        );
        return;
      }

      // 4. pick a random movie from the results
      const randomIndex = Math.floor(Math.random() * results.length);
      const randomMovie = results[randomIndex];

      setMovie(randomMovie);
    } catch (err) {
      console.error(err);
      setError("Something went wrong while fetching a movie.");
    } finally {
      setIsLoading(false);
    }
  }

  const backdropUrl = movie
    ? getPosterUrl(movie.backdrop_path ?? movie.poster_path, "w1280")
    : null;

  return (
    <div className="relative min-h-screen bg-slate-950 text-slate-50 px-4 py-8 overflow-hidden">
      {/* Background layer */}
      {backdropUrl && (
        <div className="pointer-events-none absolute inset-0 z-0">
          <div
            className="h-full w-full bg-cover bg-center blur-2x1 opacity-40"
            style={{ backgroundImage: `url(${backdropUrl})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/90 via-slate-950/95 to-slate-950" />
        </div>
      )}

      {/* Foreground content */}
      <div className="relative z-10 mx-auto max-w-4x1 space-y-6 px-4 py-8">
        <div className="mx-auto max-w-2xl space-y-6 text-center">
          <h1 className="text-3xl font-bold">Cinemiser 🎬</h1>

          <button
            onClick={handleFindMovie}
            className="rounded-xl bg-indigo-500 px-4 py-2 text-sm font-medium text-white shadow-lg shadow-indigo-500/30 transition hover:bg-indigo-400"
          >
            Find a movie
          </button>

          {isLoading && (
            <p className="text-sm text-slate-400">Finding something…</p>
          )}

          {error && <p className="text-sm text-red-400">{error}</p>}

          {movie && !error && (
            <div className="mt-8 rounded-2xl border border-slate-800 bg-slate-900/60 p-4 md:p-6">
              <div className="flex flex-col gap-4 md:flex-row">
                {/* Poster column */}
                <div className="mx-auto w-full max-w-xs md:mx-0 md:w-1/3">
                  {getPosterUrl(movie.poster_path) && (
                    <img
                      src={getPosterUrl(movie.poster_path)!}
                      alt={movie.title}
                      className="w-full rounded-xl border border-slate-800 shadow-md"
                    />
                  )}
                </div>

                {/* Info column */}
                <div className="flex-1 text-left flex flex-col gap-3">
                  {/* Top info block */}
                  <div className="space-y-1">
                    <h2 className="text-2xl font-semibold">
                      {movie.title}{" "}
                      <span className="text-lg text-slate-400">
                        ({movie.release_date?.slice(0, 4)})
                      </span>
                    </h2>

                    {/* Genres */}
                    <p className="text-sm text-slate-300">
                      {movie.genre_ids
                        ?.map((id) => genres.find((g) => g.id === id)?.name)
                        .filter(Boolean)
                        .join(" • ")}
                    </p>

                    {/* Rating */}
                    <p className="mt-1 text-sm text-slate-300">
                      ⭐ {movie.vote_average.toFixed(1)}
                    </p>
                  </div>

                  {/* Overview block at the bottom */}
                  <div className="mt-auto space-y-1">
                    <h3 className="text-sm font-semibold text-slate-200 uppercase tracking-wide">
                      Overview
                    </h3>
                    <p className="text-sm text-slate-400">{movie.overview}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
