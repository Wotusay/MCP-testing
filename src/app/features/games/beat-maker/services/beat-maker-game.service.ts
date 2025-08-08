import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface DrumSound {
  id: string;
  name: string;
  color: string;
  audioBuffer?: AudioBuffer;
}

export interface BeatPattern {
  id: string;
  name: string;
  bpm: number;
  steps: number;
  tracks: { [trackId: string]: boolean[] };
}

export interface GameState {
  isPlaying: boolean;
  currentStep: number;
  bpm: number;
  steps: number;
  tracks: DrumSound[];
  pattern: { [trackId: string]: boolean[] };
  volume: number;
}

@Injectable({
  providedIn: 'root',
})
export class BeatMakerGameService {
  private audioContext: AudioContext | null = null;
  private schedulerTimerId: number | null = null;
  private nextNoteTime = 0;
  private lookahead = 25; // 25ms lookahead
  private scheduleAheadTime = 0.1; // 100ms scheduling ahead

  private readonly defaultTracks: DrumSound[] = [
    { id: 'kick', name: 'Kick', color: 'bg-red-500' },
    { id: 'snare', name: 'Snare', color: 'bg-blue-500' },
    { id: 'hihat', name: 'Hi-Hat', color: 'bg-yellow-500' },
    { id: 'openhat', name: 'Open Hat', color: 'bg-green-500' },
  ];

  private initialState: GameState = {
    isPlaying: false,
    currentStep: 0,
    bpm: 120,
    steps: 16,
    tracks: this.defaultTracks,
    pattern: {},
    volume: 0.7,
  };

  private gameStateSubject = new BehaviorSubject<GameState>(this.initialState);
  public gameState$ = this.gameStateSubject.asObservable();

  constructor() {
    this.initializeAudioContext();
    this.initializePattern();
  }

  private async initializeAudioContext(): Promise<void> {
    try {
      // Initialize Web Audio API context with fallback for older browsers
      const AudioContextConstructor =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext;
      this.audioContext = new AudioContextConstructor();
      await this.createDrumSounds();
    } catch {
      // Audio context initialization failed - game will continue without sound
    }
  }

  private async createDrumSounds(): Promise<void> {
    if (!this.audioContext) return;

    const tracks = this.defaultTracks.map(async (track) => {
      try {
        const buffer = await this.createDrumBuffer(track.id);
        return { ...track, audioBuffer: buffer };
      } catch {
        // Failed to create sound buffer - continue without this track
        return track;
      }
    });

    const resolvedTracks = await Promise.all(tracks);
    const currentState = this.gameStateSubject.value;
    this.gameStateSubject.next({
      ...currentState,
      tracks: resolvedTracks,
    });
  }

  private async createDrumBuffer(soundType: string): Promise<AudioBuffer> {
    if (!this.audioContext) throw new Error('Audio context not initialized');

    // Create synthetic drum sounds using Web Audio API
    const sampleRate = this.audioContext.sampleRate;
    let duration: number;
    let buffer: AudioBuffer;

    switch (soundType) {
      case 'kick':
        duration = 0.5;
        buffer = this.audioContext.createBuffer(
          1,
          sampleRate * duration,
          sampleRate,
        );
        this.generateKickSound(buffer);
        break;
      case 'snare':
        duration = 0.2;
        buffer = this.audioContext.createBuffer(
          1,
          sampleRate * duration,
          sampleRate,
        );
        this.generateSnareSound(buffer);
        break;
      case 'hihat':
        duration = 0.1;
        buffer = this.audioContext.createBuffer(
          1,
          sampleRate * duration,
          sampleRate,
        );
        this.generateHiHatSound(buffer);
        break;
      case 'openhat':
        duration = 0.3;
        buffer = this.audioContext.createBuffer(
          1,
          sampleRate * duration,
          sampleRate,
        );
        this.generateOpenHatSound(buffer);
        break;
      default:
        duration = 0.1;
        buffer = this.audioContext.createBuffer(
          1,
          sampleRate * duration,
          sampleRate,
        );
    }

    return buffer;
  }

  private generateKickSound(buffer: AudioBuffer): void {
    const data = buffer.getChannelData(0);
    const sampleRate = buffer.sampleRate;

    for (let i = 0; i < buffer.length; i++) {
      const t = i / sampleRate;
      const frequency = 60 * Math.exp(-t * 30); // Frequency sweep down
      const envelope = Math.exp(-t * 10); // Exponential decay
      data[i] = Math.sin(2 * Math.PI * frequency * t) * envelope * 0.5;
    }
  }

  private generateSnareSound(buffer: AudioBuffer): void {
    const data = buffer.getChannelData(0);
    const sampleRate = buffer.sampleRate;

    for (let i = 0; i < buffer.length; i++) {
      const t = i / sampleRate;
      const noise = (Math.random() * 2 - 1) * 0.3;
      const tone = Math.sin(2 * Math.PI * 200 * t) * 0.2;
      const envelope = Math.exp(-t * 30);
      data[i] = (noise + tone) * envelope;
    }
  }

  private generateHiHatSound(buffer: AudioBuffer): void {
    const data = buffer.getChannelData(0);
    const sampleRate = buffer.sampleRate;

    for (let i = 0; i < buffer.length; i++) {
      const t = i / sampleRate;
      const noise = (Math.random() * 2 - 1) * 0.1;
      const envelope = Math.exp(-t * 50);
      data[i] = noise * envelope;
    }
  }

  private generateOpenHatSound(buffer: AudioBuffer): void {
    const data = buffer.getChannelData(0);
    const sampleRate = buffer.sampleRate;

    for (let i = 0; i < buffer.length; i++) {
      const t = i / sampleRate;
      const noise = (Math.random() * 2 - 1) * 0.08;
      const envelope = Math.exp(-t * 8); // Slower decay for open hat
      data[i] = noise * envelope;
    }
  }

  private initializePattern(): void {
    const currentState = this.gameStateSubject.value;
    const pattern: { [trackId: string]: boolean[] } = {};

    this.defaultTracks.forEach((track) => {
      pattern[track.id] = new Array(currentState.steps).fill(false);
    });

    this.gameStateSubject.next({
      ...currentState,
      pattern,
    });
  }

  public toggleStep(trackId: string, stepIndex: number): void {
    const currentState = this.gameStateSubject.value;
    const newPattern = { ...currentState.pattern };

    if (!newPattern[trackId]) {
      newPattern[trackId] = new Array(currentState.steps).fill(false);
    }

    newPattern[trackId][stepIndex] = !newPattern[trackId][stepIndex];

    this.gameStateSubject.next({
      ...currentState,
      pattern: newPattern,
    });
  }

  public play(): void {
    if (!this.audioContext) {
      // Audio context not available - skip playback
      return;
    }

    if (this.audioContext.state === 'suspended') {
      this.audioContext.resume();
    }

    const currentState = this.gameStateSubject.value;
    this.gameStateSubject.next({
      ...currentState,
      isPlaying: true,
    });

    this.nextNoteTime = this.audioContext.currentTime;
    this.scheduler();
  }

  public stop(): void {
    const currentState = this.gameStateSubject.value;
    this.gameStateSubject.next({
      ...currentState,
      isPlaying: false,
      currentStep: 0,
    });

    if (this.schedulerTimerId) {
      clearTimeout(this.schedulerTimerId);
      this.schedulerTimerId = null;
    }
  }

  public setBpm(bpm: number): void {
    const currentState = this.gameStateSubject.value;
    this.gameStateSubject.next({
      ...currentState,
      bpm: Math.max(60, Math.min(200, bpm)),
    });
  }

  public clearPattern(): void {
    const currentState = this.gameStateSubject.value;
    const clearedPattern: { [trackId: string]: boolean[] } = {};

    Object.keys(currentState.pattern).forEach((trackId) => {
      clearedPattern[trackId] = new Array(currentState.steps).fill(false);
    });

    this.gameStateSubject.next({
      ...currentState,
      pattern: clearedPattern,
    });
  }

  public savePattern(name: string): void {
    const currentState = this.gameStateSubject.value;
    const pattern: BeatPattern = {
      id: Date.now().toString(),
      name,
      bpm: currentState.bpm,
      steps: currentState.steps,
      tracks: currentState.pattern,
    };

    const savedPatterns = this.getSavedPatterns();
    savedPatterns.push(pattern);
    localStorage.setItem('beatMakerPatterns', JSON.stringify(savedPatterns));
  }

  public getSavedPatterns(): BeatPattern[] {
    const saved = localStorage.getItem('beatMakerPatterns');
    return saved ? JSON.parse(saved) : [];
  }

  public loadPattern(pattern: BeatPattern): void {
    const currentState = this.gameStateSubject.value;
    this.gameStateSubject.next({
      ...currentState,
      bpm: pattern.bpm,
      steps: pattern.steps,
      pattern: pattern.tracks,
    });
  }

  public playSound(trackId: string): void {
    if (!this.audioContext) return;

    const currentState = this.gameStateSubject.value;
    const track = currentState.tracks.find((t) => t.id === trackId);

    if (track?.audioBuffer) {
      const source = this.audioContext.createBufferSource();
      const gainNode = this.audioContext.createGain();

      source.buffer = track.audioBuffer;
      gainNode.gain.value = currentState.volume;

      source.connect(gainNode);
      gainNode.connect(this.audioContext.destination);
      source.start();
    }
  }

  private scheduler(): void {
    if (!this.audioContext) return;

    const currentState = this.gameStateSubject.value;
    if (!currentState.isPlaying) return;

    while (
      this.nextNoteTime <
      this.audioContext.currentTime + this.scheduleAheadTime
    ) {
      this.scheduleNote(this.nextNoteTime, currentState.currentStep);
      this.nextStep(currentState);
    }

    this.schedulerTimerId = window.setTimeout(() => {
      this.scheduler();
    }, this.lookahead);
  }

  private scheduleNote(time: number, step: number): void {
    const currentState = this.gameStateSubject.value;

    // Play sounds for this step
    currentState.tracks.forEach((track) => {
      if (currentState.pattern[track.id]?.[step] && track.audioBuffer) {
        const source = this.audioContext!.createBufferSource();
        const gainNode = this.audioContext!.createGain();

        source.buffer = track.audioBuffer;
        gainNode.gain.value = currentState.volume;

        source.connect(gainNode);
        gainNode.connect(this.audioContext!.destination);
        source.start(time);
      }
    });
  }

  private nextStep(currentState: GameState): void {
    const secondsPerBeat = 60.0 / currentState.bpm / 4; // 16th notes
    this.nextNoteTime += secondsPerBeat;

    const nextStep = (currentState.currentStep + 1) % currentState.steps;
    this.gameStateSubject.next({
      ...currentState,
      currentStep: nextStep,
    });
  }
}
