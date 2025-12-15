import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EstanysComponent } from './estanys.component';

describe('EstanysComponent', () => {
  let component: EstanysComponent;
  let fixture: ComponentFixture<EstanysComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EstanysComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EstanysComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
