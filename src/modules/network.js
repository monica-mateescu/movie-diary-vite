import { displayMovies } from "./ui.js";

const options = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization:
      "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIwOTg1MTMwMDQ5MGM3ZjliMGM5MTJmM2Y3ZDBhMTMyNSIsIm5iZiI6MTc2Mjg1ODI0OC4yNDE5OTk5LCJzdWIiOiI2OTEzMTUwODI3Mjk3ZjJlMzc5YWNjNDYiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.qQV5ezx-p_63eQ4UA5MEj_IsR8LOwE7uZkaa3clKQeU",
  },
};

const fetchSearchMovie = async (query) => {
  const endpoint = Number(query)
    ? `movie/${query}`
    : `search/movie?query=${encodeURIComponent(query)}`;

  try {
    const res = await fetch(
      `https://api.themoviedb.org/3/${endpoint}`,
      options
    );

    if (!res.ok) throw new Error("Fetch failed");

    const data = await res.json();

    const movies = data.results ?? [data];

    displayMovies(movies);
  } catch (error) {
    console.log(error);
  }
};

export { fetchSearchMovie };
