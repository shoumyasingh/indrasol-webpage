// src/services/contactService.ts
import { API_ENDPOINTS } from "../config";


type ContactPayload = {
    user_id: string;
    name: string;
    email: string;
    company?: string;
    message?: string;
  };
export const contactService = {
  submit: async (form: ContactPayload) => {
    const res = await fetch(API_ENDPOINTS.CONTACT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    });
    if (!res.ok) throw new Error("Contact submission failed");
  }
};
