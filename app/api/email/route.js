import { ContactEmail } from "@/components/emails/ContactEmail";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request) {
  try {
    const { name, email, phone, subject, message } = await request.json();

    console.log(name, email, phone, subject, message);

    const { data, error } = await resend.emails.send({
      from: "Wellmark Technologies <contact@wellmark.co.in>",
      to: ["accounts@wellmark.co.in", "shindearyan179@gmail.com"],
      subject: "New Contact Email",
      react: ContactEmail({ name, email, phone, subject, message }),
    });

    if (error) {
      return new Response(JSON.stringify({ error }), { status: 500 });
    }

    return new Response(JSON.stringify(data));
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
}
