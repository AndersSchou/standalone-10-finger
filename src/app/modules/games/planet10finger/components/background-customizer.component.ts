import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BackgroundCustomizationService } from '../services/background-customization.service';

@Component({
  selector: 'app-background-customizer',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="background-customizer">
      <h3>Baggrundfarve</h3>
      <div class="color-options">
        <button
          *ngFor="let color of backgroundColors"
          [class.selected]="isSelected(color.id)"
          [style.--preview-color]="color.hexPreview"
          (click)="selectColor(color.id)"
          [title]="color.label"
          class="color-btn"
        >
          <span class="color-preview"></span>
          <span class="color-label">{{ color.label }}</span>
        </button>
      </div>
    </div>
  `,
  styles: [`
    .background-customizer {
      background: #f9f9f9;
      border: 2px solid #e0e0e0;
      border-radius: 12px;
      padding: 20px;
      margin: 20px 0;
    }

    h3 {
      margin: 0 0 16px 0;
      color: #333;
      font-size: 1.1rem;
      border-bottom: 3px solid #667eea;
      padding-bottom: 10px;
    }

    .color-options {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
      gap: 12px;
    }

    .color-btn {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 8px;
      padding: 12px;
      border: 3px solid #ddd;
      border-radius: 10px;
      background: white;
      cursor: pointer;
      transition: all 0.3s ease;

      &:hover {
        border-color: #667eea;
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(102, 126, 234, 0.2);
      }

      &.selected {
        border-color: #667eea;
        background: #e8eaf6;
        box-shadow: 0 6px 16px rgba(102, 126, 234, 0.3);

        .color-preview {
          box-shadow: 0 0 10px rgba(102, 126, 234, 0.6);
        }
      }
    }

    .color-preview {
      width: 50px;
      height: 50px;
      border-radius: 8px;
      background: linear-gradient(135deg, var(--preview-color) 0%, var(--preview-color) 100%);
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
      transition: box-shadow 0.3s ease;
    }

    .color-label {
      font-size: 0.85rem;
      font-weight: 600;
      color: #333;
      text-align: center;
    }

    @media (max-width: 600px) {
      .color-options {
        grid-template-columns: repeat(auto-fit, minmax(80px, 1fr));
      }

      .color-btn {
        padding: 8px;
      }

      .color-preview {
        width: 40px;
        height: 40px;
      }

      .color-label {
        font-size: 0.75rem;
      }
    }
  `]
})
export class BackgroundCustomizerComponent implements OnInit {
  backgroundColors = this.backgroundCustomization.backgroundColors;

  constructor(private backgroundCustomization: BackgroundCustomizationService) {}

  ngOnInit(): void {}

  isSelected(colorId: string): boolean {
    return this.backgroundCustomization.getCurrentBackgroundColor().id === colorId;
  }

  selectColor(colorId: string): void {
    this.backgroundCustomization.setBackgroundColor(colorId);
  }
}
