import { IShBreadcrumbActivity, IShBreadcrumbStackFrame } from './../../../components/breadcrumb/breadcrumb.component';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { PolicyEngineService, ResourceService } from '@ca-webstack/ng-policy-engine';
import { TranslateModule } from '@ngx-translate/core';
import { IdSequenceService } from '../../../services/id-sequence.service';
import { ShBreadcrumbComponent } from './../../../components/breadcrumb/breadcrumb.component';
import { ShBreadcrumbPipe } from '../../../pipes/breadcrumb.pipe';
import { RouterTestingModule } from '@angular/router/testing';

describe('Breadcrumb component', () => {
  let component: ShBreadcrumbComponent;
  let fixture: ComponentFixture<ShBreadcrumbComponent>;
  let htmlElement: HTMLSpanElement;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), RouterTestingModule],
      declarations: [ShBreadcrumbComponent, ShBreadcrumbPipe],
      providers: [IdSequenceService, PolicyEngineService, ResourceService]
    }).compileComponents();
  }));
  beforeEach(() => {
    fixture = TestBed.createComponent(ShBreadcrumbComponent);
    component = fixture.debugElement.componentInstance;
    fixture.detectChanges();
    const html: HTMLElement = fixture.debugElement.nativeElement;
    htmlElement = html.querySelector('span');
  });
  it('should create', () => {
    expect(component).toBeDefined();
    expect(fixture).toBeDefined();
    expect(htmlElement).toBeDefined();
    expect(htmlElement).not.toBeNull();
    expect(htmlElement instanceof HTMLSpanElement).toBeTruthy();
  });
  describe('actualize', () => {
    it('should do nothing when no stack is found', () => {
      const activity: IShBreadcrumbActivity = {
        CurrentPayload: {
          stack: null
        }
      };
      component.activity = activity;

      component['actualize'](null);

      expect(activity.CurrentPayload.stack).toBeNull();
    });
    it('should do nothing when index of given frame is not found in stack', () => {
      const activity: IShBreadcrumbActivity = {
        CurrentPayload: {
          stack: []
        }
      };
      component.activity = activity;

      component['actualize']({});

      expect(activity.CurrentPayload.stack).toEqual([]);
    });
    it('should splice stack till current frame', () => {
      const targetFrame: IShBreadcrumbStackFrame = {
        domain: ['foo'],
        scenario: ['sample']
      };
      const landingFrame: IShBreadcrumbStackFrame = {
        domain: ['foo'],
        scenario: ['hello'],
      };
      const stack: IShBreadcrumbStackFrame[] = [
        landingFrame,
        targetFrame,
        {
          domain: ['foo'],
          scenario: ['bar'],
        },
        {
          domain: ['foo'],
          scenario: ['baz'],
        },
      ];
      const activity: IShBreadcrumbActivity = {
        CurrentPayload: {
          stack
        }
      };
      component.activity = activity;

      component['actualize'](targetFrame);

      expect(activity.CurrentPayload.stack.length).toEqual(2);
      expect(activity.CurrentPayload.stack).toEqual([landingFrame, targetFrame]);
    });
  });
});
