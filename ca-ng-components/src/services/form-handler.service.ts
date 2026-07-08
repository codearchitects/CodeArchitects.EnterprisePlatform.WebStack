import { Injectable } from '@angular/core';
import { AbstractControl, ValidatorFn, Validators, AsyncValidatorFn } from '@angular/forms';
import { Observable, Subject, from } from 'rxjs';
import { Dictionary } from '@ca-webstack/data-structures';
import { ValidatorHelper } from '@ca-webstack/ng-aspects';
import { map, distinctUntilChanged } from 'rxjs/operators';
import { ShFormControl } from '../utilities/form-control.utility';
import { ShFormGroup } from '../utilities/form-group.utility';
import { isNoU } from '../utilities/common.utility';
import { getJsonObject } from '@ca-webstack/reflection';
import { ShFormArray } from '../utilities/form-array.utility';
import { IShComplexFieldDescriptor } from '../models/complex-field-descriptor';

interface Key {
  model: any;
  prop?: string;
}

interface UnresolvedSubscription {
  resolveFunction: Function;
  buildFunction: Function;
}

type SubscriptableProperty = 'valid' | 'invalid' | 'pending' | 'disabled' | 'enabled' | 'touched' | 'untouched' | 'dirty' | 'pristine';

@Injectable({
  providedIn: 'root'
})
export class FormHandlerService {

  public validityChanges: Observable<any>;
  public controlDetach$: Observable<ShFormGroup<any> | ShFormControl<any> | ShFormArray<any>>;
  public readonly isFormArrayEnabled: boolean = false;

  protected keys = new Array<Key>();
  protected store = new Dictionary<Key, AbstractControl>();
  protected formRoot: ShFormGroup<any>;
  protected root = new Object();
  private unresolvedSubscriptions = new Dictionary<Key, UnresolvedSubscription[]>();
  private index = 0;
  private _controlDetach$: Subject<ShFormGroup<any> | ShFormControl<any> | ShFormArray<any>> = new Subject();

  private get next() {
    return `id-${this.index++}`;
  }

  constructor(
    protected validatorHelper: ValidatorHelper
  ) {
    this.initializeFormRoot();
    this.controlDetach$ = this._controlDetach$.asObservable();
  }


  getGroup<T extends { [K in keyof T]: AbstractControl<any> } = any>(model: any, parent?: any);
  getGroup<T extends { [K in keyof T]: AbstractControl<any> } = any>(modelId: string, namespace: string): ShFormGroup<T> | null;
  getGroup<T extends { [K in keyof T]: AbstractControl<any> } = any>(prop: string, parent: any);
  /**
   * 
   * @internal Autodestroy specification
   */
  getGroup<T extends { [K in keyof T]: AbstractControl<any> } = any>(model: any, parent?: any, autodestroy?: boolean);
  getGroup<T extends { [K in keyof T]: AbstractControl<any> } = any>(model: any, parentOrNamespace = this.root, autodestroy = false) {
    let control: ShFormGroup<T> | null = null;
    if (typeof model === 'string' && typeof parentOrNamespace === 'string') {
      const key = this.keys.find(key => key.model.id === model && isNoU(key.prop) && getJsonObject(key.model.constructor)?.name === parentOrNamespace);
      if (key) {
        const storeControl = this.store.get(key);
        control = storeControl instanceof ShFormGroup ? storeControl : null;
      }
    } else {
      if (!model) {
        return;
      }
      let modelProp: string | undefined;
      if (typeof model === 'string') {
        modelProp = model;
        model = parentOrNamespace[model];
        // undefined parentOrNamespace[model] not supported, should throw error?
      }
      const key = this.getKey(model);
      if (!this.store.containsKey(key)) {
        control = !isNoU(modelProp) ? this.createGroup<T>(modelProp, parentOrNamespace) : this.createGroup<T>(model);
        this.attach(control, parentOrNamespace, modelProp);
        this.store.set(key, control);
        this.resolveSubscriptions(key);
      }
      const storeControl = control || this.store.get(key);
      control = storeControl instanceof ShFormGroup ? storeControl : null;
      if (control) {
        if (autodestroy === true && (control.autodestroy === undefined || control.autodestroy === true)) {
          control.autodestroy = true;
        } else {
          control.autodestroy = false;
        }
      }
    }
    return control;
  }

  removeGroup(group: ShFormGroup);
  removeGroup(model: any, parent?: any);
  removeGroup(model: any | ShFormGroup, parent = this.root) {
    if (!model) {
      return;
    }
    if (model instanceof ShFormGroup) {
      if (!model.canDestroy) {
        return;
      }
      const groupIndex = this.store.values.indexOf(model);
      if (groupIndex > -1) {
        const key = this.store.keys[groupIndex];
        this.store.remove(key);
        const index = this.keys.indexOf(key);
        this.keys.splice(index, 1);
        if (!isNoU(model.parent)) {
          if (model.parent instanceof ShFormGroup) {
            this.detach(model.parent, model);
            this._controlDetach$.next(model);
            if (model.parent.autodestroy && Object.keys(model.parent.controls).length === 0) {
              this.removeGroup(model.parent);
            }
          } else if (model.parent instanceof ShFormArray) {
            this.detach(model.parent, model);
            this._controlDetach$.next(model);
            if (model.parent.autodestroy && Object.keys(model.parent.controls).length === 0) {
              this.removeArray(model.parent);
            }
          }
          model.setParent(null);
        }
      }
    } else {
      const key = this.getKey(model);
      let group: AbstractControl;
      if (this.store.containsKey(key)) {
        group = this.store.get(key);
        if (!(group instanceof ShFormGroup) || !group.canDestroy) {
          return;
        }
        this.detach(parent, key);
        this.store.remove(key);
        this._controlDetach$.next(group);
      }
      const index = this.keys.indexOf(key);
      this.keys.splice(index, 1);
      if (!isNoU(group?.parent)) {
        if (group.parent instanceof ShFormGroup && group.parent.autodestroy && Object.keys(group.parent.controls).length === 0) {
          this.removeGroup(group.parent);
        } else if (group.parent instanceof ShFormArray && group.parent.autodestroy && Object.keys(group.parent.controls).length === 0) {
          this.removeArray(group.parent);
        }
        group.setParent(null);
      }
    }
  }

  getControl<T = any, C extends ShFormControl<T> = ShFormControl<T>>(model: any, prop: string);
  getControl<T = any, C extends ShFormControl<T> = ShFormControl<T>>(modelId: string, prop: string, namespace: string): C | null;
  getControl<T = any, C extends ShFormControl<T> = ShFormControl<T>>(model: any, prop: string, namespace?: string) {
    let control: C | null = null;
    if (typeof model === 'string') {
      const key = this.keys.find(key => key.model.id === model && key.prop === prop && getJsonObject(key.model.constructor)?.name === namespace);
      if (key) {
        control = this.store.get(key) as C;
      }
    } else {
      if (!model) {
        return;
      }
      const key = this.getKey(model, prop);

      if (!this.store.containsKey(key)) {
        control = this.createControl<T>(model, prop) as C;
        this.attach(control, model, prop);
        this.store.set(key, control);
        this.resolveSubscriptions(key);
      }

      control = control || this.store.get(key) as C;
    }
    return control;
  }

  removeControl(control: ShFormControl);
  removeControl(model: any, prop: string);
  removeControl(model: any | ShFormControl, prop?: string) {
    if (!model) {
      return;
    }
    if (model instanceof ShFormControl) {
      if (!model.canDestroy) {
        return;
      }
      const controlIndex = this.store.values.indexOf(model);
      if (controlIndex > -1) {
        const key = this.store.keys[controlIndex];
        this.store.remove(key);
        const index = this.keys.indexOf(key);
        this.keys.splice(index, 1);
        if (!isNoU(model.parent)) {
          if (model.parent instanceof ShFormGroup) {
            this.detach(model.parent, model);
            this._controlDetach$.next(model);
            if (model.parent.autodestroy && Object.keys(model.parent.controls).length === 0) {
              this.removeGroup(model.parent);
            }
          } else if (model.parent instanceof ShFormArray) {
            this.detach(model.parent, model);
            this._controlDetach$.next(model);
            if (model.parent.autodestroy && Object.keys(model.parent.controls).length === 0) {
              this.removeArray(model.parent);
            }
          }
        }
      }
    } else {
      const key = this.getKey(model, prop);
      let control: ShFormControl;
      if (this.store.containsKey(key)) {
        control = this.store.get(key) as ShFormControl;
        if (!control.canDestroy) {
          return;
        }
        this.detach(model, key);
        this.store.remove(key);
        this._controlDetach$.next(control);
      }
      const index = this.keys.indexOf(key);
      this.keys.splice(index, 1);
      if (!isNoU(control?.parent)) {
        if (control.parent instanceof ShFormGroup && control.parent.autodestroy && Object.keys(control.parent.controls).length === 0) {
          this.removeGroup(control.parent);
        } else if (control.parent instanceof ShFormArray && control.parent.autodestroy && Object.keys(control.parent.controls).length === 0) {
          this.removeArray(control.parent);
        }
      }
    }
  }

  getArray<T extends AbstractControl<any> = any>(model: Array<any>, parent?: { [id: string]: any }): ShFormArray<T> | null;
  getArray<T extends AbstractControl<any> = any>(prop: string, parentId: string, parentNamespace: string): ShFormArray<T> | null;
  getArray<T extends AbstractControl<any> = any>(prop: string, parent: { [id: string]: any }): ShFormArray<T> | null;
  /**
   * 
   * @internal Autodestroy specification
   */
  getArray<T extends AbstractControl<any> = any>(model: Array<any>, parent?: { [id: string]: any }, autodestroy?: boolean): ShFormArray<T> | null;
  getArray<T extends AbstractControl<any> = any>(model: Array<any> | string, parent: { [id: string]: any } | string = this.root, autodestroyOrNamespace: boolean | string = false): ShFormArray<T> | null {
    let control: ShFormArray<T> | null = null;
    if (typeof model === 'string' && typeof parent === 'string') {
      const key = this.keys.find(key => key.model.id === parent && isNoU(key.prop) && getJsonObject(key.model.constructor)?.name === autodestroyOrNamespace);
      if (key) {
        const parentControl = this.store.get(key);
        const storeControl = parentControl.get(model);
        control = storeControl instanceof ShFormArray ? storeControl : null;
      }
    } else {
      if (model) {
        let modelProp: string | undefined;
        if (typeof model === 'string') {
          modelProp = model;
          model = parent[model];
          // undefined parent[model] not supported, should throw error?
        }
        const key = this.getKey(model);
        if (!this.store.containsKey(key)) {
          control = !isNoU(modelProp) ? this.createArray<T>(modelProp, parent as { [id: string]: any }) : this.createArray<T>();
          this.attach(control, parent as { [id: string]: any }, modelProp);
          this.store.set(key, control);
          this.resolveSubscriptions(key);
          control.updateValueAndValidity({ emitEvent: false });
        }
        const storeControl = control || this.store.get(key);
        control = storeControl instanceof ShFormArray ? storeControl : null;
        if (control) {
          if (autodestroyOrNamespace === true && (control.autodestroy === undefined || control.autodestroy === true)) {
            control.autodestroy = true;
          } else {
            control.autodestroy = false;
          }
        }
      }
    }
    return control;
  }

  removeArray(array: ShFormArray): void;
  removeArray(model: Array<any>, parent?: { [id: string]: any }): void;
  removeArray(model: Array<any> | ShFormArray, parent = this.root): void {
    if (!model) {
      return;
    }
    if (model instanceof ShFormArray) {
      if (!model.canDestroy) {
        return;
      }
      const groupIndex = this.store.values.indexOf(model);
      if (groupIndex > -1) {
        const key = this.store.keys[groupIndex];
        this.store.remove(key);
        const index = this.keys.indexOf(key);
        this.keys.splice(index, 1);
        if (!isNoU(model.parent)) {
          if (model.parent instanceof ShFormGroup) {
            this.detach(model.parent, model);
            this._controlDetach$.next(model);
            if (model.parent.autodestroy && Object.keys(model.parent.controls).length === 0) {
              this.removeGroup(model.parent);
            }
          } else if (model.parent instanceof ShFormArray) {
            this.detach(model.parent, model);
            this._controlDetach$.next(model);
            if (model.parent.autodestroy && Object.keys(model.parent.controls).length === 0) {
              this.removeArray(model.parent);
            }
          }
          model.setParent(null);
        }
      }
    } else {
      const key = this.getKey(model);
      let array: AbstractControl;
      if (this.store.containsKey(key)) {
        array = this.store.get(key);
        if (!(array instanceof ShFormArray) || !array.canDestroy) {
          return;
        }
        this.detach(parent, key);
        this.store.remove(key);
        this._controlDetach$.next(array);
      }
      const index = this.keys.indexOf(key);
      this.keys.splice(index, 1);
      if (!isNoU(array?.parent)) {
        if (array.parent instanceof ShFormGroup && array.parent.autodestroy && Object.keys(array.parent.controls).length === 0) {
          this.removeGroup(array.parent);
        } else if (array.parent instanceof ShFormArray && array.parent.autodestroy && Object.keys(array.parent.controls).length === 0) {
          this.removeArray(array.parent);
        }
        array.setParent(null);
      }
    }
  }

  public getForm<T extends { [K in keyof T]: AbstractControl<any> } = any>(model: { [id: string]: any }, fields: Array<string | IShComplexFieldDescriptor>): ShFormGroup<T> | null;
  public getForm<T extends { [K in keyof T]: AbstractControl<any> } = any>(prop: string, fields: Array<string | IShComplexFieldDescriptor>, parent: { [id: string]: any }): ShFormGroup<T> | null;
  public getForm<T extends { [K in keyof T]: AbstractControl<any> } = any>(model: { [id: string]: any } | string, fields: Array<string | IShComplexFieldDescriptor>, parent?: { [id: string]: any }): ShFormGroup<T> | null {
    const formRoot = this.getGroup(model, parent);
    if (formRoot) {
      let modelProp: string | undefined;
      if (typeof model === 'string') {
        modelProp = model;
        model = parent[model];
        // undefined parent[model] not supported, should throw error?
      }
      fields.forEach((field) => {
        if (typeof field === 'string') {
          const control: ShFormControl = this.getControl(model, field);
          if (control) {
            control.canDestroy = false;
          }
        } else if (field.isArray) {
          const array = this.getArray(field.name, model as { [id: string]: any });
          if (array) {
            array.canDestroy = false;
            // undefined model[field.name] not supported, should throw error?
            model[field.name].forEach((item: any, index: number) => {
              if (field.fields) {
                // undefined model[field.name] not supported, should throw error?
                const form = this.getForm(index.toString(), field.fields, model[field.name]);
                if (form) {
                  form.canDestroy = false;
                }
              } else {
                // undefined model[field.name] not supported, should throw error?
                const control = this.getControl(model[field.name], index.toString());
                if (control) {
                  control.canDestroy = false;
                }
              }
            });
          }
        } else {
          const form = this.getForm(field.name, field.fields, model as { [id: string]: any });
          if (form) {
            form.canDestroy = false;
          }
        }
      });
    }
    return formRoot || null;
  }

  public removeForm(group: ShFormGroup): void;
  public removeForm(model: { [id: string]: any }, parent?: { [id: string]: any }): void;
  public removeForm(model: { [id: string]: any } | ShFormGroup, parent?: { [id: string]: any }): void {
    let formRoot: ShFormGroup;
    if (model instanceof ShFormGroup) {
      formRoot = model;
      formRoot.canDestroy = true;
      this.removeGroup(model);
    } else {
      const key = this.getKey(model);
      if (this.store.containsKey(key)) {
        const storeControl = this.store.get(key);
        if (storeControl instanceof ShFormGroup) {
          formRoot = storeControl;
          formRoot.canDestroy = true;
          this.removeGroup(model, parent);
        }
      } else {
        const index = this.keys.indexOf(key);
        this.keys.splice(index, 1);
      }
    }
    if (formRoot) {
      Object.keys(formRoot.controls).forEach((name) => {
        const control = formRoot.controls[name];
        if (control instanceof ShFormGroup) {
          this.removeForm(control);
        } else if (control instanceof ShFormArray) {
          control.canDestroy = true;
          this.removeArray(control);
          const controls = [...control.controls];
          controls.forEach((c) => {
            if (c instanceof ShFormGroup) {
              this.removeForm(c);
            } else if (c instanceof ShFormControl) {
              c.canDestroy = true;
              this.removeControl(c);
            }
          });
        } else if (control instanceof ShFormControl) {
          control.canDestroy = true;
          this.removeControl(control);
        }
      });
    }
  }

  isValid(model: any, prop?: string) {
    const component = this.getComponent(model, prop);
    return component?.valid;
  }
  
  isInvalid(model: any, prop?: string) {
    const component = this.getComponent(model, prop);
    return component?.invalid;
  }

  isPending(model: any, prop?: string) {
    const component = this.getComponent(model, prop);
    return component?.pending;
  }

  isDisabled(model: any, prop?: string) {
    const component = this.getComponent(model, prop);
    return component?.disabled;
  }

  isEnabled(model: any, prop?: string) {
    const component = this.getComponent(model, prop);
    return component?.enabled;
  }

  isTouched(model: any, prop?: string) {
    const component = this.getComponent(model, prop);
    return component?.touched;
  }

  isUntouched(model: any, prop?: string) {
    const component = this.getComponent(model, prop);
    return component?.untouched;
  }

  isDirty(model: any, prop?: string) {
    const component = this.getComponent(model, prop);
    return component?.dirty;
  }

  isPristine(model: any, prop?: string) {
    const component = this.getComponent(model, prop);
    return component?.pristine;
  }

  isValid$(model: any, prop?: string) {
    return this.getComponentPromise(this.buildValidSubscription.bind(this), model, prop);
  }

  isInvalid$(model: any, prop?: string) {
    return this.getComponentPromise(this.buildInvalidSubscription.bind(this), model, prop);
  }

  isPending$(model: any, prop?: string) {
    return this.getComponentPromise(this.buildPendingSubscription.bind(this), model, prop);
  }

  isDisabled$(model: any, prop?: string) {
    return this.getComponentPromise(this.buildDisabledSubscription.bind(this), model, prop);
  }

  isEnabled$(model: any, prop?: string) {
    return this.getComponentPromise(this.buildEnabledSubscription.bind(this), model, prop);
  }

  isTouched$(model: any, prop?: string) {
    return this.getComponentPromise(this.buildTouchedSubscription.bind(this), model, prop);
  }

  isUntouched$(model: any, prop?: string) {
    return this.getComponentPromise(this.buildUntouchedSubscription.bind(this), model, prop);
  }

  isDirty$(model: any, prop?: string) {
    return this.getComponentPromise(this.buildDirtySubscription.bind(this), model, prop);
  }

  isPristine$(model: any, prop?: string) {
    return this.getComponentPromise(this.buildPristineSubscription.bind(this), model, prop);
  }

  protected createGroup<TControl extends { [K in keyof TControl]: AbstractControl<any> } = any>(model: { [id: string]: any }): ShFormGroup<TControl>;
  protected createGroup<TControl extends { [K in keyof TControl]: AbstractControl<any> } = any>(prop: string, parent: { [id: string]: any }): ShFormGroup<TControl>;
  protected createGroup<TControl extends { [K in keyof TControl]: AbstractControl<any> } = any>(model: string | { [id: string]: any }, parent?: { [id: string]: any }): ShFormGroup<TControl> {
    if (typeof model === 'string') {
      const parentPropSyncValidators = this.validatorHelper.getSyncValidators(parent, model);
      // undefined parent[model] not supported, should throw error?
      const modelSyncValidators = this.validatorHelper.getSyncValidators(parent[model]);
      let syncValidators: ValidatorFn | null = null;
      if (parentPropSyncValidators && modelSyncValidators) {
        syncValidators = Validators.compose([parentPropSyncValidators, modelSyncValidators]);
      } else if (parentPropSyncValidators) {
        syncValidators = parentPropSyncValidators;
      } else if (modelSyncValidators) {
        syncValidators = modelSyncValidators;
      }
      const parentPropAsyncValidators = this.validatorHelper.getAsyncValidators(parent, model);
      // undefined parent[model] not supported, should throw error?
      const modelAsyncValidators = this.validatorHelper.getAsyncValidators(parent[model]);
      let asyncValidators: AsyncValidatorFn | null = null;
      if (parentPropAsyncValidators && modelAsyncValidators) {
        asyncValidators = Validators.composeAsync([parentPropAsyncValidators, modelAsyncValidators]);
      } else if (parentPropAsyncValidators) {
        asyncValidators = parentPropAsyncValidators;
      } else if (modelAsyncValidators) {
        asyncValidators = modelAsyncValidators;
      }
      return new ShFormGroup<TControl>({} as TControl, syncValidators, asyncValidators);
    } else {
      return new ShFormGroup<TControl>({} as TControl, this.validatorHelper.getSyncValidators(model), this.validatorHelper.getAsyncValidators(model));
    }
  }

  protected createControl<T = any>(model: { [id: string]: any }, prop: string): ShFormControl<T> {
    return new ShFormControl<T>(
      model[prop],
      this.validatorHelper.getSyncValidators(model, prop),
      this.validatorHelper.getAsyncValidators(model, prop),
      this.validatorHelper.getSyncWarnings(model, prop),
      this.validatorHelper.getAsyncWarnings(model, prop)
    );
  }

  protected createArray<T extends AbstractControl<any> = any>(): ShFormArray<T>;
  protected createArray<T extends AbstractControl<any> = any>(prop: string, parent: { [id: string]: any }): ShFormArray<T>;
  protected createArray<T extends AbstractControl<any> = any>(prop?: string, parent?: { [id: string]: any }): ShFormArray<T> {
    if (!isNoU(prop)) {
      return new ShFormArray<T>([], this.validatorHelper.getSyncValidators(parent, prop), this.validatorHelper.getAsyncValidators(parent, prop));
    } else {
      return new ShFormArray<T>([]);
    }
  }

  protected initializeFormRoot() {
    this.formRoot = new ShFormGroup<any>({});
    this.store.set(this.getKey(this.root), this.formRoot);
    this.validityChanges = from(this.formRoot.statusChanges)
      .pipe(map((validity) => validity === 'VALID'),
        distinctUntilChanged());
    this.formRoot.autodestroy = false;
  }

  protected getComponent(model: { [id: string]: any }, prop?: string): AbstractControl | undefined {
    const key = this.getKey(model, prop);
    if (this.store.containsKey(key)) {
      return this.store.get(key);
    } else {
      const index = this.keys.indexOf(key);
      this.keys.splice(index, 1);
      return undefined;
    }
  }

  protected getKey<T>(model: T, prop?: string) {
    let key = this.keys.find(k => k.model === model && k.prop === prop);
    if (!key) {
      key = { model, prop };
      this.keys.push(key);
    }
    return key;
  }

  private getComponentPromise(buildFunction: Function, model: { [id: string]: any }, prop?: string) {   //leak
    return new Promise<Observable<boolean>>((resolve) => {
      const key = this.getKey(model, prop);
      if (this.store.containsKey(key)) {
        resolve(buildFunction(key));
      } else {
        this.storeUnresolvedSubscription(key, { resolveFunction: resolve, buildFunction: buildFunction });
      }
    });
  }

  private attach(control: AbstractControl, parent: { [id: string]: any }, controlName = this.next) {
    if (this.isFormArrayEnabled && parent instanceof Array) {
      const array = this.getArray(parent, undefined, true);
      // or throw error?
      array && array.push(control);
    } else {
      const group = this.getGroup(parent, undefined, true);
       // or throw error?
      group && group.setControl(controlName, control);
    }
  }

  private detach(parent: ShFormGroup, control: AbstractControl): void;
  private detach(parent: ShFormArray, control: AbstractControl): void;
  private detach(parent: { [id: string]: any }, key: Key): void;
  private detach(parent: { [id: string]: any } | ShFormGroup | ShFormArray, keyOrControl: Key | AbstractControl): void {
    if (parent instanceof ShFormGroup) {
      const controlName = Object.keys(parent.controls).find((name) => parent.controls[name] === keyOrControl);
      parent.removeControl(controlName);
    } else if (parent instanceof ShFormArray) {
      const controlIndex = parent.controls.indexOf(keyOrControl as AbstractControl);
      parent.removeAt(controlIndex);
    } else {
      const parentKey = this.getKey(parent);
      if (this.store.containsKey(parentKey)) {
        const parentForm = this.store.get(parentKey) as ShFormGroup | ShFormArray;
        const control = this.store.get(keyOrControl as Key);
        if (parentForm instanceof ShFormGroup) {
          const controlName = Object.keys(parentForm.controls).find((name) => parentForm.controls[name] === control);
          parentForm.removeControl(controlName);
        } else if (parentForm instanceof ShFormArray) {
          const controlIndex = parentForm.controls.indexOf(control);
          parentForm.removeAt(controlIndex);
        }
      } else {
        const index = this.keys.indexOf(parentKey);
        this.keys.splice(index, 1);
      }
    }
  }

  private storeUnresolvedSubscription(key: Key, subscription: UnresolvedSubscription) {
    if (this.unresolvedSubscriptions.containsKey(key)) {
      this.unresolvedSubscriptions.get(key).push(subscription);
    } else {
      this.unresolvedSubscriptions.set(key, [subscription]);
    }
  }

  private resolveSubscriptions(key: Key) {
    if (this.unresolvedSubscriptions.containsKey(key)) {
      this.unresolvedSubscriptions.get(key).forEach((subscription) => subscription.resolveFunction(subscription.buildFunction(key)));
      this.unresolvedSubscriptions.remove(key);
    }
  }

  private buildValidSubscription(key: Key) {
    return this.buildSubscription(key, 'valid');
  }

  private buildInvalidSubscription(key: Key) {
    return this.buildSubscription(key, 'invalid');
  }

  private buildPendingSubscription(key: Key) {
    return this.buildSubscription(key, 'pending');
  }

  private buildDisabledSubscription(key: Key) {
    return this.buildSubscription(key, 'disabled');
  }

  private buildEnabledSubscription(key: Key) {
    return this.buildSubscription(key, 'enabled');
  }

  private buildTouchedSubscription(key: Key) {
    return this.buildSubscription(key, 'touched');
  }

  private buildUntouchedSubscription(key: Key) {
    return this.buildSubscription(key, 'untouched');
  }

  private buildDirtySubscription(key: Key) {
    return this.buildSubscription(key, 'dirty');
  }

  private buildPristineSubscription(key: Key) {
    return this.buildSubscription(key, 'pristine');
  }

  private buildSubscription(key: Key, property: SubscriptableProperty) {
    const control = this.store.get(key);
    return control.statusChanges
      .pipe(map((): boolean => (<any>control)[property]),
        distinctUntilChanged());
  }

}
