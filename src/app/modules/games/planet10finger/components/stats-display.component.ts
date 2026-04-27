import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StatsService, GameStats } from '../services/stats.service';

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
      margin-bottom: 10px;
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

    @media (max-width: 768px) {
      .stats-grid {
        grid-template-columns: 1fr;
      }

      .summary-card {
        flex-direction: column;
        align-items: flex-start;
      }
    }
  `]
})
export class StatsDisplayComponent implements OnInit {
  gameStats: GameStats[] = [];

  constructor(private statsService: StatsService) {}

  ngOnInit(): void {
    this.gameStats = this.statsService.getAllStats();
  }

  getTotalPlayed(): number {
    return this.statsService.getTotalTimesPlayed();
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
}
