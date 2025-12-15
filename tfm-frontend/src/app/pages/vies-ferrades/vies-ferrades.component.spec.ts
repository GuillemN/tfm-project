import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViesFerradesComponent } from './vies-ferrades.component';

describe('ViesFerradesComponent', () => {
  let component: ViesFerradesComponent;
  let fixture: ComponentFixture<ViesFerradesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViesFerradesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViesFerradesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
