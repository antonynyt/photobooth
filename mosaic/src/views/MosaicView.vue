<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import { io } from "socket.io-client";
import { photos } from '../stores/photos';

const pixelHeight = ref(2);
const pixelWidth = ref(1.5);
const imageHeight = ref(46);
const imageWidth = ref(90);
const wScale = ref(100/imageWidth.value);
const hScale = ref(100/imageHeight.value);
const FullIndexes = ref([]);
const lastImage = ref(null);
const queueSize = ref(0);

const x = ref(window.innerWidth);
const y = ref(window.innerHeight);
const socket = io(import.meta.env.VITE_STORAGE_API_URL);

const displayPhotoImmediate = (photo) => {
  let randIndex = Math.floor(Math.random()*(imageHeight.value/pixelHeight.value*imageWidth.value/pixelWidth.value));
  // Increments the value of randIndex until it finds an empty spot in the array
  findEmptyIndex(photo, randIndex);
  FullIndexes.value.push([photo.number, randIndex]);
}

const displayPhoto = (photo) => {
  if (!lastImage.value) {
    queueSize.value--;
    let randIndex = Math.floor(Math.random()*(imageHeight.value/pixelHeight.value*imageWidth.value/pixelWidth.value));
    // Increments the value of randIndex until it finds an empty spot in the array
    if (!findEmptyIndex(photo, randIndex)){
      lastImage.value = randIndex;
      FullIndexes.value.push([photo.number, randIndex]);
      setTimeout(() => {
        lastImage.value = null;
      }, 3000);
    }
  }else{
    // wait for the queue to be empty
    queueSize.value++;
    setTimeout(() => {
      displayPhoto(photo);
    }, 5500*queueSize.value);
  }
};

const findEmptyIndex = (photo, randIndex) => {
  FullIndexes.value.sort((a, b) => a[1] - b[1]);
  // Stop if the array is full
  if (FullIndexes.value.length >= imageHeight.value/pixelHeight.value*imageWidth.value/pixelWidth.value) { return "array full"}
  FullIndexes.value.forEach((index) => {
    if (index[1] == randIndex) {
      if (index < imageHeight.value/pixelHeight.value*imageWidth.value/pixelWidth.value - 1) {
        randIndex++;
      }
      else {
        randIndex = 0;
        findEmptyIndex(photo, randIndex);
      }
    }
  });
};

const getImageStyle = (n) => {
  if (!photoMap.value[n-1]) {
    return {
      opacity: 0,
    }
  }

  const top = ((((n - 1) * pixelHeight.value) % imageHeight.value) * hScale.value + (pixelHeight.value * hScale.value + 0.002 - pixelHeight.value * wScale.value * x.value / y.value) / 2);
  const left = Math.floor((n - 1) / (imageHeight.value / pixelHeight.value)) * pixelWidth.value * wScale.value;
  const width = pixelWidth.value * wScale.value;
  const height = pixelHeight.value * wScale.value;

  const lastImageScale = 20
  const distTopToCenter = (y.value - pixelHeight.value * lastImageScale * x.value/100) / 2;
  const distLeftToCenter = (x.value - pixelWidth.value * lastImageScale * x.value/100) / 2;
  const lastImageWidth = pixelWidth.value * lastImageScale;
  const lastImageHeight = pixelHeight.value * lastImageScale;

  if (lastImage.value === n - 1) {
    return {
      top: `${distTopToCenter}px`,
      left: `${distLeftToCenter}px`,
      width: `${lastImageWidth}vw`,
      height: `${lastImageHeight}vw`,
      opacity: 1,
    };
  }
  return {
    top: `${top}vh`,
    left: `${left}vw`,
    width: `${width}vw`,
    height: `${height}vw`,
    opacity: 0.5,
  };
};

const photoMap = computed(() => {
  if (!photos.value.length || !FullIndexes.value.length) return {};
  const map = {};
  for (const [number, position] of FullIndexes.value) {
    const match = photos.value.find((photo) => photo.number === number);
    if (match) {
      map[position] = match;
    }
  }
  return map;
});

// Fetch images at startup
const fetchImages = async () => {
  try {
    const res = await fetch(`${import.meta.env.VITE_STORAGE_API_URL || ""}/api/images`);
    const data = await res.json();

    photos.value = data.map(photo => ({...photo}));

  } catch (error) {
    console.error("Error fetching images:", error);
  }
};

onMounted(() => {
  fetchImages()
  .then(() => {
    photos.value.forEach(photo => {
      displayPhotoImmediate(photo);
    }); 
  })

  // Listen for new images from the server
  socket.on("newImage", (newImage) => {
    displayPhoto(newImage);
    photos.value.push(newImage);
  });

  const updateSize = () => {
    x.value = window.innerWidth;
    y.value = window.innerHeight;
  };

  window.addEventListener('resize', updateSize);
});

onBeforeUnmount(() => {
  if (socket) {
    console.log("WebSocket disconnected on page unload", socket.id);
    socket.disconnect();
  }
});

</script>

<template>
  <div>
    <img class="background" src="/bg.png" :style="`width: ${imageWidth*wScale}vw; height: ${imageHeight*hScale}vh`"></img>
  </div>
  <div class="pixel" v-for="n in (imageHeight/pixelHeight)*(imageWidth/pixelWidth)">
    <img :class="`user-img ${lastImage === n-1 ? 'last-image' : ''}`" :id="`user-img-${n}`" :src="`${photoMap[n-1]?.img}`" :style="getImageStyle(n)"></img>
    <img :class="`image-blocker`" :id="`image-blocker-${n}`" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAAFCAYAAACEhIafAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAUSURBVBhXY3j67OV/JgYGBgY0AgBTkAO8FjMHxgAAAABJRU5ErkJggg==" :style="`top: ${(((n-1)*pixelHeight)%imageHeight)*hScale}vh; left:  ${Math.floor((n-1)/(imageHeight/pixelHeight))*pixelWidth*wScale}vw; opacity: ${photoMap[n-1] ? 0 : 0.96}; width: ${pixelWidth*wScale+0.002}vw; height: ${pixelHeight*hScale+0.002}vh`"></img>
  </div>
</template>

<style scoped>
  img.background, img.user-img, img.image-blocker {
    position: absolute;
  }

  img.background {
    z-index: 0;
  }

  img.user-img:not(.last-image) {
    z-index: 1;
    transition: all 2s ease-in-out;
  }

  img.image-blocker {
    z-index: 2;
  }

  img.user-img.last-image {
    /* z-index set arbitrarily high, so that the image doesn't go behind the image-blocker during transition */
    z-index: 300;
  }
</style>