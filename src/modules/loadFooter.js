// Define an asynchronous function to load the footer
export async function loadFooter(params) {
  // Find the container element in the DOM by its ID
  const container = document.getElementById("footer-container");

  // If the container does not exist, stop the function
  if (!container) return;

  // Fetch the external footer HTML file
  const response = await fetch("/footer.html");

  // Convert the response into plain text (HTML string)
  const html = await response.text();

  // Insert the fetched HTML into the container element
  container.innerHTML = html;
}

// Call the function to load the footer immediately
