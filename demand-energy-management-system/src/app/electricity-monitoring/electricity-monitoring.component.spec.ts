import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ElectricityMonitoringComponent } from './electricity-monitoring.component';

describe('ElectricityMonitoringComponent', () => {
  let component: ElectricityMonitoringComponent;
  let fixture: ComponentFixture<ElectricityMonitoringComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ElectricityMonitoringComponent]
    });
    fixture = TestBed.createComponent(ElectricityMonitoringComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
