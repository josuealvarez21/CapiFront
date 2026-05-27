'use client';
import { useState, useRef, useCallback, useEffect } from 'react';
import { api } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';

const SPANISH_LOCALES = ['es-ES', 'es-MX', 'es-US', 'es-AR', 'es-CO', 'es-CL', 'es'];

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
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const onResultRef = useRef<((text: string) => void) | null>(null);
  const voicesRef = useRef<SpeechSynthesisVoice[]>([]);

  const hasNativeSpeechApi = typeof window !== 'undefined' &&
    ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window);

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

  const stopMediaStream = useCallback(() => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
  }, []);

  const startNativeRecognition = useCallback((onResult: (text: string) => void) => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return false;

    const recognition = new SpeechRecognition();
    recognition.lang = 'es-ES';
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const text = event.results[0][0].transcript;
      if (text) onResult(text);
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      if (event.error === 'not-allowed') {
        setMicError('Permiso del micrófono denegado.');
      } else if (event.error === 'no-speech') {
        setMicError('No se detectó voz. Intenta de nuevo.');
      } else {
        setMicError(`Error de reconocimiento: ${event.error}`);
      }
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;
    recognition.start();
    setIsListening(true);
    return true;
  }, []);

  const stopNativeRecognition = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
    setIsListening(false);
  }, []);

  const startGeminiRecording = useCallback(async (onResult: (text: string) => void) => {
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
        const audioBlob = new Blob(chunksRef.current, { type: mimeType });
        stopMediaStream();

        if (!token) {
          setMicError('Debes iniciar sesión para usar voz.');
          return;
        }

        try {
          const result = await api.chat.transcribe(token, audioBlob);
          if (result.text) {
            onResult(result.text);
          }
        } catch (e: any) {
          setMicError(e.message || 'Error al transcribir el audio. Intenta de nuevo.');
        }
      };

      recorder.onerror = () => {
        setMicError('Error al grabar. Intenta de nuevo.');
        stopMediaStream();
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
        setMicError(`Error al acceder al micrófono: ${e.message}`);
      }
    }
  }, [token, stopMediaStream]);

  const startListening = useCallback(async (onResult: (text: string) => void) => {
    if (!navigator.mediaDevices?.getUserMedia) {
      setMicError('Micrófono no soportado en este navegador.');
      return;
    }

    setMicError(null);
    onResultRef.current = onResult;

    if (hasNativeSpeechApi) {
      const started = startNativeRecognition(onResult);
      if (started) return;
    }

    await startGeminiRecording(onResult);
  }, [hasNativeSpeechApi, startNativeRecognition, startGeminiRecording]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      stopNativeRecognition();
      return;
    }

    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    } else {
      stopMediaStream();
    }
    mediaRecorderRef.current = null;
    setIsListening(false);
    setMicError(null);
  }, [stopNativeRecognition, stopMediaStream]);

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
