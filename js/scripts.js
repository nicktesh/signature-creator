// Function to update the copyright year dynamically
function updateCopyrightYear() {
  const year = new Date().getFullYear();
  const copyrightElement = document.getElementById("copyright");

  // Ensure the element exists before attempting to update its content
  if (copyrightElement) {
    copyrightElement.textContent = `© Nick Tesh ${year} - All Rights Reserved.`;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  updateCopyrightYear();
});
