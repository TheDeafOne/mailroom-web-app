import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { ExploreContainerComponentModule } from '../explore-container/explore-container.module';

import { dashboard } from './dashboard.page';

describe('dashboard', () => {
  let component: dashboard;
  let fixture: ComponentFixture<dashboard>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [dashboard],
      imports: [IonicModule.forRoot(), ExploreContainerComponentModule]
    }).compileComponents();

    fixture = TestBed.createComponent(dashboard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
