import { Injectable } from '@angular/core';

export const CHARACTER_COST = 25; // Cost in coins per character

export interface Character {
  id: string;
  label: string;
  imagePath: string;
}

@Injectable({
  providedIn: 'root'
})
export class CharacterCustomizationService {
  private readonly PURCHASED_CHARACTERS_KEY = 'planet10finger_purchased_characters';
  private readonly PLACED_CHARACTERS_KEY = 'planet10finger_placed_characters';
  private readonly CHARACTER_POSITIONS_KEY = 'planet10finger_character_positions';
  private readonly MAX_CHARACTER_POSITIONS = 5;

  readonly characters: Character[] = [
    { id: 'astro_dog', label: 'Astro Hund', imagePath: 'assets/png/astro dog.png' },
    { id: 'astro_cat', label: 'Astro Kat', imagePath: 'assets/png/astro cat.png' },
    { id: 'astro_man', label: 'Astro Mand', imagePath: 'assets/png/astro man.png' },
    { id: 'astro_tree', label: 'Astro Træ', imagePath: 'assets/png/astro tree.png' },
  ];

  constructor() {}

  /**
   * Get all purchased characters from localStorage.
   */
  getPurchasedCharacters(): string[] {
    const saved = localStorage.getItem(this.PURCHASED_CHARACTERS_KEY);
    return saved ? JSON.parse(saved) : [];
  }

  /**
   * Check if a character is purchased.
   */
  isCharacterPurchased(characterId: string): boolean {
    return this.getPurchasedCharacters().includes(characterId);
  }

  /**
   * Add a purchased character and save to localStorage.
   * Automatically places the character in the hub for visibility.
   */
  purchaseCharacter(characterId: string): void {
    const purchased = this.getPurchasedCharacters();
    if (!purchased.includes(characterId)) {
      purchased.push(characterId);
      localStorage.setItem(this.PURCHASED_CHARACTERS_KEY, JSON.stringify(purchased));
      // Automatically place the character when purchased
      this.placeCharacter(characterId);
    }
  }

  /**
   * Get placed characters from localStorage.
   * Returns an array of character IDs that have been placed.
   */
  getPlacedCharacters(): string[] {
    const saved = localStorage.getItem(this.PLACED_CHARACTERS_KEY);
    return saved ? JSON.parse(saved) : [];
  }

  /**
   * Place a character and save to localStorage.
   */
  placeCharacter(characterId: string): void {
    const placed = this.getPlacedCharacters();
    if (!placed.includes(characterId)) {
      placed.push(characterId);
      localStorage.setItem(this.PLACED_CHARACTERS_KEY, JSON.stringify(placed));
    }
  }

  /**
   * Remove a placed character from localStorage.
   */
  removeCharacter(characterId: string): void {
    const placed = this.getPlacedCharacters();
    const filtered = placed.filter(id => id !== characterId);
    localStorage.setItem(this.PLACED_CHARACTERS_KEY, JSON.stringify(filtered));
  }

  /**
   * Get character positions map from localStorage.
   * Maps character ID to position index (0-4).
   */
  getCharacterPositions(): Record<string, number> {
    const saved = localStorage.getItem(this.CHARACTER_POSITIONS_KEY);
    return saved ? JSON.parse(saved) : {};
  }

  /**
   * Move a character to the next available position.
   * If already placed, cycles to the next position; otherwise places at first available.
   */
  moveCharacterToNextPosition(characterId: string): void {
    const placed = this.getPlacedCharacters();
    const positions = this.getCharacterPositions();

    // If character is not placed, place it at position 0
    if (!placed.includes(characterId)) {
      placed.push(characterId);
      positions[characterId] = 0;
      localStorage.setItem(this.PLACED_CHARACTERS_KEY, JSON.stringify(placed));
      localStorage.setItem(this.CHARACTER_POSITIONS_KEY, JSON.stringify(positions));
      return;
    }

    // If already placed, move to next position (cycle through 0-4)
    const currentPos = positions[characterId] ?? 0;
    const nextPos = (currentPos + 1) % this.MAX_CHARACTER_POSITIONS;
    positions[characterId] = nextPos;
    localStorage.setItem(this.CHARACTER_POSITIONS_KEY, JSON.stringify(positions));
  }

  /**
   * Get the position of a character.
   */
  getCharacterPosition(characterId: string): number {
    const positions = this.getCharacterPositions();
    return positions[characterId] ?? 0;
  }

  /**
   * Get character details by ID.
   */
  getCharacterById(characterId: string): Character | undefined {
    return this.characters.find(c => c.id === characterId);
  }

  /**
   * Get all character objects that have been purchased.
   */
  getPurchasedCharacterObjects(): Character[] {
    const purchased = this.getPurchasedCharacters();
    return this.characters.filter(c => purchased.includes(c.id));
  }

  /**
   * Get all character objects that have been placed.
   * Sorted by position to maintain correct grid layout.
   */
  getPlacedCharacterObjects(): Character[] {
    const placed = this.getPlacedCharacters();
    const positions = this.getCharacterPositions();
    
    // Filter characters that are placed and sort by position
    const placedChars = this.characters.filter(c => placed.includes(c.id));
    return placedChars.sort((a, b) => {
      const posA = positions[a.id] ?? 0;
      const posB = positions[b.id] ?? 0;
      return posA - posB;
    });
  }
}
