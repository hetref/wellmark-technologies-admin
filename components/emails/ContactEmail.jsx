import * as React from "react";

export const ContactEmail = ({ name, email, phone, subject, message }) => (
  <div>
    <h1>Hello Admin!</h1>
    <p>
      You have received a new contact email from {name}. Please check your
      dashboard for more details.
    </p>
    <h3>Name: {name}</h3>
    <h3>Email: {email}</h3>
    <h3>Phone: {phone}</h3>
    <h3>Subject: {subject}</h3>
    <h3>Message: {message}</h3>

    <a href={`mailto:${email}`}>Revert Back</a>
  </div>
);
