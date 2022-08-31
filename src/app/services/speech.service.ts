import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import {
  REGEX_FOR_LETTERS_WITH_DIACRITICS,
  SENTENCE_READ_REGEX, WHITE_SPACE_REGEX,
  WORD_READ_REGEX, REGEX_FOR_LETTERS_WITH_DIACRITICS_AND_NBR
} from '../common/constants';
import { READING_IDENTIFIER } from '../common/enums';
import { ReadOptionsDTO, SpeakResultDTO } from '../dto/speak.dto';
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
    voiceID: string,
    speechType?: string
  ): void {
    // If speech text does not exist.
    if (!speechText) {
      return;
    }

    this.voiceService.speak(speechText, voiceID, speechType).subscribe(
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

  /**
   * Handles reading of the current text.
   *
   * @param character Represents the character to read.
   * @param readOptions Represents the read options.
   * @param txtToRead Represents the text to read.
   * @param voiceID Represents the voice id for the speak service.
   * @param isLastChar Tells if the character is the last character of the text.
   * @param charMatch Tells if the character is a match of the text (used to disable read word when the chars do not match).
   */
  handleReading(character: string, readOptions: ReadOptionsDTO, txtToRead: string, voiceID: string, isLastChar: boolean, charMatch: boolean): void {
    switch (this.getReadingType(
      character, readOptions,
      txtToRead, isLastChar)) {
      case READING_IDENTIFIER.READ_SENTENCE:
        this.readSentence(readOptions, txtToRead, voiceID);
        break;
      case READING_IDENTIFIER.READ_WORD:
        this.readWord(readOptions, txtToRead, voiceID, isLastChar, charMatch);
        break;
      case READING_IDENTIFIER.READ_CHARACTER:
        this.readCharacterOrSound(character, readOptions, voiceID);
        break;
      default:
        break;
    }
  }

  /**
   * Triggers read character name or sound.
   *
   * @param character Represents the character to read.
   * @param readOptions Represents the read options.
   * @param voiceID Represents the voice id for the speak service.
   */
  readCharacterOrSound(character: string, readOptions: ReadOptionsDTO, voiceID: string): void {
    // Read letter name + sound only if the character is a letter.
    if (character.match(REGEX_FOR_LETTERS_WITH_DIACRITICS)) {
      if (readOptions.readLetterName) {
        this.play(character, voiceID, 'LetterName');
      } else if (readOptions.readLetterSound) {
        this.play(character, voiceID, 'LetterSound');
      }
    }
  }

  /**
   * Triggers read word.
   *
   * @param readOptions Represents the read options.
   * @param text Represents the text to read.
   * @param voiceID Represents the voice id for the speak service.
   * @param isLastChar Tells if the character is the last character of the text.
   * @param charMatch Tells if the character is a match of the text (used to disable read word when the chars do not match).
   */
  readWord(readOptions: ReadOptionsDTO, text: string, voiceID: string, isLastChar: boolean, charMatch: boolean): void {
    if (readOptions.readWord && charMatch) {
      const wordToRead = text.split(' ');
      const txt = isLastChar ? wordToRead[wordToRead.length - 1] : wordToRead[wordToRead.length - 2];
      this.play(txt, voiceID);
    }
  }

  /**
   * Triggers read sentence.
   *
   * @param readOptions Represents the read options.
   * @param text Represents the text to read.
   * @param voiceID Represents the voice id for the speak service.
   */
  readSentence(readOptions: ReadOptionsDTO, text: string, voiceID: string): void {
    if (readOptions.readWord && text.match(REGEX_FOR_LETTERS_WITH_DIACRITICS_AND_NBR)) {
      this.play(text, voiceID);
    }
  }

  /**
   * Identifies and returns the reading type based on inserted character and readOptions.
   *
   * @param character Represents the input letter.
   * @param readOptions Represents the reading options.
   * @param txtToRead Represents text that will be read.
   * @param isLastChar Tells if the character is the last character of the text.
   *
   * @returns The reading type.
   */
  getReadingType(
    character: string,
    readOptions: ReadOptionsDTO,
    txtToRead: string,
    isLastChar: boolean): string {

    // If the character contains the whiteSpace then it will add this at the end of the word to verify that user press whiteSpace or not.
    if (character === ' ') { txtToRead += character; }

    // Cleanup the object.
    const { readWord, readSentence, readLetterName, readLetterSound } = readOptions;

    // Return READ_SENTENCE If readSentence is ON and readWord is off.
    if (readSentence && this.isReadWordPatternMatch(txtToRead)) {
      if (character.match(SENTENCE_READ_REGEX)) {
        return READING_IDENTIFIER.READ_SENTENCE;
      }
    }

    // Return READ_SENTENCE if both readSentence and readWord is ON.
    if (readSentence && readWord && this.isReadSentencePatternMatch(txtToRead)) {
      if (isLastChar) {
        return READING_IDENTIFIER.READ_SENTENCE;
      }
    }

    // Return READ_WORD if readWord is ON and readSentence is OFF.
    if (readWord && this.isReadWordPatternMatch(txtToRead)) {
      if (
        character.match(SENTENCE_READ_REGEX) ||
        character.match(WORD_READ_REGEX) ||
        character.match(WHITE_SPACE_REGEX) || isLastChar
      ) {
        return READING_IDENTIFIER.READ_WORD;
      } else {
        return READING_IDENTIFIER.READ_CHARACTER;
      }
    } else if (readLetterName || readLetterSound) {
      // If no condition matches then return READ_CHARACTER.
      return READING_IDENTIFIER.READ_CHARACTER;
    }

    return '';
  }

  // TODO: Cleanup if read sentence will be removed entirely.

  /**
   * This method work as a regex expression and check the second last character of string.
   *
   * @param text Represents the last word of the sentence.
   * @returns True if second last character of the string is not end with specified condition otherwise return false.
   */
  private isReadWordPatternMatch(text: string): boolean {
    return (
      text.length > 1 && (text[text.length - 2].match(/^[.,+<>?!]+$/i))
        ? false
        : true
    );
  }

  /**
   * This method work as a regex expression and check the second last character of string.
   *
   * @param text Represents the last word of the sentence.
   *
   * @returns True if second last character of the string is not end with specified condition otherwise return false.
   */
  private isReadSentencePatternMatch(text: string): boolean {
    return (
      text.length > 1 && (text[text.length - 2].match(/^[.!?]+$/i))
        ? false
        : true
    );
  }
}
