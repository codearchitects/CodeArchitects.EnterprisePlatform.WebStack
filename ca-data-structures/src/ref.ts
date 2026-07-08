/**
 * Reference value type
 */
type RefValue<T, K = undefined> = K extends undefined ? T : K extends keyof T ? T[K] : T;

/**
 * Reference contract
 */
export interface IRef<TValue = any> {
    /**
     * Reference value
     */
    value: TValue;
}

/**
 * Reference class definition
 */
export class Ref<T, K extends keyof T = undefined> implements IRef {
    /**
     * Reference value
     */
    public get value(): RefValue<T, K> {
        if (this._get) {
            return this._get() as any;
        } else if (this._prop) {
            return this._model[this._prop] as RefValue<T, K>;
        } else {
            return this._value as any;
        }
    }
    public set value(val: RefValue<T, K>) {
        if (this._set) {
            this._set(val as RefValue<T>);
        } else if (this._prop) {
            this._model[this._prop] = val as T[K];
        } else {
            this._value = val as RefValue<T>;
        }
    }
    /**
     * (ByVal) value
     */
    private _value: RefValue<T>;
    /**
     * (ByRef) context
     */
    private _model: T;
    /**
     * (ByRef) model property name
     */
    private _prop: K;
    /**
     * (ByRef) local variable getter
     */
    private _get: () => RefValue<T>;
    /**
     * (ByRef) local variable setter
     */
    private _set: (val: RefValue<T>) => void;
    // tslint:disable-next-line: unified-signatures
    /**
     * (ByRef) Creates a references to a property of a model
     * @param model Model of the property
     * @param prop Property name
     */
    // tslint:disable-next-line: unified-signatures
    constructor(model: T, prop: K);
    /**
     * ByVal
     * @param value Value
     */
    constructor(value: T);
    /**
     * Creates a reference to a local variable
     * @param get Getter of local variable
     * @param set Setter of local variable
     */
    constructor(get: () => T, set: (val: T) => void);
    constructor(modelOrGetOrValue: T | (() => T), propOrSet?: K | ((val: T) => void)) {
        if (arguments.length === 1) {
            this._value = modelOrGetOrValue as RefValue<T>;
        } else if (typeof modelOrGetOrValue === 'function') {
            this._get = modelOrGetOrValue as (() => RefValue<T>);
            this._set = propOrSet as (val: RefValue<T>) => void;
        } else {
            this._model = modelOrGetOrValue as T;
            this._prop = propOrSet as K;
        }
    }
}
