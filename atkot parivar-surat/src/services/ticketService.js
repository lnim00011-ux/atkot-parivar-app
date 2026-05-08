import { env } from "../config/env";
import { isSupabaseConfigured, supabase } from "../config/supabase";

export async function submitSupportTicket({ message, member }) {
  const ticket = {
    member_id: member?.id,
    member_name: member?.name,
    member_whatsapp: member?.whatsapp,
    message: message.trim(),
    status: "open"
  };

  if (isSupabaseConfigured) {
    const { error } = await supabase.from("support_tickets").insert(ticket);
    if (error) throw error;
  }

  if (env.supportEmailWebhookUrl) {
    const response = await fetch(env.supportEmailWebhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(ticket)
    });
    if (!response.ok) throw new Error("Ticket saved, but email notification failed.");
  }

  if (!isSupabaseConfigured && !env.supportEmailWebhookUrl) {
    throw new Error("Connect Supabase or add a support email webhook before submitting tickets.");
  }

  return ticket;
}
