import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import * as SendGrid from "https://esm.sh/@sendgrid/mail";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const SENDGRID_API_KEY = Deno.env.get("SENDGRID_API_KEY");
    if (!SENDGRID_API_KEY) {
      throw new Error("SendGrid API key not found");
    }

    const { wishId } = await req.json();

    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? ""
    );

    // Fetch the birthday wish
    const { data: wish, error: fetchError } = await supabaseClient
      .from("birthday_wishes")
      .select("*")
      .eq("id", wishId)
      .single();

    if (fetchError || !wish) {
      throw new Error("Birthday wish not found");
    }

    // Configure SendGrid
    SendGrid.setApiKey(SENDGRID_API_KEY);

    // Prepare email message
    const msg = {
      to: wish.recipient_email,
      from: "prakyath.developer@outlook.com", // Updated sender email
      subject: `Happy Birthday ${wish.recipient_name}! 🎉`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1>Happy Birthday ${wish.recipient_name}! 🎂</h1>
          ${wish.message ? `<p>${wish.message}</p>` : ""}
          <p>Wishing you a fantastic day filled with joy and celebration!</p>
        </div>
      `,
    };

    // Send email
    await SendGrid.send(msg);

    // Update wish status
    const { error: updateError } = await supabaseClient
      .from("birthday_wishes")
      .update({
        sent: true,
        sent_at: new Date().toISOString(),
      })
      .eq("id", wishId);

    if (updateError) {
      throw new Error("Failed to update wish status");
    }

    return new Response(
      JSON.stringify({ message: "Birthday email sent successfully!" }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});