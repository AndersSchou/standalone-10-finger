/**
 * Translation object interface.
 */
export interface TranslationsDTO {
  [key: string]: string;
}

/**
 * Translations service response.
 */
export interface TranslationsResponseDTO {
  language?: string;
  translations: TranslationsDTO;
}
