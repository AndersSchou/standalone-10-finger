import { Injectable } from '@angular/core';

export interface Achievement {
  id: string;
  name: string;
  description: string;
  category: 'power' | 'oxygen' | 'meteor' | 'factory' | 'assembling' | 'misc';
  unlocked: boolean;
  icon: string;
}

@Injectable({
  providedIn: 'root',
})
export class AchievementService {
  private achievements: Achievement[] = [];
  private readonly STORAGE_KEY = 'planet10finger_achievements';

  constructor() {
    this.initializeAchievements();
    this.loadAchievements();
  }

  private initializeAchievements(): void {
    this.achievements = [
      // Power Achievements (2)
      {
        id: 'power_complete',
        name: 'Power Master',
        description: 'Complete all Power Generation rounds',
        category: 'power',
        unlocked: false,
        icon: '',
      },
      {
        id: 'power_perfect',
        name: 'Perfect Power',
        description: 'Complete Power Generation without any mistakes',
        category: 'power',
        unlocked: false,
        icon: '',
      },
      // Oxygen Achievements (2)
      {
        id: 'oxygen_complete',
        name: 'Oxygen Master',
        description: 'Complete all Oxygen Sequence rounds',
        category: 'oxygen',
        unlocked: false,
        icon: '',
      },
      {
        id: 'oxygen_perfect',
        name: 'Perfect Oxygen',
        description: 'Complete Oxygen Sequence without any mistakes',
        category: 'oxygen',
        unlocked: false,
        icon: '',
      },
      // Meteor Achievements (3)
      {
        id: 'meteor_complete',
        name: 'Meteor Master',
        description: 'Complete Meteor Word game',
        category: 'meteor',
        unlocked: false,
        icon: '',
      },
      {
        id: 'meteor_5points',
        name: 'Meteor Score',
        description: 'Score 5 points in Meteor Word game',
        category: 'meteor',
        unlocked: false,
        icon: '',
      },
      {
        id: 'meteor_fast_word',
        name: 'Lightning Fingers',
        description: 'Type a word within 3 seconds in Meteor',
        category: 'meteor',
        unlocked: false,
        icon: '',
      },
      // Factory Achievements (3)
      {
        id: 'factory_complete',
        name: 'Factory Master',
        description: 'Complete Factory Sentence game',
        category: 'factory',
        unlocked: false,
        icon: '',
      },
      {
        id: 'factory_wpm',
        name: 'Factory Speed',
        description: 'Type over 20 WPM in Factory game',
        category: 'factory',
        unlocked: false,
        icon: '',
      },
      {
        id: 'factory_perfect',
        name: 'Perfect Factory',
        description: 'Complete Factory game without any typos',
        category: 'factory',
        unlocked: false,
        icon: '',
      },
      // Assembling Achievements (3)
      {
        id: 'assembling_complete',
        name: 'Assembling Master',
        description: 'Complete Assembling Stories game',
        category: 'assembling',
        unlocked: false,
        icon: '',
      },
      {
        id: 'assembling_wpm',
        name: 'Assembling Speed',
        description: 'Type over 20 WPM in Assembling game',
        category: 'assembling',
        unlocked: false,
        icon: '',
      },
      {
        id: 'assembling_perfect',
        name: 'Perfect Assembling',
        description: 'Complete Assembling game without any typos',
        category: 'assembling',
        unlocked: false,
        icon: '',
      },
      // Diverse/Misc Achievements (6)
      {
        id: 'buy_name_color',
        name: 'Farvet navn',
        description: 'Buy a color for your planet name',
        category: 'misc',
        unlocked: false,
        icon: '',
      },
      {
        id: 'buy_planet_color',
        name: 'Planet Kunstner',
        description: 'Buy a color for your planet',
        category: 'misc',
        unlocked: false,
        icon: '',
      },
      {
        id: 'buy_star_color',
        name: 'Stjernelys',
        description: 'Buy a color for your stars',
        category: 'misc',
        unlocked: false,
        icon: '',
      },
      {
        id: 'all_colors',
        name: 'Kunstner',
        description: 'Buy colors for your name, planet, and stars',
        category: 'misc',
        unlocked: false,
        icon: '',
      },
      {
        id: 'buy_meteor',
        name: 'Meteorjæger',
        description: 'Buy the Meteor game',
        category: 'misc',
        unlocked: false,
        icon: '',
      },
      {
        id: 'buy_moonrace',
        name: 'Måne Racer',
        description: 'Buy the Moonrace game',
        category: 'misc',
        unlocked: false,
        icon: '',
      },
    ];
  }

  unlockAchievement(id: string): void {
    const achievement = this.achievements.find((ach) => ach.id === id);
    if (achievement && !achievement.unlocked) {
      achievement.unlocked = true;
      this.saveAchievements();
    }
  }

  isUnlocked(id: string): boolean {
    return this.achievements.find((ach) => ach.id === id)?.unlocked ?? false;
  }

  getAchievements(): Achievement[] {
    return [...this.achievements];
  }

  getAchievementsByCategory(
    category: 'power' | 'oxygen' | 'meteor' | 'factory' | 'assembling' | 'misc'
  ): Achievement[] {
    return this.achievements.filter((ach) => ach.category === category);
  }

  private saveAchievements(): void {
    const data = this.achievements.map((ach) => ({
      id: ach.id,
      unlocked: ach.unlocked,
    }));
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
  }

  private loadAchievements(): void {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    if (stored) {
      const data = JSON.parse(stored) as { id: string; unlocked: boolean }[];
      data.forEach((item) => {
        const ach = this.achievements.find((a) => a.id === item.id);
        if (ach) {
          ach.unlocked = item.unlocked;
        }
      });
    }
  }
}
