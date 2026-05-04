/**
 * Settings DTO.
 */
export interface KeyboardSettingsDTO {
  type: string;
  icon?: string;
  label?: string;
  selected: boolean;
}

/**
 * Text size settings DTO.
 */
export interface TextSettingsSizeDTO {
  fontSize: string;
  fontFamily: string;
}

/**
 * Create an empty text settings size DTO.
 *
 * @returns A empty text settings size DTO.
 */
export function createEmptyTextSettingsSizeDTO(): TextSettingsSizeDTO {
  return {
    fontSize: '',
    fontFamily: '',
  };
}
