import { TestBed } from '@angular/core/testing';
import { KingComponent } from './king.component';
import {CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA} from '@angular/core';
import {GameService} from './game.service';

describe('KingComponent', () => {
  beforeEach((() => {
    TestBed.configureTestingModule({
      declarations: [
        KingComponent
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
  it('should create the king', (() => {
    const fixture = TestBed.createComponent(KingComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));

});
