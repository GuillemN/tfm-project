import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EstanyDetallComponent } from './estany-detall.component';

describe('EstanyDetallComponent', () => {
  let component: EstanyDetallComponent;
  let fixture: ComponentFixture<EstanyDetallComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EstanyDetallComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EstanyDetallComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
