import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { wishId } = await req.json();
    console.log("Processing wish ID:", wishId);

    if (!wishId) {
      throw new Error("No wishId provided");
    }

    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Fetch the birthday wish from the queue
    const { data: queueItem, error: queueError } = await supabaseClient
      .from("birthday_email_queue")
      .select(`
        *,
        birthday_wishes (
          id,
          recipient_name,
          recipient_email,
          message,
          birthday_date,
          sender_name,
          timezone
        )
      `)
      .eq("wish_id", wishId)
      .maybeSingle();

    console.log("Queue item fetch result:", { queueItem, queueError });

    if (queueError) {
      console.error("Error fetching queue item:", queueError);
      throw new Error(`Failed to fetch queue item: ${queueError.message}`);
    }

    if (!queueItem) {
      throw new Error("Birthday wish not found in queue");
    }

    const wish = queueItem.birthday_wishes;
    if (!wish) {
      throw new Error("Associated birthday wish not found");
    }

    console.log("Processing wish:", wish);

    // Verify SendGrid API key exists
    const sendgridApiKey = Deno.env.get("SENDGRID_API_KEY");
    if (!sendgridApiKey) {
      throw new Error("SendGrid API key not configured");
    }

    // Send email using SendGrid API
    const emailResponse = await fetch("https://api.sendgrid.com/v3/mail/send", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${sendgridApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        personalizations: [
          {
            to: [{ email: wish.recipient_email }],
          },
        ],
        from: { 
          email: "prakyath.developer@outlook.com",
          name: "Birthday Wishes"
        },
        subject: `Happy Birthday ${wish.recipient_name}! 🎉`,
        content: [
          {
            type: "text/html",
            value: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h1>Happy Birthday ${wish.recipient_name}! 🎂</h1>
                ${wish.message ? `<p>${wish.message}</p>` : ""}
                <p>Wishing you a fantastic day filled with joy and celebration!</p>
                <p><small>Sent with ❤️ from ${wish.sender_name}</small></p>
              </div>
            `,
          },
        ],
      }),
    });

    const emailResponseText = await emailResponse.text();
    console.log("SendGrid API response:", {
      status: emailResponse.status,
      response: emailResponseText
    });

    if (!emailResponse.ok) {
      throw new Error(`Failed to send email: ${emailResponseText}`);
    }

    // Update queue item and wish status
    const now = new Date().toISOString();
    
    const { error: updateQueueError } = await supabaseClient
      .from("birthday_email_queue")
      .update({ processed_at: now })
      .eq("id", queueItem.id);

    if (updateQueueError) {
      console.error("Error updating queue status:", updateQueueError);
      throw new Error(`Failed to update queue status: ${updateQueueError.message}`);
    }

    const { error: updateWishError } = await supabaseClient
      .from("birthday_wishes")
      .update({
        sent: true,
        sent_at: now,
      })
      .eq("id", wishId);

    if (updateWishError) {
      console.error("Error updating wish status:", updateWishError);
      throw new Error(`Failed to update wish status: ${updateWishError.message}`);
    }

    console.log("Successfully processed birthday wish:", wishId);

    return new Response(
      JSON.stringify({ message: "Birthday email sent successfully!" }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error in send-birthday-email function:", error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: error.stack
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});