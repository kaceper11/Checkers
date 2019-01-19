import { BrowserModule }         from '@angular/platform-browser';
import {CUSTOM_ELEMENTS_SCHEMA, NgModule, NO_ERRORS_SCHEMA} from '@angular/core';

import { AppComponent }          from './app.component';
import { GameBoardComponent }    from './game-board.component';
import { GameConsoleComponent }  from './game-console.component';
import { GameService }	         from './game.service';
import { SpaceComponent }        from './space.component';
import { PawnComponent }         from './pawn.component';
import { KingComponent }         from './king.component';

@NgModule({
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA,
    NO_ERRORS_SCHEMA
  ],
  declarations: [
    AppComponent,
    GameBoardComponent,
    GameConsoleComponent,
    SpaceComponent,
    PawnComponent,
    KingComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [
  	GameService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
