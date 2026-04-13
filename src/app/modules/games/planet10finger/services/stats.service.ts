import { Injectable } from '@angular/core';

export interface GameStats {
  gameId: 'power' | 'oxygen' | 'meteor' | 'factory' | 'assembling';
  gameName: string;
  timesPlayed: number;
  perfectGameCount?: number;      // Power, Oxygen, Factory, Assembling (total)
  perfectGameCountByDifficulty?: { [key: number]: number };  // Perfect games per difficulty (1, 2, 3)
  bestScore?: number;              // Meteor (total)
  bestScoreByDifficulty?: { [key: number]: number };  // Best scores per difficulty (1, 2, 3)
  bestWPM?: number;                // Factory, Assembling
  timePlayed?: number;             // Factory, Assembling (in minutes)
}

interface StatsData {
  [gameId: string]: {
    timesPlayed: number;
    perfectGameCount?: number;
    perfectGameCountByDifficulty?: { [key: number]: number };
    bestScore?: number;
    bestScoreByDifficulty?: { [key: number]: number };
    gameStartTime?: number;         // For calculating time played
    bestWPMWithPerfectAccuracy?: number;
  };
}

@Injectable({
  providedIn: 'root',
})
export class StatsService {
  private stats: StatsData = {};
  private readonly STORAGE_KEY = 'planet10finger_stats';

  private gameNames: { [key: string]: string } = {
    power: 'Strøm',
    oxygen: 'Ilt',
    meteor: 'Meteor forsvar',
    factory: 'Fabrikken',
    assembling: 'Samle Hangaren',
  };

  constructor() {
    this.loadStats();
  }

  /**
   * Record a game completion with stats
   */
  recordGameCompletion(gameId: 'power' | 'oxygen' | 'meteor' | 'factory' | 'assembling', data?: {
    score?: number;
    wpm?: number;
    correctTyped?: number;
    totalTyped?: number;
    isPerfect?: boolean;
    elapsedSeconds?: number;
    difficulty?: 1 | 2 | 3;
  }): void {
    if (!this.stats[gameId]) {
      this.stats[gameId] = {
        timesPlayed: 0,
      };
    }

    this.stats[gameId].timesPlayed++;

    // Track perfect games (Power, Oxygen, Factory, Assembling)
    if (data?.isPerfect) {
      this.stats[gameId].perfectGameCount = (this.stats[gameId].perfectGameCount ?? 0) + 1;
      
      // Track perfect games by difficulty
      if (data.difficulty) {
        if (!this.stats[gameId].perfectGameCountByDifficulty) {
          this.stats[gameId].perfectGameCountByDifficulty = {};
        }
        this.stats[gameId].perfectGameCountByDifficulty![data.difficulty] = 
          (this.stats[gameId].perfectGameCountByDifficulty![data.difficulty] ?? 0) + 1;
      }
    } else if (!data?.isPerfect && (gameId === 'power' || gameId === 'oxygen' || gameId === 'factory' || gameId === 'assembling')) {
      // Initialize to 0 if not perfect
      if (this.stats[gameId].perfectGameCount === undefined) {
        this.stats[gameId].perfectGameCount = 0;
      }
    }

    // Track best meteor score
    if (data?.score !== undefined && gameId === 'meteor') {
      this.stats[gameId].bestScore = Math.max(this.stats[gameId].bestScore ?? 0, data.score);
      
      // Track best meteor score by difficulty
      if (data.difficulty) {
        if (!this.stats[gameId].bestScoreByDifficulty) {
          this.stats[gameId].bestScoreByDifficulty = {};
        }
        this.stats[gameId].bestScoreByDifficulty![data.difficulty] = Math.max(
          this.stats[gameId].bestScoreByDifficulty![data.difficulty] ?? 0,
          data.score
        );
      }
    }

    // Track best WPM with perfect accuracy (Factory, Assembling)
    if (data?.wpm !== undefined && data?.correctTyped !== undefined && data?.totalTyped !== undefined) {
      const accuracy = (data.correctTyped / data.totalTyped) * 100;
      if (accuracy === 100) {
        this.stats[gameId].bestWPMWithPerfectAccuracy = Math.max(
          this.stats[gameId].bestWPMWithPerfectAccuracy ?? 0, 
          data.wpm
        );
      }
    }

    // Track time played (Factory, Assembling)
    if (data?.elapsedSeconds !== undefined) {
      const minutes = data.elapsedSeconds / 60;
      this.stats[gameId].gameStartTime = (this.stats[gameId].gameStartTime ?? 0) + minutes;
    }

    this.saveStats();
  }

  /**
   * Get stats for all games
   */
  getAllStats(): GameStats[] {
    return Object.keys(this.gameNames).map((gameId) => {
      const data = this.stats[gameId];
      const stats: GameStats = {
        gameId: gameId as 'power' | 'oxygen' | 'meteor' | 'factory' | 'assembling',
        gameName: this.gameNames[gameId],
        timesPlayed: data?.timesPlayed ?? 0,
      };

      // Power, Oxygen, Factory, and Assembling: always show perfect game count
      if (gameId === 'power' || gameId === 'oxygen' || gameId === 'factory' || gameId === 'assembling') {
        stats.perfectGameCount = data?.perfectGameCount ?? 0;
        stats.perfectGameCountByDifficulty = data?.perfectGameCountByDifficulty ?? { 1: 0, 2: 0, 3: 0 };
      }

      // Meteor: show best score
      if (gameId === 'meteor') {
        stats.bestScore = data?.bestScore ?? 0;
        stats.bestScoreByDifficulty = data?.bestScoreByDifficulty ?? { 1: 0, 2: 0, 3: 0 };
      }

      // Factory and Assembling: show best WPM with perfect accuracy and time played
      if ((gameId === 'factory' || gameId === 'assembling') && data?.bestWPMWithPerfectAccuracy) {
        stats.bestWPM = data.bestWPMWithPerfectAccuracy;
      }
      if ((gameId === 'factory' || gameId === 'assembling') && data?.gameStartTime) {
        stats.timePlayed = data.gameStartTime;
      }

      return stats;
    });
  }

  /**
   * Get stats for a specific game
   */
  getGameStats(gameId: 'power' | 'oxygen' | 'meteor' | 'factory' | 'assembling'): GameStats {
    const data = this.stats[gameId];
    const stats: GameStats = {
      gameId,
      gameName: this.gameNames[gameId],
      timesPlayed: data?.timesPlayed ?? 0,
    };

    // Power, Oxygen, Factory, and Assembling: always show perfect game count
    if (gameId === 'power' || gameId === 'oxygen' || gameId === 'factory' || gameId === 'assembling') {
      stats.perfectGameCount = data?.perfectGameCount ?? 0;
      stats.perfectGameCountByDifficulty = data?.perfectGameCountByDifficulty ?? { 1: 0, 2: 0, 3: 0 };
    }

    // Meteor: show best score
    if (gameId === 'meteor') {
      stats.bestScore = data?.bestScore ?? 0;
      stats.bestScoreByDifficulty = data?.bestScoreByDifficulty ?? { 1: 0, 2: 0, 3: 0 };
    }

    // Factory and Assembling: show best WPM with perfect accuracy and time played
    if ((gameId === 'factory' || gameId === 'assembling') && data?.bestWPMWithPerfectAccuracy) {
      stats.bestWPM = data.bestWPMWithPerfectAccuracy;
    }
    if ((gameId === 'factory' || gameId === 'assembling') && data?.gameStartTime) {
      stats.timePlayed = data.gameStartTime;
    }

    return stats;
  }

  /**
   * Get total times played across all games
   */
  getTotalTimesPlayed(): number {
    return Object.values(this.stats).reduce((sum, stat) => sum + (stat.timesPlayed ?? 0), 0);
  }

  private saveStats(): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.stats));
  }

  private loadStats(): void {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    if (stored) {
      this.stats = JSON.parse(stored) as StatsData;
    }
  }

  /**
   * Reset all stats (for testing purposes)
   */
  resetStats(): void {
    this.stats = {};
    localStorage.removeItem(this.STORAGE_KEY);
  }
}
