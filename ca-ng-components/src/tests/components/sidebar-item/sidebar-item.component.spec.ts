import { ShIconComponent } from './../../../components';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { ShSidebarItemComponent } from '../../../components/sidebar-item/sidebar-item.component';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IdSequenceService } from '../../../services';

describe('SidebarItem component', () => {
  let component: ShSidebarItemComponent;
  let fixture: ComponentFixture<ShSidebarItemComponent>;
  let htmlElement: HTMLDivElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), RouterTestingModule],
      declarations: [ShSidebarItemComponent, ShIconComponent],
      providers: [IdSequenceService]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShSidebarItemComponent);
    component = fixture.debugElement.componentInstance;
    component.model = { name: 'command' } as any;
    fixture.detectChanges();
    htmlElement = fixture.debugElement.nativeElement.querySelector('div');
  });

  it('should create', () => {
    expect(component).toBeDefined();
    expect(component).toBeTruthy();
    expect(htmlElement).toBeDefined();
    expect(htmlElement).not.toBeNull();
    expect(htmlElement instanceof HTMLDivElement).toBeTruthy();
  });

  it('should initialize isExpanded and areChildrenShown', () => {
    expect(component.isExpanded).toBeFalsy();
    expect(component.areChildrenShown).toBeFalsy();
  });

});
