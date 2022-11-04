import { Injectable } from '@angular/core';

// Grid based values.
export interface GameObject {
  width: number;
  height: number;
  x: number;
  y: number;
  ocupied: boolean;
  type: string;
}

@Injectable()
export class GridService {
  // Stores the grid cell size.
  gridSize = 25;
  // Represents the max number of grid squares that can be displayed on X and Y.
  maxX = 0;
  maxY = 0;

  private boat: GameObject = {
    width: 200,
    height: 400,
    x: 0,
    y: 0,
    ocupied: true,
    type: 'boat',
  }

  private grid: GameObject[][] = [];

  initGrid() {
    this.grid = [];
    this.maxX = Math.floor(window.innerWidth / this.gridSize);
    this.maxY = Math.floor(window.innerHeight / this.gridSize);
    for (let i = 0; i < this.maxX; i++) {
      this.grid[i] = [];
      for (let j = 0; j < this.maxY; j++) {
        this.grid[i][j] = {
          width: this.gridSize,
          height: this.gridSize,
          x: i,
          y: j,
          ocupied: false,
          type: 'empty',
        };
      }
    }
    this.placeBoat();
  }

  getGrid(): GameObject[][] {
    return this.grid;
  }

  pickRandomEmptySpace(width: number, height: number, iteration = 0): GameObject | null {
    // We pad the map top by the boat y;
    // Failsafe if we don't find any spaces in 100 cicles.
    if (iteration > 100) {
      return null;
    }
    iteration++;
    const randX = Math.random();
    const randY = Math.random();

    const x = Math.floor((randX == 1 ? 0.9 : randX) * (this.maxX - width));
    const y = Math.floor((randY == 1 ? 0.9 : randY) * (this.maxY - height - this.boat.y)) + this.boat.y;
    if (x + width > this.maxX || y + height > this.maxY) {
      // console.log('1');
      return this.pickRandomEmptySpace(width, height, iteration);
    }
    // Check if all spaces at the picked location are not ocupied.
    for (let i = x; i <= x + width; i++) {
      for (let j = y; j <= y + height; j++) {
        if (!this.grid[i] || !this.grid[i][j] || this.grid[i][j].ocupied) {
          return this.pickRandomEmptySpace(width, height, iteration);
        }
      }
    }
    // Return the found location.
    return this.grid[x][y];

  }

  occupySpace(x: number, y: number, width: number, height: number, type: string) {
    for (let i = x; i < x + width; i++) {
      for (let j = y; j < y + height; j++) {
        if (!this.grid[i] || !this.grid[i][j]) {
          console.log('i,j', i, j);
        }
        this.grid[i][j].ocupied = type !== 'empty';
        this.grid[i][j].type = type;
      }
    }
  }

  private placeBoat(): void {
    this.calculateBoatPostion();
    for (let i = this.boat.x; i < this.boat.x + this.boat.width; i++) {
      for (let j = this.boat.y; j < this.boat.y + this.boat.height; j++) {
        this.grid[i][j].ocupied = true;
        this.grid[i][j].type = 'boat';
      }
    }
  }

  // The boat is postioned in the center of the grid and has padding.
  private calculateBoatPostion(): void {
    const bottomPercent = 10;
    const paddedWidth = 426;
    const paddedHeight = 550;

    const padding = {
      top: 4,
      right: 6,
      bottom: 1,
      left: 2
    };

    const yEnd = this.maxY - Math.floor((this.maxY * bottomPercent) / 100);
    const ySize = Math.floor(paddedHeight / this.gridSize);

    this.boat.y = yEnd - ySize + padding.top;
    this.boat.height = ySize - padding.bottom - padding.top;

    const xSize = Math.floor(paddedWidth / this.gridSize);
    const xStart = Math.floor((this.maxX - xSize) / 2);

    this.boat.x = xStart + padding.left;
    this.boat.width = xSize - padding.right - padding.left;
  }
}
