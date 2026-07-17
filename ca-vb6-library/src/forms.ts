/**
 * Form Enhancement informations
 */
interface FormEnhancement {
  /**
   * Context member name
   */
  member: string;
  /**
   * Function member arguments
   */
  arguments?: any[];
  /**
   * Context member value
   */
  value?: any;
}

/**
 * Form Property Proxy
 */
class FormPropertyProxy {
  /**
   * Form Property Proxy
   * @param key Property key
   * @param stack Enhancements stack
   */
  constructor(key: string, stack?: FormEnhancement[]);
  constructor(private readonly ___ownKey: string, public stack: FormEnhancement[] = []) {
    return new Proxy(this, {
      get: (obj: any, key: string, receiver: any) => {
        switch (key) {
          case '_self':
            return obj;
          case '___ownKey':
            return this.___ownKey;
          case 'exec':
            return (...args: any[]) => {
              this.onEnhance({ member: key, arguments: args });
            };
          case 'unwrap':
            return () => undefined;
          default:
            if (obj[key] == undefined) {
              this.onEnhance({ member: key });
              obj[key] = new FormPropertyProxy(this.___ownKey ? `${this.___ownKey}.${key}` : key, this.stack);
            }
            return obj[key];
        }
      },
      set: (obj: any, key: string, value: any, receiver: any) => {
        obj[key] = value;
        if (obj[key] != undefined) {
          obj[key].__proto__.unwrap = function () { return this };
        }
        this.onEnhance({ member: key, value });
        return true;
      }
    });
  }

  /**
   * Event fired when an instance property will be enhanced
   * @param enhancement Property enhancement informations
   */
  private onEnhance = (enhancement: FormEnhancement) => {
    if (enhancement.member === 'stack') {
      return;
    } else if (enhancement.member === 'exec') {
      enhancement.member = `${this.___ownKey}`;
    } else if (this.___ownKey) {
      enhancement.member = `${this.___ownKey}.${enhancement.member}`;
    }
    if (enhancement.value != undefined || enhancement.arguments) {
      this.stack.push(enhancement);
    }
  }
}

/**
 * Forms Enhancer
 */
class FormEnhancerDefinition {
  readonly [key: string]: any;
  constructor() {
    return new Proxy(this, {
      get: (obj: any, key: string, receiver: any) => {
        if (typeof obj[key] === 'function') {
          return obj[key];
        }
        key = key.toLowerCase().replace('component', '');
        if (!obj[key]) {
          obj[key] = new FormPropertyProxy(undefined);
        }
        return obj[key];
      },
      set: (obj: any, key: string, value: any, receiver: any) => {
        return true;
      }
    });
  }

  /**
   * Set own properties reading stack
   */
  public setOwnProperties(target: any) {
    const name = target.constructor.name.toLowerCase().replace('component', '');
    const context = this[name] as FormPropertyProxy;
    if (context) {
      context.stack.forEach(e => {
        let boundingTarget = target;
        let boundingContext = context;
        let memberName = e.member;
        if (memberName === 'stack') {
          return;
        }
        if (memberName.indexOf('.') > -1) {
          const members = memberName.split(new RegExp('\\.', 'g'));
          memberName = members.pop();
          members.forEach(m => {
            if (boundingTarget[m] === undefined) {
              boundingTarget[m] = {};
            }
            boundingTarget = boundingTarget[m];
            boundingContext = boundingContext[m];
          })
        }
        if (e.arguments) {
          boundingTarget[memberName](...e.arguments);
        } else if (e.value) {
          boundingTarget[memberName] = e.value;
        } else {
          if (typeof boundingContext[memberName] !== 'function') {
            boundingTarget[memberName] = boundingContext[memberName].unwrap();
          }
        }
      });
      context.stack = [];
    }
  }

  /**
   * Clean form instance properties and stack
   */
  public cleanOwnProperties(target: any) {
    const name = target.constructor.name.toLowerCase().replace('component', '');
    const context = this[name] as FormPropertyProxy;
    context.stack = [];
    if (context) {
      for (const key in context) {
        if (this.canCleanProperty(key)) {
          target[key] = context[key] = undefined;
        }
      }
    }
  }

  /**
   * Clean form properties and stack
   * @param target Form Enhancement to be cleaned
   * @param storicizes Specifies whether to add to stack reset actions
   */
  public cleanForm(target: any, storicizes = false) {
    if (target) {
      target.stack = [];
      for (const key in target) {
        if (this.canCleanProperty(key)) {
          target[key] = undefined;
          if (storicizes) {
            (target.stack as FormEnhancement[]).push({ member: key, value: undefined })
          }
        }
      }
    }
  }

  /**
   * Clears all form enhanced
   * @returns true for operations successfully
   */
  public clear() {
    try {
      const formNames = Object.keys(FormEnhancer);
      formNames.forEach(formName => {
        FormEnhancer.cleanForm(FormEnhancer[formName]);
      });
    } catch (ex) {
      console.error(ex);
      return false;
    }
    return true;
  }

  /**
   * Specifies whether property can be cleaned
   * @param propertyName Property to be cleaned
   */
  private canCleanProperty(propertyName: string) {
    return propertyName !== 'stack'
      && propertyName !== '___ownKey'
      && propertyName !== 'onEnhance'
      && propertyName !== 'cleanOwnProperties'
      && propertyName !== 'setOwnProperties'
      && propertyName !== 'cleanForm'
      && propertyName !== 'canCleanProperty'
      && propertyName !== 'exec'
      && propertyName !== 'unwrap'
      && propertyName !== '__proto__';
  }


  /**
   * Restore a component state, even not saved values
   * @param formName The Name of the form
   * @param classInstance The instance of the component class
   * @param callback A callback to execute after restoring props, you can pass a caller to manage different behaviour
   */
  public async restoreState(formName: string, classInstance: object, callback = (callerProp) => { }) {

    const properties = this[formName].__props.unwrap();

    if (properties) {
      properties.forEach(prop => this.setPropByString(classInstance, prop, this[formName][prop].unwrap()));

      const callerProp = this[formName].__navigationCallerProp.unwrap()
      if (callerProp != null) {
        await callback(callerProp);
      }
      this.cleanForm(this[formName]);
    }

  }

  /**
   * Store a component state, even not saved values
   * @param formName The Name of the form
   * @param classInstance The instance of the component class
   * @param callerProp a prop to store in NavigationCallerProp
   */
  public storeState(formName: string, classInstance: object, callerProp: string = undefined, additionalProps: string[] = []) {
    const forbiddenProps = ["applicationName", "domainName", "scenarioName", "actionName", "_yetInNgOnInit", "isReady", "_i", "hubName", "taskSlotFactory", "stackFrameFactory"];
    let properties = Object.keys(classInstance).filter(p =>
      forbiddenProps.indexOf(p) === -1 && (
        typeof classInstance[p] !== "object" ||
        (classInstance[p] instanceof Date && !isNaN(classInstance[p]))
      )
    );

    this[formName].__props = [...properties, ...additionalProps];

    this[formName].__props.forEach(prop => {
      this[formName][prop] = this.getPropByString(classInstance, prop);
    });

    if (callerProp != null) {
      this[formName].__navigationCallerProp = callerProp;
    }
  }


  /**
   * It access nested props of an object by a path 
   * @param classInstance The instance of the component class
   * @param path The property accessor with keys and dots
   * @returns The prop value
   */
  private getPropByString(classInstance: object, path: string): any {
    return path.split('.').reduce((accumulator, current) => {
      return accumulator ? accumulator[current] : null
    }, classInstance);
  }

  /**
   * It set value in a nested prop of an object by a path 
   * @param classInstance The instance of the component class
   * @param path The property accessor with keys and dots
   * @param value The value to set
   * @returns The prop value
   */
  private setPropByString(classInstance: object, path: string, value: any): any {
    const splittedPath = path.split('.');
    return splittedPath.reduce((accumulator, current, index) => {
      return accumulator[current] = splittedPath.length === ++index ? value : accumulator[current] || {};
    }, classInstance);
  }
}

export const FormEnhancer = new FormEnhancerDefinition();
