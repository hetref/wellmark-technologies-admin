import { ContactEmail } from "@/components/emails/ContactEmail";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req) {
  try {
    const { name, email, phone, subject, message } = await req.json();

    console.log("Received Data:", { name, email, phone, subject, message });

    const { data, error } = await resend.emails.send({
      from: "Wellmark Technologies <contact@wellmark.co.in>",
      to: ["accounts@wellmark.co.in", "yashnimse92@gmail.com"],
      subject: "New Contact Enquiry",
      react: ContactEmail({ name, email, phone, subject, message }),
    });

    if (error) {
      console.error("Email Sending Error:", error);
      return new Response(JSON.stringify({ error }), {
        status: 500,
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
      });
    }

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch (error) {
    console.error("Error in POST handler:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
    });
  }
}

export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}
