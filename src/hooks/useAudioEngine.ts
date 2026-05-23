"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { BrainwaveState } from "../utils/brainwaveFrequencies";
import type { EngineStatus, NatureSoundType } from "../utils/audioEngine";
import type { SyncNode } from "../services/DynamicSyncModulator";
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
  const [advancedEnabled, setAdvancedEnabled] = useState(audioEngine.advancedEnabled);
  const [sweepAmplitude, setSweepAmplitude] = useState(audioEngine.sweepAmplitude);
  const [secondaryGain, setSecondaryGain] = useState(audioEngine.secondaryGain);
  const [secondaryFactor, setSecondaryFactor] = useState(audioEngine.secondaryFactor);
  const [amDepth, setAmDepth] = useState(audioEngine.amDepth);
  const [amRate, setAmRate] = useState(audioEngine.amRate);
  const [syncNode, setSyncNode] = useState<SyncNode | null>(audioEngine.syncNode);
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

  const setAdvSyncEnabled = useCallback((enabled: boolean) => {
    audioEngine.setAdvancedSyncEnabled(enabled);
    setAdvancedEnabled(audioEngine.advancedEnabled);
  }, []);

  const setSweepAmp = useCallback((a: number) => {
    audioEngine.setSweepAmplitude(a);
    setSweepAmplitude(audioEngine.sweepAmplitude);
  }, []);

  const setSecGain = useCallback((g: number) => {
    audioEngine.setSecondaryGain(g);
    setSecondaryGain(audioEngine.secondaryGain);
  }, []);

  const setSecFactor = useCallback((f: number) => {
    audioEngine.setSecondaryFactor(f);
    setSecondaryFactor(audioEngine.secondaryFactor);
  }, []);

  const setAmDepthVal = useCallback((d: number) => {
    audioEngine.setAmDepth(d);
    setAmDepth(audioEngine.amDepth);
  }, []);

  const setAmRateVal = useCallback((r: number) => {
    audioEngine.setAmRate(r);
    setAmRate(audioEngine.amRate);
  }, []);

  const setSyncNodeVal = useCallback((node: SyncNode | null) => {
    audioEngine.setSyncNode(node);
    setSyncNode(audioEngine.syncNode);
    // Sync back all preset-derived values
    setSecondaryFactor(audioEngine.secondaryFactor);
    setAmDepth(audioEngine.amDepth);
    setAmRate(audioEngine.amRate);
    setSweepAmplitude(audioEngine.sweepAmplitude);
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
    // Advanced sync
    advancedEnabled,
    sweepAmplitude,
    secondaryGain,
    secondaryFactor,
    amDepth,
    amRate,
    syncNode,
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
    setAdvancedSyncEnabled: setAdvSyncEnabled,
    setSweepAmplitude: setSweepAmp,
    setSecondaryGain: setSecGain,
    setSecondaryFactor: setSecFactor,
    setAmDepth: setAmDepthVal,
    setAmRate: setAmRateVal,
    setSyncNode: setSyncNodeVal,
    exportAudio,
  };
}
