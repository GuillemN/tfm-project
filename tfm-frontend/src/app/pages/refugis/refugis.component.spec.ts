import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RefugisComponent } from './refugis.component';

describe('RefugisComponent', () => {
  let component: RefugisComponent;
  let fixture: ComponentFixture<RefugisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RefugisComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RefugisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
