"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { BrainwaveState } from "../utils/brainwaveFrequencies";
import { audioEngine, type EngineStatus, type NatureSoundType } from "../utils/audioEngine";
import type { InterferenceResult } from "../utils/interferenceDetector";

type BrainSyncContextValue = {
  selectedState: BrainwaveState;
  setSelectedState: (s: BrainwaveState) => void;
  customFreq: number | null;
  setCustomFreq: (f: number | null) => void;
  carrierFreq: number;
  setCarrierFreq: (f: number) => void;
  natureType: NatureSoundType;
  setNatureType: (t: NatureSoundType) => void;
  hasAudio: boolean;
  fileName: string | null;
  handleFileSelect: (file: File) => Promise<void>;
  audioStatus: EngineStatus;
  interference: InterferenceResult | null;
  setInterference: (r: InterferenceResult | null) => void;
};

const BrainSyncContext = createContext<BrainSyncContextValue | null>(null);

export function BrainSyncProvider({ children }: { children: ReactNode }) {
  const [selectedState, setSelectedState] = useState<BrainwaveState>("alpha");
  const [customFreq, setCustomFreq] = useState<number | null>(null);
  const [carrierFreq, setCarrierFreq] = useState(320);
  const [natureType, setNatureType] = useState<NatureSoundType>("brown");
  const [hasAudio, setHasAudio] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [audioStatus, setAudioStatus] = useState<EngineStatus>("idle");
  const [interference, setInterference] = useState<InterferenceResult | null>(null);

  // Sync audio engine status
  useState(() => {
    audioEngine.onStatusChange(setAudioStatus);
  });

  const setSelectedStateWithFreqReset = useCallback(
    (s: BrainwaveState) => {
      setSelectedState(s);
      setCustomFreq(null);
    },
    []
  );

  const handleFileSelect = useCallback(async (file: File) => {
    try {
      await audioEngine.loadUserAudio(file);
      setHasAudio(true);
      setFileName(file.name);
    } catch (e) {
      console.error("Failed to load audio:", e);
    }
  }, []);

  const value = useMemo(
    () => ({
      selectedState,
      setSelectedState: setSelectedStateWithFreqReset,
      customFreq,
      setCustomFreq,
      carrierFreq,
      setCarrierFreq,
      natureType,
      setNatureType,
      hasAudio,
      fileName,
      handleFileSelect,
      audioStatus,
      interference,
      setInterference,
    }),
    [
      selectedState,
      setSelectedStateWithFreqReset,
      customFreq,
      carrierFreq,
      natureType,
      hasAudio,
      fileName,
      handleFileSelect,
      audioStatus,
      interference,
    ]
  );

  return (
    <BrainSyncContext.Provider value={value}>
      {children}
    </BrainSyncContext.Provider>
  );
}

export function useBrainSync() {
  const ctx = useContext(BrainSyncContext);
  if (!ctx) {
    throw new Error("useBrainSync must be used within BrainSyncProvider");
  }
  return ctx;
}
