'use client';
import { useState, useRef, useCallback, useEffect } from 'react';

export function useVoice() {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isMicSupported, setIsMicSupported] = useState(false);
  const [isSpeechSupported, setIsSpeechSupported] = useState(false);
  const [micError, setMicError] = useState<string | null>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    setIsMicSupported(!!((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition));
    setIsSpeechSupported(!!window.speechSynthesis);
  }, []);

  const clearMicError = useCallback(() => setMicError(null), []);

  const startListening = useCallback((onResult: (text: string) => void) => {
    const SpeechRecognitionAPI = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognitionAPI) {
      setMicError('API de voz no disponible en este navegador');
      return;
    }

    setMicError(null);

    const recognition = new SpeechRecognitionAPI();
    recognition.lang = 'es-CO';
    recognition.interimResults = true;
    recognition.continuous = true;

    recognition.onresult = (event: any) => {
      for (let i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
          const transcript = event.results[i][0].transcript;
          if (transcript.trim()) {
            onResult(transcript);
          }
        }
      }
    };

    recognition.onerror = (event: any) => {
      const reasons: Record<string, string> = {
        'not-allowed': 'Permiso del micrófono denegado. Permítelo en la configuración del navegador.',
        'no-speech': 'No se detectó audio. Intenta hablar más cerca del micrófono.',
        'aborted': 'Grabación cancelada.',
        'audio-capture': 'No se encontró micrófono. Conecta uno e intenta de nuevo.',
        'network': 'El navegador bloqueó el servicio de voz de Google. En Edge: Configuración > Privacidad > Excepciones de Prevención de Rastreo, agrega esta página. O prueba con Chrome.',
        'service-not-allowed': 'Servicio de voz no permitido.',
      };
      setMicError(reasons[event.error] || `Error de micrófono: ${event.error}`);
      setIsListening(false);
    };

    recognition.onend = () => setIsListening(false);

    try {
      recognitionRef.current = recognition;
      recognition.start();
      setIsListening(true);
    } catch (e: any) {
      setMicError(`Error al iniciar el micrófono: ${e.message}`);
    }
  }, []);

  const stopListening = useCallback(() => {
    recognitionRef.current?.stop();
    recognitionRef.current = null;
    setIsListening(false);
    setMicError(null);
  }, []);

  const speak = useCallback((text: string) => {
    if (!window.speechSynthesis) return;

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'es-ES';
    utterance.rate = 1.0;
    utterance.pitch = 1.0;

    const voices = window.speechSynthesis.getVoices();
    const spanishVoice = voices.find((v) => v.lang.startsWith('es'));
    if (spanishVoice) utterance.voice = spanishVoice;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utterance);
  }, []);

  const stopSpeaking = useCallback(() => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  }, []);

  return { isListening, isSpeaking, isMicSupported, isSpeechSupported, micError, startListening, stopListening, speak, stopSpeaking, clearMicError };
}
