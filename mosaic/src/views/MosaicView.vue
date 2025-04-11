<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import { io } from "socket.io-client";
import { photos } from '../stores/photos';

const pixelHeight = ref(2.5);
const pixelWidth = ref(2);
const imageHeight = ref(60);
const imageWidth = ref(100);

const socket = io("ws://localhost:4000"); //change to storage API url on deployment

function convertToBase64(data) {
    // Create a string from the data array without exceeding the call stack size
    let binaryString = "";
    for (let i = 0; i < data.length; i++) {
        binaryString += String.fromCharCode(data[i]);
    }

    // Return the Base64 encoded string
    return btoa(binaryString);
}

// Fetch images at startup
const fetchImages = async () => {
  try {
    const res = await fetch("/api/images");
    const data = await res.json();

    // Convert all images to Base64 before storing in photos
    photos.value = data.map(photo => ({
      ...photo,
      img: convertToBase64(photo.img.data)
    }));

  } catch (error) {
    console.error("Error fetching images:", error);
  }
};

onMounted(() => {
  fetchImages();  

  // Listen for new images from the server
  socket.on("newImage", (newImage) => {
    console.log(convertToBase64(newImage.img.data));
    newImage.img = convertToBase64(newImage.img.data);
    photos.value.push(newImage);
    console.log("Updated photos:", photos.value);
  });
});

onBeforeUnmount(() => {
  if (socket) {
    socket.disconnect();
  }
});

</script>

<template>
  <div>
    <img class="background" src="https://servettefc.ch/wp-content/uploads/2025/03/Article-Visuel-SFCCF-2-630x320.jpg" :style="`width: ${imageWidth}vw; height: ${imageHeight}vw`"></img>
  </div>
  <div class="pixel" v-for="n in (imageHeight/pixelHeight)*(imageWidth/pixelWidth)">
    <img class="user-img" :id="`user-img-${n}`" :src="`data:image/jpeg;base64,${photos[n-1]?.img}`" :style="`top: ${((n-1)*pixelHeight)%imageHeight}vw; left:  ${Math.floor((n-1)/(imageHeight/pixelHeight))*pixelWidth}vw; opacity: 0.3; width: ${pixelWidth}vw; height: ${pixelHeight}vw`"></img>
    <img class="image-blocker" :id="`image-blocker-${n}`" src="https://images.unsplash.com/photo-1598812866501-87ad598839e7?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fGZvbmQlMjBub2lyfGVufDB8fDB8fHww" :style="`top: ${((n-1)*pixelHeight)%imageHeight}vw; left:  ${Math.floor((n-1)/(imageHeight/pixelHeight))*pixelWidth}vw; opacity: ${photos[n-1] ? 0 : 1}; width: ${pixelWidth+0.002}vw; height: ${pixelHeight+0.002}vw`"></img>
  </div>
</template>

<style scoped>
  img.background, img.user-img, img.image-blocker {
    position: absolute;
  }

  img.user-img {
    z-index: 1;
  }

  img.image-blocker {
    z-index: 2;
  }
</style>