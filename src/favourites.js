//======== Favourites Module ============================

export function getFavourites() {
  return JSON.parse(localStorage.getItem("favs")) || [];
}

export function addFavourites(currentFavs, movieObj) {
  return [...currentFavs, movieObj];
}

export function saveFavourites(newFavs) {
  localStorage.setItem("favs", JSON.stringify(newFavs));
}

export function isFavourite(id) {
  const favs = getFavourites();
  return favs.some((fav) => fav.id === id);
}

export function removeFromFavourites(id) {
  const favs = getFavourites();
  const newFavs = favs.filter((fav) => fav.id !== id);
  saveFavourites(newFavs);
}

export function addToFavourites(movieObj) {
  const currentFavs = getFavourites();
  const newFavs = addFavourites(currentFavs, movieObj);
  saveFavourites(newFavs);
}
export function getIconSize() {
  if (window.innerWidth < 640) {
    return "20px";
  } else if (window.innerWidth < 1024) {
    return "25px";
  } else {
    return "30px";
  }
}
export function setupResponsiveIcons() {
  window.addEventListener("resize", () => {
    document.querySelectorAll(".material-icons-only").forEach((icon) => {
      icon.style.fontSize = getIconSize();
    });
  });
}

export function getNotes(id) {
  const favs = getFavourites();
  const fav = favs.find((fav) => fav.id === id);

  return fav.notes ?? [];
}
