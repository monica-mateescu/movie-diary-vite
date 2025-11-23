class UIDialog {
  /**
   * @param root - The DOM element to which the dialog will be appended. Defaults to document.body.
   */
  constructor(root = document.body) {
    this.root = root;
  }

  /**
   * Creates a dialog element with a close button and a content container.
   * Appends the dialog to the root element and attaches the close event.
   * Returns object containing the dialog element and its inner content container.
   */
  create() {
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

    this.root.append(dialog);

    return { dialog, content };
  }
}

export default UIDialog;
