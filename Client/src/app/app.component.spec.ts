import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import {CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA} from '@angular/core';
import {GameService} from './game.service';
import {BehaviorSubject} from 'rxjs';

describe('AppComponent', () => {
  let service: GameService;
  let app: AppComponent;
  beforeEach((() => {
    service = new GameService();
    app = new AppComponent(service);
    TestBed.configureTestingModule({
      declarations: [
        AppComponent
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
    app = null;
  });

  it('should create the app', (() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app2 = fixture.debugElement.componentInstance;
    expect(app2).toBeTruthy();
  }));

  it('onReset should change _resetGame to true when _resetGame is false', (() => {
    app._resetGame = new BehaviorSubject<boolean>(false);
    app.onReset();
    expect(app._resetGame).toBeTruthy();
  }));

  it('onReset should not change _resetGame if it is true', (() => {
    app._resetGame = new BehaviorSubject<boolean>(true);
    app.onReset();
    expect(app._resetGame).toBeTruthy();
  }));

  it('ngOnInit should correctly assign variables', function () {
    app.ngOnInit();
    const result = service.isWinnerObs;
    const result2 = service.resetGameBeh;
    expect(app.isWinner$).toEqual(result);
    expect(app.isWinner).toBeFalsy();
    expect(app._resetGame).toEqual(result2);
  });

});
