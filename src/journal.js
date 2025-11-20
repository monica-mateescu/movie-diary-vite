import {
  addToFavourites,
  getFavourites,
  getIconSize,
  isFavourite,
  removeFromFavourites,
  setupResponsiveIcons,
  getNotes,
} from "./favourites.js";

import { renderNotes, addNoteToFavorite } from "./modules/ui.js";
import { searchForm, handleSearchFormSubmit } from "./modules/search.js";
import {
  getCardStyle,
  getFadeOverlay,
  getFavIconStyle,
  getIconWrapperStyle,
  getPosterStyle,
  getRating,
  attachFavIconHandler,
  getDescIconStyle,
  getNoteOverlay,
  getTitleStyle,
  getDescStyle,
} from "./moviecards.js";

const main = document.querySelector("main");
document.addEventListener("DOMContentLoaded", () => {
  const menuBtn = document.getElementById("menu-btn");
  const mobileMenu = document.getElementById("mobile-menu");

  if (menuBtn && mobileMenu) {
    menuBtn.addEventListener("click", () => {
      mobileMenu.classList.toggle("hidden");
    });

    mobileMenu.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        mobileMenu.classList.add("hidden");
      });
    });
  }

  renderJournal();
});

function createJournalLayout() {
  const section = main.querySelector("section");
  const heading = section.querySelector("h2");
  heading.textContent = "Favourite Movies";

  const grid = section.querySelector("#cardsContainer");
  grid.innerHTML = "";

  return { section, grid };
}

function renderEmptyState(section) {
  const message = "Wow, such empty...";

  const wrapper = document.createElement("div");
  wrapper.className = "flex flex-col items-center gap-3 mt-4";

  const icon = document.createElement("span");
  icon.className =
    "material-icons text-gray-400 text-5xl opacity-0 animate-fadeUp";
  icon.style.animationDelay = "0ms";
  icon.textContent = "cruelty_free";
  icon.style.fontSize = "80px";
  wrapper.appendChild(icon);

  const p = document.createElement("p");
  p.className =
    "text-gray-300 text-lg font-semibold italic flex gap-1 flex-wrap";

  message.split("").forEach((char, index) => {
    const span = document.createElement("span");
    span.textContent = char;
    span.className = "inline-block opacity-0 animate-fadeUp";
    span.style.animationDelay = `${index * 60 + 200}ms`;
    p.appendChild(span);
  });

  wrapper.appendChild(p);
  section.appendChild(wrapper);
}

function renderJournal() {
  const favourites = getFavourites();
  const { section, grid } = createJournalLayout();

  if (!favourites.length) {
    renderEmptyState(section, grid);
    return;
  }

  favourites.forEach((movie) => {
    // === Card wrapper ===
    const card = document.createElement("div");
    card.className = getCardStyle();

    const wrapper = document.createElement("div");
    wrapper.className = "relative";

    // === Poster ===
    const imagePath = movie.image;
    const poster =
      typeof imagePath === "string" && imagePath.startsWith("http")
        ? imagePath
        : imagePath
        ? `https://image.tmdb.org/t/p/w500${imagePath}`
        : "https://via.placeholder.com/200x300?text=No+Image";

    const img = document.createElement("img");
    img.src = poster;
    img.alt = movie.title || "Movie poster";
    img.className = getPosterStyle();

    // --- Bottom fade overlay ---
    const fade = document.createElement("div");
    fade.className = getFadeOverlay();

    // ⭐ Rating badge (falls keine Zahl vorhanden -> N/A)
    const ratingDiv = document.createElement("div");
    ratingDiv.className = getRating();
    const ratingValue =
      typeof movie.vote_average === "number"
        ? movie.vote_average
        : typeof movie.rating === "number"
        ? movie.rating
        : null;
    ratingDiv.textContent =
      ratingValue != null ? `⭐ ${ratingValue.toFixed(1)} ` : "⭐ N/A";

    // === Favourite icon ===
    const favIcon = document.createElement("span");
    favIcon.className = getFavIconStyle();
    favIcon.title = "Remove from favourites";
    favIcon.textContent = "favorite";
    favIcon.style.fontSize = getIconSize();

    favIcon.addEventListener("animationend", () => {
      favIcon.classList.remove("bounce-on-click");
    });

    if (isFavourite(movie.id)) {
      favIcon.style.color = "#ff4c60";
    }

    attachFavIconHandler(favIcon, movie, {
      isFavourite,
      addToFavourites,
      removeFromFavourites,
    });

    // === Description icon / Notes ===
    const iconWrapper = document.createElement("div");
    iconWrapper.className = getIconWrapperStyle();
    iconWrapper.appendChild(favIcon);

    const descIcon = document.createElement("span");
    descIcon.className = getDescIconStyle();
    descIcon.title = "Add Description";
    descIcon.textContent = "description";
    descIcon.style.fontSize = getIconSize();
    iconWrapper.appendChild(descIcon);

    // Klick -> eigene Notiz hinzufügen
    descIcon.addEventListener("click", () => {
      addNoteToFavorite(movie.id);
    });

    // Hover -> Overlay, falls Notizen vorhanden
    const notes = getNotes(movie.id);
    if (notes.length > 0) {
      const noteOverlay = document.createElement("div");
      descIcon.classList.add("text-yellow-200");

      descIcon.addEventListener("mouseenter", () => {
        renderNotes(notes, noteOverlay);
        noteOverlay.className = getNoteOverlay();
        wrapper.appendChild(noteOverlay);
      });

      descIcon.addEventListener("mouseleave", () => {
        noteOverlay.remove();
      });
    }

    // === Wrapper zusammenbauen ===
    wrapper.appendChild(img);
    wrapper.appendChild(fade);
    wrapper.appendChild(ratingDiv);
    wrapper.appendChild(iconWrapper);

    card.appendChild(wrapper);

    // === Titel wie in main.js ===
    const titleDiv = document.createElement("div");
    titleDiv.className = getTitleStyle();
    titleDiv.textContent = movie.title;
    card.appendChild(titleDiv);

    // === Beschreibung (3-Zeilen-Clamp wie in main.js) ===
    const descDiv = document.createElement("p");
    descDiv.className = getDescStyle();

    const text =
      typeof movie.info === "string" && movie.info.length > 180
        ? movie.info.slice(0, 180) + "..."
        : movie.info;

    descDiv.textContent = text || "No description available.";

    descDiv.style.display = "-webkit-box";
    descDiv.style.webkitBoxOrient = "vertical";
    descDiv.style.overflow = "hidden";
    descDiv.style.webkitLineClamp = "3";
    descDiv.style.maxHeight = "4 rem";
    descDiv.style.lineHeight = "1.2em";
    descDiv.style.textOverflow = "ellipsis";

    card.appendChild(descDiv);
    grid.appendChild(card);

    // Zusätzliche Logik: wenn Herz "aus" -> Karte aus dem Journal entfernen
    favIcon.addEventListener("click", () => {
      if (!isFavourite(movie.id)) {
        card.remove();

        if (!grid.children.length) {
          renderEmptyState(section, grid);
        }
      }
    });
  });
}

// setupResponsiveIcons();
// renderJournal();
searchForm.addEventListener("submit", handleSearchFormSubmit);
