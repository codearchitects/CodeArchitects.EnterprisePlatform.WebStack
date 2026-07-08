import { ShComboComponent } from './../components/combo/combo.component';
import { ShTextareaComponent } from './../components/textarea/textarea.component';
import { ShTextComponent } from './../components/text/text.component';
import { ShButtonComponent } from './../components/button/button.component';
import { TestBed } from '@angular/core/testing';

import { FormDesignerManager, ShComponentClass } from './form-designer.manager';
import { FormDesignerControl } from '../decorators';

// @FormDesignerControl({ name: 'concrete-text' })
class ConcreteTextComponent {

}

// @FormDesignerControl({ name: 'concrete-textarea', shortDescription: 'Textarea Control' })
class ConcreteTextareaComponent {

}

// @FormDesignerControl({ name: 'concrete-combo' })
class ConcreteComboComponent {

}

// @FormDesignerControl({ name: 'concrete-button' })
class ConcreteButtonComponent {

}


describe('FormDesignerManager', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  const sut = FormDesignerManager;

  it('should be created', () => {
    expect(sut).toBeDefined();
  });

  it('should clear associated components', () => {
    sut.Clear();
    expect(sut.All().length).toEqual(0);
  });

  it('should register components', () => {
    FormDesignerControl({ name: 'concrete-text' })(ConcreteTextComponent);
    FormDesignerControl({ name: 'concrete-textarea', shortDescription: 'Textarea Control' })(ConcreteTextareaComponent);
    FormDesignerControl({ name: 'concrete-button' })(ConcreteButtonComponent);
    FormDesignerControl({ name: 'concrete-combo' })(ConcreteComboComponent);
    // sut.register(ShButtonComponent as ShComponentClass, { name: 'button', shortDescription: 'Button Control' });
    // sut.register(ShTextComponent as ShComponentClass, { name: 'text', shortDescription: 'Text Control' });
    // sut.register(ShTextareaComponent as ShComponentClass, { name: 'textarea', shortDescription: 'Textarea Control' });
    // sut.register(ShComboComponent as ShComponentClass, { name: 'combo', shortDescription: 'Combo Control' });
    expect(sut.All().length).toEqual(4);
  });

  // it('should unregister component by prototype', () => {
  //   sut.unregister(ShButtonComponent.prototype as any);
  //   expect(sut.All().length).toEqual(2);
  // });

  it('should retrieves component by key', () => {
    const control = sut.GetByKey('concrete-textarea');
    expect(control).toBeDefined();
    expect(control.name).toEqual('concrete-textarea');
    expect(control.shortDescription).toEqual('Textarea Control');
  });

  it('should filters component by key', () => {
    const control = sut.Filter('concrete-textarea');
    expect(control).toBeDefined();
  });

  // it('should unregister component by name', () => {
  //   sut.unregister('concrete-button');
  //   expect(sut.All().length).toEqual(3);
  // });

  // it('should return undefined when try to get unregistered component by key', () => {
  //   const control = sut.GetByKey('concrete-button');
  //   expect(control).not.toBeDefined();
  // });

});
