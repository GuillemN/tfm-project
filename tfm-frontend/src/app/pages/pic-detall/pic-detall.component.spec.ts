import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PicDetallComponent } from './pic-detall.component';

describe('PicDetallComponent', () => {
  let component: PicDetallComponent;
  let fixture: ComponentFixture<PicDetallComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PicDetallComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PicDetallComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
