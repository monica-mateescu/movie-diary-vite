import { getFavourites, saveFavourites } from "../favourites.js";

const body = document.body;

const truncate = (text, maxLength) => {
  if (!text) return "";

  return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
};

// Create dialog
const createDialog = () => {
  const dialog = document.createElement("dialog");
  const container = document.createElement("div");
  const closeBtn = document.createElement("button");
  const content = document.createElement("div");

  dialog.className =
    "fixed inset-0 flex justify-center items-center w-full h-full bg-black/40 backdrop-blur-sm z-50";
  container.className =
    "bg-[var(--card-bg)]/80 rounded-lg w-full lg:w-2/3 max-h-[80vh] p-4 relative";
  closeBtn.className =
    "absolute top-4 right-4 bg-transparent hover:bg-red-600 rounded-lg px-2 text-[var(--text-light)] hover:text-white text-sm font-bold cursor-pointer";
  closeBtn.textContent = "x";

  content.className = "overflow-y-auto max-h-[65vh] pr-2";

  container.append(closeBtn, content);
  dialog.appendChild(container);

  closeBtn.addEventListener("click", () => dialog.remove());

  return { dialog, content };
};

// Display search results in a dialog
const displayMovies = (movies) => {
  const { dialog, content } = createDialog();

  if (movies.length === 0) {
    const p = document.createElement("p");
    p.className = "text-[var(--text-light)] pt-20";
    p.textContent = "No results found.";
    dialog.appendChild(p);
  } else {
    for (const movie of movies) {
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
      p.textContent = truncate(overview, 250);

      div.append(h2, span, p);
      article.appendChild(div);
      content.appendChild(article);
    }
  }

  body.appendChild(dialog);
};

// Display notes
const displayNotes = (fav, container) => {
  if (!container) return;

  const oldUl = container.querySelector("ul");
  if (oldUl) oldUl.remove();

  const ul = document.createElement("ul");

  const notes = fav.notes ?? [];

  for (const note of notes) {
    const li = document.createElement("li");
    const p = document.createElement("p");
    const deleteBtn = document.createElement("button");

    li.className =
      "border-b-2 border-gray-600 text-[var(--text-light)] flex gap-4 items-baseline px-4 py-2 justify-between text-xs";
    p.textContent = note.content;

    deleteBtn.className =
      "text-red-400 hover:text-red-600 active:text-red-600 text-xs font-bold";
    deleteBtn.textContent = "Delete";

    deleteBtn.addEventListener("click", () => {
      const favs = getFavourites();

      const newFav = favs.find((f) => f.id === fav.id);

      if (newFav.notes) {
        const notesUpdated = newFav.notes.filter((n) => n.id !== note.id);

        newFav.notes = notesUpdated;
      }

      saveFavourites(favs);

      li.remove();
    });

    li.append(p, deleteBtn);
    ul.prepend(li);
  }

  container.appendChild(ul);
};

// Add notes to favorite
const addNoteToFavorite = (id) => {
  const { dialog, content } = createDialog();

  const favs = getFavourites();
  const fav = favs.find((fav) => fav.id === id);

  const h2 = document.createElement("h2");
  const form = document.createElement("form");
  const noteInput = document.createElement("textarea");
  const saveBtn = document.createElement("button");
  h2.className = "text-sm text-[var(--text-light)] mt-8 mb-2";
  h2.innerHTML = `Reflections on <strong>${fav.title}</strong>`;

  form.className = "pb-8 flex flex-col w-full";
  noteInput.className =
    "mt-2 w-full bg-[var(--card-bg)]/90 text-[var(--text-light)] p-2 rounded resize-none text-sm";
  noteInput.placeholder = "Add your note here...";
  saveBtn.className =
    "self-end mt-2 bg-[var(--card-bg)]/90 hover:bg-red-600 active:bg-red-600 text-[var(--text-light)] px-2 py-1 rounded text-xs";
  saveBtn.textContent = "Save Note";

  form.append(noteInput, saveBtn);
  content.append(h2, form);
  body.appendChild(dialog);

  displayNotes(fav, content);

  saveBtn.addEventListener("click", (e) => {
    e.preventDefault();

    const val = noteInput.value.trim();

    if (!val) {
      const p = document.createElement("p");
      p.className = "text-red-600 text-xs";
      p.textContent = "Note cannot be empty.";

      noteInput.insertAdjacentElement("afterend", p);

      return;
    }

    fav.notes = fav.notes ?? [];

    const newNote = {
      id: "note-" + crypto.randomUUID(),
      content: val,
    };

    fav.notes.push(newNote);

    saveFavourites(favs);

    displayNotes(fav, content);

    form.reset();
  });
};

const renderNotes = (notes, container) => {
  container.innerHTML = "";

  const list = document.createElement("ul");

  list.className = "space-y-1 overflow-y-auto";

  notes.forEach((note) => {
    const li = document.createElement("li");
    li.className = "text-[var(--text-light)] text-xs px-2 py-1 rounded";

    li.textContent = note.content;

    list.appendChild(li);
  });

  container.appendChild(list);
};

export { renderNotes, displayMovies, addNoteToFavorite };
