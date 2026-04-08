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
  private readonly STORAGE_KEY = 'planet10finger_achievements';

  private achievements: Achievement[] = [
    // Power game
    {
      id: 'power_complete',
      name: 'Strømmaster',
      description: 'Gennemfør strømgenerationsspillet',
      category: 'power',
      unlocked: false,
      icon: '',
    },
    {
      id: 'power_perfect',
      name: 'Fejlfri strøm',
      description: 'Gennemfør strømgenerationsspillet uden forkerte tastetryk',
      category: 'power',
      unlocked: false,
      icon: '',
    },
    // Oxygen game
    {
      id: 'oxygen_complete',
      name: 'Iltkemist',
      description: 'Gennemfør oxygenspillet',
      category: 'oxygen',
      unlocked: false,
      icon: '',
    },
    {
      id: 'oxygen_perfect',
      name: 'Perfekt iltkemi',
      description: 'Gennemfør oxygenspillet uden forkerte tastetryk',
      category: 'oxygen',
      unlocked: false,
      icon: '',
    },
    // Meteor game
    {
      id: 'meteor_complete',
      name: 'Meteorjæger',
      description: 'Gennemfør meteorspillet',
      category: 'meteor',
      unlocked: false,
      icon: '',
    },
    {
      id: 'meteor_5points',
      name: 'Meteor Slayer',
      description: 'Tjener 5 point i meteorspillet',
      category: 'meteor',
      unlocked: false,
      icon: '',
    },
    {
      id: 'meteor_fast_word',
      name: 'Lynhurtig stavning',
      description: 'Skriv et ord inden for 3 sekunder i meteorspillet',
      category: 'meteor',
      unlocked: false,
      icon: '',
    },
    // Factory game
    {
      id: 'factory_complete',
      name: 'Fabrikschef',
      description: 'Gennemfør fabriksspillet',
      category: 'factory',
      unlocked: false,
      icon: '',
    },
    {
      id: 'factory_wpm',
      name: 'Hurtig skriver',
      description: 'Skriv over 20 ord per minut i fabriksspillet',
      category: 'factory',
      unlocked: false,
      icon: '',
    },
    {
      id: 'factory_perfect',
      name: 'Fejlfri fabrikant',
      description: 'Gennemfør fabriksspillet uden stavefejl',
      category: 'factory',
      unlocked: false,
      icon: '',
    },
    // Assembling game
    {
      id: 'assembling_complete',
      name: 'Samler',
      description: 'Gennemfør samlespillet',
      category: 'assembling',
      unlocked: false,
      icon: '',
    },
    {
      id: 'assembling_wpm',
      name: 'Hurtig samler',
      description: 'Skriv over 20 ord per minut i samlespillet',
      category: 'assembling',
      unlocked: false,
      icon: '',
    },
    {
      id: 'assembling_perfect',
      name: 'Fejlfri samling',
      description: 'Gennemfør samlespillet uden stavefejl',
      category: 'assembling',
      unlocked: false,
      icon: '',
    },
  ];

  constructor() {
    this.loadAchievements();
  }

  private loadAchievements(): void {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    if (stored) {
      const unlockedIds = JSON.parse(stored) as string[];
      this.achievements.forEach((ach) => {
        if (unlockedIds.includes(ach.id)) {
          ach.unlocked = true;
        }
      });
    }
  }

  getAchievements(): Achievement[] {
    return this.achievements;
  }

  getAchievementsByCategory(category: string): Achievement[] {
    return this.achievements.filter((ach) => ach.category === category);
  }

  unlockAchievement(id: string): void {
    const ach = this.achievements.find((a) => a.id === id);
    if (ach && !ach.unlocked) {
      ach.unlocked = true;
      this.saveAchievements();
    }
  }

  isUnlocked(id: string): boolean {
    return this.achievements.find((a) => a.id === id)?.unlocked ?? false;
  }

  private saveAchievements(): void {
    const unlockedIds = this.achievements
      .filter((ach) => ach.unlocked)
      .map((ach) => ach.id);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(unlockedIds));
  }
}
