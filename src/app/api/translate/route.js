import { NextResponse } from 'next/server'

export async function POST(request) {
  try {
    const { text, target } = await request.json()
    
    if (!text || !target) {
      return NextResponse.json(
        { error: 'Missing required fields: text and target' },
        { status: 400 }
      )
    }

    const apiKey = "AIzaSyBS4N8g1D0VhjnOHwSMWRdz1JbTmEUg8Gw"
    if (!apiKey) {
      return NextResponse.json(
        { error: 'Google Translate API key not configured' },
        { status: 500 }
      )
    }

    const url = `https://translation.googleapis.com/language/translate/v2?key=${apiKey}`
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        q: text,
        target: target,
        format: 'text'
      })
    })

    if (!response.ok) {
      const errorData = await response.json()
      console.error('Google Translate API error:', errorData)
      return NextResponse.json(
        { error: 'Translation service error' },
        { status: response.status }
      )
    }

    const data = await response.json()
    const translatedText = data.data.translations[0].translatedText

    return NextResponse.json({ translatedText })
  } catch (error) {
    console.error('Translation error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
