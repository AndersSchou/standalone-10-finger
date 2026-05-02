import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StatsService, GameStats } from '../services/stats.service';
import { UserSessionService, DailyGamePerformance } from '../services/user-session.service';

@Component({
  selector: 'app-stats-display',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="stats-container">
      <h2>Spillestatistik</h2>
      
      <div class="stats-summary">
        <div class="summary-card">
          <span class="summary-label">Total spil afsluttet:</span>
          <span class="summary-value">{{ getTotalPlayed() }}</span>
        </div>
        <div class="summary-card">
          <span class="summary-label">Logins:</span>
          <span class="summary-value">{{ sessionService.getLoginCount() }}</span>
        </div>
        <div class="summary-card">
          <span class="summary-label">Tid på siden:</span>
          <span class="summary-value">{{ sessionService.getFormattedTimeSpent() }}</span>
        </div>
      </div>

      <!-- Today's Performance Section -->
      <div class="daily-performance-section" *ngIf="getTodayPerformance().length > 0">
        <h3>Dagens bedste præstationer</h3>
        <div class="daily-grid">
          <div class="daily-card" *ngFor="let perf of getTodayPerformance()">
            <h4>{{ perf.gameName }}</h4>
            <div class="perf-line" *ngIf="perf.bestScore !== undefined">
              <span class="perf-label">Bedste score:</span>
              <span class="perf-value">{{ perf.bestScore }}</span>
            </div>
            <div class="perf-line" *ngIf="perf.bestWPM !== undefined">
              <span class="perf-label">Bedste WPM:</span>
              <span class="perf-value">{{ perf.bestWPM | number: '1.0-0' }}</span>
            </div>
            <div class="perf-line" *ngIf="perf.perfectGames !== undefined">
              <span class="perf-label">Perfekte spil:</span>
              <span class="perf-value">{{ perf.perfectGames }}</span>
            </div>
            <div class="perf-line" *ngIf="perf.timesPlayed !== undefined">
              <span class="perf-label">Gange spillet:</span>
              <span class="perf-value">{{ perf.timesPlayed }}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="stats-grid">
        <div class="stat-card" *ngFor="let stat of gameStats" [attr.data-game]="stat.gameId">
          <h3>{{ stat.gameName }}</h3>
          
          <div class="stat-line">
            <span class="stat-label">Spillet:</span>
            <span class="stat-value">{{ stat.timesPlayed }} {{ stat.timesPlayed === 1 ? 'gang' : 'gange' }}</span>
          </div>

          <!-- Power, Oxygen, Factory, and Assembling: show perfect game count by difficulty -->
          <div *ngIf="shouldShowPerfectGameCount(stat.gameId)">
            <div class="stat-line" *ngIf="stat.perfectGameCountByDifficulty">
              <span class="stat-label">Perfekte level 1 spil:</span>
              <span class="stat-value">{{ stat.perfectGameCountByDifficulty[1] || 0 }}</span>
            </div>
            <div class="stat-line" *ngIf="stat.perfectGameCountByDifficulty">
              <span class="stat-label">Perfekte level 2 spil:</span>
              <span class="stat-value">{{ stat.perfectGameCountByDifficulty[2] || 0 }}</span>
            </div>
            <div class="stat-line" *ngIf="stat.perfectGameCountByDifficulty">
              <span class="stat-label">Perfekte level 3 spil:</span>
              <span class="stat-value">{{ stat.perfectGameCountByDifficulty[3] || 0 }}</span>
            </div>
          </div>

          <!-- Meteor: show best score by difficulty -->
          <div *ngIf="stat.gameId === 'meteor'">
            <div class="stat-line" *ngIf="stat.bestScoreByDifficulty">
              <span class="stat-label">Bedste level 1 score:</span>
              <span class="stat-value">{{ stat.bestScoreByDifficulty[1] || 0 }}</span>
            </div>
            <div class="stat-line" *ngIf="stat.bestScoreByDifficulty">
              <span class="stat-label">Bedste level 2 score:</span>
              <span class="stat-value">{{ stat.bestScoreByDifficulty[2] || 0 }}</span>
            </div>
            <div class="stat-line" *ngIf="stat.bestScoreByDifficulty">
              <span class="stat-label">Bedste level 3 score:</span>
              <span class="stat-value">{{ stat.bestScoreByDifficulty[3] || 0 }}</span>
            </div>
          </div>

          <!-- Moonrace: show best score by difficulty -->
          <div *ngIf="stat.gameId === 'moonrace'">
            <div class="stat-line" *ngIf="stat.bestScoreByDifficulty">
              <span class="stat-label">Bedste level 1 score:</span>
              <span class="stat-value">{{ stat.bestScoreByDifficulty[1] || 0 }}</span>
            </div>
            <div class="stat-line" *ngIf="stat.bestScoreByDifficulty">
              <span class="stat-label">Bedste level 2 score:</span>
              <span class="stat-value">{{ stat.bestScoreByDifficulty[2] || 0 }}</span>
            </div>
            <div class="stat-line" *ngIf="stat.bestScoreByDifficulty">
              <span class="stat-label">Bedste level 3 score:</span>
              <span class="stat-value">{{ stat.bestScoreByDifficulty[3] || 0 }}</span>
            </div>
          </div>

          <!-- Factory and Assembling: show best WPM and time played -->
          <div class="stat-line" *ngIf="stat.bestWPM !== undefined">
            <span class="stat-label">Bedste ord/min (100% nøjagtighed):</span>
            <span class="stat-value">{{ stat.bestWPM | number: '1.0-0' }}</span>
          </div>

          <div class="stat-line no-stats" *ngIf="!hasDetailedStats(stat)">
            <span class="stat-label">Ingen detaljerede statistikker endnu</span>
          </div>
        </div>
      </div>

      <!-- 7-Day Performance Table -->
      <div class="averages-section">
        <h3>Seneste 7 dages præstation</h3>
        <div class="seven-day-table">
          <div class="seven-day-header">
            <div class="header-cell game-name-cell">Spil</div>
            <div class="header-cell day-cell" *ngFor="let dayData of getSevenDayPerformanceTable()[0]?.dailyData">
              <div class="day-header">
                <div class="day-label">{{ dayData.dayLabel }}</div>
                <div class="day-date">{{ dayData.date | slice:5:10 }}</div>
              </div>
            </div>
          </div>
          
          <div class="seven-day-row" *ngFor="let game of getSevenDayPerformanceTable()">
            <div class="game-name-cell">{{ game.gameName }}</div>
            <div class="day-cell" *ngFor="let data of game.dailyData">
              <div class="performance-data">
                <div class="completion-time" *ngIf="data.completionTime !== undefined">
                  {{ data.completionTime > 0 ? (data.completionTime | number: '1.0-0') : '—' }}s
                </div>
                <div class="score" *ngIf="data.score !== undefined && (game.gameId === 'meteor' || game.gameId === 'moonrace')">
                  {{ data.score > 0 ? (data.score | number: '1.0-0') : '—' }}
                </div>
                <div *ngIf="!data.completionTime && !data.score" class="no-data">—</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .stats-container {
      display: flex;
      flex-direction: column;
      gap: 20px;
      padding: 20px;
    }

    h2 {
      margin: 0;
      color: #333;
      font-size: 1.5rem;
      text-align: center;
    }

    .stats-summary {
      display: flex;
      justify-content: center;
      gap: 15px;
      margin-bottom: 10px;
      flex-wrap: wrap;
    }

    .summary-card {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 15px 30px;
      border-radius: 10px;
      display: flex;
      gap: 10px;
      align-items: center;
      box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
    }

    .summary-label {
      font-weight: 600;
      font-size: 0.95rem;
    }

    .summary-value {
      font-size: 1.5rem;
      font-weight: 700;
    }

    .daily-performance-section {
      background: #f0f4ff;
      border-radius: 12px;
      padding: 20px;
      border-left: 5px solid #667eea;
    }

    .daily-performance-section h3 {
      margin: 0 0 16px 0;
      color: #333;
      font-size: 1.2rem;
    }

    .daily-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 15px;
    }

    .daily-card {
      background: white;
      border: 2px solid #e0e0e0;
      border-radius: 8px;
      padding: 15px;
      transition: all 0.2s ease;

      &:hover {
        border-color: #667eea;
        box-shadow: 0 4px 12px rgba(102, 126, 234, 0.2);
      }

      h4 {
        margin: 0 0 12px 0;
        color: #333;
        font-size: 1rem;
        border-bottom: 2px solid #667eea;
        padding-bottom: 8px;
      }
    }

    .perf-line {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 6px 0;
      border-bottom: 1px solid #efefef;
      font-size: 0.9rem;

      &:last-child {
        border-bottom: none;
      }
    }

    .perf-label {
      color: #666;
      font-weight: 500;
    }

    .perf-value {
      color: #667eea;
      font-weight: 700;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(5, 1fr);
      gap: 20px;
    }

    .stat-card {
      background: #f9f9f9;
      border: 2px solid #e0e0e0;
      border-radius: 12px;
      padding: 20px;
      transition: all 0.3s ease;

      &:hover {
        border-color: #667eea;
        box-shadow: 0 8px 20px rgba(102, 126, 234, 0.15);
      }

      h3 {
        margin: 0 0 16px 0;
        color: #333;
        font-size: 1.2rem;
        border-bottom: 3px solid #667eea;
        padding-bottom: 10px;
      }
    }

    .stat-line {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 8px 0;
      border-bottom: 1px solid #efefef;

      &:last-child {
        border-bottom: none;
      }

      &.no-stats {
        justify-content: center;
        color: #999;
        font-size: 0.9rem;
        font-style: italic;
        padding: 12px 0;
      }
    }

    .stat-label {
      color: #666;
      font-size: 0.95rem;
      font-weight: 500;
    }

    .stat-value {
      color: #333;
      font-size: 1.1rem;
      font-weight: 700;
      color: #667eea;
    }

    .averages-section {
      background: #f8f5ff;
      border-radius: 12px;
      padding: 20px;
      border-left: 5px solid #764ba2;
      margin-top: 30px;
    }

    .averages-section h3 {
      margin: 0 0 16px 0;
      color: #333;
      font-size: 1.2rem;
      font-weight: 600;
    }

    .averages-table {
      background: white;
      border-radius: 8px;
      overflow: auto;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    }

    .seven-day-table {
      display: flex;
      flex-direction: column;
      background: white;
      border-radius: 8px;
      overflow: auto;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    }

    .seven-day-header {
      display: grid;
      grid-template-columns: 150px repeat(7, 120px);
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      font-weight: 600;
      min-width: min-content;
      position: sticky;
      top: 0;
      z-index: 10;
    }

    .header-cell {
      padding: 12px 16px;
      text-align: center;
      border-right: 1px solid rgba(255, 255, 255, 0.2);

      &:last-child {
        border-right: none;
      }
    }

    .game-name-cell {
      text-align: left;
      font-weight: 600;
    }

    .day-cell {
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
    }

    .day-header {
      text-align: center;
    }

    .day-label {
      font-weight: 700;
      font-size: 0.95rem;
    }

    .day-date {
      font-size: 0.8rem;
      opacity: 0.9;
      margin-top: 2px;
    }

    .seven-day-row {
      display: grid;
      grid-template-columns: 150px repeat(7, 120px);
      border-bottom: 1px solid #e0e0e0;
      min-width: min-content;

      &:last-child {
        border-bottom: none;
      }

      &:nth-child(even) {
        background: #f9f7ff;
      }

      &:hover {
        background: #f0ecff;
      }
    }

    .game-name-cell {
      padding: 12px 16px;
      display: flex;
      align-items: center;
      color: #333;
      font-weight: 500;
      background: #f5f5f5;
      border-right: 2px solid #e0e0e0;
    }

    .day-cell {
      padding: 12px 16px;
      text-align: center;
      border-right: 1px solid #e0e0e0;
      min-height: 60px;
      display: flex;
      align-items: center;
      justify-content: center;

      &:last-child {
        border-right: none;
      }
    }

    .performance-data {
      display: flex;
      flex-direction: column;
      gap: 4px;
      text-align: center;
    }

    .completion-time {
      font-size: 0.95rem;
      font-weight: 600;
      color: #667eea;
    }

    .score {
      font-size: 0.85rem;
      color: #764ba2;
      font-weight: 500;
    }

    .no-data {
      color: #ccc;
      font-weight: 600;
    }

    .table-header {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      font-weight: 600;
      padding: 0;
    }

    .table-row {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      border-bottom: 1px solid #e0e0e0;

      &:last-child {
        border-bottom: none;
      }

      &:nth-child(even) {
        background: #f9f7ff;
      }

      &:hover {
        background: #f0ecff;
      }
    }

    .table-cell {
      padding: 12px 16px;
      display: flex;
      align-items: center;
      color: #333;

      .table-header & {
        color: white;
      }
    }

    @media (max-width: 1024px) {
      .stats-grid {
        grid-template-columns: repeat(3, 1fr);
      }

      .seven-day-header,
      .seven-day-row {
        grid-template-columns: 130px repeat(4, 90px);
      }

      .table-header,
      .table-row {
        grid-template-columns: 1fr 1fr;
      }

      .table-cell:nth-child(3) {
        grid-column: 1 / -1;
        border-top: 1px solid #e0e0e0;
      }
    }

    @media (max-width: 768px) {
      .stats-grid {
        grid-template-columns: 1fr;
      }

      .summary-card {
        flex-direction: column;
        align-items: flex-start;
      }

      .daily-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class StatsDisplayComponent implements OnInit {
  gameStats: GameStats[] = [];

  constructor(
    private statsService: StatsService,
    public sessionService: UserSessionService
  ) {}

  ngOnInit(): void {
    this.gameStats = this.statsService.getAllStats();
  }

  getTotalPlayed(): number {
    return this.statsService.getTotalTimesPlayed();
  }

  getTodayPerformance(): DailyGamePerformance[] {
    return this.sessionService.getTodayPerformance();
  }

  getGameAveragesTable() {
    return this.sessionService.getGameAveragesTable();
  }

  getSevenDayPerformanceTable() {
    return this.sessionService.getSevenDayPerformanceTable();
  }

  shouldShowPerfectGameCount(gameId: string): boolean {
    return gameId === 'power' || gameId === 'oxygen' || gameId === 'factory' || gameId === 'assembling';
  }

  hasDetailedStats(stat: GameStats): boolean {
    return stat.perfectGameCount !== undefined || 
           stat.perfectGameCountByDifficulty !== undefined ||
           stat.bestScore !== undefined || 
           stat.bestScoreByDifficulty !== undefined ||
           stat.bestWPM !== undefined;
  }

  hasAnyAverages(): boolean {
    const averages = this.sessionService.getGameAveragesTable();
    return averages.some(
      g => g.averageCompletionTime > 0 || (g.averageDailyScore !== undefined && g.averageDailyScore > 0)
    );
  }

  hasAnyScores(): boolean {
    return true; // Meteor and Moonrace always show score column
  }
}
