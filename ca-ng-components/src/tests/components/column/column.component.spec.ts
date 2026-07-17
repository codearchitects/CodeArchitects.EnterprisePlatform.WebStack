import { ShColumnComponent, ColumnResolution } from './../../../components/column/column.component';
import { async, ComponentFixture, inject, TestBed } from '@angular/core/testing';
import { IdSequenceService } from '../../../services/id-sequence.service';
import { Injector, SimpleChange } from '@angular/core';

describe('Column component', () => {
  let component: ShColumnComponent;
  let fixture: ComponentFixture<ShColumnComponent>;

  const mockedElement = document.createElement('div');

  const mockedElementRef = { nativeElement: mockedElement };

  const mockedInjector = {
    get: () => mockedElementRef
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ShColumnComponent],
      providers: [
        IdSequenceService,
        { provide: Injector, useValue: mockedInjector }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShColumnComponent);
    component = fixture.debugElement.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeDefined();
    expect(fixture).toBeDefined();
    component['isReady'] = true;
    fixture.detectChanges();
    const html: HTMLElement = fixture.debugElement.nativeElement;
    expect(html).toBeDefined();
    expect(html).not.toBeNull();
    expect(html instanceof HTMLDivElement).toBeTruthy();
  });

  describe('constructor', () => {
    it('should set column', () => {
      expect(component['_column']).toBeDefined();
      expect(component['_column']).not.toBeNull();
      expect(component['_column']).toEqual(fixture.debugElement.nativeElement);
    });
    it('should subscribe to setup$', () => {
      expect(component['_setup$'].observers.length).toEqual(1);
    });
    describe('setup$ subscription', () => {
      it('should call setupColumns, setupOffsets, setupOrders and  setupVisibility', done => {
        const setupColumnsSpy = spyOn(component as any, 'setupColumns');
        const setupOffsetsSpy = spyOn(component as any, 'setupOffsets');
        const setupOrdersSpy = spyOn(component as any, 'setupOrders');
        const setupVisibilitySpy = spyOn(component as any, 'setupVisbility');

        setTimeout(() => {
          component['_setup$'].next();

          expect(setupColumnsSpy).toHaveBeenCalledTimes(1);
          expect(setupOffsetsSpy).toHaveBeenCalledTimes(1);
          expect(setupOrdersSpy).toHaveBeenCalledTimes(1);
          expect(setupVisibilitySpy).toHaveBeenCalledTimes(1);
          done();
        }, 500);
      });
      it('should set break style', done => {
        const expectedBreak = 'all';
        const expectedPrevStyle = 'baz';
        component.break = expectedBreak;

        setTimeout(() => {
          spyOn(component as any, 'setupColumns');
          spyOn(component as any, 'setupOffsets');
          spyOn(component as any, 'setupOrders');
          spyOn(component as any, 'setupVisbility');
          component['style'] = expectedPrevStyle;

          component['_setup$'].next();

          expect(component['style']).toEqual(`${expectedPrevStyle} break-${expectedBreak}`);
          done();
        }, 500);
      });
      it('should set column className by style result correctly', done => {
        const expectedClassName = 'fooClass';

        setTimeout(() => {
          spyOn(component as any, 'setupColumns');
          spyOn(component as any, 'setupOffsets');
          spyOn(component as any, 'setupOrders');
          spyOn(component as any, 'setupVisbility');
          component['style'] = expectedClassName;

          component['_setup$'].next();

          expect(fixture.debugElement.nativeElement.className).toEqual(expectedClassName);
          done();
        }, 500);
      });
    });
  });

  it('ngOnInit should next setup$', () => {
    const nextSpy = spyOn(component['_setup$'], 'next').and.callThrough();

    component.ngOnInit();

    expect(nextSpy).toHaveBeenCalledTimes(1);
  });

  it('ngOnChanges should next setup$', () => {
    const nextSpy = spyOn(component['_setup$'], 'next').and.callThrough();

    component.ngOnChanges({ 'fooChange': new SimpleChange(undefined, undefined, false) });

    expect(nextSpy).toHaveBeenCalledTimes(1);
  });

  describe('setupColumns', () => {
    it('should set style to col', () => {
      component['setupColumns']();

      expect(component['style']).toEqual('col');
    });
    it('should set style to given xs', () => {
      const expectedXs = 10;
      component.xs = expectedXs;

      component['setupColumns']();

      expect(component['style']).toEqual(`col-${expectedXs}`);
    });
    it('should set style to existing style with given sm', () => {
      const expectedXs = 42;
      const expectedSm = 3;
      component.xs = expectedXs;
      component.sm = expectedSm;

      component['setupColumns']();

      expect(component['style']).toEqual(`col-${expectedXs} col-sm-${expectedSm}`);
    });
    it('should set style to existing style with given md', () => {
      const expectedXs = 19;
      const expectedMd = 8;
      component.xs = expectedXs;
      component.md = expectedMd;

      component['setupColumns']();

      expect(component['style']).toEqual(`col-${expectedXs} col-md-${expectedMd}`);
    });
    it('should set style to existing style with given lg', () => {
      const expectedXs = 7;
      const expectedLg = 14;
      component.xs = expectedXs;
      component.lg = expectedLg;

      component['setupColumns']();

      expect(component['style']).toEqual(`col-${expectedXs} col-lg-${expectedLg}`);
    });
    it('should set style to existing style with given xl', () => {
      const expectedXl = 21;
      component.xl = expectedXl;

      component['setupColumns']();

      expect(component['style']).toEqual(` col-xl-${expectedXl}`);
    });
  });

  describe('setupOffsets', () => {
    it('should leave style as it is', () => {
      const expectedStyle = 'bar';
      component['style'] = expectedStyle;

      component['setupOffsets']();

      expect(component['style']).toEqual(expectedStyle);
    });
    it('should add to existing style xs offset when set', () => {
      const prevStyle = 'baz';
      const expectedOffset = 11;
      component.offset_xs = expectedOffset;
      component['style'] = prevStyle;

      component['setupOffsets']();

      expect(component['style']).toEqual(`${prevStyle} offset-${expectedOffset}`);
    });
    it('should add to existing style sm offset when set', () => {
      const prevStyle = 'baz';
      const expectedOffset = 12;
      component.offset_sm = expectedOffset;
      component['style'] = prevStyle;

      component['setupOffsets']();

      expect(component['style']).toEqual(`${prevStyle} offset-sm-${expectedOffset}`);
    });
    it('should add to existing style md offset when set', () => {
      const prevStyle = 'baz';
      const expectedOffset = 13;
      component.offset_md = expectedOffset;
      component['style'] = prevStyle;

      component['setupOffsets']();

      expect(component['style']).toEqual(`${prevStyle} offset-md-${expectedOffset}`);
    });
    it('should add to existing style lg offset when set', () => {
      const prevStyle = 'baz';
      const expectedOffset = 14;
      component.offset_lg = expectedOffset;
      component['style'] = prevStyle;

      component['setupOffsets']();

      expect(component['style']).toEqual(`${prevStyle} offset-lg-${expectedOffset}`);
    });
    it('should add to existing style xl offset when set', () => {
      const prevStyle = 'baz';
      const expectedOffset = 15;
      component.offset_xl = expectedOffset;
      component['style'] = prevStyle;

      component['setupOffsets']();

      expect(component['style']).toEqual(`${prevStyle} offset-xl-${expectedOffset}`);
    });
  });

  describe('setupOrders', () => {
    it('should leave style as it is', () => {
      const expectedStyle = 'bar';
      component['style'] = expectedStyle;

      component['setupOrders']();

      expect(component['style']).toEqual(expectedStyle);
    });
    it('should add to existing style xs order when set', () => {
      const prevStyle = 'baz';
      const expectedOrder = 11;
      component.order_xs = expectedOrder;
      component['style'] = prevStyle;

      component['setupOrders']();

      expect(component['style']).toEqual(`${prevStyle} order-${expectedOrder}`);
    });
    it('should add to existing style sm order when set', () => {
      const prevStyle = 'baz';
      const expectedOrder = 12;
      component.order_sm = expectedOrder;
      component['style'] = prevStyle;

      component['setupOrders']();

      expect(component['style']).toEqual(`${prevStyle} order-sm-${expectedOrder}`);
    });
    it('should add to existing style md order when set', () => {
      const prevStyle = 'baz';
      const expectedOrder = 13;
      component.order_md = expectedOrder;
      component['style'] = prevStyle;

      component['setupOrders']();

      expect(component['style']).toEqual(`${prevStyle} order-md-${expectedOrder}`);
    });
    it('should add to existing style lg order when set', () => {
      const prevStyle = 'baz';
      const expectedOrder = 14;
      component.order_lg = expectedOrder;
      component['style'] = prevStyle;

      component['setupOrders']();

      expect(component['style']).toEqual(`${prevStyle} order-lg-${expectedOrder}`);
    });
    it('should add to existing style xl order when set', () => {
      const prevStyle = 'baz';
      const expectedOrder = 15;
      component.order_xl = expectedOrder;
      component['style'] = prevStyle;

      component['setupOrders']();

      expect(component['style']).toEqual(`${prevStyle} order-xl-${expectedOrder}`);
    });
  });

  describe('setupVisibility', () => {
    it('should leave style as it is if hide is not set', () => {
      const prevStyle = 'foo';
      component['style'] = prevStyle;
      component.hide = undefined;

      component['setupVisbility']();

      expect(component['style']).toEqual(prevStyle);
    });
    it('should add hide key when hide is set as single value', () => {
      const prevStyle = 'foo';
      const expectedHideTarget = 'lg';
      component.hide = expectedHideTarget;
      component['style'] = prevStyle;

      component['setupVisbility']();

      expect(component['style']).toEqual(`${prevStyle} hide-${expectedHideTarget}`);
    });
    it('should add hide key for each hide target', () => {
      const prevStyle = 'foo';
      const expectedHideTargets: ColumnResolution[] = ['lg', 'md'];
      component.hide = expectedHideTargets;
      component['style'] = prevStyle;

      component['setupVisbility']();

      expect(component['style']).toEqual(`${prevStyle} hide-${expectedHideTargets[0]} hide-${expectedHideTargets[1]}`);
    });
  });
});
