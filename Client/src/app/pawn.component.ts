import { Component, Input }	from '@angular/core';
import { Pawn }	from './piece';

@Component({
  selector: 'pawn',
  templateUrl: './pawn.component.html'
})
export class PawnComponent {
  @Input() pawn: Pawn;

}
