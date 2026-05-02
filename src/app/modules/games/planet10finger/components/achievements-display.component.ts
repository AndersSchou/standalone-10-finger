import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AchievementService, Achievement } from '../services/achievement.service';

@Component({
  selector: 'app-achievements-display',
  templateUrl: './achievements-display.component.html',
  styleUrl: './achievements-display.component.scss',
  standalone: true,
  imports: [CommonModule],
})
export class AchievementsDisplayComponent implements OnInit {
  powerAchievements: Achievement[] = [];
  oxygenAchievements: Achievement[] = [];
  meteorAchievements: Achievement[] = [];
  factoryAchievements: Achievement[] = [];
  assemblingAchievements: Achievement[] = [];
  moonraceAchievements: Achievement[] = [];
  miscAchievements: Achievement[] = [];

  hoveredAchievementId: string | null = null;
  private hoverTimeout: any;

  constructor(private readonly achievementService: AchievementService) {}

  ngOnInit(): void {
    this.powerAchievements = this.achievementService.getAchievementsByCategory('power');
    this.oxygenAchievements = this.achievementService.getAchievementsByCategory('oxygen');
    this.meteorAchievements = this.achievementService.getAchievementsByCategory('meteor');
    this.factoryAchievements = this.achievementService.getAchievementsByCategory('factory');
    this.assemblingAchievements = this.achievementService.getAchievementsByCategory('assembling');
    this.moonraceAchievements = this.achievementService.getAchievementsByCategory('moonrace');
    this.miscAchievements = this.achievementService.getAchievementsByCategory('misc');
  }

  onAchievementMouseEnter(id: string): void {
    this.hoverTimeout = setTimeout(() => {
      this.hoveredAchievementId = id;
    }, 1000);
  }

  onAchievementMouseLeave(): void {
    clearTimeout(this.hoverTimeout);
    this.hoveredAchievementId = null;
  }
}
