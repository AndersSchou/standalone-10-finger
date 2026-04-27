import { Component, AfterViewInit, EventEmitter, Input, OnDestroy, Output, ViewChild, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { VKeyboardComponent } from 'src/app/vkeyboard/vkeyboard.component';
import { AchievementService } from '../../services/achievement.service';
import { StatsService } from '../../services/stats.service';
import {
  FingerName,
  HandSide,
  isFingerExpectedForAnyKey,
} from '../shared/finger-indicator.util';

interface PowerRound {
  pairs: string[][]; // 4 pairs of 2 keys each
  holdDuration: number; // seconds per pair
}

interface ButtonGroup {
  name: string;
  part1: string[];
  part2: string[];
}

/** Button groups for level 2 (split parts) */
const BUTTON_GROUPS_L2: ButtonGroup[] = [
  { name: 'qwer + uiop', part1: ['Q', 'W', 'E', 'R'], part2: ['U', 'I', 'O', 'P'] },
  { name: 'asdf + jklæ', part1: ['A', 'S', 'D', 'F'], part2: ['J', 'K', 'L', 'Æ'] },
  { name: 'zxcv + ,.-', part1: ['Z', 'X', 'C', 'V'], part2: ['M', ',', '.', '-'] },
];

/** Individual rows for level 3 (left and right groups) */
interface Level3Row {
  left: string[];
  right: string[];
}

const LEVEL3_ROWS: Level3Row[] = [
  { left: ['Q', 'W', 'E', 'R'], right: ['U', 'I', 'O', 'P'] },     // Row 1
  { left: ['A', 'S', 'D', 'F'], right: ['J', 'K', 'L', 'Æ'] },     // Row 2
  { left: ['Z', 'X', 'C', 'V'], right: ['M', ',', '.', '-'] },     // Row 3
];

/** Generate valid combinations for level 3 (left and right from different rows) */
function generateLevel3Combinations(): Array<{ left: string[]; right: string[] }> {
  const combinations: Array<{ left: string[]; right: string[] }> = [];
  
  // For each row in left group, pair with different rows in right group
  for (let leftIdx = 0; leftIdx < 3; leftIdx++) {
    for (let rightIdx = 0; rightIdx < 3; rightIdx++) {
      if (leftIdx !== rightIdx) {
        combinations.push({
          left: [...LEVEL3_ROWS[leftIdx].left],
          right: [...LEVEL3_ROWS[rightIdx].right],
        });
      }
    }
  }
  
  return combinations;
}

/**
 * Power Generation minigame component.
 * Player holds key pairs sequentially to generate power.
 */
@Component({
  selector: 'app-planet10finger-power',
  templateUrl: './power.component.html',
  styleUrls: ['./power.component.scss'],
  standalone: true,
  imports: [CommonModule, VKeyboardComponent],
})
export class PowerComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild(VKeyboardComponent) vkeyboard?: VKeyboardComponent;
  @Input() coinsEarned = 0;
  @Input() difficulty: 1 | 2 | 3 = 2;
  /** Emitted when the user closes the training-complete screen. */
  @Output() gameClose = new EventEmitter<void>();

  powerRounds: PowerRound[] = [];
  allPairs: string[][] = [];
  currentPairIndex = 0;
  heldKeys = new Set<string>();
  holdProgress = 0;
  holdDuration = 2;
  roundsCompleted = 0;
  totalRounds = 6;
  roundSuccess = false;
  trainingComplete = false;
  wrongPressCount = 0;
  isCountingWrong = true;
  batteryEarned = 3;

  private holdInterval: ReturnType<typeof setInterval> | null = null;
  private holdStart: number | null = null;
  private cooldownTimer: ReturnType<typeof setTimeout> | null = null;
  private keydownListener: ((e: KeyboardEvent) => void) | null = null;
  private keyupListener: ((e: KeyboardEvent) => void) | null = null;
  private remainingRoundIndices: number[] = [];

  constructor(
    private readonly http: HttpClient,
    private readonly achievementService: AchievementService,
    private readonly statsService: StatsService
  ) {}

  ngOnInit(): void {
    this.startPowerGame();
  }

  ngAfterViewInit(): void {
    this.vkeyboard?.setTheme('color-group');
    this.vkeyboard?.setMode('partial');
  }

  // ── Public helpers for template ───────────────────────────

  get currentKeys(): string[] {
    return this.allPairs[this.currentPairIndex] ?? [];
  }

  isPairDone(pairIdx: number): boolean {
    return pairIdx < this.currentPairIndex ||
      (this.roundSuccess && pairIdx === this.currentPairIndex);
  }

  isPairActive(pairIdx: number): boolean {
    return !this.roundSuccess && pairIdx === this.currentPairIndex;
  }

  isKeyHeld(key: string): boolean {
    return this.heldKeys.has(key.toUpperCase());
  }

  isFingerExpected(hand: HandSide, finger: FingerName): boolean {
    if (this.roundSuccess) return false;
    return isFingerExpectedForAnyKey(this.currentKeys, hand, finger);
  }

  close(): void {
    this.gameClose.emit();
  }

  restartGame(): void {
    this.trainingComplete = false;
    this.detachKeyListeners();
    this.startPowerGame();
  }

  // ── Game lifecycle ────────────────────────────────────────

  private startPowerGame(): void {
    this.roundsCompleted = 0;
    this.trainingComplete = false;
    this.wrongPressCount = 0;
    
    // Set total rounds to 6 for all difficulties
    this.totalRounds = 6;
    
    // For difficulty 1, load JSON; for others, use button groups
    if (this.difficulty === 1) {
      this.http
        .get<{ rounds: PowerRound[] }>('assets/games/power-generation.json')
        .subscribe((data) => {
          this.powerRounds = data.rounds;
          this.totalRounds = Math.min(this.totalRounds, this.powerRounds.length);
          this.remainingRoundIndices = this.getRandomRoundOrder().slice(
            0,
            this.totalRounds
          );
          this.pickNewRound();
          this.attachKeyListeners();
        });
    } else if (this.difficulty === 2) {
      // For level 2, use alternating pairs from button groups
      this.remainingRoundIndices = this.generateLevel2Sequence();
      this.pickNewRound();
      this.attachKeyListeners();
    } else {
      // For level 3, use left+right combinations from different rows
      this.remainingRoundIndices = this.generateLevel3Sequence();
      this.pickNewRound();
      this.attachKeyListeners();
    }
  }

  private pickNewRound(): void {
    this.clearHoldTimer();
    this.clearCooldownTimer();
    this.heldKeys = new Set();
    this.holdProgress = 0;
    this.roundSuccess = false;
    this.currentPairIndex = 0;
    this.isCountingWrong = true;

    if (this.remainingRoundIndices.length === 0) {
      this.trainingComplete = true;
      this.detachKeyListeners();
      return;
    }

    // For difficulty 1, ALWAYS use JSON data (never button groups)
    if (this.difficulty === 1) {
      const idx = this.remainingRoundIndices.shift() ?? 0;
      this.allPairs = this.powerRounds[idx].pairs;
      this.holdDuration = 1; // Override to 1 second for all levels
    } else if (this.difficulty === 2) {
      // For level 2, use split button groups with alternating pair logic
      const groupIdx = this.remainingRoundIndices.shift() ?? 0;
      const selectedGroup = BUTTON_GROUPS_L2[groupIdx % BUTTON_GROUPS_L2.length];
      this.allPairs = this.generatePairsFromSplitGroup(selectedGroup);
      this.holdDuration = 1; // 1 second for all levels
    } else {
      // For level 3, use left+right groups from different rows
      const combIdx = this.remainingRoundIndices.shift() ?? 0;
      const allCombinations = generateLevel3Combinations();
      const selectedCombination = allCombinations[combIdx % allCombinations.length];
      this.allPairs = this.generatePairsFromLevel3Combination(selectedCombination);
      this.holdDuration = 1; // 1 second for all levels
    }
  }

  /** Generate a sequence of button group indices for level 2 (each group 2x) */
  private generateLevel2Sequence(): number[] {
    const sequence: number[] = [];
    const timesPerGroup = 2;
    
    // Create array with each group index appearing timesPerGroup times
    for (let groupIdx = 0; groupIdx < BUTTON_GROUPS_L2.length; groupIdx++) {
      for (let i = 0; i < timesPerGroup; i++) {
        sequence.push(groupIdx);
      }
    }
    
    // Shuffle the sequence
    return this.shuffleArray(sequence);
  }

  /** Generate a sequence of combinations for level 3 (6 rounds total) */
  private generateLevel3Sequence(): number[] {
    const allCombinations = generateLevel3Combinations();
    const sequence: number[] = [];
    
    // We have 6 valid combinations (3 rows × 2 other rows per left group)
    // For 6 rounds, simply shuffle and use all 6
    for (let i = 0; i < allCombinations.length; i++) {
      sequence.push(i);
    }
    
    // Shuffle the sequence
    return this.shuffleArray(sequence);
  }

  /** Generate a sequence of button group indices (deprecated - use level2Sequence or level3Sequence) */
  private generateButtonGroupSequence(): number[] {
    const sequence: number[] = [];
    const timesPerGroup = this.difficulty === 1 ? 1 : this.difficulty === 3 ? 3 : 2;
    
    // Create array with each group index appearing timesPerGroup times
    for (let groupIdx = 0; groupIdx < BUTTON_GROUPS_L2.length; groupIdx++) {
      for (let i = 0; i < timesPerGroup; i++) {
        sequence.push(groupIdx);
      }
    }
    
    // Shuffle the sequence
    return this.shuffleArray(sequence);
  }

  /** Fisher-Yates shuffle for a random, non-repeating round order (for difficulty 1) */
  private getRandomRoundOrder(): number[] {
    const indices = this.powerRounds.map((_, idx) => idx);
    for (let i = indices.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [indices[i], indices[j]] = [indices[j], indices[i]];
    }
    return indices;
  }

  /** Generate 4 random pairs from split button group (for level 2) */
  private generatePairsFromSplitGroup(group: ButtonGroup): string[][] {
    // Copy and shuffle each part independently
    const part1 = this.shuffleArray([...group.part1]);
    const part2 = this.shuffleArray([...group.part2]);
    
    // Take first 2 from each, then remaining 2 from each
    return [
      [part1[0], part1[1]],  // First 2 from part1
      [part2[0], part2[1]],  // First 2 from part2
      [part1[2], part1[3]],  // Remaining 2 from part1
      [part2[2], part2[3]],  // Remaining 2 from part2
    ];
  }

  /** Generate 4 random pairs from left+right groups (for level 3) */
  private generatePairsFromLevel3Combination(combination: { left: string[]; right: string[] }): string[][] {
    // Shuffle left and right separately
    const left = this.shuffleArray([...combination.left]);
    const right = this.shuffleArray([...combination.right]);
    
    // Take first 2 from each, then remaining 2 from each
    return [
      [left[0], left[1]],     // First 2 from left
      [right[0], right[1]],   // First 2 from right
      [left[2], left[3]],     // Remaining 2 from left
      [right[2], right[3]],   // Remaining 2 from right
    ];
  }

  /** Generate 4 random pairs from all keys in a group (deprecated) */
  private generatePairsFromAllKeys(keys: string[]): string[][] {
    const pairs: string[][] = [];
    for (let i = 0; i < 4; i++) {
      // Pick 2 random different keys
      const key1Idx = Math.floor(Math.random() * keys.length);
      let key2Idx = Math.floor(Math.random() * keys.length);
      
      // Ensure we pick 2 different keys
      while (key2Idx === key1Idx && keys.length > 1) {
        key2Idx = Math.floor(Math.random() * keys.length);
      }
      
      pairs.push([keys[key1Idx], keys[key2Idx]]);
    }
    return pairs;
  }

  /** Fisher-Yates shuffle for arrays */
  private shuffleArray<T>(array: T[]): T[] {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  private get allKeysHeld(): boolean {
    return this.currentKeys.every((k) => this.heldKeys.has(k.toUpperCase()));
  }

  // ── Key listeners ─────────────────────────────────────────

  private attachKeyListeners(): void {
    const readyAt = Date.now() + 400;
    this.keydownListener = (e: KeyboardEvent) => {
      if (Date.now() < readyAt) return;
      const key = e.key.toUpperCase();
      if (this.currentKeys.includes(key) && !this.heldKeys.has(key)) {
        const next = new Set(this.heldKeys);
        next.add(key);
        this.heldKeys = next;
        if (this.allKeysHeld) {
          this.startHoldTimer();
        }
      } else if (!this.currentKeys.includes(key) && this.currentKeys.length > 0) {
        // Wrong key pressed (only count if not in cooldown period)
        if (this.isCountingWrong) {
          this.wrongPressCount++;
        }
      }
    };
    this.keyupListener = (e: KeyboardEvent) => {
      const key = e.key.toUpperCase();
      if (this.heldKeys.has(key)) {
        const next = new Set(this.heldKeys);
        next.delete(key);
        this.heldKeys = next;
        this.clearHoldTimer();
        this.holdProgress = 0;
      }
    };
    document.addEventListener('keydown', this.keydownListener);
    document.addEventListener('keyup', this.keyupListener);
  }

  private detachKeyListeners(): void {
    if (this.keydownListener)
      document.removeEventListener('keydown', this.keydownListener);
    if (this.keyupListener)
      document.removeEventListener('keyup', this.keyupListener);
    this.keydownListener = null;
    this.keyupListener = null;
  }

  // ── Hold timer ────────────────────────────────────────────

  private startHoldTimer(): void {
    this.holdStart = Date.now();
    const totalMs = this.holdDuration * 1000;
    this.holdInterval = setInterval(() => {
      const elapsed = Date.now() - (this.holdStart ?? Date.now());
      this.holdProgress = Math.min((elapsed / totalMs) * 100, 100);
      if (this.holdProgress >= 100) {
        this.clearHoldTimer();
        this.heldKeys = new Set();
        this.holdProgress = 0;
        // Start cooldown period where wrong presses don't count
        this.startCooldownPeriod();
        if (this.currentPairIndex < this.allPairs.length - 1) {
          this.currentPairIndex++;
        } else {
          this.roundsCompleted++;
          this.roundSuccess = true;
          if (this.roundsCompleted >= this.totalRounds) {
            this.trainingComplete = true;
            this.detachKeyListeners();
            // Record game completion
            this.statsService.recordGameCompletion('power', { 
              isPerfect: this.wrongPressCount === 0,
              difficulty: this.difficulty
            });
            // Unlock achievements
            this.achievementService.unlockAchievement(`power_lvl${this.difficulty}_complete`);
            if (this.wrongPressCount === 0) {
              this.achievementService.unlockAchievement(`power_lvl${this.difficulty}_perfect`);
            }
          } else {
            setTimeout(() => this.pickNewRound(), 900);
          }
        }
      }
    }, 50);
  }

  private clearHoldTimer(): void {
    if (this.holdInterval !== null) {
      clearInterval(this.holdInterval);
      this.holdInterval = null;
    }
    this.holdStart = null;
  }

  private startCooldownPeriod(): void {
    this.isCountingWrong = false;
    if (this.cooldownTimer) {
      clearTimeout(this.cooldownTimer);
    }
    this.cooldownTimer = setTimeout(() => {
      this.isCountingWrong = true;
      this.cooldownTimer = null;
    }, 1000); // 1 second cooldown
  }

  private clearCooldownTimer(): void {
    if (this.cooldownTimer) {
      clearTimeout(this.cooldownTimer);
      this.cooldownTimer = null;
    }
  }

  ngOnDestroy(): void {
    this.clearHoldTimer();
    this.clearCooldownTimer();
    this.detachKeyListeners();
  }
}
