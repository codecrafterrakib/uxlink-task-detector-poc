// Get references to the HTML elements
const imageInput = document.getElementById("imageInput");
const processButton = document.getElementById("processButton");
const uploadedImage = document.getElementById("uploadedImage");
const walletAddressDisplay = document.getElementById("walletAddressDisplay");
const balanceDisplay = document.getElementById("balanceDisplay");
const extractedText = document.getElementById("extractedText");
// Define the regex pattern
const walletPattern = /\s*[a-zA-Z0-9]{4}\.\.\.[a-zA-Z0-9]{4}\s*/;
const balancePattern = /\s*10\s+UXUY\s*/i;

let imageFile = null;

// Handle image file selection
imageInput.addEventListener("change", (event) => {
  imageFile = event.target.files[0];
  if (imageFile) {
    // Display the uploaded image
    const reader = new FileReader();
    reader.onload = function (e) {
      uploadedImage.src = e.target.result;
    };
    reader.readAsDataURL(imageFile);
  }
});

// Handle text extraction when the button is clicked
processButton.addEventListener("click", () => {
  if (!imageFile) {
    alert("Please upload an image first!");
    return;
  }

  // Use Tesseract.js to process the image
  extractedText.textContent = "Processing..."; // Show loading message
  Tesseract.recognize(
    uploadedImage.src, // Image source
    "eng", // Language (English in this case)
    {
      logger: (info) => {
        console.log(info); // Log progress information
      },
    }
  )
    .then(({ data: { text } }) => {
      // Display the extracted text
      extractedText.textContent = text;
      const walletAddress = text.match(walletPattern);
      const balance = text.match(balancePattern);
      walletAddressDisplay.textContent = walletAddress;
      balanceDisplay.textContent = balance;
    })
    .catch((err) => {
      // Handle errors
      console.error(err);
      extractedText.textContent = "Error occurred while extracting text.";
    });
});
