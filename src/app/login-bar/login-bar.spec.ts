import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginBar } from './login-bar';

describe('LoginBar', () => {
  let component: LoginBar;
  let fixture: ComponentFixture<LoginBar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginBar]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoginBar);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
