🎬 **Cinemiser**

_A smart movie randomiser powered by TMDB._

Cinemiser helps you discover movies when you don't know what to watch.
Choose your filters, and Cinemiser will fetch a random movie that fits your vibe.

Built with **React, TypeScript, TailwindCSS and Axios**, this app focuses on clean UI, smooth feedback, and strong real world API handling.

---

**🎥 Live Demo**

[cinemiser.vercel.app](https://cinemiser.vercel.app/)

---

✨ **Features**

- Genre filtering (using real time TMDB genre data)
- Minimum rating slider (0-10)
- Maximum runtime slider (60-240 min)
- Released within X years selector
- Random movie picking based on filters
- Movie card with
  - Poster
  - title + release year
  - genres
  - rating + runtime
  - tagline
  - full overview
- Trailer link (Youtube, fetched via TMDB videos API)
- More info toggle
  - director
  - top cast
- Blurred poster/ backdrop background
- Skeleton loader while fetching
- Smooth animations on card + background

---

🛠 **Tech Stack**

**Frontend**

- React (Vite)
- TypeScript
- TailwindCSS
- Axios

**API**

- TMDB REST API
  - `/discover/movie`
  - `/genre/movie/list`
  - ` /movie/{id}` + `append_to_response=credits,videos`

---

🧱 **Architecture Overview**
Cinemiser uses a clean, modular API layer with Axios:

**1. Axios Instance**
A single configured Axios client keeps the code DRY:

- Base URL
- API key injected from `.env`
- Shared params

**2. Discover Movies (filters -> random pick)**
User-selected filters are transformed into TMDB parameters:

- `with_genres`
- `vote_average.gte`
- `with_runtime.lte`
- `primary_release_date.gte`

Then a random movie is selected from the results.

**3. Movie Details**
Once a movie is picked, Cinemiser fetches enriched data:

- runtime
- tagline
- director (from credits)
- cast (top 3 actors)
- trailer URL (Youtube)
- backdrop image for UI styling

**4. UI Rendering**
React state holds:

- filters
- isLoading
- movie
- showMore

TailwindCSS handles spacing, visuals, and animations:

- skeleton state
- fade-in card
- blurred backdrop

---

🧭 **How to Use**

1. Pick your filters (rating, runtime, genres, years).
2. Click **Find a movie**.
3. View the movie details and poster.
4. Expand **More Info** for director + cast.
5. Click **Watch Trailer** to open the Youtube trailer.
6. Change filters or hit **Find a movie** again to discover something new.

---

🙏 **Acknowledgements**

This product uses the TMDB API but is not endorsed or certified by TMDB.
