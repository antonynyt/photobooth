// Elements
const video = document.getElementById('video');
const photo = document.getElementById('photo');
const photoContext = photo.getContext('2d');
const startCameraBtn = document.getElementById('startCameraBtn');
const captureBtn = document.getElementById('captureBtn');
const processBtn = document.getElementById('processBtn');
const resultImg = document.getElementById('result');
const backgroundInput = document.getElementById('backgroundInput');
const backgroundPreview = document.getElementById('backgroundPreview');
const downloadBtn = document.getElementById('downloadBtn');
const countdownElement = document.getElementById('countdown');

// Variables
let stream = null;
let backgroundFile = null;

// Initialize canvas dimensions
photo.width = 400;
photo.height = 300;

// Start camera
startCameraBtn.addEventListener('click', async () => {
    try {
        stream = await navigator.mediaDevices.getUserMedia({ 
            video: { facingMode: "user", width: { ideal: 1280 }, height: { ideal: 720 } },
            audio: false 
        });
        video.srcObject = stream;
        startCameraBtn.disabled = true;
        captureBtn.disabled = false;
        
    } catch (err) {
        console.error("Error accessing camera: ", err);
        alert("Could not access camera. Please make sure it's connected and you've given permission.");
    }
});

// Preview selected background
backgroundInput.addEventListener('change', () => {
    if (backgroundInput.files && backgroundInput.files[0]) {
        backgroundFile = backgroundInput.files[0];
        
        const reader = new FileReader();
        reader.onload = (e) => {
            backgroundPreview.src = e.target.result;
            backgroundPreview.classList.remove('hidden');
        };
        reader.readAsDataURL(backgroundFile);
    }
});

// Start countdown and take photo
captureBtn.addEventListener('click', () => {
    if (!stream) return;
    
    // Start countdown
    let count = 3;
    countdownElement.textContent = count;
    countdownElement.classList.remove('hidden');
    
    const countdownInterval = setInterval(() => {
        count--;
        
        if (count <= 0) {
            clearInterval(countdownInterval);
            countdownElement.classList.add('hidden');
            
            // Take photo
            photo.width = video.videoWidth;
            photo.height = video.videoHeight;
            photoContext.drawImage(video, 0, 0, photo.width, photo.height);
            
            // Enable process button if background is selected
            if (backgroundFile) {
                processBtn.disabled = false;
            } else {
                alert("Please select a background image before processing");
            }
        } else {
            countdownElement.textContent = count;
        }
    }, 1000);
});

// Process photo with API
processBtn.addEventListener('click', async () => {
    if (!backgroundFile) {
        alert("Please select a background image");
        return;
    }
    
    try {
        processBtn.disabled = true;
        processBtn.textContent = "Processing...";
        
        // Create FormData to send files to API
        const formData = new FormData();
        
        // Convert canvas to blob and add to form data
        const photoBlob = await new Promise(resolve => {
            photo.toBlob(resolve, 'image/jpeg');
        });
        formData.append('subject', photoBlob, 'webcam.jpg');
        
        // Add background file
        formData.append('new_background', backgroundFile);
        
        // Send to API
        const response = await fetch('http://localhost:8000/replace-background', {
            method: 'POST',
            body: formData,
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        // Get result as blob and display
        const resultBlob = await response.blob();
        const resultUrl = URL.createObjectURL(resultBlob);
        resultImg.src = resultUrl;
        resultImg.classList.remove('hidden');
        
        // Enable download button
        downloadBtn.href = resultUrl;
        downloadBtn.classList.remove('hidden');
        
    } catch (error) {
        console.error("Error processing image:", error);
        alert("Error processing image. Please try again.");
    } finally {
        processBtn.disabled = false;
        processBtn.textContent = "Process Photo";
    }
});