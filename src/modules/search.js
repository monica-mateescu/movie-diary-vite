import FetchSearch from "./FetchSearch.js";
import UISearch from "./UISearch.js";

/**
 * Select main elements of the search form
 */
const searchForm = document.querySelector("#search-form");
const searchInput = document.querySelector("#search");

/**
 * Handles the submission of the search form.
 * Prevents default page reload, reads the input value,
 * fetches movie data from the API, and updates the UI.
 */
const handleSearchFormSubmit = async (e) => {
  e.preventDefault();

  const query = searchInput.value.trim();

  if (!query) {
    return;
  }

  const uiSearch = new UISearch();

  try {
    /**
     * Create an instance of FetchSearch to handle API requests
     */
    const api = new FetchSearch();
    const data = await api.searchMovies(query);
    uiSearch.display(data);
  } catch (err) {
    uiSearch.showError(err.message);
  }

  searchForm.reset();
};

export { searchForm, handleSearchFormSubmit };
