import { TestBed } from '@angular/core/testing';
import { SpaceComponent } from './space.component';
import { Space } from './space';
import {CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA} from '@angular/core';
import {GameService} from './game.service';
import {Piece} from './piece';

describe('SpaceComponent', () => {
  let space: Space;

  beforeEach((() => {
    space = new Space(true, 6, 7);
    TestBed.configureTestingModule({
      declarations: [
        SpaceComponent
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
    space = null;
  });

  it('should create the space', (() => {
    const fixture = TestBed.createComponent(SpaceComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));

  it('creating new Space should correctly assign properties', (() => {
    expect(space.playable).toBeTruthy();
    expect(space.col).toBe(7);
    expect(space.row).toBe(6);
  }));

  it('addPiece should call movePiece 1 time when piece is null', (() => {
    const p: Piece = new Piece('red', 5, 4);
    const spy = spyOn(Piece.prototype, 'movePiece').and.callThrough();
    space.piece = null;
    space.addPiece(p);
    expect(space.piece).toEqual(p);
    expect(spy).toHaveBeenCalledTimes(1);
  }));

  it('addPiece should call movePiece 0 times when piece is not null', (() => {
    const p: Piece = new Piece('red', 5, 4);
    const spy = spyOn(Piece.prototype, 'movePiece').and.callThrough();
    space.piece = p;
    space.addPiece(p);
    expect(spy).toHaveBeenCalledTimes(0);
  }));

  it('clearPiece should be null when piece is not null', (() => {
    const p: Piece = new Piece('red', 5, 4);
    space.piece = p;
    space.clearPiece();
    expect(space.piece).toBe(null);
  }));

  it('clearPiece should be null when piece is null', (() => {
    space.piece = null;
    space.clearPiece();
    expect(space.piece).toBe(null);
  }));

});
