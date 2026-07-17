import { ShRowComponent } from '../../../components/row/row.component';
import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { IdSequenceService } from '../../../services/id-sequence.service';
import { ShBaseComponent } from '../../../components/base';
import { SimpleChange, SimpleChanges } from '@angular/core';

describe('Row component', () => {
  let component: ShRowComponent;
  let fixture: ComponentFixture<ShRowComponent>;
  let htmlElement: HTMLDivElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ShRowComponent],
      providers: [IdSequenceService]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShRowComponent);
    component = fixture.debugElement.componentInstance;
    fixture.detectChanges();
    htmlElement = fixture.debugElement.nativeElement;
  });

  it('should create', () => {
    expect(component).toBeDefined();
    expect(fixture).toBeDefined();
    expect(htmlElement).toBeDefined();
    expect(htmlElement).not.toBeNull();
  });

  it('should set defaults correctly', () => {
    expect(component.noGutters).toBeFalsy();
    expect(component['style']).toEqual('row');
  });

  it('ngOnInit should call super ngOnInit and next setup', () => {
    const superSpy = spyOn(ShBaseComponent.prototype, 'ngOnInit');
    const setupNextSpy = spyOn(component['_setup$'], 'next');

    component.ngOnInit();

    expect(superSpy).toHaveBeenCalledTimes(1);
    expect(setupNextSpy).toHaveBeenCalledTimes(1);
  });

  it('ngOnChanges should call super ngOnChanges and next setup', () => {
    const changes: SimpleChanges = {
      'myChange': new SimpleChange(null, null, false)
    };
    const superSpy = spyOn(ShBaseComponent.prototype, 'ngOnChanges');
    const setupNextSpy = spyOn(component['_setup$'], 'next');

    component.ngOnChanges(changes);

    expect(superSpy).toHaveBeenCalledOnceWith(changes);
    expect(setupNextSpy).toHaveBeenCalledTimes(1);
  });

  describe('constructor', () => {
    it('should set row', () => {
      expect(component['_row']).toBeDefined();
      expect(component['_row']).not.toBeNull();
      expect(component['_row']).toBeInstanceOf(HTMLElement);
    });
    it('should subscribe to setup', () => {
      expect(component['_setup$'].observers.length).toEqual(1);
    });
    it('should unsubscribe to setup when component has been destroyed', () => {
      component['destroy$'].next();
      expect(component['_setup$'].observers.length).toEqual(0);
    });
    describe('setup subscription', () => {
      it('should not throw erorr when row is not defined', done => {
        setTimeout(() => {
          const style = 'row excetera';
          component['style'] = style;
          component['_row'] = undefined;

          component['_setup$'].next();

          setTimeout(() => {
            expect(component['style']).toEqual(style);
            done();
          }, 500);
        }, 500);
      });
      it('should add verticalAlignment to style', done => {
        setTimeout(() => {
          const previousStyle = 'row excetera';
          const expectedAlignment = 'end';
          component.verticalAlignment = expectedAlignment;
          component['style'] = previousStyle;

          component['_setup$'].next();

          setTimeout(() => {
            expect(component['style']).toEqual(`${previousStyle} align-items-${expectedAlignment}`);
            done();
          }, 500);
        }, 500);
      });
      it('should add horizontalAlignment to style', done => {
        setTimeout(() => {
          const previousStyle = 'row excetera';
          const expectedAlignment = 'between';
          component.horizontalAlignment = expectedAlignment;
          component['style'] = previousStyle;

          component['_setup$'].next();

          setTimeout(() => {
            expect(component['style']).toEqual(`${previousStyle} justify-content-${expectedAlignment}`);
            done();
          }, 500);
        }, 500);
      });
      it('should add no gutters to style', done => {
        setTimeout(() => {
          const previousStyle = 'row excetera';
          component.noGutters = true;
          component['style'] = previousStyle;

          component['_setup$'].next();

          setTimeout(() => {
            expect(component['style']).toEqual(`${previousStyle} no-gutters`);
            done();
          }, 500);
        }, 500);
      });
      it('should set new classes to row element', done => {
        setTimeout(() => {
          const mockedStyle = 'custom classes names';
          component['style'] = mockedStyle;

          component['_setup$'].next();
          setTimeout(() => {
            expect(component['_row'].className).toEqual(mockedStyle);
            done();
          }, 500);
        }, 500);
      });
    });
  });

});
