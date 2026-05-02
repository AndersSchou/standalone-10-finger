import { Injectable } from '@angular/core';

export interface DailyGamePerformance {
  gameId: string;
  gameName: string;
  bestScore?: number;
  bestWPM?: number;
  perfectGames?: number;
  timesPlayed?: number;
  date: string;
  completionTimes?: number[];
  scores?: number[];
  averageCompletionTime?: number;
  averageDailyScore?: number;
}

interface SessionData {
  loginCount: number;
  totalMinutesSpent: number;
  dailyPerformance: DailyGamePerformance[];
  lastLoginDate: string;
  sessionStartTime: number;
}

@Injectable({
  providedIn: 'root',
})
export class UserSessionService {
  private sessionData: SessionData = {
    loginCount: 0,
    totalMinutesSpent: 0,
    dailyPerformance: [],
    lastLoginDate: '',
    sessionStartTime: 0,
  };
  private readonly STORAGE_KEY = 'planet10finger_user_session';
  private readonly SESSION_TIMEOUT = 60 * 60 * 1000; // 60 minutes of inactivity
  private sessionStartTime: number = 0;
  private activityTimeout: any;

  private gameNames: { [key: string]: string } = {
    power: 'Strøm',
    oxygen: 'Ilt',
    meteor: 'Meteor forsvar',
    factory: 'Fabrikken',
    assembling: 'Samle Hangaren',
    moonrace: 'Måneræs',
  };

  constructor() {
    this.loadSessionData();
    this.initializeSession();
  }

  /**
   * Initialize a new session or continue existing one
   */
  private initializeSession(): void {
    const now = new Date();
    const today = now.toISOString().split('T')[0];

    // Check if this is a new login (different day or new user)
    if (this.sessionData.lastLoginDate !== today) {
      this.sessionData.loginCount++;
      this.sessionData.lastLoginDate = today;
      // Reset daily performance when new day starts
      this.sessionData.dailyPerformance = this.sessionData.dailyPerformance.filter(
        p => p.date === today
      );
    }

    this.sessionStartTime = Date.now();
    this.setupActivityTracking();
    this.saveSessionData();
  }

  /**
   * Setup activity tracking to calculate time spent
   */
  private setupActivityTracking(): void {
    if (this.activityTimeout) {
      clearInterval(this.activityTimeout);
    }

    // Update session data every minute
    this.activityTimeout = setInterval(() => {
      const elapsedMinutes = Math.floor((Date.now() - this.sessionStartTime) / (1000 * 60));
      const today = new Date().toISOString().split('T')[0];
      
      // Only count time spent today
      const todayPerformance = this.sessionData.dailyPerformance.filter(p => p.date === today);
      if (todayPerformance.length > 0 || elapsedMinutes > 0) {
        this.sessionData.totalMinutesSpent += 1;
        this.saveSessionData();
      }
    }, 60000); // Update every minute
  }

  /**
   * Record game performance (daily best)
   */
  recordDailyGamePerformance(
    gameId: string,
    gameName: string,
    performanceData: {
      score?: number;
      wpm?: number;
      isPerfect?: boolean;
      completionTimeSeconds?: number;
    }
  ): void {
    const today = new Date().toISOString().split('T')[0];

    // Find or create performance record for today
    let performanceRecord = this.sessionData.dailyPerformance.find(
      p => p.gameId === gameId && p.date === today
    );

    if (!performanceRecord) {
      performanceRecord = {
        gameId,
        gameName,
        date: today,
        completionTimes: [],
        scores: [],
      };
      this.sessionData.dailyPerformance.push(performanceRecord);
    }

    // Initialize arrays if not present
    if (!performanceRecord.completionTimes) {
      performanceRecord.completionTimes = [];
    }
    if (!performanceRecord.scores) {
      performanceRecord.scores = [];
    }

    // Track completion time
    if (performanceData.completionTimeSeconds !== undefined) {
      performanceRecord.completionTimes.push(performanceData.completionTimeSeconds);
      performanceRecord.averageCompletionTime =
        performanceRecord.completionTimes.reduce((a, b) => a + b, 0) /
        performanceRecord.completionTimes.length;
    }

    // Update best score
    if (performanceData.score !== undefined) {
      performanceRecord.scores.push(performanceData.score);
      performanceRecord.bestScore = Math.max(
        performanceRecord.bestScore ?? 0,
        performanceData.score
      );
      performanceRecord.averageDailyScore =
        performanceRecord.scores.reduce((a, b) => a + b, 0) /
        performanceRecord.scores.length;
    }

    // Update best WPM
    if (performanceData.wpm !== undefined) {
      performanceRecord.bestWPM = Math.max(
        performanceRecord.bestWPM ?? 0,
        performanceData.wpm
      );
    }

    // Track perfect games
    if (performanceData.isPerfect) {
      performanceRecord.perfectGames = (performanceRecord.perfectGames ?? 0) + 1;
    }

    // Track times played
    performanceRecord.timesPlayed = (performanceRecord.timesPlayed ?? 0) + 1;

    this.saveSessionData();
  }

  /**
   * Get login count
   */
  getLoginCount(): number {
    return this.sessionData.loginCount;
  }

  /**
   * Get total time spent in minutes
   */
  getTotalMinutesSpent(): number {
    return this.sessionData.totalMinutesSpent;
  }

  /**
   * Get formatted time spent (e.g., "2h 30m")
   */
  getFormattedTimeSpent(): string {
    const minutes = this.sessionData.totalMinutesSpent;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;

    if (hours > 0) {
      return `${hours}t ${mins}m`;
    }
    return `${mins}m`;
  }

  /**
   * Get today's performance summary
   */
  getTodayPerformance(): DailyGamePerformance[] {
    const today = new Date().toISOString().split('T')[0];
    return this.sessionData.dailyPerformance.filter(p => p.date === today);
  }

  /**
   * Get all daily performance records
   */
  getAllDailyPerformance(): DailyGamePerformance[] {
    return this.sessionData.dailyPerformance;
  }

  /**
   * Get average completion time for a game across all days (in seconds)
   */
  getAverageCompletionTimeByGame(gameId: string): number {
    const records = this.sessionData.dailyPerformance.filter(
      p => p.gameId === gameId && p.completionTimes && p.completionTimes.length > 0
    );
    
    if (records.length === 0) return 0;

    const totalSeconds = records.reduce((sum, r) => {
      const dailyAverage = r.averageCompletionTime || 0;
      return sum + dailyAverage;
    }, 0);

    return totalSeconds / records.length;
  }

  /**
   * Get average daily score for a game across all days
   */
  getAverageDailyScoreByGame(gameId: string): number {
    const records = this.sessionData.dailyPerformance.filter(
      p => p.gameId === gameId && p.scores && p.scores.length > 0
    );
    
    if (records.length === 0) return 0;

    const totalScore = records.reduce((sum, r) => {
      const dailyAverage = r.averageDailyScore || 0;
      return sum + dailyAverage;
    }, 0);

    return totalScore / records.length;
  }

  /**
   * Get all games with their average completion times and scores
   */
  getGameAveragesTable(): Array<{
    gameId: string;
    gameName: string;
    averageCompletionTime: number;
    averageDailyScore?: number;
    showScore: boolean;
  }> {
    const gameNames: { [key: string]: string } = {
      power: 'Strøm',
      oxygen: 'Ilt',
      meteor: 'Meteor forsvar',
      factory: 'Fabrikken',
      assembling: 'Samle Hangaren',
      moonrace: 'Måneræs',
    };

    const allGameIds = ['power', 'oxygen', 'meteor', 'factory', 'assembling', 'moonrace'];
    
    return allGameIds.map(gameId => ({
      gameId,
      gameName: gameNames[gameId] || gameId,
      averageCompletionTime: this.getAverageCompletionTimeByGame(gameId),
      averageDailyScore: this.getAverageDailyScoreByGame(gameId),
      showScore: gameId === 'meteor' || gameId === 'moonrace',
    }));
  }

  /**
   * Get 7-day performance table with each day as a column
   */
  getSevenDayPerformanceTable(): Array<{
    gameId: string;
    gameName: string;
    dailyData: Array<{
      date: string;
      dayLabel: string;
      completionTime?: number;
      score?: number;
    }>;
  }> {
    const gameNames: { [key: string]: string } = {
      power: 'Strøm',
      oxygen: 'Ilt',
      meteor: 'Meteor forsvar',
      factory: 'Fabrikken',
      assembling: 'Samle Hangaren',
      moonrace: 'Måneræs',
    };

    const allGameIds = ['power', 'oxygen', 'meteor', 'factory', 'assembling', 'moonrace'];

    // Get last 7 days (including today)
    const today = new Date();
    const last7Days: string[] = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      last7Days.push(date.toISOString().split('T')[0]);
    }

    // Get day labels (Mon, Tue, etc.)
    const dayLabels: { [key: string]: string } = {
      '0': 'Søn',
      '1': 'Man',
      '2': 'Tir',
      '3': 'Ons',
      '4': 'Tor',
      '5': 'Fre',
      '6': 'Lør',
    };

    return allGameIds.map(gameId => {
      const dailyData = last7Days.map(date => {
        const performance = this.sessionData.dailyPerformance.find(
          p => p.gameId === gameId && p.date === date
        );
        
        const dateObj = new Date(date);
        const dayIndex = dateObj.getDay().toString();
        const dayLabel = dayLabels[dayIndex] || date;

        return {
          date,
          dayLabel,
          completionTime: performance?.averageCompletionTime,
          score: performance?.averageDailyScore,
        };
      });

      return {
        gameId,
        gameName: gameNames[gameId] || gameId,
        dailyData,
      };
    });
  }

  /**
   * Reset all session data (for testing)
   */
  resetSessionData(): void {
    this.sessionData = {
      loginCount: 0,
      totalMinutesSpent: 0,
      dailyPerformance: [],
      lastLoginDate: '',
      sessionStartTime: Date.now(),
    };
    this.saveSessionData();
  }

  /**
   * Load session data from localStorage
   */
  private loadSessionData(): void {
    const saved = localStorage.getItem(this.STORAGE_KEY);
    if (saved) {
      try {
        this.sessionData = JSON.parse(saved);
      } catch {
        this.initializeNewSessionData();
      }
    } else {
      this.initializeNewSessionData();
    }
  }

  /**
   * Initialize new session data
   */
  private initializeNewSessionData(): void {
    this.sessionData = {
      loginCount: 0,
      totalMinutesSpent: 0,
      dailyPerformance: [],
      lastLoginDate: '',
      sessionStartTime: Date.now(),
    };
  }

  /**
   * Save session data to localStorage
   */
  private saveSessionData(): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.sessionData));
  }

  /**
   * Clean up on destroy
   */
  ngOnDestroy(): void {
    if (this.activityTimeout) {
      clearInterval(this.activityTimeout);
    }
  }
}
