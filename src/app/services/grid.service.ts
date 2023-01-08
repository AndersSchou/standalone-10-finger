import { Injectable } from '@angular/core';

/**
 * Game object interface.
 */
export interface GameObject {
  width: number;
  height: number;
  x: number;
  y: number;
  ocupied: boolean;
  type: string;
}

/**
 * This service is used to handle the grid. The fish/words will be displyed only on the bottm part of the screen (boat area).
 */
@Injectable()
export class GridService {
  // Stores the grid cell size.
  gridSize = 25;
  // Represents the max number of grid squares that can be displayed on X axis.
  maxX = 0;
  // Represents the max number of grid squares that can be displayed on Y axis.
  maxY = 0;
  // Stores the boat object.
  private boat: GameObject = {
    width: 200,
    height: 400,
    x: 0,
    y: 0,
    ocupied: true,
    type: 'boat',
  }
  // Stores the grid.
  private grid: GameObject[][] = [];

  /**
   * Initialize the grid.
   */
  initGrid() {
    console.log('GridService.initGrid()');
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

  /**
   * Get the grid.
   *
   * @returns The grid.
   */
  getGrid(): GameObject[][] {
    return this.grid;
  }

  /**
   * Pick a random empty space from left and right of the boat area.
   *
   * @param width Represents the width of the object.
   * @param height Represents the height of the object.
   * @param iteration Represents the number of iterations.
   *
   * @returns An object as GameObject or null if no space was found.
   */
  pickRandomEmptySpace(width: number, height: number, iteration = 0): GameObject | null {
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

  /**
   * Occupy a space in the grid.
   *
   * @param x Represents the x position of the object.
   * @param y Represents the y position of the object.
   * @param width Represents the width of the object.
   * @param height Represents the height of the object.
   * @param type Represents the type of the object.
   */
  occupySpace(x: number, y: number, width: number, height: number, type: string): void {
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

  /**
   * Place the boat in the grid.
   */
  private placeBoat(): void {
    this.calculateBoatPostion();
    for (let i = this.boat.x; i < this.boat.x + this.boat.width; i++) {
      for (let j = this.boat.y; j < this.boat.y + this.boat.height; j++) {
        this.grid[i][j].ocupied = true;
        this.grid[i][j].type = 'boat';
      }
    }
  }

  /**
   * Calculate the boat position. The boat is positioned in the center of the grid and has padding (the shown fish/word
   * should not overlap with the boat).
   */
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
