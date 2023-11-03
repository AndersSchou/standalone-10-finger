import { nl } from './nl-NL';
import { nb } from './nb-NO';
import { nn } from './nn-NO';
import { sv } from './sv-SE';
import { da } from './da-DK';

// Default course based on selected language.
export const Courses: { [key: string]: any } = {
  da,
  sv,
  nb,
  nn,
  nl
};
