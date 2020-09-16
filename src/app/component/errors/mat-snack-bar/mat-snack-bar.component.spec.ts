import { MatSnackBarModule } from '@angular/material/snack-bar';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MatSnackBarComponent } from './mat-snack-bar.component';

describe('MatSnackBarComponent', () => {
  let component: MatSnackBarComponent;
  let fixture: ComponentFixture<MatSnackBarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MatSnackBarComponent ],
      imports: [ MatSnackBarModule ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MatSnackBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});