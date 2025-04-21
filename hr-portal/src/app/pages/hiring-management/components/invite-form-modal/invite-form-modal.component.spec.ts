import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InviteFormModalComponent } from './invite-form-modal.component';

describe('InviteFormModalComponent', () => {
  let component: InviteFormModalComponent;
  let fixture: ComponentFixture<InviteFormModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InviteFormModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InviteFormModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
