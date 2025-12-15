import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RefugiMapComponent } from './refugi-map.component';

describe('RefugiMapComponent', () => {
  let component: RefugiMapComponent;
  let fixture: ComponentFixture<RefugiMapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RefugiMapComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RefugiMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
