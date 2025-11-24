// 2ND ENTRY-POINT
import { renderJournal } from "./modules/journalView.js";
import { setupMobileMenu } from "./modules/mobileMenu.js";
import { handleSearchFormSubmit, searchForm } from "./modules/search.js";

document.addEventListener("DOMContentLoaded", () => {
  setupMobileMenu();
  renderJournal();
});

searchForm.addEventListener("submit", handleSearchFormSubmit);
