import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

const NAME_CHANGE_COST = 10;

@Component({
  selector: 'app-planet-name-editor',
  template: `
    <div class="planet-name-editor">
      <h4>Skift planetens navn</h4>
      <div class="name-change-section">
        <p class="customizer-subtitle"><strong>Skift planetens navn for 10 mønter</strong></p>
        
        <!-- Initial Button -->
        <button *ngIf="!editingNameMode" class="change-name-button" (click)="startEditingName()">
          Skift planetens navn
        </button>

        <!-- Edit Mode -->
        <div *ngIf="editingNameMode" class="name-edit-mode">
          <div class="name-edit-container">
            <input
              type="text"
              class="name-input"
              [(ngModel)]="editingName"
              placeholder="Indtast planetnavn"
              (keyup)="updateNamePreview()"
              (keyup.enter)="savePlanetName()"
              maxlength="30"
            />
          </div>

          <!-- Name Preview -->
          <div *ngIf="editingName.trim()" class="name-preview-inline">
            <h3 class="name-preview-text" [style.color]="currentColorHex">Planet {{ editingName }}</h3>
            <div class="name-action-buttons">
              <button class="confirm-button" (click)="savePlanetName()">
                Bekræft navn - 🪙 {{ nameChangeCost }} mønter
              </button>
              <button class="cancel-button" (click)="cancelEditName()">
                Fortryd
              </button>
            </div>
          </div>
        </div>

        <!-- Purchase Message for Name Change -->
        <div *ngIf="purchaseMessage" class="purchase-message" [ngClass]="{ 'message-success': purchaseMessageType === 'success', 'message-error': purchaseMessageType === 'error' }">
          {{ purchaseMessage }}
        </div>
      </div>
    </div>
  `,
  styles: [`
    .planet-name-editor {
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

    .customizer-subtitle {
      margin: 0 0 16px;
      color: #1a1a2e;
      font-size: 1.1rem;
      font-weight: 700;
    }

    .customizer-subtitle strong {
      font-weight: 700;
    }

    .name-change-section {
      background: #f9f9f9;
      border-radius: 8px;
      padding: 16px;
      margin-bottom: 0;
    }

    .change-name-button {
      width: 100%;
      padding: 12px 16px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border: none;
      border-radius: 8px;
      font-size: 0.95rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .change-name-button:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
    }

    .change-name-button:active {
      transform: translateY(0);
    }

    .name-edit-mode {
      animation: slideDown 0.3s ease;
    }

    .name-edit-container {
      display: flex;
      gap: 8px;
      margin-bottom: 16px;
    }

    .name-input {
      flex: 1;
      padding: 10px 12px;
      border: 2px solid #ddd;
      border-radius: 6px;
      font-size: 1rem;
      font-family: inherit;
      color: #1a1a2e;
      transition: border-color 0.2s;
    }

    .name-input:focus {
      outline: none;
      border-color: #667eea;
      box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
    }

    .name-input::placeholder {
      color: #90a4ae;
    }

    .name-preview-inline {
      margin-top: 16px;
      animation: slideDown 0.3s ease;
      background: #000000;
      border-radius: 8px;
      padding: 16px;
      border: 2px solid #333333;
    }

    .name-preview-text {
      margin: 0 0 12px;
      font-size: 1.5rem;
      font-weight: 700;
      text-shadow: 0 2px 8px rgba(0, 0, 0, 0.6);
      text-align: center;
    }

    .name-action-buttons {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .confirm-button {
      width: 100%;
      padding: 12px 16px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border: none;
      border-radius: 8px;
      font-size: 0.95rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .confirm-button:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
    }

    .confirm-button:active {
      transform: translateY(0);
    }

    .cancel-button {
      width: 100%;
      padding: 10px 16px;
      background: #f0f0f0;
      color: #333;
      border: 2px solid #ddd;
      border-radius: 8px;
      font-size: 0.95rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .cancel-button:hover {
      background: #e0e0e0;
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }

    .cancel-button:active {
      transform: translateY(0);
    }

    .purchase-message {
      padding: 12px 16px;
      border-radius: 6px;
      font-weight: 500;
      text-align: center;
      animation: slideDown 0.3s ease;
      font-size: 0.9rem;
      margin-top: 12px;
      margin-bottom: 0;
    }

    .purchase-message.message-success {
      background: #c8e6c9;
      color: #2e7d32;
      border: 1px solid #81c784;
    }

    .purchase-message.message-error {
      background: #ffcdd2;
      color: #c62828;
      border: 1px solid #ef5350;
    }

    @keyframes slideDown {
      from {
        opacity: 0;
        transform: translateY(-10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    @media (max-width: 768px) {
      .name-preview-text {
        font-size: 1.3rem;
      }

      .name-edit-container {
        flex-direction: column;
      }
    }
  `],
  standalone: true,
  imports: [CommonModule, FormsModule],
})
export class PlanetNameEditorComponent {
  @Input() coins: number = 0;
  @Input() planetName: string = 'Planet';
  @Input() currentColorHex: string = '#FFFFFF';
  @Output() coinsChanged = new EventEmitter<number>();
  @Output() planetNameChanged = new EventEmitter<string>();

  editingName: string = '';
  nameChangeCost = NAME_CHANGE_COST;
  editingNameMode = false;
  purchaseMessage = '';
  purchaseMessageType: 'success' | 'error' = 'success';

  savePlanetName(): void {
    const trimmedName = this.editingName.trim();
    
    if (!trimmedName || trimmedName === this.planetName) {
      return;
    }

    // Check if user has enough coins
    if (this.coins < NAME_CHANGE_COST) {
      const needed = NAME_CHANGE_COST - this.coins;
      this.purchaseMessage = `✗ Du mangler 🪙 ${needed} mønter for at ændre planetens navn.`;
      this.purchaseMessageType = 'error';
      setTimeout(() => (this.purchaseMessage = ''), 3000);
      return;
    }

    // Deduct coins and save name
    this.coins -= NAME_CHANGE_COST;
    this.coinsChanged.emit(this.coins);
    this.planetNameChanged.emit(trimmedName);

    this.purchaseMessage = `✓ Planetens navn ændret til "${trimmedName}"! Du brugte 🪙 ${NAME_CHANGE_COST} mønter.`;
    this.purchaseMessageType = 'success';
    this.editingName = '';
    this.editingNameMode = false;
    setTimeout(() => (this.purchaseMessage = ''), 3000);
  }

  startEditingName(): void {
    this.editingName = this.planetName;
    this.editingNameMode = true;
  }

  cancelEditName(): void {
    this.editingName = '';
    this.editingNameMode = false;
  }

  updateNamePreview(): void {
    // Preview updates automatically as user types
  }
}
