// 2ND ENTRY-POINT
import { renderJournal } from "./modules/journalView.js";
import { loadFooter } from "./modules/loadFooter.js";
import { loadheader } from "./modules/loadHeader.js";
import { mobileMenuHandler } from "./modules/mobilemenue.js";
import { handleSearchFormSubmit, searchForm } from "./modules/search.js";

loadheader();
document.addEventListener("DOMContentLoaded", () => {
  mobileMenuHandler();
  renderJournal();
});

searchForm.addEventListener("submit", handleSearchFormSubmit);
mobileMenuHandler();
loadFooter();
