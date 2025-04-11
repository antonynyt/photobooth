import { Handler } from "@netlify/functions";
import SendGrid from "@sendgrid/mail";
import { parse } from "lambda-multipart-parser";

// Configure SendGrid
SendGrid.setApiKey(process.env.SENDGRID_API_KEY);

export const handler: Handler = async (event) => {
    // Handle CORS preflight request
    if (event.httpMethod === "OPTIONS") {
        return {
            statusCode: 200,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "Content-Type",
                "Access-Control-Allow-Methods": "POST",
            },
        };
    }

    if (event.httpMethod !== "POST") {
        return {
            statusCode: 405,
            body: JSON.stringify({ message: "Method Not Allowed" }),
        };
    }

    try {
        // Parse multipart/form-data
        const { email, files } = await parse(event);

        // Validate form data
        if (!email || !files || files.length === 0) {
            return {
                statusCode: 400,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ error: "Missing email or image file" }),
            };
        }

        const [imageFile] = files;

        // Prepare email message
        const msg = {
            to: email,
            from: process.env.SENDGRID_VERIFIED_SENDER, // Must be verified
            subject: "#WHYNOTYOU: Your photo",
            text: "Thank you for your submission.",
            html: `<p>Thank you for your submission.</p><p>Here is your photo:</p><img src="cid:photo" alt="Your photo" />`,
            attachments: [
                {
                    content: imageFile.content.toString("base64"),
                    filename: "photobooth.jpg",
                    type: "image/jpeg",
                    disposition: "inline",
                    content_id: "photo",
                },
            ],
        };

        // Send email
        await SendGrid.send(msg);

        return {
            statusCode: 200,
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
            },
            body: JSON.stringify({ message: "Email sent successfully" }),
        };
    } catch (error) {
        console.error("Error processing request:", error);
        return {
            statusCode: 500,
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
            },
            body: JSON.stringify({ error: "Internal server error" }),
        };
    }
};
