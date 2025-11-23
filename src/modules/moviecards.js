//======== Moviecards Module ============================

export function getCardStyle() {
  return "bg-[var(--card-bg)] rounded-lg shadow-md drop-shadow-md overflow-free text-black hover:scale-105 duration-300 group w-full sm:w-[45%] md:w-[23%]";
}
export function getFadeOverlay() {
  return "absolute bottom-0 left-0 w-full h-[150px] bg-gradient-to-t from-[#2A2E3E] via-[#2A2E3Eaa] to-transparent pointer-events-none";
}
export function getPosterStyle() {
  return "w-full  object-cover rounded-lg h-[250px]";
}
export function getRating() {
  return "absolute top-2 left-2 bg-[#FF4C60]/80 text-white text-[12px] font-bold px-0.5 pr-3 italic rounded border border-[rgba(0,0,0,0.3)] shadow-[0_4px_10px_rgba(0,0,0,0.6)] ";
}
export function getIconWrapperStyle() {
  return "absolute top-1 right-1 flex items-center gap-0.5 z-10";
}
export function getFavIconStyle() {
  return "material-icons-only icon-hover icon-animated cursor-pointer text-[var(--icon-light)] pt-0.5 pr-1";
}
export function getDescIconStyle() {
  return "material-icons-only icon-hover icon-animated cursor-pointer text-[var(--icon-light)]";
}
export function getNoteOverlay() {
  return "absolute w-full h-full inset-0 bg-aurora-cinema opacity-90 text-[#E1E2EC] flex flex-col justify-end p-4";
}
export function getTitleStyle() {
  return "text-[var(--primary-red)] text-xs font-bold text-center p-1";
}
export function getDescStyle() {
  return "text-[var(--text-light)] text-[8px] text-left px-3 mb-4";
}

export function attachFavIconHandler(
  favIcon,
  movie,
  { isFavourite, addToFavourites, removeFromFavourites }
) {
  favIcon.addEventListener("click", () => {
    const movieObj = {
      id: movie.id,
      title: movie.title,
      image: movie.poster_path,
      info: movie.overview,
      rating: movie.vote_average,
    };

    if (!isFavourite(movie.id)) {
      // Bounce-Effekt beim Klicken
      favIcon.classList.remove("bounce-on-click");
      void favIcon.offsetWidth;
      favIcon.classList.add("bounce-on-click");
    }

    if (isFavourite(movie.id)) {
      removeFromFavourites(movie.id);
      favIcon.style.color = "";
    } else {
      addToFavourites(movieObj);
      favIcon.style.color = "#ff4c60";
    }
  });
}
