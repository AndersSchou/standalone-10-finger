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
  miscAchievements: Achievement[] = [];

  constructor(private readonly achievementService: AchievementService) {}

  ngOnInit(): void {
    this.powerAchievements = this.achievementService.getAchievementsByCategory('power');
    this.oxygenAchievements = this.achievementService.getAchievementsByCategory('oxygen');
    this.meteorAchievements = this.achievementService.getAchievementsByCategory('meteor');
    this.factoryAchievements = this.achievementService.getAchievementsByCategory('factory');
    this.assemblingAchievements = this.achievementService.getAchievementsByCategory('assembling');
    this.miscAchievements = this.achievementService.getAchievementsByCategory('misc');
  }
}
