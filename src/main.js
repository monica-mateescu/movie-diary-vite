// ENTRY-POINT
//
// 1) init App
// 2) fetch movies
// 3) init Icons (favouriteButton / noteButton)
// 4) search form
// 5) mobile menu
import { API_KEY } from "./modules/config.js";
import { setupResponsiveIcons } from "./modules/favourites.js";
import { loadFooter } from "./modules/loadFooter.js";
import { loadheader } from "./modules/loadHeader.js";
import { mobileMenuHandler } from "./modules/mobilemenue.js";
import MovieApp from "./modules/movieApp.js";
import { handleSearchFormSubmit, searchForm } from "./modules/search.js";

const app = new MovieApp(API_KEY);
app.fetchPopularMovies();
setupResponsiveIcons();

searchForm.addEventListener("submit", handleSearchFormSubmit);

loadheader();
mobileMenuHandler();
loadFooter();
