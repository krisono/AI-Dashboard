import { VoiceCommand } from './types';

export class VoiceRecognitionService {
  private recognition: any;
  private isListening = false;

  constructor() {
    if (typeof window !== 'undefined' && 'webkitSpeechRecognition' in window) {
      this.recognition = new (window as any).webkitSpeechRecognition();
      this.recognition.continuous = false;
      this.recognition.interimResults = false;
      this.recognition.lang = 'en-US';
    }
  }

  isSupported(): boolean {
    return typeof window !== 'undefined' && 'webkitSpeechRecognition' in window;
  }

  startListening(onResult: (command: VoiceCommand) => void, onError?: (error: any) => void): void {
    if (!this.recognition) {
      onError?.(new Error('Speech recognition not supported'));
      return;
    }

    if (this.isListening) return;

    this.isListening = true;

    this.recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript.toLowerCase();
      const confidence = event.results[0][0].confidence;

      const command = this.parseCommand(transcript);
      onResult({ ...command, confidence });
    };

    this.recognition.onerror = (event: any) => {
      this.isListening = false;
      onError?.(event.error);
    };

    this.recognition.onend = () => {
      this.isListening = false;
    };

    this.recognition.start();
  }

  stopListening(): void {
    if (this.recognition && this.isListening) {
      this.recognition.stop();
      this.isListening = false;
    }
  }

  private parseCommand(transcript: string): Omit<VoiceCommand, 'confidence'> {
    // Parse voice commands and map to actions
    if (transcript.includes('open') || transcript.includes('show')) {
      if (transcript.includes('queue')) {
        return { transcript, action: 'navigate:/queue' };
      }
      if (transcript.includes('audit')) {
        return { transcript, action: 'navigate:/audit' };
      }
      if (transcript.includes('bias')) {
        return { transcript, action: 'navigate:/bias' };
      }
      if (transcript.includes('settings')) {
        return { transcript, action: 'navigate:/settings' };
      }
    }

    if (transcript.includes('approve') || transcript.includes('accept')) {
      return { transcript, action: 'decision:approve' };
    }

    if (transcript.includes('reject') || transcript.includes('deny')) {
      return { transcript, action: 'decision:reject' };
    }

    if (transcript.includes('refer') || transcript.includes('escalate')) {
      return { transcript, action: 'decision:refer' };
    }

    if (transcript.includes('next case')) {
      return { transcript, action: 'navigate:next-case' };
    }

    if (transcript.includes('previous case')) {
      return { transcript, action: 'navigate:previous-case' };
    }

    if (transcript.includes('help')) {
      return { transcript, action: 'show:help' };
    }

    return { transcript, action: 'unknown' };
  }
}

export const voiceService = new VoiceRecognitionService();
