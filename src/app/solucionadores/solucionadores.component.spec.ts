import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SolucionadoresComponent } from './solucionadores.component';

describe('SolucionadoresComponent', () => {
  let component: SolucionadoresComponent;
  let fixture: ComponentFixture<SolucionadoresComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SolucionadoresComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SolucionadoresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
