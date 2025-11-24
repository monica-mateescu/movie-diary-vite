import { ACCESS_TOKEN } from "./config";

/**
 * Service class responsible for interacting with the TMDB API.
 * Handles authenticated fetch requests and provides search functionality.
 */
class FetchSearch {
  /**
   * Initializes the API access token and base URL.
   */
  constructor() {
    this.baseUrl = "https://api.themoviedb.org/3";
    this.accessToken = ACCESS_TOKEN;
  }

  /**
   * Performs a movie search request based on a text query
   * Returns an array of movies or throws an error if request fails
   */
  async searchMovies(query) {
    try {
      const res = await fetch(
        `${this.baseUrl}/search/movie?query=${encodeURIComponent(query)}`,
        this.#options(),
      );

      if (!res.ok) {
        throw new Error(`Something went wrong. Please try again.`);
      }

      const data = await res.json();

      return data.results;
    } catch (error) {
      throw new Error("Network error. Please check your connection.");
    }
  }

  /**
   * Builds request headers for TMDB API calls.
   * This method is private and cannot be accessed outside the class.
   */
  #options() {
    return {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${this.accessToken}`,
      },
    };
  }
}

export default FetchSearch;
