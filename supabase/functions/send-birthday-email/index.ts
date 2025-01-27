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

    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Fetch the birthday wish
    const { data: wish, error: fetchError } = await supabaseClient
      .from("birthday_wishes")
      .select("*")
      .eq("id", wishId)
      .single();

    if (fetchError || !wish) {
      console.error("Error fetching wish:", fetchError);
      throw new Error("Birthday wish not found");
    }

    console.log("Fetched wish:", wish);

    // Check if it's time to send the email
    const now = new Date();
    const scheduledTime = new Date(wish.birthday_date);
    
    if (now < scheduledTime) {
      console.log("Too early to send birthday wish. Scheduled for:", scheduledTime);
      return new Response(
        JSON.stringify({ message: "Email will be sent at scheduled time" }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        }
      );
    }

    // Send email using SendGrid API
    const response = await fetch("https://api.sendgrid.com/v3/mail/send", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${Deno.env.get("SENDGRID_API_KEY")}`,
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

    if (!response.ok) {
      const errorData = await response.text();
      console.error("SendGrid API error:", errorData);
      throw new Error(`Failed to send email: ${errorData}`);
    }

    console.log("Email sent successfully");

    // Update wish status
    const { error: updateError } = await supabaseClient
      .from("birthday_wishes")
      .update({
        sent: true,
        sent_at: new Date().toISOString(),
      })
      .eq("id", wishId);

    if (updateError) {
      console.error("Error updating wish status:", updateError);
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
    console.error("Error in send-birthday-email function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});