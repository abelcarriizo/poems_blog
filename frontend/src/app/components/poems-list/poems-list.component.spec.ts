import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PoemsListComponent } from './poems-list.component';

describe('PoemsListComponent', () => {
  let component: PoemsListComponent;
  let fixture: ComponentFixture<PoemsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PoemsListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PoemsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
