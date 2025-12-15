import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViesFerradesDetallComponent } from './vies-ferrades-detall.component';

describe('ViesFerradesDetallComponent', () => {
  let component: ViesFerradesDetallComponent;
  let fixture: ComponentFixture<ViesFerradesDetallComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViesFerradesDetallComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViesFerradesDetallComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
