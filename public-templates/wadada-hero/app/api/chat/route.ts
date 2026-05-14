import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const { message, sessionId } = await req.json()

    const webhookUrl = process.env.N8N_WEBHOOK_URL
    if (!webhookUrl) {
      return NextResponse.json({ error: "N8N_WEBHOOK_URL is not configured." }, { status: 500 })
    }

    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ chatInput: message, sessionId: sessionId }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error("n8n webhook error:", errorText)
      if (response.status === 404) {
        return NextResponse.json(
          { error: "The chatbot workflow appears to be inactive. Please activate the workflow in your n8n editor." },
          { status: 404 },
        )
      }
      return NextResponse.json({ error: "Failed to get response from chatbot." }, { status: response.status })
    }

    const data = await response.json()
    console.log("Full response from n8n:", JSON.stringify(data, null, 2))

    const botResponse = data?.output

    if (!botResponse) {
      console.error("n8n response did not contain an 'output' field.", data)
      return NextResponse.json(
        { error: "Received an unexpected response format from the chatbot. Check the n8n execution logs for details." },
        { status: 500 },
      )
    }

    return NextResponse.json({ reply: botResponse })
  } catch (error) {
    console.error("Chat API error:", error)
    return NextResponse.json({ error: "An internal server error occurred." }, { status: 500 })
  }
}
