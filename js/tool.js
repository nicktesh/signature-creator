const canvas = document.getElementById("drawingCanvas");
const ctx = canvas.getContext("2d");
const clearCanvasButton = document.getElementById("clearCanvas");
let drawing = false;
let startTime;
let penWidth = 3;
let penColor = "#000000";
let savedStates = [];

// Function to detect and save states for the user - Keeps the last 10 states
function saveState() {
  savedStates.push(canvas.toDataURL());
  if (savedStates.length > 10) savedStates.shift();
}

// Function to detect when drawing starts
function startDrawing(e) {
  drawing = true;
  const { x, y } = getCoordinates(e);
  ctx.beginPath();
  ctx.moveTo(x, y);
  saveState();
}

// Function to detect when drawing stops
function stopDrawing(e) {
  if (!drawing) return;
  drawing = false;
  ctx.beginPath();
}
// Clear Canvas functionality
clearCanvasButton.addEventListener("click", () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
});

// This function determines if an event is a touch event or mouse event
// and extracts the coordinates accordingly
function getCoordinates(e) {
  let x, y;
  if (e.touches) {
    e.preventDefault();
    let rect = canvas.getBoundingClientRect();
    x = e.touches[0].clientX - rect.left;
    y = e.touches[0].clientY - rect.top;
  } else {
    x = e.offsetX;
    y = e.offsetY;
  }
  return { x, y };
}

// This function handles the pen tool drawing
function draw(e) {
  if (!drawing) return;

  const { x, y } = getCoordinates(e);

  ctx.lineWidth = penWidth;
  ctx.lineCap = "round";
  ctx.strokeStyle = penColor;

  ctx.lineTo(x, y);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(x, y);
}

// Function to draw the text with the current settings
function drawText() {
  const userName = document.getElementById("nameInput").value;
  const textSize = document.getElementById("textSizeInput").value || 70;
  const fontFamily = document.getElementById("fontDropdown").value;

  // This will set the font center of the canvas
  if (userName) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.font = `${textSize}px ${fontFamily}`;
    ctx.fillStyle = penColor;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(userName, canvas.width / 2, canvas.height / 2);
  }
}

// Event listener for color picker
document.getElementById("colorPicker").addEventListener("input", function (e) {
  penColor = e.target.value;
  drawText();
});

// Event listener for hex input
document.getElementById("hexInput").addEventListener("input", function (e) {
  const hexValue = e.target.value;
  // Validate hex value
  if (/^#[0-9A-F]{6}$/i.test(hexValue)) {
    penColor = hexValue;
    document.getElementById("colorPicker").value = penColor;
    drawText();
  }
});

// Event listeners for text input and font size
document.getElementById("nameInput").addEventListener("input", drawText);
document.getElementById("textSizeInput").addEventListener("input", drawText);
document.getElementById("fontDropdown").addEventListener("change", drawText);

// Apply Text button, useful if user clears the canvas and wants to quickly add name back
document.getElementById("applyText").addEventListener("click", drawText);

// This function handles undoing previous actions
function undoLastAction() {
  if (savedStates.length) {
    const lastState = savedStates.pop();
    const img = new Image();
    img.onload = function () {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
    };
    img.src = lastState;
  }
}

// This function handles exporting the canvas to either a PNG or JPG image
function exportCanvas(format) {
  let image;
  if (format === "png") {
    // Export as PNG
    image = canvas.toDataURL("image/png", 1.0);
  } else if (format === "jpg") {
    // Create a temporary canvas to handle the JPG export
    const jpgCanvas = document.createElement("canvas");
    const jpgCtx = jpgCanvas.getContext("2d");

    // Set dimensions equal to the original canvas
    jpgCanvas.width = canvas.width;
    jpgCanvas.height = canvas.height;

    // Fill background with white color
    jpgCtx.fillStyle = "#fff";
    jpgCtx.fillRect(0, 0, jpgCanvas.width, jpgCanvas.height);

    // Draw the original canvas content on top
    jpgCtx.drawImage(canvas, 0, 0);

    // Export as JPG
    image = jpgCanvas.toDataURL("image/jpeg", 1.0);
  }

  // Create link and trigger download
  const link = document.createElement("a");
  link.download = `exported_image.${format}`;
  link.href = image;
  link.click();
}

// Event listeners for desktop
canvas.addEventListener("mousedown", startDrawing);
canvas.addEventListener("mouseup", stopDrawing);
canvas.addEventListener("mouseout", stopDrawing);
canvas.addEventListener("mousemove", draw);

// Touch Event Listeners for mobile
canvas.addEventListener("touchstart", startDrawing);
canvas.addEventListener("touchend", stopDrawing);
canvas.addEventListener("touchcancel", stopDrawing);
canvas.addEventListener("touchmove", draw);

// Additional Event Listeners
document.getElementById("undo").addEventListener("click", undoLastAction);
document.getElementById("exportPng").addEventListener("click", () => exportCanvas("png"));
document.getElementById("exportJpg").addEventListener("click", () => exportCanvas("jpg"));

// Update the pen width based on user selection
document.getElementById("penWidth").addEventListener("input", function (e) {
  penWidth = parseFloat(e.target.value);
  document.getElementById("penWidthValue").textContent = penWidth.toFixed(1);
});

// Update hex input when the color picker value changes
document.getElementById("colorPicker").addEventListener("input", function (e) {
  penColor = e.target.value;
  document.getElementById("hexInput").value = penColor.toUpperCase(); // Update the hex input
});

// Update color picker when the hex input value changes
document.getElementById("hexInput").addEventListener("input", function (e) {
  const hexValue = e.target.value;
  // Validate hex value
  if (/^#[0-9A-F]{6}$/i.test(hexValue)) {
    penColor = hexValue;
    document.getElementById("colorPicker").value = penColor; // Update the color picker
  }
});
