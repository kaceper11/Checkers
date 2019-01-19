import { Piece }	from './piece';

export class Space {
  playable: boolean;
  piece: Piece = null;
  highlight: boolean = false;
  moveTo: boolean = false;
  jump: boolean = false;
  row: number;
  col: number;

  constructor(play: boolean, r: number, c: number) {
    this.playable = play;
    this.row = r;
    this.col = c;
  }

  addPiece(p: Piece) {
    if (this.piece == null) {
      this.piece = p;
      this.piece.movePiece(this.row, this.col);
    }
  }

  clearPiece() {
    if (this.piece != null) {
      this.piece = null;
    }
  }
}
