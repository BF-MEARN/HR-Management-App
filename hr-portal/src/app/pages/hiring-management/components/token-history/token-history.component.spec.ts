import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TokenHistoryComponent } from './token-history.component';

describe('TokenHistoryComponent', () => {
  let component: TokenHistoryComponent;
  let fixture: ComponentFixture<TokenHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TokenHistoryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TokenHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
