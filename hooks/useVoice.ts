'use client';
import { useState, useRef, useCallback, useEffect } from 'react';
import { api } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { webmToWav } from '@/lib/audio';

const SPANISH_LOCALES = ['es-ES', 'es-MX', 'es-US', 'es-AR', 'es-CO', 'es-CL', 'es'];

function normalizeForSpeech(text: string): string {
  let t = text;

  // Strip Markdown formatting
  t = t.replace(/\*\*(.+?)\*\*/g, '$1');
  t = t.replace(/\*(.+?)\*/g, '$1');
  t = t.replace(/__(.+?)__/g, '$1');
  t = t.replace(/`(.+?)`/g, '$1');
  t = t.replace(/~~(.+?)~~/g, '$1');
  t = t.replace(/\[(.+?)\]\(.+?\)/g, '$1');
  t = t.replace(/#{1,6}\s/g, '');
  t = t.replace(/^[-*+]\s/gm, '');

  // Currency: COP 25.000 → 25000 pesos colombianos
  t = t.replace(/\bCOP\s*(\d[\d.,]*)/gi, (_, num) => `${cleanNumber(num)} pesos colombianos`);

  // Currency: $25.000 or $25,000 → 25000 pesos
  t = t.replace(/\$\s*(\d[\d.,]*)/g, (_, num) => `${cleanNumber(num)} pesos`);

  // Thousands separators: 25.000 → 25000, 25,000 → 25000
  t = t.replace(/(\d+)\.(\d{3})(?!\d)/g, (_, a, b) => a + b);
  t = t.replace(/(\d+),(\d{3})(?!\d)/g, (_, a, b) => a + b);

  // Percentages: 25% → 25 por ciento
  t = t.replace(/(\d+(?:[.,]\d+)?)\s*%/g, '$1 por ciento');

  // Informal thousands: 25k → 25 mil
  t = t.replace(/\b(\d+)\s*k\b/gi, '$1 mil');

  // Clean up whitespace
  t = t.replace(/\s+/g, ' ').trim();

  return t;
}

function cleanNumber(num: string): string {
  let n = num.replace(/\.(\d{3})/g, (_, d) => d);
  n = n.replace(/,(\d{3})/g, (_, d) => d);
  n = n.replace(/,(\d{1,2})$/, '.$1');
  return n;
}

export function useVoice() {
  const { token } = useAuth();
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isMicSupported, setIsMicSupported] = useState(false);
  const [isSpeechSupported, setIsSpeechSupported] = useState(false);
  const [micError, setMicError] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const voicesRef = useRef<SpeechSynthesisVoice[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    setIsMicSupported(!!navigator.mediaDevices?.getUserMedia);
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
      audioRef.current?.pause();
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

  const startListening = useCallback(async (onResult: (text: string) => void) => {
    if (!navigator.mediaDevices?.getUserMedia) {
      setMicError('Micrófono no soportado en este navegador.');
      return;
    }

    setMicError(null);
    chunksRef.current = [];

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const mimeType = MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
        ? 'audio/webm;codecs=opus'
        : 'audio/webm';

      const recorder = new MediaRecorder(stream, { mimeType });

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      recorder.onstop = async () => {
        const webmBlob = new Blob(chunksRef.current, { type: mimeType });
        stream.getTracks().forEach((t) => t.stop());
        streamRef.current = null;

        if (!token) {
          setMicError('Debes iniciar sesión para usar voz.');
          return;
        }

        try {
          const wavBlob = await webmToWav(webmBlob);
          const result = await api.chat.transcribe(token, wavBlob);
          if (result.text) {
            onResult(result.text);
          }
        } catch (e: any) {
          setMicError(e.message || 'Error al transcribir el audio.');
        }
      };

      recorder.onerror = () => {
        setMicError('Error al grabar. Intenta de nuevo.');
        stream.getTracks().forEach((t) => t.stop());
        streamRef.current = null;
        setIsListening(false);
      };

      mediaRecorderRef.current = recorder;
      recorder.start();
      setIsListening(true);
    } catch (e: any) {
      if (e.name === 'NotAllowedError' || e.name === 'PermissionDeniedError') {
        setMicError('Permiso del micrófono denegado.');
      } else if (e.name === 'NotFoundError') {
        setMicError('No se encontró micrófono.');
      } else {
        setMicError(`Error: ${e.message}`);
      }
    }
  }, [token]);

  const stopListening = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    } else {
      streamRef.current?.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    mediaRecorderRef.current = null;
    setIsListening(false);
    setMicError(null);
  }, []);

  const speak = useCallback(async (text: string) => {
    window.speechSynthesis?.cancel();
    audioRef.current?.pause();
    audioRef.current = null;

    const normalized = normalizeForSpeech(text);

    // Deepgram TTS (mejor calidad)
    if (token) {
      try {
        setIsSpeaking(true);
        const audioBlob = await api.chat.speak(token, normalized);
        const audioUrl = URL.createObjectURL(audioBlob);
        const audio = new Audio(audioUrl);
        audioRef.current = audio;

        audio.onended = () => {
          URL.revokeObjectURL(audioUrl);
          audioRef.current = null;
          setIsSpeaking(false);
        };
        audio.onerror = () => {
          URL.revokeObjectURL(audioUrl);
          audioRef.current = null;
          setIsSpeaking(false);
        };

        await audio.play();
        return;
      } catch {
        audioRef.current = null;
        // fallback a browser TTS
      }
    }

    // Browser TTS fallback
    if (!window.speechSynthesis) return;
    const utterance = new SpeechSynthesisUtterance(normalized);
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
  }, [token]);

  const stopSpeaking = useCallback(() => {
    window.speechSynthesis?.cancel();
    audioRef.current?.pause();
    audioRef.current = null;
    setIsSpeaking(false);
  }, []);

  return { isListening, isSpeaking, isMicSupported, isSpeechSupported, micError, startListening, stopListening, speak, stopSpeaking, clearMicError };
}
