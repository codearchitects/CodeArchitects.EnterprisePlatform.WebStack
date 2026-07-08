import { Injectable } from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';
import { Dictionary } from '@ca-webstack/data-structures';
import { ValidatorHelper } from '@ca-webstack/ng-aspects';
import { Observable, from } from 'rxjs';
import { distinctUntilChanged, map } from 'rxjs/operators';
import { CaepFormControl } from '../utilities/form-control.utility';

interface Key {
  model: any;
  prop?: string;
}

interface UnresolvedSubscription {
  resolveFunction: Function;
  buildFunction: Function;
}

type SubscriptableProperty = 'valid' | 'touched' | 'dirty';

@Injectable(/*{
  providedIn: 'root'
}*/)
export class CaepFormHandlerService {
  validityChanges: Observable<any>;

  private keys = new Array<Key>();
  private store = new Dictionary<Key, AbstractControl>();
  private unresolvedSubscriptions = new Dictionary<Key, UnresolvedSubscription[]>();
  private formRoot = new FormGroup({});
  private root = new Object();
  private index = 0;

  private get next() {
    return `id-${this.index++}`;
  }

  constructor(private validatorHelper: ValidatorHelper) {
    this.store.set(this.getKey(this.root), this.formRoot);
    this.validityChanges = from(this.formRoot.statusChanges).pipe(
      map(validity => validity === 'VALID'),
      distinctUntilChanged()
    );
  }

  getGroup(model: any, parent = this.root) {
    if (!model) {
      return;
    }
    const key = this.getKey(model);

    if (!this.store.containsKey(key)) {
      const control = new FormGroup(
        {},
        this.validatorHelper.getSyncValidators(model),
        this.validatorHelper.getAsyncValidators(model)
      );
      this.attach(control, parent);
      this.store.set(key, control);
      this.resolveSubscriptions(key);
    }

    return this.store.get(key) as FormGroup;
  }

  removeGroup(model: any, parent = this.root) {
    if (!model) {
      return;
    }
    const key = this.getKey(model);
    if (this.store.containsKey(key)) {
      this.detach(parent, key);
      this.store.remove(key);
    }
    const index = this.keys.indexOf(key);
    this.keys.splice(index, 1);
  }

  getControl<C extends CaepFormControl>(model: any, prop: string, disabled: boolean) {
    if (!model) {
      return;
    }
    const key = this.getKey(model, prop);

    if (!this.store.containsKey(key)) {
      const control = new CaepFormControl(
        { value: model[prop], disabled },
        this.validatorHelper.getSyncValidators(model, prop),
        this.validatorHelper.getAsyncValidators(model, prop),
        this.validatorHelper.getSyncWarnings(model, prop),
        this.validatorHelper.getAsyncWarnings(model, prop)
      );
      this.attach(control, model, prop);
      this.store.set(key, control);
      this.resolveSubscriptions(key);
    }

    return this.store.get(key) as C;
  }

  removeControl(model: any, prop: string) {
    if (!model) {
      return;
    }
    const key = this.getKey(model, prop);
    if (this.store.containsKey(key)) {
      this.detach(model, key);
      this.store.remove(key);
      const index = this.keys.indexOf(key);
      this.keys.splice(index, 1);
      const group = this.getGroup(model);
      if (
        Object.keys(this.formRoot.controls).some(name => this.formRoot.controls[name] === group) &&
        Object.keys(group.controls).length === 0
      )
        this.removeGroup(model);
    }
  }

  isValid(model: any, prop?: string) {
    const component = this.getComponent(model, prop);
    return component && component.valid;
  }

  isTouched(model: any, prop?: string) {
    const component = this.getComponent(model, prop);
    return component && component.touched;
  }

  isDirty(model: any, prop?: string) {
    const component = this.getComponent(model, prop);
    return component && component.dirty;
  }

  isValid$(model: any, prop?: string) {
    return this.getComponentPromise(this.buildValidSubscription.bind(this), model, prop);
  }

  isTouched$(model: any, prop?: string) {
    return this.getComponentPromise(this.buildTouchSubscription.bind(this), model, prop);
  }

  isDirty$(model: any, prop?: string) {
    return this.getComponentPromise(this.buildDirtySubscription.bind(this), model, prop);
  }

  private getComponent(model: any, prop?: string) {
    const key = this.getKey(model, prop);
    if (this.store.containsKey(key)) {
      return this.store.get(key);
    }
  }

  private getComponentPromise(buildFunction: Function, model: any, prop?: string) {
    return new Promise<Observable<boolean>>(resolve => {
      const key = this.getKey(model, prop);
      if (this.store.containsKey(key)) {
        resolve(buildFunction(key));
      } else {
        this.storeUnresolvedSubscription(key, { resolveFunction: resolve, buildFunction: buildFunction });
      }
    });
  }

  private attach(control: AbstractControl, parent: any, controlName = this.next) {
    const group = this.getGroup(parent);
    group.setControl(controlName, control);
  }

  private detach(parent: any, key: Key) {
    const group = this.getGroup(parent);
    const control = this.store.get(key);
    const controlName = Object.keys(group.controls).find(name => group.controls[name] === control);
    group.removeControl(controlName);
  }

  private getKey<T>(model: T, prop?: string) {
    let key = this.keys.find(k => k.model === model && k.prop === prop);
    if (!key) {
      key = { model, prop };
      this.keys.push(key);
    }
    return key;
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
      this.unresolvedSubscriptions
        .get(key)
        .forEach(subscription => subscription.resolveFunction(subscription.buildFunction(key)));
      this.unresolvedSubscriptions.remove(key);
    }
  }

  private buildValidSubscription(key: Key) {
    return this.buildSubscription(key, 'valid');
  }

  private buildTouchSubscription(key: Key) {
    return this.buildSubscription(key, 'touched');
  }

  private buildDirtySubscription(key: Key) {
    return this.buildSubscription(key, 'dirty');
  }

  private buildSubscription(key: Key, property: SubscriptableProperty) {
    const control = this.store.get(key);
    return control.statusChanges.pipe(
      map((): boolean => (<any>control)[property]),
      distinctUntilChanged()
    );
  }
}
