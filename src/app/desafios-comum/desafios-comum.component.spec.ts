import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DesafiosComumComponent } from './desafios-comum.component';

describe('DesafiosComumComponent', () => {
  let component: DesafiosComumComponent;
  let fixture: ComponentFixture<DesafiosComumComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DesafiosComumComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DesafiosComumComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
