<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import { io } from "socket.io-client";
import { photos } from '../stores/photos';

const pixelHeight = ref(2.5);
const pixelWidth = ref(2);
const imageHeight = ref(60);
const imageWidth = ref(100);

const socket = io("ws://localhost:4000"); //change to storage API url on deployment

const fetchImages = async () => {
  try {
    const res = await fetch("/api/images");
    const data = await res.json();
    photos.value = data;
  } catch (error) {
    console.error("Error fetching images:", error);
  }
};

onMounted(() => {
  fetchImages();      
  socket.on("newImage", (newImage) => {
    photos.value.push(newImage);
    console.log(photos.value.length);
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
    <img class="user-img" :id="`user-img-${n}`" src="https://thispersondoesnotexist.com/" :style="`top: ${((n-1)*pixelHeight)%imageHeight}vw; left:  ${Math.floor((n-1)/(imageHeight/pixelHeight))*pixelWidth}vw; opacity: 0.3; width: ${pixelWidth}vw; height: ${pixelHeight}vw`"></img>
    <img class="image-blocker" :id="`image-blocker-${n}`" src="https://images.unsplash.com/photo-1598812866501-87ad598839e7?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fGZvbmQlMjBub2lyfGVufDB8fDB8fHww" :style="`top: ${((n-1)*pixelHeight)%imageHeight}vw; left:  ${Math.floor((n-1)/(imageHeight/pixelHeight))*pixelWidth}vw; opacity: ${Math.floor(Math.random()*2)}; width: ${pixelWidth+0.002}vw; height: ${pixelHeight+0.002}vw`"></img>
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