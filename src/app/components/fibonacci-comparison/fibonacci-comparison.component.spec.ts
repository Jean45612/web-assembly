import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FibonacciComparisonComponent } from './fibonacci-comparison.component';

describe('FibonacciComparisonComponent', () => {
  let component: FibonacciComparisonComponent;
  let fixture: ComponentFixture<FibonacciComparisonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FibonacciComparisonComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FibonacciComparisonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
