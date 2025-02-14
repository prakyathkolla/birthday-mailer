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
    console.log("Starting send-birthday-email function");
    
    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Process all unprocessed queue entries
    const { data: queueEntries, error: queueError } = await supabaseClient
      .from("birthday_email_queue")
      .select("*, birthday_wishes(*)")
      .is("processed_at", null);

    console.log("Fetched queue entries:", queueEntries);
    
    if (queueError) {
      console.error("Error fetching queue:", queueError);
      throw new Error(`Failed to fetch queue: ${queueError.message}`);
    }

    if (!queueEntries || queueEntries.length === 0) {
      console.log("No emails to process");
      return new Response(
        JSON.stringify({ message: "No emails to process" }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        }
      );
    }

    // Verify SendGrid API key exists
    const sendgridApiKey = Deno.env.get("SENDGRID_API_KEY");
    if (!sendgridApiKey) {
      console.error("SendGrid API key not configured");
      throw new Error("SendGrid API key not configured");
    }

    // Process each queue entry
    const results = [];
    for (const entry of queueEntries) {
      const wish = entry.birthday_wishes;
      
      if (!wish) {
        console.error("No wish found for queue entry:", entry);
        continue;
      }

      console.log("Processing wish:", wish);
      console.log("Sending email via SendGrid...");

      try {
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

        console.log("Email sent successfully, updating database records...");

        // Update queue entry and wish status
        const now = new Date().toISOString();
        
        // Update queue entry
        const { error: updateQueueError } = await supabaseClient
          .from("birthday_email_queue")
          .update({ processed_at: now })
          .eq("id", entry.id);

        if (updateQueueError) {
          throw new Error(`Failed to update queue entry: ${updateQueueError.message}`);
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
          throw new Error(`Failed to update wish status: ${updateWishError.message}`);
        }

        results.push({
          success: true,
          queueEntryId: entry.id,
          wishId: wish.id,
          message: "Email sent successfully"
        });

      } catch (error) {
        console.error(`Error processing queue entry ${entry.id}:`, error);
        results.push({
          success: false,
          queueEntryId: entry.id,
          wishId: wish?.id,
          error: error.message
        });
      }
    }

    console.log("Finished processing all queue entries:", results);

    return new Response(
      JSON.stringify({ 
        message: "Birthday email processing complete",
        results
      }),
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