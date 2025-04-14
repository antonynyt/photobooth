import { ref } from "vue";

export function usePhotoProcessing() {
    const isProcessing = ref(false);

    function blobToDataURL(blob) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(blob);
        });
    }

    async function processPhoto(photo, apiUrl) {
        if (!apiUrl || photo.processed) return photo;

        isProcessing.value = true;

        try {
            // Create FormData
            const formData = new FormData();

            // Get background
            const backgroundResponse = await fetch(photo.backgroundFile);
            const backgroundBlob = await backgroundResponse.blob();

            formData.append("subject", photo.blob, "webcam.jpg");
            formData.append("new_background", backgroundBlob, "background.jpg");

            // API request
            const response = await fetch(apiUrl, {
                method: "POST",
                body: formData,
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            // Get result
            const resultBlob = await response.blob();
            const dataUrl = await blobToDataURL(resultBlob);

            isProcessing.value = false;
            return {
                ...photo,
                processedUrl: dataUrl,
                processed: true,
                processing: false,
            };
        } catch (error) {
            console.error("Error processing image:", error);
            isProcessing.value = false;
            return {
                ...photo,
                error: true,
                processing: false,
            };
        }
    }

    return {
        processPhoto,
        blobToDataURL,
        isProcessing,
    };
}
