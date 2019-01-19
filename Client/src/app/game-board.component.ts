import { Component }	 from '@angular/core';
import { OnInit } from '@angular/core';
import { Piece }	from './piece';
import { GameService }	 from './game.service';
import { Observable } from 'rxjs/internal/Observable';
import { SpaceComponent } from './space.component';

@Component({
  selector: 'game-board',
  templateUrl: './game-board.component.html',
  styleUrls: ['./game-board.component.css'],
})
export class GameBoardComponent implements OnInit {
  public board: any;

  public resetGame$: Observable<boolean>;

  constructor(
      private service: GameService
  ) {}

  ngOnInit() {
      this.resetGame$ = this.service.resetGameObs;
      this.resetGame$.subscribe(reset => {
          if (reset) {
              this.onReset();
          }
      });

      this.onReset();
  }

  onReset() {
      this.service.resetGame();
      this.board = this.service.board;
  }
}
