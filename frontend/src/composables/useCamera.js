import { ref, onUnmounted } from "vue";

export function useCamera() {
    const video = ref(null);
    const stream = ref(null);
    const cameraActive = ref(false);
    const cameraError = ref(null);

    async function startCamera(videoElement) {
        try {
            stream.value = await navigator.mediaDevices.getUserMedia({
                video: {
                    facingMode: "user",
                    width: { ideal: 1280 },
                    height: { ideal: 720 },
                },
                audio: false,
            });

            if (videoElement) {
                videoElement.srcObject = stream.value;
            }

            cameraActive.value = true;
            return true;
        } catch (err) {
            console.error("Error accessing camera: ", err);
            cameraError.value = err.message;
            return false;
        }
    }

    function stopCamera() {
        if (stream.value) {
            stream.value.getTracks().forEach((track) => track.stop());
            stream.value = null;
            cameraActive.value = false;
        }
    }

    function captureFrame(videoElement) {
        if (!videoElement || !videoElement.videoWidth) return null;

        const canvas = document.createElement("canvas");
        canvas.width = videoElement.videoWidth;
        canvas.height = videoElement.videoHeight;
        const context = canvas.getContext("2d");
        context.drawImage(videoElement, 0, 0, canvas.width, canvas.height);

        return {
            dataUrl: canvas.toDataURL("image/jpeg"),
            width: canvas.width,
            height: canvas.height,
            toBlob: () =>
                new Promise((resolve) => canvas.toBlob(resolve, "image/jpeg")),
        };
    }

    onUnmounted(() => {
        stopCamera();
    });

    return {
        video,
        cameraActive,
        cameraError,
        startCamera,
        stopCamera,
        captureFrame,
    };
}
