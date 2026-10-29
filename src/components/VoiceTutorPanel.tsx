import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Sparkles, Play, Square, RotateCcw, BookOpen, Gauge, HelpCircle, CheckCircle2 } from 'lucide-react';
import { Mode, ObjectType } from '../types';
import { VoiceExplanationContext, getLiveExplanation, speechSynthesizer, VoiceTutorScript } from '../utils/voiceTutor';

interface VoiceTutorPanelProps {
  mode: Mode;
  objectType?: ObjectType;
  metrics?: VoiceExplanationContext['metrics'];
  autoPlayOnSelect?: boolean;
  onToggleAutoPlay?: (val: boolean) => void;
  accentColor: string;
}

export const VoiceTutorPanel: React.FC<VoiceTutorPanelProps> = ({
  mode,
  objectType,
  metrics,
  autoPlayOnSelect = false,
  onToggleAutoPlay,
  accentColor,
}) => {
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [speechRate, setSpeechRate] = useState<number>(1.0);
  const [currentScript, setCurrentScript] = useState<VoiceTutorScript>(() =>
    getLiveExplanation({ mode, objectType, metrics })
  );
  const [explanationTarget, setExplanationTarget] = useState<'object' | 'shape'>(
    objectType ? 'object' : 'shape'
  );
  const [highlightWordIndex, setHighlightWordIndex] = useState<number>(-1);

  // Update script whenever mode, objectType, or explanationTarget changes
  useEffect(() => {
    const targetObj = explanationTarget === 'object' ? objectType : undefined;
    const script = getLiveExplanation({ mode, objectType: targetObj, metrics });
    setCurrentScript(script);

    if (autoPlayOnSelect) {
      handleSpeak(script);
    }
  }, [mode, objectType, explanationTarget]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      speechSynthesizer.stop();
    };
  }, []);

  const handleSpeak = (scriptToSpeak?: VoiceTutorScript) => {
    const script = scriptToSpeak || currentScript;
    setHighlightWordIndex(-1);

    speechSynthesizer.speak(
      script.text,
      () => {
        setIsSpeaking(true);
      },
      () => {
        setIsSpeaking(false);
        setHighlightWordIndex(-1);
      },
      (_word, charIndex) => {
        // highlight estimation based on character progress
        setHighlightWordIndex(charIndex);
      },
      speechRate
    );
  };

  const handleStop = () => {
    speechSynthesizer.stop();
    setIsSpeaking(false);
    setHighlightWordIndex(-1);
  };

  const toggleSpeech = () => {
    if (isSpeaking) {
      handleStop();
    } else {
      handleSpeak();
    }
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-xl backdrop-blur-md transition-all">
      {/* Top Bar: Title & Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800/80">
        <div className="flex items-center gap-2.5">
          <div className="relative flex items-center justify-center">
            <div
              className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all ${
                isSpeaking
                  ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/30 animate-pulse'
                  : 'bg-slate-800 text-cyan-400 border border-slate-700'
              }`}
            >
              {isSpeaking ? <Volume2 className="w-4 h-4 animate-bounce" /> : <Volume2 className="w-4 h-4" />}
            </div>
            {isSpeaking && (
              <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-500"></span>
              </span>
            )}
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-white font-display">AI Voice Tutor</span>
              <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
                10-Sec Audio Lesson
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-tight">
              {currentScript.subtitle}
            </p>
          </div>
        </div>

        {/* Right side controls: Play/Stop + Speed + Auto-play toggle */}
        <div className="flex items-center gap-2">
          {/* Target toggle: Object vs Shape */}
          {objectType && (
            <div className="inline-flex rounded-lg bg-slate-950 p-0.5 border border-slate-800 text-xs">
              <button
                onClick={() => setExplanationTarget('object')}
                className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors ${
                  explanationTarget === 'object'
                    ? 'bg-slate-800 text-cyan-300 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Object
              </button>
              <button
                onClick={() => setExplanationTarget('shape')}
                className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors ${
                  explanationTarget === 'shape'
                    ? 'bg-slate-800 text-cyan-300 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Shape
              </button>
            </div>
          )}

          {/* Speed selector */}
          <div className="flex items-center gap-1 text-[11px] font-mono text-slate-400 bg-slate-950 px-2 py-1 rounded-lg border border-slate-800">
            <Gauge className="w-3 h-3 text-slate-500" />
            <select
              value={speechRate}
              onChange={(e) => {
                const val = parseFloat(e.target.value);
                setSpeechRate(val);
                if (isSpeaking) {
                  handleStop();
                }
              }}
              className="bg-transparent text-slate-300 focus:outline-none cursor-pointer"
            >
              <option value="0.85" className="bg-slate-900">0.85x</option>
              <option value="1.0" className="bg-slate-900">1.0x</option>
              <option value="1.15" className="bg-slate-900">1.15x</option>
              <option value="1.3" className="bg-slate-900">1.3x</option>
            </select>
          </div>

          {/* Primary Speak Button */}
          <button
            onClick={toggleSpeech}
            className={`px-3 py-1.5 rounded-xl font-semibold text-xs flex items-center gap-1.5 transition-all shadow-md ${
              isSpeaking
                ? 'bg-rose-500 hover:bg-rose-600 text-white shadow-rose-500/20'
                : 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-cyan-500/20'
            }`}
          >
            {isSpeaking ? (
              <>
                <Square className="w-3.5 h-3.5 fill-current" />
                <span>Stop</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Play Voice</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Spoken Transcript & Live Waveform */}
      <div className="mt-3 bg-slate-950/80 rounded-xl p-3 border border-slate-800/80 relative overflow-hidden">
        {/* Subtle background glow */}
        <div
          className="absolute -right-10 -bottom-10 w-32 h-32 rounded-full blur-3xl opacity-10 pointer-events-none"
          style={{ backgroundColor: accentColor }}
        />

        <div className="flex items-start justify-between gap-2 mb-1.5">
          <span className="text-[11px] font-semibold text-slate-300 flex items-center gap-1.5">
            <Sparkles className="w-3 h-3 text-cyan-400" />
            <span>{currentScript.title}</span>
          </span>

          {/* Animated audio equalizer when speaking */}
          {isSpeaking && (
            <div className="flex items-center gap-0.5 h-3">
              <span className="w-0.5 bg-cyan-400 h-full animate-[bounce_0.6s_ease-in-out_infinite]"></span>
              <span className="w-0.5 bg-cyan-400 h-2 animate-[bounce_0.4s_ease-in-out_infinite_0.1s]"></span>
              <span className="w-0.5 bg-cyan-400 h-full animate-[bounce_0.5s_ease-in-out_infinite_0.2s]"></span>
              <span className="w-0.5 bg-cyan-400 h-1.5 animate-[bounce_0.7s_ease-in-out_infinite_0.15s]"></span>
              <span className="w-0.5 bg-cyan-400 h-2.5 animate-[bounce_0.5s_ease-in-out_infinite_0.05s]"></span>
            </div>
          )}
        </div>

        {/* Text Transcript with dynamic styling */}
        <p className="text-xs text-slate-300 leading-relaxed font-sans">
          "{currentScript.text}"
        </p>

        {/* Footer info: CBSE Syllabus citation */}
        <div className="mt-2.5 pt-2 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-slate-400">
          <span className="flex items-center gap-1 text-slate-400 truncate">
            <BookOpen className="w-3 h-3 text-cyan-400 shrink-0" />
            <span className="truncate">{currentScript.cbseRef}</span>
          </span>

          {onToggleAutoPlay && (
            <label className="flex items-center gap-1.5 cursor-pointer text-slate-400 hover:text-slate-200 select-none shrink-0 ml-2">
              <input
                type="checkbox"
                checked={autoPlayOnSelect}
                onChange={(e) => onToggleAutoPlay(e.target.checked)}
                className="w-3 h-3 rounded bg-slate-900 border-slate-700 text-cyan-500 focus:ring-0"
              />
              <span className="text-[10px]">Auto-speak on select</span>
            </label>
          )}
        </div>
      </div>
    </div>
  );
};
