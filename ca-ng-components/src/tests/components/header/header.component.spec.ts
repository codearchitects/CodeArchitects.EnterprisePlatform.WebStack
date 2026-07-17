import { ShComboComponent, ShIconComponent, ShSidebarSearchComponent } from './../../../components';
import { RouterTestingModule } from '@angular/router/testing';
import { ShHeaderComponent } from '../../../components/header/header.component';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { I18nModule } from '@ca-webstack/ng-i18n';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
import { AssetsService, IdSequenceService } from '../../../services';

describe('Header component', () => {
  let component: ShHeaderComponent;
  let fixture: ComponentFixture<ShHeaderComponent>;
  let htmlElements: HTMLCollection;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule, TranslateModule.forRoot(), I18nModule, RouterTestingModule],
      declarations: [ShHeaderComponent, ShIconComponent, ShSidebarSearchComponent, ShComboComponent],
      providers: [
        IdSequenceService,
        { provide: AssetsService, useValue: { get: jasmine.createSpy() } }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShHeaderComponent);
    component = fixture.debugElement.componentInstance;
    fixture.detectChanges();
    htmlElements = fixture.debugElement.nativeElement.querySelectorAll('div');
  });

  it('should create', () => {
    expect(component).toBeDefined();
    expect(component).toBeTruthy();
    expect(htmlElements).toBeDefined();
    expect(htmlElements).not.toBeNull();
    expect(htmlElements.length).toEqual(2);
    expect(htmlElements[0] instanceof HTMLDivElement).toBeTruthy();
    expect(htmlElements[1] instanceof HTMLDivElement).toBeTruthy();
  });

  it('should initialize showSearchbar to true', () => {
    expect(component.showSearchbar).toBeTruthy();
  });
});
