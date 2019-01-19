import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { Piece, Pawn, King }	from './piece';
import { PawnComponent } from './pawn.component';
import { Space } from './space';
import { CheckerBoard }	from './checkerBoard';
import {CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA} from '@angular/core';
import {GameService} from './game.service';
import createSpyObj = jasmine.createSpyObj;

describe('GameService', () => {
  let service: GameService;
  let board: any;
  let piece: Piece;

  beforeEach((() => {
    service = new GameService();
    board = new CheckerBoard().board;


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
    board = null;
    piece = null;
  });

  it('when resetting the game, resetGame() method should be called once', () => {
    const spy = spyOn(GameService.prototype, 'resetGame').and.callThrough();
    service.resetGame();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('when resetting the game, loadIsWinner() should be called with "none" param', () => {
    const spy = spyOn(GameService.prototype, 'loadIsWinner').and.callThrough();
    service.resetGame();
    expect(spy).toHaveBeenCalledWith('none');
  });

  it('when resetting the game, loadResetGame() should be called with "false" param', () => {
    const spy = spyOn(GameService.prototype, 'loadResetGame').and.callThrough();
    service.resetGame();
    expect(spy).toHaveBeenCalledWith(false);
  });


  it('when resetting the game, sendMessage() should be called once', () => {
    const spy = spyOn(GameService.prototype, 'sendMessage').and.callThrough();
    service.resetGame();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('canJump should return false when all values are null', () => {
    expect(service.canJump(null, null, null)).toBeFalsy();
  });

  it('canJump should return true when all are fine', () => {
    const p: Piece = new Piece('red', 4, 5);
    const p2: Piece = new Piece('black', 6, 6);
    const sp: Space = new Space(true, 5, 5);
    const diag: Space = new Space(true, 5, 5);
    sp.piece = p2;
    diag.piece = null;
    expect(service.canJump(p, sp, diag)).toBeTruthy();
  });

  it('canJump should return false when one is not fine', () => {
    const p: Piece = new Piece('red', 4, 5);
    const p2: Piece = new Piece('black', 6, 6);
    const sp: Space = new Space(true, 5, 5);
    const diag: Space = new Space(true, 5, 5);
    sp.piece = null;
    diag.piece = p2;
    expect(service.canJump(p, sp, diag)).toBeFalsy();
  });

  it('getDiagMoveSpace should return  null when space is null', () => {
    const p: Piece = new Piece('red', 4, 5);
    const sp: Space = null;
    const diag: Space = new Space(true, 5, 5);
    expect(service.getDiagMoveSpace(p, sp, diag)).toBe(null);
  });

  it('getDiagMoveSpace should return space when space is not null and sp.piece is null', () => {
    const p: Piece = new Piece('red', 4, 5);
    const sp: Space = new Space(true, 5, 5);
    const diag: Space = new Space(true, 5, 5);
    sp.piece = null;
    expect(service.getDiagMoveSpace(p, sp, diag)).toBe(sp);
  });

  it('getDiagMoveSpace should return space(diag) when space is not null and canJump = true', () => {
    const p: Piece = new Piece('red', 4, 5);
    const sp: Space = new Space(true, 5, 5);
    const diag: Space = new Space(true, 5, 5);
    const p2: Piece = new Piece('black', 6, 6);
    sp.piece = p2;
    spyOn(GameService.prototype, 'canJump').and.returnValue(true);
    expect(service.getDiagMoveSpace(p, sp, diag)).toBe(diag);
  });

  it('getDiagMoveSpace should return null when space is not null and canJump = false', () => {
    const p: Piece = new Piece('red', 4, 5);
    const sp: Space = new Space(true, 5, 5);
    const diag: Space = new Space(true, 5, 5);
    const p2: Piece = new Piece('black', 6, 6);
    sp.piece = p2;
    spyOn(GameService.prototype, 'canJump').and.returnValue(false);
    expect(service.getDiagMoveSpace(p, sp, diag)).toBe(null);
  });

  it('getDiagJumpSpace should return null when space is null', () => {
    const p: Piece = new Piece('red', 4, 5);
    const sp: Space = null;
    const diag: Space = new Space(true, 5, 5);
    expect(service.getDiagJumpSpace(p, sp, diag)).toBe(null);
  });

  it('getDiagJumpSpace should return  space(diag) when  space is not null and canJump = true', () => {
    const p: Piece = new Piece('red', 4, 5);
    const sp: Space = new Space(true, 5, 5);
    const diag: Space = new Space(true, 5, 5);
    const p2: Piece = new Piece('black', 6, 6);
    sp.piece = p2;
    spyOn(GameService.prototype, 'canJump').and.returnValue(true);
    expect(service.getDiagJumpSpace(p, sp, diag)).toBe(diag);
  });

  it('getDiagJumpSpace shold return null when space is not null and canJump = false', () => {
    const p: Piece = new Piece('red', 4, 5);
    const sp: Space = new Space(true, 5, 5);
    const diag: Space = new Space(true, 5, 5);
    const p2: Piece = new Piece('black', 6, 6);
    sp.piece = p2;
    spyOn(GameService.prototype, 'canJump').and.returnValue(false);
    expect(service.getDiagJumpSpace(p, sp, diag)).toBe(null);
  });

  it('isEndSpace should be true when sp.row  = 0', () => {
    const sp: Space = new Space(true, 0, 5);
    expect(service.isEndSpace(sp)).toBeTruthy();
  });

  it('isEndSpace should be true when sp.row  = 7', () => {
    const sp: Space = new Space(true, 7, 5);
    expect(service.isEndSpace(sp)).toBeTruthy();
  });

  it('isEndSpace should be false when sp.row  != 7 and sp.row !=0', () => {
    const sp: Space = new Space(true, 5, 5);
    expect(service.isEndSpace(sp)).toBeFalsy();
  });

  it('checkBoardSpace should be null when conditions are not satisfied ', () => {
    expect(service.checkBoardSpace(9, 8)).toBe(null);
  });

  it('checkBoardSpace should return space when conditions are satisfied ', () => {
    const result: Space = new Space(true, 4, 6);
    result.piece = null;
    result.highlight = false;
    result.jump = false;
    result.playable = true;
    result.row = 4;
    result.col = 6;
    result.moveTo = false;
    expect(service.checkBoardSpace(4, 6)).toEqual(result);
  });

  it('getPiece should return null when conditions are not satisfied', () => {
    const sp: Space = new Space(true, 5, 5);
    spyOn(GameService.prototype, 'checkBoardSpace').and.returnValue(sp);
    expect(service.getPiece(4, 7)).toBe(null);
  });

  it('getPiece should return space.piece when conditions are satisfied', () => {
    const sp: Space = new Space(true, 5, 5);
    const p: Piece = new Piece('black', 6, 6);
    sp.piece = p;
    spyOn(GameService.prototype, 'checkBoardSpace').and.returnValue(sp);
    expect(service.getPiece(4, 7)).toEqual(sp.piece);
  });

  it('makeKing should change piece to  red king', () => {
    const p: Piece = new Piece('red', 6, 6);
    const sp: Space = new Space(true, 6, 6);
    const king: King = new King(p.isRed === true ? 'red' : 'black', p.row, p.col);
    spyOn(GameService.prototype, 'makeKing').and.callThrough();
    spyOn(GameService.prototype, 'findPiece').and.returnValue(sp);
    sp.clearPiece();
    sp.addPiece(king);
    service.makeKing(p);
    expect(service._selectedPiece).toEqual(king);
  });

  it('clickAtPiece should do nothing when _doubleJump = false', () => {
    const p: Piece = new Piece('black', 6, 6);
    spyOn(GameService.prototype, 'clearSelections').and.callThrough();
    spyOn(GameService.prototype, 'findPiece').and.callThrough();
    spyOn(GameService.prototype, 'selectMoveableSpaces').and.callThrough();
    service._doubleJump = false;
    service.clickAPiece(p);
    expect(service.clearSelections).toHaveBeenCalledTimes(0);
    expect(service.findPiece).toHaveBeenCalledTimes(0);
    expect(service.selectMoveableSpaces).toHaveBeenCalledTimes(0);
  });

  it('checkForJump should return true if canJump is true', () => {
    const sp: Space = new Space(true, 6, 6);
    spyOn(GameService.prototype, 'canJump').and.returnValue(true);
    const spy = spyOn(GameService.prototype, 'checkForJump').and.callThrough();
    expect(spy).toBeTruthy();
  });

  it('checkForJump should return false if canJump is false', () => {
    const sp: Space = new Space(true, 6, 6);
    spyOn(GameService.prototype, 'canJump').and.returnValue(false);
    const spy = spyOn(GameService.prototype, 'checkForJump').and.callThrough();
    expect(spy).toBeTruthy();
  });

  it('clearJumpedPiece should call getPiece - 4 times and findPiece once', () => {
    const spy = spyOn(GameService.prototype, 'getPiece').and.callThrough();
    const sp2: Space = new Space(true, 5, 4);
    const spy2 = spyOn(GameService.prototype, 'findPiece').and.returnValue(sp2);
    const sp: Space = new Space(true, 6, 6);

    service.clearJumpedPiece(sp);
    expect(spy).toHaveBeenCalledTimes(4);
    expect(spy2).toHaveBeenCalledTimes(1);
  });

  it('calcAllDiag should call callDiag 4 times', () => {
    const spy = spyOn(GameService.prototype, 'calcDiag');
    const p: Piece = new Piece('red', 6, 8);
    service.calcAllDiag(p);
    expect(spy).toHaveBeenCalledTimes(4);
  });

});
