import { Component, OnInit } from '@angular/core';
import { GameService }	 from './game.service';
import { Observable }	from 'rxjs/internal/Observable';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';

@Component({
  selector: 'game-console',
  templateUrl: './game-console.component.html',
  styleUrls: ['./game-console.component.css']
})
export class GameConsoleComponent implements OnInit {
  public turn: string = null;
  public redTurn$: Observable<boolean>;
  public _resetGame: BehaviorSubject<boolean>;

  constructor(
    private service: GameService
  ) {}

  ngOnInit() {
    this.redTurn$ = this.service.redTurnObs;
    this.redTurn$.subscribe(redTurn => {
    this.turn = redTurn ? 'Red' : 'Black';
  });

  // Behavior Subjects
    this._resetGame = this.service.resetGameBeh;
    this._resetGame.subscribe(reset => {
    this.turn = 'Red';
    });
  }

  resetGame() {
    this._resetGame.next(true);
  }

}
