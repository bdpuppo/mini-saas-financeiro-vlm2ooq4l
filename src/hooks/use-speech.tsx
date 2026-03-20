import { useState, useEffect, useCallback, useRef } from 'react'

export function useSpeechRecognition() {
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [supported, setSupported] = useState(true)
  const recognitionRef = useRef<any>(null)

  useEffect(() => {
    if (typeof window === 'undefined') return
    const SpeechRecognition = window.SpeechRecognition || (window as any).webkitSpeechRecognition
    if (!SpeechRecognition) {
      setSupported(false)
      return
    }

    try {
      const rec = new SpeechRecognition()
      rec.continuous = false
      rec.interimResults = false
      rec.lang = 'pt-BR'

      rec.onresult = (event: any) => {
        if (event.results.length > 0) {
          const text = event.results[0][0].transcript
          setTranscript(text)
        }
      }

      rec.onerror = (event: any) => {
        console.error('Speech recognition error', event.error)
        setIsListening(false)
      }

      rec.onend = () => {
        setIsListening(false)
      }

      recognitionRef.current = rec
    } catch (e) {
      setSupported(false)
    }
  }, [])

  const startListening = useCallback(() => {
    if (recognitionRef.current && !isListening) {
      setTranscript('')
      try {
        recognitionRef.current.start()
        setIsListening(true)
      } catch (err) {
        console.error('Failed to start recognition:', err)
        setIsListening(false)
      }
    }
  }, [isListening])

  const stopListening = useCallback(() => {
    if (recognitionRef.current && isListening) {
      try {
        recognitionRef.current.stop()
      } catch (err) {
        console.error('Failed to stop recognition:', err)
      }
      setIsListening(false)
    }
  }, [isListening])

  return { isListening, transcript, startListening, stopListening, supported, setTranscript }
}
