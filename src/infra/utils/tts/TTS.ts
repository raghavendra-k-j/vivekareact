export type SpeechVoice = SpeechSynthesisVoice;

interface TTSOptions {
    rate?: number;
    pitch?: number;
    volume?: number;
    voice?: SpeechVoice;
}

type TTSListener = (tag: string) => void;

export class TTS {

    private synth: SpeechSynthesis;
    private startListeners = new Set<TTSListener>();
    private stopListeners = new Set<TTSListener>();
    private languageVoiceMap = new Map<string, SpeechVoice[]>();

    constructor() {
        this.synth = window.speechSynthesis;
        this.initializeVoices();
    }

    private initializeVoices(): void {
        const voices = this.synth.getVoices();
        if (voices.length > 0) {
            this.mapVoicesByLanguage(voices);
        }
        else {
            const handler = () => {
                const loadedVoices = this.synth.getVoices();
                this.mapVoicesByLanguage(loadedVoices);
                this.synth.removeEventListener("voiceschanged", handler);
            };
            this.synth.addEventListener("voiceschanged", handler);
        }
    }

    private mapVoicesByLanguage(voices: SpeechVoice[]): void {
        this.languageVoiceMap.clear();
        for (const voice of voices) {
            const lang = voice.lang;
            if (!this.languageVoiceMap.has(lang)) {
                this.languageVoiceMap.set(lang, []);
            }
            this.languageVoiceMap.get(lang)!.push(voice);
        }
    }

    async waitForVoices(): Promise<SpeechVoice[]> {
        const voices = this.synth.getVoices();
        if (voices.length > 0) return voices;

        return new Promise(resolve => {
            const handler = () => {
                this.synth.removeEventListener("voiceschanged", handler);
                const loaded = this.synth.getVoices();
                this.mapVoicesByLanguage(loaded);
                resolve(loaded);
            };
            this.synth.addEventListener("voiceschanged", handler);
        });
    }

    get isSpeaking() {
        return this.synth.speaking || this.synth.pending;
    }

    get voices(): SpeechVoice[] {
        return this.synth.getVoices();
    }

    get supportedLanguages(): string[] {
        return Array.from(this.languageVoiceMap.keys());
    }

    getAvailableVoicesForLanguage(lang: string): SpeechVoice[] {
        return this.languageVoiceMap.get(lang) ?? [];
    }


    getDefaultVoiceForLanguage(lang: string): SpeechVoice | null {
        const voices = this.getAvailableVoicesForLanguage(lang);
        if (voices.length > 0) {
            return voices[0];
        }
        return null;
    }

    isLangSupported(lang: string): boolean {
        return this.languageVoiceMap.has(lang);
    }


    onStart(listener: TTSListener): void {
        this.startListeners.add(listener);
    }

    offStart(listener: TTSListener): void {
        this.startListeners.delete(listener);
    }

    onStop(listener: TTSListener): void {
        this.stopListeners.add(listener);
    }

    offStop(listener: TTSListener): void {
        this.stopListeners.delete(listener);
    }

    clearAllListeners(): void {
        this.startListeners.clear();
        this.stopListeners.clear();
    }

    private emitStart(tag: string): void {
        this.startListeners.forEach(listener => listener(tag));
    }

    private emitStop(tag: string): void {
        this.stopListeners.forEach(listener => listener(tag));
    }

    speak({ text, tag, options = {} }: { text: string; tag: string; options?: TTSOptions; }): void {
        this.stop();

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = options.rate ?? 1;
        utterance.pitch = options.pitch ?? 1;
        utterance.volume = options.volume ?? 1;
        utterance.voice = options.voice ?? this.voices[0] ?? null;

        utterance.onstart = () => {
            this.emitStart(tag);
        };

        utterance.onend = () => {
            this.emitStop(tag);
        };

        utterance.onerror = () => {
            this.emitStop(tag);
        };

        this.synth.speak(utterance);
    }

    stop(): void {
        if (this.isSpeaking) {
            this.synth.cancel();
        }
    }
}