import UIDialog from "./UIDialog";

/**
 * UISearch class handles the display of movie search results in a modal dialog.
 */
class UISearch {
  /**
   * @param dialog - An instance of UIDialog to manage modal creation. Defaults to a new UIDialog.
   */
  constructor(dialog = new UIDialog()) {
    this.dialog = dialog;
  }

  /**
   * Displays a list of movies inside a modal dialog.
   * If no movies are found, shows a "No results found" message.
   *
   * @param movies - Array of movie objects returned from the API
   */
  display(movies) {
    // Create modal dialog and get its content container
    const { dialog, content } = this.dialog.create();

    if (movies.length === 0) {
      const p = document.createElement("p");
      p.className = "text-[var(--text-light)] py-20";
      p.textContent = "No results found.";
      content.appendChild(p);

      return;
    }

    movies.forEach((movie) => {
      const element = this.#createElement(movie);
      content.appendChild(element);
    });
  }

  showError(error) {
    const { dialog, content } = this.dialog.create();
    const p = document.createElement("p");

    p.className = "text-[var(--text-light)] py-20";
    p.textContent = error;

    content.appendChild(p);
  }

  /**
   * Creates a DOM element representing a single movie card.
   * This method is private and should only be used internally by the class.
   * @param movie - Movie object containing title, overview, poster_path, release_date
   * Returns a fully constructed article element representing the movie
   */
  #createElement(movie) {
    const { title, overview, poster_path, release_date } = movie;

    const article = document.createElement("article");
    const img = document.createElement("img");
    const div = document.createElement("div");
    const h2 = document.createElement("h2");
    const span = document.createElement("span");
    const p = document.createElement("p");

    article.className = "flex lg:items-center border-b-2 border-gray-600 p-2";
    img.className = "self-start";
    div.className = "text-[var(--text-light)] pl-5 text-sm";
    h2.className = "text-sm font-semibold";
    span.className = "text-slate-100 text-xs";
    p.className = "mt-2";

    if (poster_path) {
      img.src = `https://image.tmdb.org/t/p/w92${poster_path}`;
      img.title = title;
      article.appendChild(img);
    }

    h2.textContent = title;
    span.textContent = release_date
      ? new Date(release_date).toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "long",
          year: "numeric",
        })
      : "";
    p.textContent =
      overview.length > 250 ? overview.slice(0, 250) + "..." : overview;

    div.append(h2, span, p);
    article.appendChild(div);

    return article;
  }
}

export default UISearch;
