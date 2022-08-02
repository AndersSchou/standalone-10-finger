import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { SpeakResultDTO } from '../dto/speak.dto';
import { VoiceService } from './api/voice.service';

/**
 * Extension of audio element.
 */
class AudioElement extends Audio {
  constructor() {
    super();
  }
}

@Injectable()
export class SpeechService {
  // Responsible for handling audio events.
  private speechAudioElement: AudioElement = new AudioElement();

  // Hold speak result of selected text.
  private speakResult: SpeakResultDTO = {} as SpeakResultDTO;;
  // The subject used to send signal on speech termination.
  private speechEnded = new Subject<boolean>();
  // Observable instance of the source object.
  public OnSpeechEnd = this.speechEnded.asObservable();

  /**
   * Constructor function responsible for injecting the needed services.
   *
   * @param voiceService Is an instance of VoiceService.
   */
  constructor(
    private readonly voiceService: VoiceService,
  ) {
    // Unload speech when completed.
    this.speechAudioElement.addEventListener('ended', () => {
      this.unload();
      this.speechEnded.next(true);

    });
  }

  /**
   * Check if current selection is playing.
   *
   * @return True if the current selection is playing and false otherwise.
   */
  isPlaying(): boolean {
    return this.speechAudioElement && !this.speechAudioElement.paused;
  }

  /**
   * Start speech for the current text.
   *
   * @param speechText Text to play in speech.
   * @param voiceID Represents the voice id for the speak service.
   */
  play(
    speechText: string,
    voiceID: string
  ): void {
    // If speech text does not exist.
    if (!speechText) {
      return;
    }

    this.voiceService.speak(speechText, voiceID).subscribe(
      (speakResult) => {
        if (speakResult.soundLink) {
          this.speakResult = speakResult;
          this.speechAudioElement.src = speakResult.soundLink;
          this.speechAudioElement.load();
          this.speechAudioElement.play().catch(() => { });
        }
      }
    );
  }

  /**
   * Method responsible for unloading the speech.
   */
  unload(): void {
    if (!this.speechAudioElement.src || !this.speakResult) {
      return;
    }
    this.speechAudioElement.removeAttribute('src');
  }

  /**
   * Pause the current running speech audio speech.
   */
  pause(): void {
    this.speechAudioElement.pause();
  }

  /**
   * Unload all audio elements.
   */
  unloadAll(): void {
    this.unload();
  }


  /**
   * Returns true if speech is ended and false otherwise.
   *
   * @returns True if speech is ended and false otherwise.
   */
  isSpeechEnded(): boolean {
    return this.speechAudioElement.src ? false : true;
  }

}
