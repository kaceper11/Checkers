import { Component } from '@angular/core';
import { OnInit } from '@angular/core';
import { GameBoardComponent } from './game-board.component';
import { GameConsoleComponent } from './game-console.component';
import { GameService }	 from './game.service';
import { Observable } from 'rxjs/internal/Observable';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  isWinner = false;
  winner: string = null;

  public isWinner$: Observable<string>;

  public _resetGame: BehaviorSubject<boolean>;

  constructor(
    private service: GameService
  ) {}

  ngOnInit() {
    this.isWinner$ = this.service.isWinnerObs;
    this.isWinner$.subscribe(w => {
    if (w !== 'none') {
      this.isWinner = true;
      this.winner = w;
    } else {
      this.isWinner = false;
      this.winner = 'none';
    }
  });

    this._resetGame = this.service.resetGameBeh;
  }

  onReset() {
    this._resetGame.next(true);
  }

}
