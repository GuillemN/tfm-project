import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RefugiDetallComponent } from './refugi-detall.component';

describe('RefugiDetallComponent', () => {
  let component: RefugiDetallComponent;
  let fixture: ComponentFixture<RefugiDetallComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RefugiDetallComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RefugiDetallComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
