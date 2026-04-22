import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-shop-accessories',
  template: `
    <div class="shop-accessories">
      <h4>Ekstra køb</h4>
      <div class="accessories-section">
        <p class="accessories-subtitle">Kommende snart...</p>
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
      margin: 0 0 12px;
      color: #1a1a2e;
      font-size: 1.2rem;
      font-weight: 600;
      border-bottom: 2px solid #cfd8dc;
      padding-bottom: 8px;
    }

    .accessories-section {
      background: #f9f9f9;
      border-radius: 8px;
      padding: 16px;
      margin-bottom: 0;
    }

    .accessories-subtitle {
      margin: 0;
      color: #999;
      font-size: 0.95rem;
      text-align: center;
    }
  `],
  standalone: true,
  imports: [CommonModule],
})
export class ShopAccessoriesComponent {}
