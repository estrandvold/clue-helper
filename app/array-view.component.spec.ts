import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { By }              from '@angular/platform-browser';
import { DebugElement }    from '@angular/core';
import { FormsModule }   from '@angular/forms';

import { ArrayViewComponent } from './array-view.component';
import { ArrayViewItem } from './array-view-item';

describe('ArrayViewComponent tests', () => {

  let comp:    ArrayViewComponent;
  let fixture: ComponentFixture<ArrayViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        ArrayViewComponent
      ],
      providers: [],
      imports: [
        FormsModule
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArrayViewComponent);

    comp = fixture.componentInstance;
    comp.strings = [new ArrayViewItem("one"), new ArrayViewItem("two")];
  });

  it('should display all items', () => {
    fixture.detectChanges();

    let items = fixture.debugElement.queryAll(By.css("input"));
    expect(items.length).toBe(2);
  });

  it('should remove items', () => {
    fixture.detectChanges();
    let removeButton = fixture.debugElement.query(By.css("#delete0Button")).nativeElement;
    removeButton.click();
    fixture.detectChanges();

    let items = fixture.debugElement.queryAll(By.css("input"));
    expect(items.length).toBe(1);
  });

  it('should add items', () => {
    fixture.detectChanges();
    let removeButton = fixture.debugElement.query(By.css("#newButton")).nativeElement;
    removeButton.click();
    fixture.detectChanges();

    let items = fixture.debugElement.queryAll(By.css("input"));
    expect(items.length).toBe(3);
  });

});
