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
    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Fetch unprocessed queue entries
    const { data: queueEntries, error: queueError } = await supabaseClient
      .from("birthday_email_queue")
      .select("*, birthday_wishes(*)")
      .is("processed_at", null)
      .limit(10);

    console.log("Fetched queue entries:", queueEntries);
    console.log("Queue error if any:", queueError);

    if (queueError) {
      throw new Error(`Failed to fetch queue: ${queueError.message}`);
    }

    if (!queueEntries || queueEntries.length === 0) {
      return new Response(
        JSON.stringify({ message: "No emails to process" }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        }
      );
    }

    // Process each queue entry
    for (const entry of queueEntries) {
      const wish = entry.birthday_wishes;
      
      if (!wish) {
        console.error("No wish found for queue entry:", entry);
        continue;
      }

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

      // Update queue entry and wish status
      const now = new Date().toISOString();
      
      // Update queue entry
      const { error: updateQueueError } = await supabaseClient
        .from("birthday_email_queue")
        .update({ processed_at: now })
        .eq("id", entry.id);

      if (updateQueueError) {
        console.error("Error updating queue entry:", updateQueueError);
        continue;
      }

      // Update wish status
      const { error: updateWishError } = await supabaseClient
        .from("birthday_wishes")
        .update({
          sent: true,
          sent_at: now,
        })
        .eq("id", wish.id);

      if (updateWishError) {
        console.error("Error updating wish status:", updateWishError);
        continue;
      }

      console.log("Successfully processed queue entry:", entry.id);
    }

    return new Response(
      JSON.stringify({ message: "Birthday emails processed successfully!" }),
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