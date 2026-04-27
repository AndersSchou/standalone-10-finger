import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-shop-accessories',
  template: `
    <div class="shop-accessories">
      <h4>Spil</h4>
      <div class="games-grid">
        <div class="game-card">
          <div class="game-icon">
            <img src="assets/png/Meteor defense tower building.png" alt="Meteor Forsvar" />
          </div>
          <div class="game-info">
            <div class="game-title">Meteor Forsvar</div>
            <div class="game-price">50 mønter</div>
          </div>
          <button 
            class="buy-btn"
            (click)="onBuyGame('meteor')"
            [disabled]="isPurchased('meteor') || !canAfford(50)"
            [class.purchased]="isPurchased('meteor')"
          >
            {{ isPurchased('meteor') ? 'Ejet' : 'Køb' }}
          </button>
        </div>

        <div class="game-card">
          <div class="game-icon">
            <img src="assets/png/garage building.png" alt="Måneræs" />
          </div>
          <div class="game-info">
            <div class="game-title">Måneræs</div>
            <div class="game-price">50 mønter</div>
          </div>
          <button 
            class="buy-btn"
            (click)="onBuyGame('moonrace')"
            [disabled]="isPurchased('moonrace') || !canAfford(50)"
            [class.purchased]="isPurchased('moonrace')"
          >
            {{ isPurchased('moonrace') ? 'Ejet' : 'Køb' }}
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .shop-accessories {
      background: white;
      border-radius: 12px;
      padding: 20px;
      margin-bottom: 24px;
    }

    h4 {
      margin: 0 0 16px;
      color: #1a1a2e;
      font-size: 1.2rem;
      font-weight: 600;
      border-bottom: 2px solid #cfd8dc;
      padding-bottom: 8px;
    }

    .games-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
      gap: 16px;
    }

    .game-card {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 16px 12px;
      background: #f9f9f9;
      border-radius: 8px;
      text-align: center;
    }

    .game-icon {
      width: 140px;
      height: 140px;
      border-radius: 6px;
      overflow: hidden;
      background: white;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 12px;
      border: 1px solid #e0e0e0;

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }

    .game-info {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: center;
      margin-bottom: 12px;
      min-height: 50px;
    }

    .game-title {
      font-size: 0.95rem;
      font-weight: 600;
      color: #1a1a2e;
      margin-bottom: 4px;
      line-height: 1.2;
    }

    .game-price {
      font-size: 0.85rem;
      color: #106ebe;
      font-weight: 500;
    }

    .buy-btn {
      width: 100%;
      padding: 8px 12px;
      background: #106ebe;
      color: white;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      font-weight: 600;
      font-size: 0.9rem;
      transition: background 0.2s;

      &:hover:not(:disabled) {
        background: #0d4fa8;
      }

      &:disabled {
        background: #ccc;
        cursor: not-allowed;
      }

      &.purchased {
        background: #4caf50;
      }
    }
  `],
  standalone: true,
  imports: [CommonModule],
})
export class ShopAccessoriesComponent {
  @Input() coins: number = 0;
  @Input() purchasedGames: Set<string> = new Set();
  @Output() gameRequested = new EventEmitter<{ game: string; cost: number }>();

  isPurchased(game: string): boolean {
    return this.purchasedGames.has(game);
  }

  canAfford(cost: number): boolean {
    return this.coins >= cost;
  }

  onBuyGame(game: string): void {
    this.gameRequested.emit({ game, cost: 50 });
  }
}
