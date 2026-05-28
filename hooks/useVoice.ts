'use client';
import { useState, useRef, useCallback, useEffect } from 'react';

const SPANISH_LOCALES = ['es-ES', 'es-MX', 'es-US', 'es-AR', 'es-CO', 'es-CL', 'es'];

const SpeechRecognitionAPI =
  typeof window !== 'undefined'
    ? (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    : null;

export function useVoice() {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isMicSupported, setIsMicSupported] = useState(false);
  const [isSpeechSupported, setIsSpeechSupported] = useState(false);
  const [micError, setMicError] = useState<string | null>(null);
  const recognitionRef = useRef<any>(null);
  const voicesRef = useRef<SpeechSynthesisVoice[]>([]);
  const onResultRef = useRef<((text: string) => void) | null>(null);

  useEffect(() => {
    setIsMicSupported(!!SpeechRecognitionAPI);
    setIsSpeechSupported(!!window.speechSynthesis);
  }, []);

  useEffect(() => {
    const loadVoices = () => {
      const v = window.speechSynthesis?.getVoices();
      if (v && v.length > 0) voicesRef.current = v;
    };
    loadVoices();
    if (window.speechSynthesis) {
      window.speechSynthesis.addEventListener('voiceschanged', loadVoices);
    }
    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.removeEventListener('voiceschanged', loadVoices);
      }
    };
  }, []);

  function findSpanishVoice(voices: SpeechSynthesisVoice[]): SpeechSynthesisVoice | undefined {
    for (const locale of SPANISH_LOCALES) {
      const found = voices.find((v) => v.lang === locale);
      if (found) return found;
    }
    return voices.find((v) => v.lang.startsWith('es'));
  }

  const clearMicError = useCallback(() => setMicError(null), []);

  const startListening = useCallback((onResult: (text: string) => void) => {
    if (!SpeechRecognitionAPI) {
      setMicError('Reconocimiento de voz no soportado en este navegador.');
      return;
    }

    setMicError(null);
    onResultRef.current = onResult;

    const recognition = new SpeechRecognitionAPI();
    recognition.lang = 'es-CO';
    recognition.interimResults = false;
    recognition.continuous = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event: any) => {
      const text = event.results[0][0].transcript;
      if (text && onResultRef.current) {
        onResultRef.current(text);
      }
    };

    recognition.onerror = (event: any) => {
      setMicError(`Error: ${event.error}`);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;
    recognition.start();
    setIsListening(true);
  }, []);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {}
      recognitionRef.current = null;
    }
    setIsListening(false);
    setMicError(null);
  }, []);

  const speak = useCallback((text: string) => {
    if (!window.speechSynthesis) return;

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'es-ES';
    utterance.rate = 0.9;
    utterance.pitch = 1.0;

    const voices = voicesRef.current.length > 0
      ? voicesRef.current
      : window.speechSynthesis.getVoices();
    const spanishVoice = findSpanishVoice(voices);
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
