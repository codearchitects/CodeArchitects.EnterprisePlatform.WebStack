import 'core-js';
// import { expect } from 'chai';
import { JsonIgnore, JsonObject } from './reflection-decorators';
import * as reflectionDecorators from './reflection-decorators';
import { MetadataHelpers } from './metadata-helpers';

export const ENTITYKEYS = 'keys';
export type KeysType = string | Array<string>;

export interface IEntityObject {
  name: string;
  keys: KeysType;
}

export function Entity(object: IEntityObject) {
  return MetadataHelpers.defineMetadata(ENTITYKEYS, object);
}

export function getEntity(object: any) {
  return MetadataHelpers.getMetadata<IEntityObject>(ENTITYKEYS, object);
}

export function hasEntity(object: any) {
  return MetadataHelpers.getMetadata<IEntityObject>(ENTITYKEYS, object) !== undefined;
}

export enum EntityState {
  Ready = 0,
  UpdatePending = 1,
  Deleted = 2,
  Disabled = 4
}

@JsonObject({ name: 'Entity' })
export abstract class TheEntity {

  @JsonIgnore() public status: EntityState = 0;

  /* tslint:disable */
  @JsonIgnore() private _id: string;
  /* tslint:enable */

  public get id(): string { return this.getter<string>('_id'); }
  public set id(value: string) { this.setter<string>('_id', 'id', value, true); }

  // #region Facilities

  protected getter<T>(attrName: string): T {
    const self: any = this;
    return self[attrName];
  }

  protected setter<T>(attrName: string, propName: string, value: T, isKey = false) {
    const self: any = this;
    self[attrName] = value;
  }

  // #endregion Facilities

}

@JsonObject({ name: 'TrackableEntity' })
export abstract class TrackableEntity
  extends TheEntity {
}

@JsonObject({ name: 'WKI.Notaro.Amministrazione.Fattura.DepositoLookup, WKI.Containers' })
@Entity({
  name: 'WKI.Notaro.Amministrazione.Fattura.DepositoLookup',
  keys: ['id']
})
export class DepositoLookup extends TrackableEntity {

  /* #template models/models-entity-declarations.ejs */

  // #region fields
  /* tslint:disable */
  @JsonIgnore() private _numeroDeposito: string;
  @JsonIgnore() private _data: Date;
  @JsonIgnore() private _dataScadenza: Date;
  @JsonIgnore() private _clienti: string;
  @JsonIgnore() private _numeroRepertorio: string;
  @JsonIgnore() private _fascicoli: string;
  @JsonIgnore() private _importoDeposito: number;
  /* tslint:enable */
  // #endregion

  /* #endtemplate models/models-entity-declarations.ejs */

  /* #template models/models-entity-constructor.ejs */

  // constructor

  public constructor() {
    super();
  }
  /* #endtemplate models/models-entity-constructor.ejs */

  /* #template models/models-entity-properties.ejs */

  // #region properties

  /**
   * property: numero progressivo
   */
  public get numeroDeposito(): string { return this.getter<string>('_numeroDeposito'); }
  public set numeroDeposito(value: string) { this.setter<string>('_numeroDeposito', 'numeroDeposito', value); }

  /**
   * property: Data
   */
  public get data(): Date { return this.getter<Date>('_data'); }
  public set data(value: Date) { this.setter<Date>('_data', 'data', value); }

  /**
   * property: Data Scadenza
   */
  public get dataScadenza(): Date { return this.getter<Date>('_dataScadenza'); }
  public set dataScadenza(value: Date) { this.setter<Date>('_dataScadenza', 'dataScadenza', value); }

  /**
   * property: clienti
   */
  public get clienti(): string { return this.getter<string>('_clienti'); }
  public set clienti(value: string) { this.setter<string>('_clienti', 'clienti', value); }

  /**
   * property: string
   */
  public get numeroRepertorio(): string { return this.getter<string>('_numeroRepertorio'); }
  public set numeroRepertorio(value: string) { this.setter<string>('_numeroRepertorio', 'numeroRepertorio', value); }

  /**
   * property: string
   */
  public get fascicoli(): string { return this.getter<string>('_fascicoli'); }
  public set fascicoli(value: string) { this.setter<string>('_fascicoli', 'fascicoli', value); }

  /**
   * property: Importo del deposito
   */
  public get importoDeposito(): number { return this.getter<number>('_importoDeposito'); }
  public set importoDeposito(value: number) { this.setter<number>('_importoDeposito', 'importoDeposito', value); }
  // #endregion

  /* #endtemplate models/models-entity-properties.ejs */

}

/**
 * Deposito per la fattura
 */

@JsonObject({ name: 'WKI.Notaro.Amministrazione.Fattura.DepositoFattura, WKI.Containers' })
@Entity({
  name: 'WKI.Notaro.Amministrazione.Fattura.DepositoFattura',
  keys: ['id']
})
export class DepositoFattura extends TrackableEntity {
  /* #template models/models-entity-declarations.ejs */

  // #region fields
  /* tslint:disable */
  @JsonIgnore() private _importo: number;
  /* tslint:enable */
  // #endregion

  /* #endtemplate models/models-entity-declarations.ejs */

  /* #template models/models-ct-entity-associations.ejs */
  // #region Associations
  // Association: DepositoFattura_Deposito

  @JsonIgnore() private _deposito: DepositoLookup;
  // #endregion

  /* #endtemplate models/models-ct-entity-associations.ejs */

  /* #template models/models-entity-constructor.ejs */

  // constructor

  public constructor() {
    super();
  }
  /* #endtemplate models/models-entity-constructor.ejs */

  /* #template models/models-ct-entity-properties.ejs */

  // #region Properties

  /**
   * property: importo del deposito impegnato per la fattura
   */
  public get importo(): number { return this.getter<number>('_importo'); }
  public set importo(value: number) { this.setter<number>('_importo', 'importo', value); }
  // #endregion

  /* #endtemplate models/models-ct-entity-properties.ejs */

  /* #template models/models-ct-entity-navigation-properties.ejs */

  // #region Navigation properties

  // Navigation property: deposito
  public get deposito() { return this._deposito; }
  public set deposito(value: DepositoLookup) {
    if (this._deposito !== value) {
      const previousValue = this._deposito;
      this._deposito = value;
      this.fixupDeposito(previousValue);
      // this.onNavigationPropertyChanged('deposito');
    }
  }

  // #endregion

  /* #endtemplate models/models-ct-entity-navigation-properties.ejs */

  /* #template models/models-ct-entity-change-tracker.ejs */

  // #region ChangeTracking

  protected clearNavigationProperties() {
    this._deposito = null as any;
    this.fixupDepositoKeys();
  }

  // #endregion

  /* #endtemplate models/models-ct-entity-change-tracker.ejs */

  /* #template models/models-ct-entity-fixups.ejs */

  // #region Fixups

  // Fixup: deposito
  /* #template models/models-ct-entity-fixups-1-to-n.ejs */

  private fixupDeposito(previousValue: DepositoLookup) {
    // if (Serializer.isDeserializing || DataContext.isAttaching) return;

    // if (this.changeTracker.changeTrackingEnabled) {
    //   let originalValues = this.changeTracker.originalValues;
    //   if (originalValues.containsKey('deposito') && originalValues.get('deposito') === this.deposito) {
    //     originalValues.remove('deposito');
    //   } else {
    //     this.changeTracker.recordOriginalValue('deposito', previousValue);
    //   }
    // }
  }

  private fixupDepositoKeys() {
    // const idKeyName = 'deposito.id';

    // if (this.changeTracker.extendedProperties.containsKey(idKeyName)) {
    //   if (this.deposito === null || this.changeTracker.extendedProperties.get(idKeyName) === this.deposito.id) {
    //     this.changeTracker.recordOriginalValue(idKeyName, this.changeTracker.extendedProperties.get(idKeyName));
    //   }
    //   this.changeTracker.extendedProperties.remove(idKeyName);
    // }
  }

  /* #endtemplate models/models-ct-entity-fixups-1-to-n.ejs */

  // #endregion

  /* #endtemplate models/models-ct-entity-fixups.ejs */

}

describe('ancestor bug', () => {
  context('ancestor bug', () => {
    it('deserialization is OK', () => {
      // console.log('----------------------------------------------------');

      let a = reflectionDecorators.getJsonObject(DepositoLookup, true);
      console.log(a);

      const b = reflectionDecorators.getJsonObject(DepositoFattura, true);
      console.log(b);

      a = reflectionDecorators.getJsonObject(DepositoLookup, true);
      console.log(a);
    });
  });
});
