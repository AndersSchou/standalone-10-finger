import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-modules-games-fishing',
  templateUrl: './fishing.component.html',
  styleUrls: ['./fishing.component.scss']
})
export class AppGamesFishingComponent implements OnInit {
  showLoadingScreen = true;

  constructor() { }

  ngOnInit(): void {
    setTimeout(() => {
      this.showLoadingScreen = false;
    }, 3000);
  }
}
