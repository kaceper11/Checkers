import { TestBed } from '@angular/core/testing';
import { GameBoardComponent } from './game-board.component';
import {CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA} from '@angular/core';
import {GameService} from './game.service';
import {after} from 'selenium-webdriver/testing';

describe('GameBoardComponent', () => {
  let gameBoard: GameBoardComponent;
  let service: GameService;
  beforeEach((() => {
    service = new GameService();
    gameBoard = new GameBoardComponent(service);
    TestBed.configureTestingModule({
      declarations: [
        GameBoardComponent
      ],
      schemas: [
        CUSTOM_ELEMENTS_SCHEMA,
        NO_ERRORS_SCHEMA
      ],
      providers: [
        GameService
      ]
    }).compileComponents();
  }));

  afterEach( () => {
    service = null;
    gameBoard = null;
  });

  it('should create the game board', (() => {
    const fixture = TestBed.createComponent(GameBoardComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));

  it('when onReset is called, then variable should be set and resetGame called', (() => {
    const spy = spyOn(GameService.prototype, 'resetGame').and.callThrough();
    gameBoard.onReset();
    const result = service.board;
    expect(gameBoard.board).toEqual(result);
    expect(spy).toHaveBeenCalledTimes(1);
  }));

  it('when ngOnInit is called, then variables should be set and onReset called', (() => {
    const spy = spyOn(GameBoardComponent.prototype, 'onReset').and.callThrough();
    gameBoard.ngOnInit();
    const result = service.resetGameObs;
    expect(gameBoard.resetGame$).toEqual(result);
    expect(spy).toHaveBeenCalled();
  }));

});
