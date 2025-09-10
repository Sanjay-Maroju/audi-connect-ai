import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { question, eventId, voice = 'alloy' } = await req.json()

    if (!question) {
      throw new Error('Question is required')
    }

    const elevenLabsApiKey = Deno.env.get('ELEVENLABS_API_KEY')
    
    if (!elevenLabsApiKey) {
      throw new Error('ElevenLabs API key not configured')
    }

    console.log(`Processing question for event ${eventId}: ${question}`)

    // Generate AI response using a simple contextual approach
    // In a real implementation, you'd use a more sophisticated AI model
    const aiResponse = generateContextualResponse(question)
    
    console.log(`Generated AI response: ${aiResponse}`)

    // Convert text to speech using ElevenLabs
    const ttsResponse = await fetch('https://api.elevenlabs.io/v1/text-to-speech/9BWtsMINqrJLrRacOk9x', {
      method: 'POST',
      headers: {
        'Accept': 'audio/mpeg',
        'Content-Type': 'application/json',
        'xi-api-key': elevenLabsApiKey,
      },
      body: JSON.stringify({
        text: aiResponse,
        model_id: 'eleven_multilingual_v2',
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.75,
          style: 0.0,
          use_speaker_boost: true
        }
      }),
    })

    if (!ttsResponse.ok) {
      const errorText = await ttsResponse.text()
      console.error('ElevenLabs API error:', errorText)
      throw new Error(`ElevenLabs API error: ${ttsResponse.status}`)
    }

    // Convert audio to base64
    const audioBuffer = await ttsResponse.arrayBuffer()
    const base64Audio = btoa(
      String.fromCharCode(...new Uint8Array(audioBuffer))
    )

    console.log('Successfully generated voice response')

    return new Response(
      JSON.stringify({ 
        audioContent: base64Audio,
        responseText: aiResponse
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    )
  } catch (error) {
    console.error('Error in generate-voice-response:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    )
  }
})

function generateContextualResponse(question: string): string {
  const lowerQuestion = question.toLowerCase()
  
  // Simple pattern matching for common questions
  if (lowerQuestion.includes('hello') || lowerQuestion.includes('hi')) {
    return "Hello! Welcome to our interactive session. I'm here to help answer your questions using AI. What would you like to know?"
  }
  
  if (lowerQuestion.includes('how') && lowerQuestion.includes('work')) {
    return "This system uses advanced AI to process your voice questions and provide intelligent responses. Simply speak your question, and I'll analyze it and provide a helpful answer in real-time."
  }
  
  if (lowerQuestion.includes('what') && lowerQuestion.includes('smart mic')) {
    return "Smart Mic AI is an interactive question and answer system that combines voice recognition, artificial intelligence, and text-to-speech synthesis to create seamless conversations during events and presentations."
  }
  
  if (lowerQuestion.includes('technology') || lowerQuestion.includes('tech')) {
    return "We use cutting-edge technologies including speech recognition, natural language processing, ElevenLabs voice synthesis, and real-time communication to create this interactive experience."
  }
  
  if (lowerQuestion.includes('feature') || lowerQuestion.includes('capability')) {
    return "Key features include real-time voice recognition, AI-powered responses, natural voice synthesis, QR code event joining, and live question management for hosts."
  }
  
  if (lowerQuestion.includes('thank') || lowerQuestion.includes('thanks')) {
    return "You're very welcome! I'm glad I could help. Feel free to ask more questions anytime during this session."
  }
  
  // Default intelligent response for other questions
  return `That's an interesting question about "${question}". Based on the context of our interactive AI session, I'd say this relates to how we can leverage artificial intelligence to enhance communication and engagement. The key is using technology to create more meaningful and accessible interactions between speakers and their audience. Would you like me to elaborate on any specific aspect?`
}