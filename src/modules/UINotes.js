import {
  addNoteToFav,
  getFavourites,
  removeNoteFromFav,
} from "./favourites.js";
import { getNoteOverlay } from "./moviecards.js";
import UIDialog from "./UIDialog";

/**
 * UINotes class handles creating, displaying, and managing notes for favorite movies.
 */
class UINotes {
  /**
   * @param dialog - An instance of UIDialog to manage modal creation. Defaults to a new UIDialog.
   */
  constructor(dialog = new UIDialog()) {
    this.dialog = dialog;
  }

  /**
   * Creates a note form for a specific movie inside a dialog.
   * Displays existing notes and allows adding new ones.
   * @param id - The ID of the movie to add notes for
   */
  createForm(id) {
    // Create modal dialog and get its content container
    const { dialog, content } = this.dialog.create();

    const movie = getFavourites().find((movie) => movie.id === id);

    const h2 = document.createElement("h2");
    const form = document.createElement("form");
    const field = document.createElement("textarea");
    field.name = "note";
    const saveBtn = document.createElement("button");
    h2.className = "text-sm text-[var(--text-light)] mt-8 mb-2";
    h2.innerHTML = `Reflections on <strong>${movie.title}</strong>`;

    form.className = "pb-8 flex flex-col w-full";
    field.className =
      "mt-2 w-full bg-[var(--card-bg)]/90 text-[var(--text-light)] p-2 rounded resize-none text-sm";
    field.placeholder = "Add your note here...";
    saveBtn.className =
      "self-end mt-2 bg-[var(--card-bg)]/90 hover:bg-red-600 active:bg-red-600 text-[var(--text-light)] px-2 py-1 rounded text-xs";
    saveBtn.textContent = "Save Note";

    form.append(field, saveBtn);
    content.append(h2, form);

    content.appendChild(this.#displayNotes(movie.id));

    saveBtn.addEventListener("click", (e) => {
      e.preventDefault();

      const submit = this.#handleFormSubmit(field, movie.id);
      if (submit) {
        const oldList = content.querySelector("ul");
        const newList = this.#displayNotes(movie.id);

        if (oldList) {
          oldList.replaceWith(newList);
        } else {
          content.appendChild(newList);
        }

        form.reset();
      }
    });
  }

  /**
   * Handles the submission of the note form.
   * Validates input and adds the note to favorites.
   * @param field - The textarea element containing the note
   * @param movieId - The ID of the movie to associate the note with
   * Returns true if note was added, false if input was empty
   */
  #handleFormSubmit(field, movieId) {
    const val = field.value.trim();

    if (!val) {
      const p = document.createElement("p");
      p.className = "text-red-600 text-xs";
      p.textContent = "Note cannot be empty.";

      field.insertAdjacentElement("afterend", p);

      setTimeout(() => {
        p.remove();
      }, 3000);
      return false;
    }

    addNoteToFav(movieId, val);

    return true;
  }

  /**
   * Generates a <ul> element containing all notes for a given movie.
   * @param  movieID - The ID of the movie
   * Returns a <ul> element populated with note items
   */
  #displayNotes(movieId) {
    const movies = getFavourites();
    const movie = movies.find((m) => m.id === movieId);
    const ul = document.createElement("ul");

    const notes = movie.notes ?? [];

    notes.forEach((note) => {
      const element = this.#createElement(movie.id, note);
      ul.prepend(element);
    });

    return ul;
  }

  /**
   * Creates a single note <li> element with a delete button.
   * @param movieId - The ID of the movie
   * @param note - Note object containing id and content
   * Returns the constructed list item element
   */
  #createElement(movieId, note) {
    const element = document.createElement("li");
    const p = document.createElement("p");
    const deleteBtn = document.createElement("button");

    element.className =
      "border-b-2 border-gray-600 text-[var(--text-light)] flex gap-4 items-baseline px-4 py-2 justify-between text-xs";
    p.textContent = note.content;

    deleteBtn.className =
      "text-red-400 hover:text-red-600 active:text-red-600 text-xs font-bold";
    deleteBtn.textContent = "Delete";

    deleteBtn.addEventListener("click", () => {
      removeNoteFromFav(movieId, note.id);

      element.remove();
    });

    element.append(p, deleteBtn);

    return element;
  }

  /**
   * Renders notes in an overlay div (used outside of a dialog).
   * @param  notes - Array of note objects
   * Return overlay element containing the list of notes
   */
  renderNotes(notes) {
    const overlay = document.createElement("div");
    const ul = document.createElement("ul");

    overlay.className = getNoteOverlay();
    ul.className = "space-y-1 overflow-y-auto";

    notes.forEach((note) => {
      const element = document.createElement("li");
      element.className = "text-[var(--text-light)] text-xs px-2 py-1 rounded";

      element.textContent = note.content;

      ul.prepend(element);
    });

    overlay.appendChild(ul);

    return overlay;
  }
}

export default UINotes;
