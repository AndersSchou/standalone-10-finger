/**
 * Expected body format for speak request.
 */
export interface SpeakBodyDTO {
  format: string;
  speed: number;
  text: string;
  type: string;
  voiceID: string;
}

/**
 * Response format for TTS request.
 */
export interface SpeakResultDTO {
  // Relative url for audio file used for speech.
  soundLink: string;
  // List of SpeakTimestamps.
  speakTimestamps: Array<SpeakTimestampDTO>;
}

/**
 * Speak timestamp format.
 */
export interface SpeakTimestampDTO {
  // Start time for the given range.
  time: number;
  // First letter/character of word that is highlighted.
  start: number;
  // Length of the word that is highlighted.
  length: number;
}

/**
 * Read options interface.
 */
export interface ReadOptionsDTO {
  readLetterName: boolean;
  readLetterSound: boolean;
  readWord: boolean;
}
