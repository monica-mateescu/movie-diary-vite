// src/modules/movieApp.js
import {
  addToFavourites,
  getIconSize,
  getNotesForFav,
  isFavourite,
  removeFromFavourites,
} from "./favourites.js";
import UINotes from "./UINotes.js";
import {
  attachFavIconHandler,
  getCardStyle,
  getDescIconStyle,
  getDescStyle,
  getFadeOverlay,
  getFavIconStyle,
  getIconWrapperStyle,
  getPosterStyle,
  getRating,
  getTitleStyle,
} from "./moviecards.js";

class MovieApp {
  constructor(apiKey, containerSelector = "#cardsContainer") {
    this.apiUrl = "https://api.themoviedb.org/3";
    this.apiKey = apiKey;
    this.container = document.querySelector(containerSelector);
  }

  // Fetch latest movies from TMDB
  async fetchPopularMovies() {
    try {
      const response = await fetch(
        `${this.apiUrl}/movie/popular?api_key=${this.apiKey}&language=en-US&page=1`,
      );
      const data = await response.json();

      // Take only the first 25 movies
      const movies = data.results.slice(0, 25);

      // Display movies in the container
      this.displayMovies(movies);
    } catch (error) {
      console.error("Error fetching movies:", error);
    }
  }

  // Create and append movie cards to the container
  displayMovies(movies) {
    if (!this.container) return;

    // Clear previous cards
    this.container.innerHTML = "";

    movies.forEach((movie) => {
      // Movie title and poster
      const title = movie.title || movie.name;
      const poster = movie.poster_path
        ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
        : "https://via.placeholder.com/200x300?text=No+Image";

      // Main card
      const card = document.createElement("div");
      card.className = getCardStyle();

      // Relative wrapper
      const wrapper = document.createElement("div");
      wrapper.className = "relative";

      // Poster
      const img = document.createElement("img");
      img.src = poster;
      img.alt = title;
      img.className = getPosterStyle();

      // --- Bottom fade overlay ---
      const fade = document.createElement("div");
      fade.className = getFadeOverlay();

      // ⭐ Rating badge
      const rating = movie.vote_average || "N/A";
      const ratingDiv = document.createElement("div");
      ratingDiv.className = getRating();
      ratingDiv.textContent = `⭐ ${rating.toFixed(1)} `;

      // Favorite icon
      const favIcon = document.createElement("span");
      favIcon.className = getFavIconStyle();
      favIcon.title = "Add to Favorite";
      favIcon.textContent = "favorite";
      favIcon.style.fontSize = getIconSize();
      favIcon.addEventListener("animationend", () => {
        favIcon.classList.remove("bounce-on-click");
      });

      const alreadyFav = isFavourite(movie.id);
      if (alreadyFav) {
        favIcon.style.color = "#ff4c60";
      }

      attachFavIconHandler(favIcon, movie, {
        isFavourite,
        addToFavourites,
        removeFromFavourites,
      });

      // Icon Wrapper
      const iconWrapper = document.createElement("div");
      iconWrapper.className = getIconWrapperStyle();
      iconWrapper.appendChild(favIcon);
      wrapper.appendChild(img);
      wrapper.appendChild(fade);
      wrapper.appendChild(ratingDiv);

      // Description icon and notes list
      if (isFavourite(movie.id)) {
        const notes = getNotesForFav(movie.id);
        if (notes.length > 0) {
          const descIcon = document.createElement("span");
          descIcon.className = getDescIconStyle();
          descIcon.title = "Add Description";
          descIcon.textContent = "description";
          descIcon.style.fontSize = getIconSize();
          iconWrapper.appendChild(descIcon);

          const uiNotes = new UINotes();
          const renderNotes = uiNotes.renderNotes(notes);

          descIcon.addEventListener("mouseenter", () => {
            wrapper.appendChild(renderNotes);
            console.log(renderNotes);
          });

          descIcon.addEventListener("mouseleave", () => {
            renderNotes.remove();
          });
        }
      }

      wrapper.appendChild(iconWrapper);

      // Movie title section
      const titleDiv = document.createElement("div");
      titleDiv.className = getTitleStyle();
      titleDiv.textContent = title;

      // Append all to card
      card.appendChild(wrapper);
      card.appendChild(titleDiv);

      // Movie description section
      const descDiv = document.createElement("p");
      descDiv.className = getDescStyle();
      descDiv.textContent = movie.overview || "No description available.";

      // --- Tailwind + inline style for 3-line clamp ---
      descDiv.style.display = "-webkit-box"; // Use webkit box to enable line clamping
      descDiv.style.webkitBoxOrient = "vertical"; // Set box orientation to vertical
      descDiv.style.overflow = "hidden"; // Hide overflowing text
      descDiv.style.webkitLineClamp = "3"; // Limit text to 3 lines
      descDiv.style.maxHeight = "4 rem"; // Approximate height for 3 lines
      descDiv.style.lineHeight = "1.2em"; // Set line height for proper spacing
      descDiv.style.textOverflow = "ellipsis"; // Show "..." at the end of truncated text

      card.appendChild(descDiv);
      this.container.appendChild(card);
    });
  }
}

export default MovieApp;
