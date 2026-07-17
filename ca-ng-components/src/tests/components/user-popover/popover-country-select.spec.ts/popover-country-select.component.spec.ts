import { TranslateModule } from '@ngx-translate/core';
import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { IdSequenceService, ShIconComponent } from '../../../..';
import { ShPopoverCountrySelect } from '../../../../components/user-popover/popover-country-select/popover-country-select.component';
import { ExtendedCountryPipe } from '../../../../pipes/extended-country.pipe';
import { ISOCountryPipe } from '../../../../pipes/iso-country.pipe';
import { AspectHelper, ContextService, ValidatorHelper } from '@ca-webstack/ng-aspects';

describe('PopoverCountrySelect component', () => {
  let component: ShPopoverCountrySelect<any, any, any>;
  let fixture: ComponentFixture<ShPopoverCountrySelect<any, any, any>>;
  let htmlElement: HTMLDivElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      declarations: [ShPopoverCountrySelect, ISOCountryPipe, ExtendedCountryPipe, ShIconComponent],
      providers: [IdSequenceService, ValidatorHelper, AspectHelper, ContextService]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShPopoverCountrySelect);
    component = fixture.debugElement.componentInstance;
    fixture.detectChanges();
    htmlElement = fixture.debugElement.nativeElement;
  });

  it('should create', () => {
    expect(component).toBeDefined();
    expect(fixture).toBeDefined();
    expect(htmlElement).toBeDefined();
    expect(htmlElement).not.toBeNull();
    expect(htmlElement).toBeInstanceOf(HTMLDivElement);
  });

});
