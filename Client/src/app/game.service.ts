import { Injectable, OnInit } from '@angular/core';
import { Piece, Pawn, King }	from './piece';
import { Space } from './space';
import { CheckerBoard }	from './checkerBoard';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { Observable } from 'rxjs/internal/Observable';
import * as io from 'socket.io-client';


@Injectable()
export class GameService {
  private socket: SocketIOClient.Socket;
  public board: any;
  public _selectedPiece: Piece = null;
  public _redTurn = true;
  public _doubleJump = false;
  private SERVER_URL = 'http://localhost:4200';

  // Behavior Subjects
  private _redTurnBeh: BehaviorSubject<boolean>;
  private readonly _resetGame: BehaviorSubject<boolean>;
  private _isWinner: BehaviorSubject<string>;

  constructor() {
    this.socket = io(this.SERVER_URL).connect();
    this._redTurnBeh = <BehaviorSubject<boolean>>new BehaviorSubject(true);
    this._resetGame = <BehaviorSubject<boolean>>new BehaviorSubject(true);
    this._isWinner = <BehaviorSubject<string>>new BehaviorSubject('none');
    this.resetGame();
  }

  ngOnInit() {
      this.onNewMessage();
  }

  // EMITTER
  sendMessage(msg: string) {
    this.socket.emit('sendMessage', {
      message: msg });
    console.log('Sent message to Websocket Server: ');
    console.log(msg);
  }

  // HANDLER
  onNewMessage() {
    return Observable.create(observer => {
      this.socket.on('newMessage', msg => {
        console.log('Received message from Websocket Server: ');
        console.log(msg);
        observer.next(msg);

        let tempBoard = msg as CheckerBoard;
        tempBoard.board.forEach( row => {
          row.forEach(space => {
            space.playable = false;
            space.moveTo = false;
            space.highlight = false;
            space.col = row;
          });
        });

        tempBoard = this.board;
        this._redTurn = true;
      });
    });
  }

  resetGame() {
    this.board = new CheckerBoard().board;
    this._redTurn = true;
    this.loadResetGame(false);
    this.loadIsWinner('none');

    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 8; j++) {
        if (this.board[i][j].playable === true) {
          this.board[i][j].addPiece(new Pawn('red', i, j));
        }
      }
    }
    for (let i = 5; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        if (this.board[i][j].playable === true) {
          this.board[i][j].addPiece(new Pawn('black', i, j));
        }
      }
    }

    const tempBoard: CheckerBoard = new CheckerBoard();
    tempBoard.board.forEach( row => {
      row.forEach(space => {
        delete space.playable;
        delete space.moveTo;
        delete space.highlight;
        delete space.col;
        delete space.row;
      });
    });
    this.sendMessage(JSON.stringify(tempBoard));
  }

  loadRedTurn(turn: boolean) {
    this._redTurnBeh.next(turn);
  }

  loadResetGame(reset: boolean) {
    this._resetGame.next(reset);
  }

  loadIsWinner(winner: string) {
    this._isWinner.next(winner);
  }

  get redTurnObs() {
    return this._redTurnBeh.asObservable();
  }

  get resetGameBeh() {
    return this._resetGame;
  }

  get resetGameObs() {
    return this._resetGame.asObservable();
  }

  get isWinnerObs() {
    return this._isWinner.asObservable();
  }

  isWinner(turn: boolean) {
    const redTeam: Piece[] = [];
    const blackTeam: Piece[] = [];
    let winner = true;

    this.board.forEach(row => {
      row.forEach(space => {
        if (space.piece !== null) {
          if (space.piece.isRed) {
            redTeam.push(space.piece);
          } else {
            blackTeam.push(space.piece);
          }
        }
      });
    });

    if (turn) { // red turn
      redTeam.forEach(piece => {
        if (this.canMove(piece)) { // jesli jakis pionek moze sie ruszyc, to nie ma zwyciezcy
          winner = false;
        }
      });
    } else { // black turn
      blackTeam.forEach(piece => {
        if (this.canMove(piece)) { // jesli jakis pionek moze sie ruszyc, to nie ma zwyciezcy
          winner = false;
        }
      });
    }

    if (winner) {
      let win = 'none';
      if (turn) {
        win = 'Black';
      } else {
        win = 'Red';
      }
      this.loadIsWinner(win);
    }
  }

  clickAPiece(p: Piece) {
    if (this._doubleJump) {
      if (this._selectedPiece === p) {
        this.clearSelections();
        this._selectedPiece = p;
        this.findPiece(p).highlight = true;
        this.selectMoveableSpaces(p);
      }
    } else if (this._redTurn === p.isRed) {
      this.clearSelections();
      this._selectedPiece = p;
      this.findPiece(p).highlight = true;
      this.selectMoveableSpaces(p);
    }
  }

  clickEmptySpace(sp: Space) {
    if (this._selectedPiece !== null && sp.moveTo) { // kiedy jest pusta przestrzen i pionsek moze sie ruszyc
      this.findPiece(this._selectedPiece).clearPiece(); // usun pionek ze starego pola
      sp.addPiece(this._selectedPiece); // dodaj pionek do nowego pola
      if (sp.jump === true) { // pionek zostal zbity
        this.clearJumpedPiece(sp);
      }
      if (this.isEndSpace(sp)) { // Zaznaczony pionek zostaje damka
        this.makeKing(this._selectedPiece);
      }
      if (sp.jump === false || !this.checkForJump(sp)) {
        this._redTurn = !this._redTurn;
        this.loadRedTurn(this._redTurn);
        this._doubleJump = false;
        this.clearSelections();
        this.isWinner(this._redTurn);
      } else { // double jump opportunity
        this._doubleJump = true;
        this.clickAPiece(this._selectedPiece);
      }
    }
  }

  findMoveableSpaces(p: Piece) {
    let upRight = null;
    let downRight = null;
    let upLeft = null;
    let downLeft = null;

    if (!this._doubleJump) {
      upRight = this.getDiagMoveSpace(p, this.calcAllDiag(p).upRightDiag.sp, this.calcAllDiag(p).upRightDiag.diag);
      downRight = this.getDiagMoveSpace(p, this.calcAllDiag(p).downRightDiag.sp, this.calcAllDiag(p).downRightDiag.diag);
      upLeft = this.getDiagMoveSpace(p, this.calcAllDiag(p).upLeftDiag.sp, this.calcAllDiag(p).upLeftDiag.diag);
      downLeft = this.getDiagMoveSpace(p, this.calcAllDiag(p).downLeftDiag.sp, this.calcAllDiag(p).downLeftDiag.diag);
    } else {
      upRight = this.getDiagJumpSpace(p, this.calcAllDiag(p).upRightDiag.sp, this.calcAllDiag(p).upRightDiag.diag);
      downRight = this.getDiagJumpSpace(p, this.calcAllDiag(p).downRightDiag.sp, this.calcAllDiag(p).downRightDiag.diag);
      upLeft = this.getDiagJumpSpace(p, this.calcAllDiag(p).upLeftDiag.sp, this.calcAllDiag(p).upLeftDiag.diag);
      downLeft = this.getDiagJumpSpace(p, this.calcAllDiag(p).downLeftDiag.sp, this.calcAllDiag(p).downLeftDiag.diag);
    }

    return {
      upRight: upRight,
      downRight: downRight,
      upLeft: upLeft,
      downLeft: downLeft
    };
  }

  selectMoveableSpaces(p: Piece) {
    const upRight = this.findMoveableSpaces(p).upRight;
    const downRight = this.findMoveableSpaces(p).downRight;
    const upLeft = this.findMoveableSpaces(p).upLeft;
    const downLeft = this.findMoveableSpaces(p).downLeft;

    if (upRight !== null) {
      upRight.highlight = upRight.moveTo = true;
    }
    if (upLeft !== null) {
      upLeft.highlight = upLeft.moveTo = true;
    }
    if (downRight !== null) {
      downRight.highlight = downRight.moveTo = true;
    }
    if (downLeft !== null) {
      downLeft.highlight = downLeft.moveTo = true;
    }
  }

  canMove(p: Piece): boolean {
    const upRight = this.findMoveableSpaces(p).upRight;
    const downRight = this.findMoveableSpaces(p).downRight;
    const upLeft = this.findMoveableSpaces(p).upLeft;
    const downLeft = this.findMoveableSpaces(p).downLeft;

    if (upRight == null && downRight == null && upLeft == null && downLeft == null) {
      return false;  // niezdolny do ruchu
    } else {
      return true;  // zdolny do ruchu w przynajmniej jednym kierunku
    }
  }

  clearJumpedPiece(sp: Space) {
    const pieces = new Array();

    pieces.push(this.getPiece(sp.row - 1, sp.col - 1));
    pieces.push(this.getPiece(sp.row - 1, sp.col + 1));
    pieces.push(this.getPiece(sp.row + 1, sp.col - 1));
    pieces.push(this.getPiece(sp.row + 1, sp.col + 1));

    this.findPiece(pieces.find(p => p !== null && p.jump === true)).clearPiece();

  }

  checkForJump(sp: Space): boolean {
    const p = sp.piece;

    if (this.canJump(p, this.calcAllDiag(p).upRightDiag.sp, this.calcAllDiag(p).upRightDiag.diag) ||
      this.canJump(p, this.calcAllDiag(p).downRightDiag.sp, this.calcAllDiag(p).downRightDiag.diag) ||
      this.canJump(p, this.calcAllDiag(p).upLeftDiag.sp, this.calcAllDiag(p).upLeftDiag.diag) ||
      this.canJump(p, this.calcAllDiag(p).downLeftDiag.sp, this.calcAllDiag(p).downLeftDiag.diag) ) {
      return true;
    } else {
      return false;
    }

  }

  canJump(p: Piece, sp: Space, diag: Space): boolean {
    if (sp === null || diag === null || sp.piece === null) {
      return false;
    } else if (p.isRed === !sp.piece.isRed && diag !== null && diag.piece === null) {
      return true;
    } else {
      return false;
    }
  }


  calcAllDiag(p: Piece) {
    return {
      upRightDiag: this.calcDiag(p, true, true),
      downRightDiag: this.calcDiag(p, false, true),
      upLeftDiag: this.calcDiag(p, true, false),
      downLeftDiag: this.calcDiag(p, false, false)
    };
  }


  calcDiag(p: Piece, up: boolean, right: boolean) {
    let neighborRow = -1; // -1 czyli poza planszą
    let neighborCol = -1;
    let diagRow = -1;
    let diagCol = -1;

    if (up) {
      if (right) {
        neighborRow = (<Pawn>p).getUpRightMove().row;
        neighborCol = (<Pawn>p).getUpRightMove().col;
        diagRow = (<Pawn>p).getDiagUpRightMove().row;
        diagCol = (<Pawn>p).getDiagUpRightMove().col;
      }
      if (!right) {
        neighborRow = (<Pawn>p).getUpLeftMove().row;
        neighborCol = (<Pawn>p).getUpLeftMove().col;
        diagRow = (<Pawn>p).getDiagUpLeftMove().row;
        diagCol = (<Pawn>p).getDiagUpLeftMove().col;
      }
    } else if (!up && p.type === 'king') {
      if (right) {
        neighborRow = (<King>p).getDownRightMove().row;
        neighborCol = (<King>p).getDownRightMove().col;
        diagRow = (<King>p).getDiagDownRightMove().row;
        diagCol = (<King>p).getDiagDownRightMove().col;
      }
      if (!right) {
        neighborRow = (<King>p).getDownLeftMove().row;
        neighborCol = (<King>p).getDownLeftMove().col;
        diagRow = (<King>p).getDiagDownLeftMove().row;
        diagCol = (<King>p).getDiagDownLeftMove().col;
      }
    }

    return {
      p: p,
      sp: this.checkBoardSpace(neighborRow, neighborCol),
      diag: this.checkBoardSpace(diagRow, diagCol)
    };
  }

  getDiagMoveSpace(p: Piece, sp: Space, diag: Space): Space {
    let space: Space = null;

    if (sp !== null) {
      if (sp.piece === null) {
        space = sp;
      } else if (this.canJump(p, sp, diag)) {
        sp.piece.jump = diag.jump = true;
        space = diag;
      } else {
        space = null;
      }
    }

    return space;
  }

  getDiagJumpSpace(p: Piece, sp: Space, diag: Space): Space {
    let space: Space = null;

    if (sp !== null) {
      if (this.canJump(p, sp, diag)) {
        sp.piece.jump = diag.jump = true;
        space = diag;
      } else {
        space = null;
      }
    }

    return space;
  }

  makeKing(p: Piece) {
    const king = new King(p.isRed === true ? 'red' : 'black', p.row, p.col);
    const space = this.findPiece(p);

    space.clearPiece();
    space.addPiece(king);

    this._selectedPiece = king;
  }

  isEndSpace(sp: Space): boolean {
    if (sp.row === 0 || sp.row === 7) {
      return true;
    } else {
      return false;
    }
  }

  checkBoardSpace(row: number, col: number): Space {
    if (row < 8 && row > -1 && col < 8 && col > -1) {
      return this.board[row][col];
    } else {
      return null;
    }
  }

  findPiece(p: Piece): Space {
    let sp: Space = null;

    this.board.forEach(row => row.forEach(space => {
      if (space.piece === p) {
        sp = space;
      }
    }));

    return sp;
  }

  getPiece(row: number, col: number): Piece {
    const space = this.checkBoardSpace(row, col);

    if (space !== null && space.piece !== null) {
      return space.piece;
    } else {
      return null;
    }
  }

  clearSelections() {
    this.board.forEach(row => row.forEach(space => {
      space.highlight = space.moveTo = space.jump = false;
      if (space.piece !== null) {
        space.piece.jump = false;
      }
    }));
  }


}
