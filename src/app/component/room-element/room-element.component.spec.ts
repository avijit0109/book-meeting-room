import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RoomElementComponent } from './room-element.component';

describe('RoomElementComponent', () => {
  let component: RoomElementComponent;
  let fixture: ComponentFixture<RoomElementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RoomElementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RoomElementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
