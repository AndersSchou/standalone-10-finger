import { Injectable } from '@angular/core';

export interface Achievement {
  id: string;
  name: string;
  description: string;
  category: 'power' | 'oxygen' | 'meteor' | 'factory' | 'assembling' | 'moonrace' | 'misc';
  unlocked: boolean;
  icon: string;
}

@Injectable({
  providedIn: 'root',
})
export class AchievementService {
  private readonly STORAGE_KEY = 'planet10finger_achievements';

  private achievements: Achievement[] = [
    // Meteor game
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
      id: 'factory_wpm',
      name: 'Hurtig skriver',
      description: 'Gennemfør fabriksspillet på under et minut',
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
    // Power game - Level specific
    {
      id: 'power_lvl1_complete',
      name: 'Strøm - Niveau 1',
      description: 'Gennemfør strømgenerationsspillet niveau 1',
      category: 'power',
      unlocked: false,
      icon: '',
    },
    {
      id: 'power_lvl1_perfect',
      name: 'Strøm Niveau 1 - Fejlfrit',
      description: 'Gennemfør strømgenerationsspillet niveau 1 uden fejl',
      category: 'power',
      unlocked: false,
      icon: '',
    },
    {
      id: 'power_lvl2_complete',
      name: 'Strøm - Niveau 2',
      description: 'Gennemfør strømgenerationsspillet niveau 2',
      category: 'power',
      unlocked: false,
      icon: '',
    },
    {
      id: 'power_lvl2_perfect',
      name: 'Strøm Niveau 2 - Fejlfrit',
      description: 'Gennemfør strømgenerationsspillet niveau 2 uden fejl',
      category: 'power',
      unlocked: false,
      icon: '',
    },
    {
      id: 'power_lvl3_complete',
      name: 'Strøm - Niveau 3',
      description: 'Gennemfør strømgenerationsspillet niveau 3',
      category: 'power',
      unlocked: false,
      icon: '',
    },
    {
      id: 'power_lvl3_perfect',
      name: 'Strøm Niveau 3 - Fejlfrit',
      description: 'Gennemfør strømgenerationsspillet niveau 3 uden fejl',
      category: 'power',
      unlocked: false,
      icon: '',
    },
    // Oxygen game - Level specific
    {
      id: 'oxygen_lvl1_complete',
      name: 'Ilt - Niveau 1',
      description: 'Gennemfør oxygenspillet niveau 1',
      category: 'oxygen',
      unlocked: false,
      icon: '',
    },
    {
      id: 'oxygen_lvl1_perfect',
      name: 'Ilt Niveau 1 - Fejlfrit',
      description: 'Gennemfør oxygenspillet niveau 1 uden fejl',
      category: 'oxygen',
      unlocked: false,
      icon: '',
    },
    {
      id: 'oxygen_lvl2_complete',
      name: 'Ilt - Niveau 2',
      description: 'Gennemfør oxygenspillet niveau 2',
      category: 'oxygen',
      unlocked: false,
      icon: '',
    },
    {
      id: 'oxygen_lvl2_perfect',
      name: 'Ilt Niveau 2 - Fejlfrit',
      description: 'Gennemfør oxygenspillet niveau 2 uden fejl',
      category: 'oxygen',
      unlocked: false,
      icon: '',
    },
    {
      id: 'oxygen_lvl3_complete',
      name: 'Ilt - Niveau 3',
      description: 'Gennemfør oxygenspillet niveau 3',
      category: 'oxygen',
      unlocked: false,
      icon: '',
    },
    {
      id: 'oxygen_lvl3_perfect',
      name: 'Ilt Niveau 3 - Fejlfrit',
      description: 'Gennemfør oxygenspillet niveau 3 uden fejl',
      category: 'oxygen',
      unlocked: false,
      icon: '',
    },
    // Meteor game - Level specific
    {
      id: 'meteor_lvl1_complete',
      name: 'Meteor - Niveau 1',
      description: 'Gennemfør meteorspillet niveau 1',
      category: 'meteor',
      unlocked: false,
      icon: '',
    },
    {
      id: 'meteor_lvl1_5points',
      name: 'Meteor Niveau 1 - 5 Point',
      description: 'Tjener 5 point i meteorspillet niveau 1',
      category: 'meteor',
      unlocked: false,
      icon: '',
    },
    {
      id: 'meteor_lvl1_fast_word',
      name: 'Meteor Niveau 1 - Lyn-hurtig',
      description: 'Skriv et ord inden for 3 sekunder i meteorspillet niveau 1',
      category: 'meteor',
      unlocked: false,
      icon: '',
    },
    {
      id: 'meteor_lvl2_complete',
      name: 'Meteor - Niveau 2',
      description: 'Gennemfør meteorspillet niveau 2',
      category: 'meteor',
      unlocked: false,
      icon: '',
    },
    {
      id: 'meteor_lvl2_5points',
      name: 'Meteor Niveau 2 - 5 Point',
      description: 'Tjener 5 point i meteorspillet niveau 2',
      category: 'meteor',
      unlocked: false,
      icon: '',
    },
    {
      id: 'meteor_lvl2_fast_word',
      name: 'Meteor Niveau 2 - Lyn-hurtig',
      description: 'Skriv et ord inden for 3 sekunder i meteorspillet niveau 2',
      category: 'meteor',
      unlocked: false,
      icon: '',
    },
    {
      id: 'meteor_lvl3_complete',
      name: 'Meteor - Niveau 3',
      description: 'Gennemfør meteorspillet niveau 3',
      category: 'meteor',
      unlocked: false,
      icon: '',
    },
    {
      id: 'meteor_lvl3_5points',
      name: 'Meteor Niveau 3 - 5 Point',
      description: 'Tjener 5 point i meteorspillet niveau 3',
      category: 'meteor',
      unlocked: false,
      icon: '',
    },
    {
      id: 'meteor_lvl3_fast_word',
      name: 'Meteor Niveau 3 - Lyn-hurtig',
      description: 'Skriv et ord inden for 3 sekunder i meteorspillet niveau 3',
      category: 'meteor',
      unlocked: false,
      icon: '',
    },
    // Factory game - Level specific
    {
      id: 'factory_lvl1_complete',
      name: 'Fabrik - Niveau 1',
      description: 'Gennemfør fabriksspillet niveau 1',
      category: 'factory',
      unlocked: false,
      icon: '',
    },
    {
      id: 'factory_lvl1_wpm',
      name: 'Fabrik Niveau 1 - Hurtig',
      description: 'Skriv over 20 ord per minut i fabriksspillet niveau 1',
      category: 'factory',
      unlocked: false,
      icon: '',
    },
    {
      id: 'factory_lvl1_perfect',
      name: 'Fabrik Niveau 1 - Fejlfrit',
      description: 'Gennemfør fabriksspillet niveau 1 uden stavefejl',
      category: 'factory',
      unlocked: false,
      icon: '',
    },
    {
      id: 'factory_lvl2_complete',
      name: 'Fabrik - Niveau 2',
      description: 'Gennemfør fabriksspillet niveau 2',
      category: 'factory',
      unlocked: false,
      icon: '',
    },
    {
      id: 'factory_lvl2_wpm',
      name: 'Fabrik Niveau 2 - Hurtig',
      description: 'Skriv over 20 ord per minut i fabriksspillet niveau 2',
      category: 'factory',
      unlocked: false,
      icon: '',
    },
    {
      id: 'factory_lvl2_perfect',
      name: 'Fabrik Niveau 2 - Fejlfrit',
      description: 'Gennemfør fabriksspillet niveau 2 uden stavefejl',
      category: 'factory',
      unlocked: false,
      icon: '',
    },
    {
      id: 'factory_lvl3_complete',
      name: 'Fabrik - Niveau 3',
      description: 'Gennemfør fabriksspillet niveau 3',
      category: 'factory',
      unlocked: false,
      icon: '',
    },
    {
      id: 'factory_lvl3_wpm',
      name: 'Fabrik Niveau 3 - Hurtig',
      description: 'Skriv over 20 ord per minut i fabriksspillet niveau 3',
      category: 'factory',
      unlocked: false,
      icon: '',
    },
    {
      id: 'factory_lvl3_perfect',
      name: 'Fabrik Niveau 3 - Fejlfrit',
      description: 'Gennemfør fabriksspillet niveau 3 uden stavefejl',
      category: 'factory',
      unlocked: false,
      icon: '',
    },
    // Assembling game - Level specific
    {
      id: 'assembling_lvl1_complete',
      name: 'Samling - Niveau 1',
      description: 'Gennemfør samlespillet niveau 1',
      category: 'assembling',
      unlocked: false,
      icon: '',
    },
    {
      id: 'assembling_lvl1_wpm',
      name: 'Samling Niveau 1 - Hurtig',
      description: 'Skriv over 20 ord per minut i samlespillet niveau 1',
      category: 'assembling',
      unlocked: false,
      icon: '',
    },
    {
      id: 'assembling_lvl1_perfect',
      name: 'Samling Niveau 1 - Fejlfrit',
      description: 'Gennemfør samlespillet niveau 1 uden stavefejl',
      category: 'assembling',
      unlocked: false,
      icon: '',
    },
    {
      id: 'assembling_lvl2_complete',
      name: 'Samling - Niveau 2',
      description: 'Gennemfør samlespillet niveau 2',
      category: 'assembling',
      unlocked: false,
      icon: '',
    },
    {
      id: 'assembling_lvl2_wpm',
      name: 'Samling Niveau 2 - Hurtig',
      description: 'Skriv over 20 ord per minut i samlespillet niveau 2',
      category: 'assembling',
      unlocked: false,
      icon: '',
    },
    {
      id: 'assembling_lvl2_perfect',
      name: 'Samling Niveau 2 - Fejlfrit',
      description: 'Gennemfør samlespillet niveau 2 uden stavefejl',
      category: 'assembling',
      unlocked: false,
      icon: '',
    },
    {
      id: 'assembling_lvl3_complete',
      name: 'Samling - Niveau 3',
      description: 'Gennemfør samlespillet niveau 3',
      category: 'assembling',
      unlocked: false,
      icon: '',
    },
    {
      id: 'assembling_lvl3_wpm',
      name: 'Samling Niveau 3 - Hurtig',
      description: 'Skriv over 20 ord per minut i samlespillet niveau 3',
      category: 'assembling',
      unlocked: false,
      icon: '',
    },
    {
      id: 'assembling_lvl3_perfect',
      name: 'Samling Niveau 3 - Fejlfrit',
      description: 'Gennemfør samlespillet niveau 3 uden stavefejl',
      category: 'assembling',
      unlocked: false,
      icon: '',
    },
    // Moonrace game - Level specific
    {
      id: 'moonrace_lvl1_complete',
      name: 'Måneræs - Niveau 1',
      description: 'Gennemfør Måneræs niveau 1',
      category: 'moonrace',
      unlocked: false,
      icon: '',
    },
    {
      id: 'moonrace_lvl1_10points',
      name: 'Måneræs Niveau 1 - 10 Point',
      description: 'Tjener 10 point i Måneræs niveau 1',
      category: 'moonrace',
      unlocked: false,
      icon: '',
    },
    {
      id: 'moonrace_lvl1_fast_letter',
      name: 'Måneræs Niveau 1 - Lyn-håndig',
      description: 'Svar på et bogstav inden for 2 sekunder i Måneræs niveau 1',
      category: 'moonrace',
      unlocked: false,
      icon: '',
    },
    {
      id: 'moonrace_lvl2_complete',
      name: 'Måneræs - Niveau 2',
      description: 'Gennemfør Måneræs niveau 2',
      category: 'moonrace',
      unlocked: false,
      icon: '',
    },
    {
      id: 'moonrace_lvl2_10points',
      name: 'Måneræs Niveau 2 - 10 Point',
      description: 'Tjener 10 point i Måneræs niveau 2',
      category: 'moonrace',
      unlocked: false,
      icon: '',
    },
    {
      id: 'moonrace_lvl2_fast_letter',
      name: 'Måneræs Niveau 2 - Lyn-håndig',
      description: 'Svar på et bogstav inden for 2 sekunder i Måneræs niveau 2',
      category: 'moonrace',
      unlocked: false,
      icon: '',
    },
    {
      id: 'moonrace_lvl3_complete',
      name: 'Måneræs - Niveau 3',
      description: 'Gennemfør Måneræs niveau 3',
      category: 'moonrace',
      unlocked: false,
      icon: '',
    },
    {
      id: 'moonrace_lvl3_10points',
      name: 'Måneræs Niveau 3 - 10 Point',
      description: 'Tjener 10 point i Måneræs niveau 3',
      category: 'moonrace',
      unlocked: false,
      icon: '',
    },
    {
      id: 'moonrace_lvl3_fast_letter',
      name: 'Måneræs Niveau 3 - Lyn-håndig',
      description: 'Svar på et bogstav inden for 2 sekunder i Måneræs niveau 3',
      category: 'moonrace',
      unlocked: false,
      icon: '',
    },
    // Misc - Customization
    {
      id: 'buy_name_color',
      name: 'Farvet navn',
      description: 'Køb en personlig planetnavnfarve',
      category: 'misc',
      unlocked: false,
      icon: '',
    },
    {
      id: 'buy_planet_color',
      name: 'Planet Kunstner',
      description: 'Køb en planetfarve personalisering',
      category: 'misc',
      unlocked: false,
      icon: '',
    },
    {
      id: 'buy_star_color',
      name: 'Stjernelys',
      description: 'Køb en stjernfarve personalisering',
      category: 'misc',
      unlocked: false,
      icon: '',
    },
    {
      id: 'all_colors',
      name: 'Kunstner',
      description: 'Køb alle tre farve personaliseringer',
      category: 'misc',
      unlocked: false,
      icon: '',
    },
    // Misc - Extra Games
    {
      id: 'buy_meteor',
      name: 'Meteorjæger',
      description: 'Køb Meteor Forsvar spillet',
      category: 'misc',
      unlocked: false,
      icon: '',
    },
    {
      id: 'buy_moonrace',
      name: 'Måne Racer',
      description: 'Køb Måneræs spillet',
      category: 'misc',
      unlocked: false,
      icon: '',
    },
    {
      id: 'buy_character',
      name: 'Karakter Samler',
      description: 'Køb enhver karakter',
      category: 'misc',
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
