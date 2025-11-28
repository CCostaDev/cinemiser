import { useEffect, useState } from "react";
import { getGenres } from "./api/tmdb";

function App() {
  const [genres, setGenres] = useState<{ id: number; name: string }[]>([]);
  const [selectedGenreIds, setSelectedGenreIds] = useState<number[]>([]);

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
  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 px-4 py-8">
      <div className="mx-auto max-w-3xl space-y-6">
        <header>
          <h1 className="text-3xl font-bold tracking-tight">Cinemiser 🎬</h1>
          <p className="mt-1 text-sm text-slate-400">
            Pick some genres and we’ll find you a movie.
          </p>
        </header>

        <section>
          <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-slate-400">
            Genres
          </h2>

          <div className="flex flex-wrap gap-2">
            {genres.map((genre) => {
              const isSelected = selectedGenreIds.includes(genre.id);

              return (
                <button
                  key={genre.id}
                  onClick={() => toggleGenre(genre.id)}
                  className={
                    "rounded-full border px-3 py-1 text-sm transition " +
                    (isSelected
                      ? "border-indigo-400 bg-indigo-500/20 text-indigo-200"
                      : "border-slate-700 bg-slate-900 text-slate-200 hover:border-indigo-400")
                  }
                >
                  {genre.name}
                </button>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}

export default App;
