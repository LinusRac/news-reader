import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewsViewer } from './news-viewer';

describe('NewsViewer', () => {
  let component: NewsViewer;
  let fixture: ComponentFixture<NewsViewer>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewsViewer]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewsViewer);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
