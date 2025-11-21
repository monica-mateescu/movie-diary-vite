//Since the header is imported, the script inside it no longer runs.
// It needs to be written separately and called explicitly.
import { mobileMenuHandler } from "./mobilemenue.js";

async function loadheader(params) {
  const container = document.getElementById("header-container");
  if (!container) return;
  const response = await fetch("./header.html");
  const html = await response.text();
  container.innerHTML = html;
  //active-menu Mobile
  mobileMenuHandler();
}
loadheader();
