import { Injectable } from '@angular/core';

export interface GameStats {
  gameId: 'power' | 'oxygen' | 'meteor' | 'factory' | 'assembling';
  gameName: string;
  timesPlayed: number;
  averageScore?: number;
  averageWPM?: number;
  accuracyRate?: number;
}

interface StatsData {
  [gameId: string]: {
    timesPlayed: number;
    totalScore?: number;
    totalWPM?: number;
    totalAttempts?: number;
    correctTyped?: number;
    totalTyped?: number;
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
  }): void {
    if (!this.stats[gameId]) {
      this.stats[gameId] = {
        timesPlayed: 0,
      };
    }

    this.stats[gameId].timesPlayed++;

    if (data?.score !== undefined) {
      this.stats[gameId].totalScore = (this.stats[gameId].totalScore ?? 0) + data.score;
    }

    if (data?.wpm !== undefined) {
      this.stats[gameId].totalWPM = (this.stats[gameId].totalWPM ?? 0) + data.wpm;
      this.stats[gameId].totalAttempts = (this.stats[gameId].totalAttempts ?? 0) + 1;
    }

    if (data?.correctTyped !== undefined && data?.totalTyped !== undefined) {
      this.stats[gameId].correctTyped = (this.stats[gameId].correctTyped ?? 0) + data.correctTyped;
      this.stats[gameId].totalTyped = (this.stats[gameId].totalTyped ?? 0) + data.totalTyped;
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

      if (data?.totalScore !== undefined && data?.timesPlayed > 0) {
        stats.averageScore = data.totalScore / data.timesPlayed;
      }

      if (data?.totalWPM !== undefined && data?.totalAttempts && data.totalAttempts > 0) {
        stats.averageWPM = data.totalWPM / data.totalAttempts;
      }

      if (data?.correctTyped !== undefined && data?.totalTyped !== undefined && data.totalTyped > 0) {
        stats.accuracyRate = (data.correctTyped / data.totalTyped) * 100;
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

    if (data?.totalScore !== undefined && data?.timesPlayed > 0) {
      stats.averageScore = data.totalScore / data.timesPlayed;
    }

    if (data?.totalWPM !== undefined && data?.totalAttempts && data.totalAttempts > 0) {
      stats.averageWPM = data.totalWPM / data.totalAttempts;
    }

    if (data?.correctTyped !== undefined && data?.totalTyped !== undefined && data.totalTyped > 0) {
      stats.accuracyRate = (data.correctTyped / data.totalTyped) * 100;
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
