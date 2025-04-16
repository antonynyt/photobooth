import { Handler } from "@netlify/functions";

interface ImageRequestBody {
    key: string;
    boothID: string;
    img: string;
}

const handler: Handler = async (event) => {
    // Only allow POST requests
    if (event.httpMethod !== "POST") {
        return {
            statusCode: 405,
            body: "Method Not Allowed",
        };
    }

    try {
        const { images } = JSON.parse(event.body || "{}");
        const apiKey = process.env.STORAGE_API_KEY;
        const apiUrl = process.env.VITE_STORAGE_API_URL;

        if (!apiKey || !apiUrl) {
            return {
                statusCode: 500,
                body: JSON.stringify({
                    error: "Server configuration error: Missing API key or URL",
                }),
            };
        }

        // Get booth ID from environment or generate one
        const boothID = process.env.BOOTH_ID || "default-booth";

        if (!Array.isArray(images) || images.length === 0) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: "No images provided" }),
            };
        }

        // Process images sequentially instead of in parallel
        const results = [];
        for (let i = 0; i < images.length; i++) {
            const imageBase64 = images[i];
            const requestBody: ImageRequestBody = {
                boothID,
                key: apiKey,
                img: imageBase64,
            };

            try {
                const response = await fetch(`${apiUrl}/api/images`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(requestBody),
                });

                if (!response.ok) {
                    const errorText = await response.text();
                    console.error(`Error uploading image ${i}: ${errorText}`);

                    // Instead of throwing immediately, we'll add the error to results and continue
                    results.push({
                        success: false,
                        error: `API request failed: ${response.status} ${errorText}`,
                        imageIndex: i,
                    });
                } else {
                    const result = await response.json();
                    results.push({
                        success: true,
                        data: result,
                        imageIndex: i,
                    });
                }
            } catch (error) {
                console.error(`Error processing image ${i}:`, error);
                results.push({
                    success: false,
                    error: error.message || "Unknown error",
                    imageIndex: i,
                });
            }

            // Add a small delay between requests
            if (i < images.length - 1) {
                await new Promise((resolve) => setTimeout(resolve, 300));
            }
        }

        // Count successful uploads
        const successCount = results.filter((r) => r.success).length;

        return {
            statusCode: successCount > 0 ? 200 : 500,
            body: JSON.stringify({
                success: successCount > 0,
                total: images.length,
                successful: successCount,
                results,
            }),
        };
    } catch (error) {
        console.error("Error processing images:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message || "Unknown error" }),
        };
    }
};

export { handler };
