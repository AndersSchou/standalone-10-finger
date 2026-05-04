export type HandSide = 'left' | 'right';
export type FingerName = 'pinky' | 'ring' | 'middle' | 'index';

const FINGER_KEY_MAP: Record<HandSide, Record<FingerName, Set<string>>> = {
  left: {
    pinky: new Set(['1', 'Q', 'A', 'Z', '½']),
    ring: new Set(['2', 'W', 'S', 'X']),
    middle: new Set(['3', 'E', 'D', 'C']),
    index: new Set(['4', 'R', 'F', 'V', '5', 'T', 'G', 'B']),
  },
  right: {
    index: new Set(['6', 'Y', 'H', 'N', '7', 'U', 'J', 'M']),
    middle: new Set(['8', 'I', 'K', ',']),
    ring: new Set(['9', 'O', 'L', '.']),
    pinky: new Set(['0', 'P', 'Æ', '-', 'Å', 'Ø', '+', '´', '¨', "'"]),
  },
};

function normalizeKey(key: string): string {
  return key.toUpperCase();
}

export function isFingerExpectedForKey(
  expectedKey: string | undefined,
  hand: HandSide,
  finger: FingerName
): boolean {
  if (!expectedKey || expectedKey === ' ') return false;
  return FINGER_KEY_MAP[hand][finger].has(normalizeKey(expectedKey));
}

export function isFingerExpectedForAnyKey(
  expectedKeys: string[],
  hand: HandSide,
  finger: FingerName
): boolean {
  return expectedKeys.some((key) =>
    isFingerExpectedForKey(key, hand, finger)
  );
}
