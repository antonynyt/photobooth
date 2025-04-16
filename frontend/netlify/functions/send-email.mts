import { Handler } from "@netlify/functions";
import Mailgun from "mailgun.js";
import formData from "form-data";
import { parse } from "lambda-multipart-parser";
import { getEmailTemplate } from "./shared/email-template.js";

// Configure Mailgun with updated form-data
const mailgun = new Mailgun(formData);
const mg = mailgun.client({
    username: "api",
    key: process.env.MAILGUN_API_KEY,
    url: "https://api.eu.mailgun.net"
});

const domain = process.env.MAILGUN_DOMAIN;

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
        const { email, files } = await parse(event);

        if (!email || !files || files.length === 0) {
            return {
                statusCode: 400,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ error: "Missing email or image file" }),
            };
        }

        const [imageFile] = files;

        // Ensure content is a Buffer
        let contentBuffer: Buffer;
        if (Buffer.isBuffer(imageFile.content)) {
            contentBuffer = imageFile.content;
        } else {
            contentBuffer = Buffer.from(imageFile.content as any);
        }

        const styledHtml = getEmailTemplate();

        const messageData = {
            from: `WhyNotYou <${process.env.MAILGUN_SENDER}>`,
            to: email,
            subject: "#WHYNOTYOU: Ready to lead the game?",
            html: styledHtml,
            inline: [
                {
                    data: contentBuffer,
                    filename: "photobooth.jpg",
                    contentType: imageFile.contentType || "image/jpeg",
                },
            ],
        };

        await mg.messages.create(domain, messageData);

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
