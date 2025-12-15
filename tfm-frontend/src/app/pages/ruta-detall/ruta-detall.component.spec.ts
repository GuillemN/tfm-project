import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RutaDetallComponent } from './ruta-detall.component';

describe('RutaDetallComponent', () => {
  let component: RutaDetallComponent;
  let fixture: ComponentFixture<RutaDetallComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RutaDetallComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RutaDetallComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
