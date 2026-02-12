const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type'
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { message, senderEmail, recipientEmail } = await req.json();

    const trimmedMessage = String(message ?? '').trim();
    const fromEmail = String(senderEmail ?? '').trim();
    const toEmail = String(recipientEmail ?? '').trim();

    if (trimmedMessage.length < 3) {
      return new Response(JSON.stringify({ error: 'Nachricht zu kurz.' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    if (!fromEmail || !toEmail) {
      return new Response(JSON.stringify({ error: 'Sender oder Empfänger fehlt.' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const resendApiKey = Deno.env.get('RESEND_API_KEY');
    if (!resendApiKey) {
      return new Response(JSON.stringify({ error: 'RESEND_API_KEY fehlt.' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const resendResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: fromEmail,
        to: [toEmail],
        subject: 'Silentap Feedback',
        text: trimmedMessage
      })
    });

    if (!resendResponse.ok) {
      const errorBody = await resendResponse.text();
      return new Response(JSON.stringify({ error: 'Resend-Fehler', detail: errorBody }), {
        status: 502,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Unerwarteter Fehler', detail: String(error) }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
