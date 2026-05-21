"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { BrainwaveState } from "../utils/brainwaveFrequencies";
import type { EngineStatus, NatureSoundType } from "../utils/audioEngine";
import { audioEngine } from "../utils/audioEngine";

export function useAudioEngine() {
  const [status, setStatus] = useState<EngineStatus>(audioEngine.status);
  const [error, setError] = useState<string | null>(null);
  const [carrierFreq, setCarrierFreq] = useState(audioEngine.carrierFrequency);
  const [carrierVol, setCarrierVol] = useState(audioEngine.carrierVolume);
  const [musicVol, setMusicVol] = useState(audioEngine.musicVolume);
  const [noiseVol, setNoiseVol] = useState(audioEngine.noiseVolume);
  const [natureType, setNatureType] = useState(audioEngine.natureSoundType);
  const [hasAudio, setHasAudio] = useState(audioEngine.hasUserAudio());
  const analyserRef = useRef<AnalyserNode | null>(null);

  useEffect(() => {
    return audioEngine.onStatusChange(setStatus);
  }, []);

  useEffect(() => {
    return audioEngine.onAudioLoadChange(() => {
      setHasAudio(true);
    });
  }, []);

  const play = useCallback(
    (state: BrainwaveState, customFreq?: number | null) => {
      try {
        setError(null);
        audioEngine.play(state, customFreq);
        analyserRef.current = audioEngine.analyserNode;
      } catch (e) {
        setError(e instanceof Error ? e.message : "Audio play failed");
      }
    },
    []
  );

  const pause = useCallback(() => {
    audioEngine.pause();
  }, []);

  const resume = useCallback(() => {
    try {
      setError(null);
      audioEngine.resume();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Audio resume failed");
    }
  }, []);

  const stop = useCallback(() => {
    audioEngine.stop();
    analyserRef.current = null;
  }, []);

  const loadAudio = useCallback(async (file: File) => {
    try {
      setError(null);
      await audioEngine.loadUserAudio(file);
      setHasAudio(true);
      return true;
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load audio");
      return false;
    }
  }, []);

  const setCarrierFrequency = useCallback((freq: number) => {
    audioEngine.setCarrierFrequency(freq);
    setCarrierFreq(audioEngine.carrierFrequency);
  }, []);

  const setCarrierVolume = useCallback((v: number) => {
    audioEngine.setCarrierVolume(v);
    setCarrierVol(audioEngine.carrierVolume);
  }, []);

  const setMusicVolume = useCallback((v: number) => {
    audioEngine.setMusicVolume(v);
    setMusicVol(audioEngine.musicVolume);
  }, []);

  const setNoiseVolume = useCallback((v: number) => {
    audioEngine.setNoiseVolume(v);
    setNoiseVol(audioEngine.noiseVolume);
  }, []);

  const setNatureSoundType = useCallback((type: NatureSoundType) => {
    audioEngine.setNatureSoundType(type);
    setNatureType(audioEngine.natureSoundType);
  }, []);

  const exportAudio = useCallback(
    async (
      state: BrainwaveState,
      customFreq?: number | null,
      format: "wav" | "mp3" = "wav",
      onProgress?: (msg: string) => void,
    ) => {
      try {
        setError(null);
        return await audioEngine.exportAudio(state, customFreq, format, onProgress);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Export failed");
        return null;
      }
    },
    []
  );

  return {
    status,
    error,
    carrierFreq,
    carrierVol,
    musicVol,
    noiseVol,
    natureType,
    hasAudio,
    analyserRef,
    play,
    pause,
    resume,
    stop,
    loadAudio,
    setCarrierFrequency,
    setCarrierVolume,
    setMusicVolume,
    setNoiseVolume,
    setNatureSoundType,
    exportAudio,
  };
}
