import { TestBed } from '@angular/core/testing';
import { GameConsoleComponent } from './game-console.component';
import {CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA} from '@angular/core';
import {GameService} from './game.service';
import {BehaviorSubject} from 'rxjs';

describe('GameConsoleComponent', () => {
  let console: GameConsoleComponent;
  let service: GameService;
  beforeEach((() => {
    service = new GameService();
    console = new GameConsoleComponent(service);
    TestBed.configureTestingModule({
      declarations: [
        GameConsoleComponent
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
    console = null;
  });

  it('should create the game console', (() => {
    const fixture = TestBed.createComponent(GameConsoleComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));

  it('ngOnInit should set variables', (() => {
    console.ngOnInit();
    const result1 = service.redTurnObs;
    const result2 = service.resetGameBeh;
    expect(console.redTurn$).toEqual(result1);
    expect(console._resetGame).toEqual(result2);
    expect(console.turn).toBe('Red');
  }));

  it('resetGame should set _resetGame to true if was false', (() => {
    console._resetGame = new BehaviorSubject<boolean>(false);
    console.resetGame();
    expect(console._resetGame).toBeTruthy();
  }));

  it('resetGame should set _resetGame to true if was true', (() => {
    console._resetGame = new BehaviorSubject<boolean>(true);
    console.resetGame();
    expect(console._resetGame).toBeTruthy();
  }));

});
