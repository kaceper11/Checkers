import { TestBed } from '@angular/core/testing';
import { PawnComponent } from './pawn.component';
import {CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA} from '@angular/core';
import {GameService} from './game.service';
import {Piece, Pawn, King} from './piece';

describe('PawnComponent', () => {
  beforeEach((() => {
    TestBed.configureTestingModule({
      declarations: [
        PawnComponent
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
  it('should create the pawn', (() => {
    const fixture = TestBed.createComponent(PawnComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));

  it('creating new Piece should set isRed to true if color is red', (() => {
    const p: Piece = new Piece('red', 5, 7);
    expect(p.isRed).toBeTruthy();
  }));

  it('creating new Piece should set row and column correctly', (() => {
    const p: Piece = new Piece('red', 5, 7);
    expect(p.row).toBe(5);
    expect(p.col).toBe(7);
  }));

  it('creating new Piece should set isRed to false if color is black', (() => {
    const p: Piece = new Piece('black', 5, 7);
    expect(p.isRed).toBeFalsy();
  }));

  it('creating new Pawn should set isRed to true if color is red', (() => {
    const p: Pawn = new Pawn('red', 5, 7);
    expect(p.isRed).toBeTruthy();
  }));

  it('creating new Pawn should set row and column correctly', (() => {
    const p: Pawn = new Pawn('red', 5, 7);
    expect(p.row).toBe(5);
    expect(p.col).toBe(7);
  }));

  it('creating new Pawn should set isRed to false if color is black', (() => {
    const p: Pawn = new Pawn('black', 5, 7);
    expect(p.isRed).toBeFalsy();
  }));

  it('creating new King should set isRed to true if color is red', (() => {
    const k: King = new King('red', 5, 7);
    expect(k.isRed).toBeTruthy();
  }));

  it('creating new King should set row and column correctly', (() => {
    const k: King = new King('red', 5, 7);
    expect(k.row).toBe(5);
    expect(k.col).toBe(7);
  }));

  it('creating new King should set isRed to false if color is black', (() => {
    const k: King = new King('black', 5, 7);
    expect(k.isRed).toBeFalsy();
  }));

  it('movePiece on Piece correctly assigns row and column', (() => {
    const p: Piece = new Piece('red', 5, 7);
    p.movePiece(1, 3);
    expect(p.row).toBe(1);
    expect(p.col).toBe(3);
  }));

  it('movePiece on Pawn correctly assigns row and column', (() => {
    const p: Pawn = new Pawn('red', 5, 7);
    p.movePiece(1, 3);
    expect(p.row).toBe(1);
    expect(p.col).toBe(3);
  }));

  it('movePiece on King correctly assigns row and column', (() => {
    const k: King = new King('red', 5, 7);
    k.movePiece(1, 3);
    expect(k.row).toBe(1);
    expect(k.col).toBe(3);
  }));

  it('Pawn: getUpRightMove  correctly returns col and row when color = red', (() => {
    const p: Pawn = new Pawn('red', 5, 7);
    const result = {
      row: 6,
      col: 8
    };
    expect(p.getUpRightMove()).toEqual(result);
  }));

  it('Pawn: getUpRightMove  correctly returns col and row when color = black', (() => {
    const p: Pawn = new Pawn('black', 4, 3);
    const result = {
      row: 3,
      col: 4
    };
    expect(p.getUpRightMove()).toEqual(result);
  }));

  it('Pawn: getUpLeftMove  correctly returns col and row when color = red', (() => {
    const p: Pawn = new Pawn('red', 5, 7);
    const result = {
      row: 6,
      col: 6
    };
    expect(p.getUpLeftMove()).toEqual(result);
  }));

  it('Pawn: getUpLeftMove  correctly returns col and row when color = black', (() => {
    const p: Pawn = new Pawn('black', 4, 3);
    const result = {
      row: 3,
      col: 2
    };
    expect(p.getUpLeftMove()).toEqual(result);
  }));

  it('Pawn: getDiagUpRightMove  correctly returns col and row when color = red', (() => {
    const p: Pawn = new Pawn('red', 5, 3);
    const result = {
      row: 7,
      col: 5
    };
    expect(p.getDiagUpRightMove()).toEqual(result);
  }));

  it('Pawn: getDiagUpRightMove  correctly returns col and row when color = black', (() => {
    const p: Pawn = new Pawn('black', 4, 3);
    const result = {
      row: 2,
      col: 5
    };
    expect(p.getDiagUpRightMove()).toEqual(result);
  }));


  it('Pawn: getDiagUpLeftMove  correctly returns col and row when color = red', (() => {
    const p: Pawn = new Pawn('red', 5, 3);
    const result = {
      row: 7,
      col: 1
    };
    expect(p.getDiagUpLeftMove()).toEqual(result);
  }));

  it('Pawn: getDiagUpLeftMove  correctly returns col and row when color = black', (() => {
    const p: Pawn = new Pawn('black', 4, 3);
    const result = {
      row: 2,
      col: 1
    };
    expect(p.getDiagUpLeftMove()).toEqual(result);
  }));

 ////////////////////////////////////////////

  it('King: getDownRightMove  correctly returns col and row when color = red', (() => {
    const k: King = new King('red', 5, 7);
    const result = {
      row: 4,
      col: 8
    };
    expect(k.getDownRightMove()).toEqual(result);
  }));

  it('King: getDownRightMove  correctly returns col and row when color = black', (() => {
    const k: King = new King('black', 4, 3);
    const result = {
      row: 5,
      col: 4
    };
    expect(k.getDownRightMove()).toEqual(result);
  }));

  it('King: getDownLeftMove  correctly returns col and row when color = red', (() => {
    const k: King = new King('red', 5, 7);
    const result = {
      row: 4,
      col: 6
    };
    expect(k.getDownLeftMove()).toEqual(result);
  }));

  it('King: getDownLeftMove  correctly returns col and row when color = black', (() => {
    const k: King = new King('black', 4, 3);
    const result = {
      row: 5,
      col: 2
    };
    expect(k.getDownLeftMove()).toEqual(result);
  }));

  it('King: getDiagDownRightMove  correctly returns col and row when color = red', (() => {
    const k: King = new King('red', 5, 3);
    const result = {
      row: 3,
      col: 5
    };
    expect(k.getDiagDownRightMove()).toEqual(result);
  }));

  it('King: getDiagDownRightMove  correctly returns col and row when color = black', (() => {
    const k: King = new King('black', 4, 3);
    const result = {
      row: 6,
      col: 5
    };
    expect(k.getDiagDownRightMove()).toEqual(result);
  }));


  it('King: getDiagDownLeftMove  correctly returns col and row when color = red', (() => {
    const k: King = new King('red', 5, 3);
    const result = {
      row: 3,
      col: 1
    };
    expect(k.getDiagDownLeftMove()).toEqual(result);
  }));

  it('King: getDiagDownLeftMove  correctly returns col and row when color = black', (() => {
    const k: King = new King('black', 4, 3);
    const result = {
      row: 6,
      col: 1
    };
    expect(k.getDiagDownLeftMove()).toEqual(result);
  }));

});
