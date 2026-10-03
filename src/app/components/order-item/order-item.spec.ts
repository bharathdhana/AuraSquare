import { describe, it, expect, beforeEach } from 'vitest';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';

import { OrderItemComponent } from './order-item';

describe('OrderItemComponent', () => {
  let component: OrderItemComponent;
  let fixture: ComponentFixture<OrderItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrderItemComponent],
      providers: [provideHttpClient(), provideRouter([])]
    }).compileComponents();

    fixture = TestBed.createComponent(OrderItemComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
