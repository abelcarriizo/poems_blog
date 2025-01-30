import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminPoemsComponent } from './admin-poems.component';

describe('AdminPoemsComponent', () => {
  let component: AdminPoemsComponent;
  let fixture: ComponentFixture<AdminPoemsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdminPoemsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminPoemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
