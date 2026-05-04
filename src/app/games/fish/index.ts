import { nl } from './nl-NL';
import { nn } from './nn-NO';
import { nb } from './nb-NO';
import { sv } from './sv-SE';
import { da } from './da-DK';

// Default fish game based on selected language.
export const FishGame: { [key: string]: any } = {
  da,
  sv,
  nb,
  nn,
  nl
};
