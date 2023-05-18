import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TopbarInfoComponent } from './topbar-info.component';

describe('TopbarInfoComponent', () => {
  let component: TopbarInfoComponent;
  let fixture: ComponentFixture<TopbarInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TopbarInfoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TopbarInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
