import { fetchSearchMovie } from "./network.js";

const searchForm = document.querySelector("#search-form");
const searchInput = document.querySelector("#search");

const handleSearchFormSubmit = (e) => {
  e.preventDefault();

  const val = searchInput.value.trim();

  if (!val) {
    return;
  }

  fetchSearchMovie(val);

  searchForm.reset();
};

export { searchForm, handleSearchFormSubmit };
