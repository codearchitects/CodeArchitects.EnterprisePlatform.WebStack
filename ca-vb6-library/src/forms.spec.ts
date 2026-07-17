import { FormEnhancer } from './index';

class FrmpersonaComponent {
  public Name: string;
  public Enabled: boolean;
  public Container: { Id: string, FirstName: string, Child: { Id: number } };
  public Functions = {
    LastLog: '',
    SetLookups: (lookups: string[]) => {
      this.__lookups = lookups;
    },
    SubFunctions: {
      LogLookups: (title: string) => {
        this.Functions.LastLog = `${title}${this.__lookups.toString()}`;
      }
    }
  }
  private __lookups = [];

  public ChangeName(name: string) {
    this.Name = name;
  }

  public ChangeContainerFirstName(value: string) {
    this.Container.FirstName = value;
  }
}

class FrmRiassegnaComponent {
  public applicationName = "CA";
  public Name: string = "frmriassegna";
  public TxtField: string = "Giovanni";
  public MskDtField: Date = new Date(1980, 12, 30);
  public BoolField: boolean = false;
  public NumField: number = 100;
  public FieldExitPoint: string = "Qualcosa";
  public simpleArray = [];

  public ChangeName(name: string) {
    this.Name = name;
  }
}

describe('Forms Suite', () => {

  let component = new FrmpersonaComponent();
  let component2 = new FrmRiassegnaComponent();

  test('should be defined', () => {
    const actual = FormEnhancer;
    expect(actual).toBeDefined();
  });

  test('should define FrmPersona enhancements', () => {
    FormEnhancer.FrmPersona.Enabled = true;
    FormEnhancer.FrmPersona.Name = 'Mario';
    FormEnhancer.FrmPersona.Container.Id = '123';
    FormEnhancer.FrmPersona.Container.Child.Id = 345;
    FormEnhancer.FrmPersona.Container.FirstName = 'Biagio';
    FormEnhancer.FrmPersona.ChangeContainerFirstName.exec('Gianni');
    FormEnhancer.FrmPersona.Container.FirstName = 'Veronica';
    FormEnhancer.FrmPersona.Functions.SetLookups.exec(['Luca', 'Tonio', 'Marco']);
    FormEnhancer.FrmPersona.Functions.SubFunctions.LogLookups.exec('LOG: ');
    let actual = FormEnhancer.FrmPersona.Enabled;
    expect(actual).toEqual(true);
    actual = FormEnhancer.FrmPersona.Name;
    expect(actual).toEqual('Mario');
    actual = FormEnhancer.FrmPersona.Container;
    expect(actual).toBeDefined();
    actual = FormEnhancer.FrmPersona.Container.Id;
    expect(actual).toEqual('123');
    actual = FormEnhancer.FrmPersona.Container.Child;
    expect(actual).toBeDefined();
    actual = FormEnhancer.FrmPersona.Container.Child.Id;
    expect(actual).toEqual(345);
    FormEnhancer.FrmPersona.ChangeName.exec('Francesco');
    actual = FormEnhancer.FrmPersona.ChangeName;
    expect(actual).toBeDefined();
    actual = FormEnhancer.FrmPersona.Container.FirstName;
    expect(actual).toEqual('Veronica');
    actual = FormEnhancer.FrmPersona.ChangeContainerFirstName;
    expect(actual).toBeDefined();
    actual = FormEnhancer.FrmPersona.Functions;
    expect(actual).toBeDefined();
    actual = FormEnhancer.FrmPersona.Functions.SetLookups;
    expect(actual).toBeDefined();
    actual = FormEnhancer.FrmPersona.Functions.Sub;
    expect(actual).toBeDefined();
    actual = FormEnhancer.FrmPersona.Functions.Sub.LogLookups;
    expect(actual).toBeDefined();
  });

  test('should restore FrmpersonaComponent shared properties', () => {
    FormEnhancer.setOwnProperties(component);
    expect(component.Enabled).toEqual(true);
    expect(component.Name).toEqual('Francesco');
    expect(component.Container).toBeDefined();
    expect(component.Container.Id).toEqual('123');
    expect(component.Container.Child).toBeDefined();
    expect(component.Container.Child.Id).toEqual(345);
    expect(component.Container.FirstName).toEqual('Veronica');
    expect(component.Functions.LastLog).toEqual('LOG: Luca,Tonio,Marco');
  });

  test('should clean FrmpersonaComponent own shared properties', () => {
    FormEnhancer.cleanOwnProperties(component);
    expect(component.Enabled).toBeUndefined();
    expect(component.Name).toBeUndefined();
    expect(component.Container).toBeUndefined();
    expect(component.Functions).toBeUndefined();
  });

  test('should clean FrmpersonaComponent instance shared properties', () => {
    FormEnhancer.FrmPersona.Enabled = true;
    FormEnhancer.FrmPersona.Name = 'Mario';
    FormEnhancer.FrmPersona.Container.Id = '123';
    FormEnhancer.FrmPersona.Container.Child.Id = 345;
    FormEnhancer.FrmPersona.Container.FirstName = 'Biagio';
    FormEnhancer.FrmPersona.ChangeContainerFirstName.exec('Gianni');
    FormEnhancer.FrmPersona.Container.FirstName = 'Veronica';
    component = new FrmpersonaComponent();
    FormEnhancer.setOwnProperties(component);
    expect(component.Enabled).toEqual(true);
    expect(component.Name).toEqual('Mario');
    expect(component.Container).toBeDefined();
    expect(component.Container.Id).toEqual('123');
    expect(component.Container.Child).toBeDefined();
    expect(component.Container.Child.Id).toEqual(345);
    expect(component.Container.FirstName).toEqual('Veronica');
    FormEnhancer.cleanForm(FormEnhancer.FrmPersona);
    expect(FormEnhancer.FrmPersona.Enabled.unwrap()).not.toBeDefined();
    expect(FormEnhancer.FrmPersona.Name.unwrap()).not.toBeDefined();
    expect(FormEnhancer.FrmPersona.Container.Id.unwrap()).not.toBeDefined();
    expect(FormEnhancer.FrmPersona.Container.Child.unwrap()).not.toBeDefined();
    FormEnhancer.setOwnProperties(component);
    expect(component.Enabled).toBeDefined();
    expect(component.Name).toBeDefined();
    expect(component.Container).toBeDefined();
  });

  test('should clean FrmpersonaComponent instance shared properties with storicization', () => {
    FormEnhancer.FrmPersona.Enabled = true;
    FormEnhancer.FrmPersona.Name = 'Mario';
    component = new FrmpersonaComponent();
    FormEnhancer.setOwnProperties(component);
    expect(component.Enabled).toEqual(true);
    expect(component.Name).toEqual('Mario');
    FormEnhancer.cleanForm(FormEnhancer.FrmPersona, true);
    expect(FormEnhancer.FrmPersona.Enabled.unwrap()).not.toBeDefined();
    expect(FormEnhancer.FrmPersona.Name.unwrap()).not.toBeDefined();
    FormEnhancer.setOwnProperties(component);
    expect(component.Enabled).not.toBeDefined();
    expect(component.Name).not.toBeDefined();
  });

  test('should unwrap value', () => {
    expect(FormEnhancer.FrmPersona.TxtName.unwrap()).toEqual(undefined);
    FormEnhancer.FrmPersona.TxtName = 'Michele';
    expect(FormEnhancer.FrmPersona.TxtName.unwrap()).toEqual('Michele');

    expect(FormEnhancer.FrmPersona.TxtAge.unwrap()).toEqual(undefined);
    FormEnhancer.FrmPersona.TxtAge = 23;
    expect(FormEnhancer.FrmPersona.TxtAge.unwrap()).toEqual(23);

    expect(FormEnhancer.FrmPersona.TxtAccepted.unwrap()).toEqual(undefined);
    FormEnhancer.FrmPersona.TxtAccepted = true;
    expect(FormEnhancer.FrmPersona.TxtAccepted.unwrap()).toEqual(true);

    expect(FormEnhancer.FrmPersona.ChkVerified.unwrap()).toEqual(undefined);
    FormEnhancer.FrmPersona.ChkVerified = false;
    expect(FormEnhancer.FrmPersona.ChkVerified.unwrap()).toEqual(false);

    expect(FormEnhancer.FrmPersona.ZeroValue.unwrap()).toEqual(undefined);
    FormEnhancer.FrmPersona.ZeroValue = 0;
    expect(FormEnhancer.FrmPersona.ZeroValue.unwrap()).toEqual(0);

    expect(FormEnhancer.FrmPersona.TxtObj.unwrap()).toEqual(undefined);
    FormEnhancer.FrmPersona.TxtObj = { hello: 'world' };
    expect(FormEnhancer.FrmPersona.TxtObj.unwrap().hello).toEqual('world');
  });

  test('should store state of FrmRiassegnaComponent instance', () => {
    FormEnhancer.storeState("FrmRiassegna", component2);
    expect(FormEnhancer.FrmRiassegna.Name.unwrap()).toEqual("frmriassegna");
    expect(FormEnhancer.FrmRiassegna.TxtField.unwrap()).toEqual("Giovanni");
    expect(FormEnhancer.FrmRiassegna.MskDtField.unwrap().getTime()).toEqual(new Date(1980, 12, 30).getTime());
    expect(FormEnhancer.FrmRiassegna.BoolField.unwrap()).toEqual(false);
    expect(FormEnhancer.FrmRiassegna.NumField.unwrap()).toEqual(100);
    expect(FormEnhancer.FrmRiassegna.FieldExitPoint.unwrap()).toEqual("Qualcosa");
    expect(FormEnhancer.FrmRiassegna.ChangeName.unwrap()).toEqual(undefined);

    component2.TxtField = "Ermenegildo";
    component2.MskDtField = new Date(1970, 12, 30);
    component2.BoolField = true;
    component2.NumField = 1000;
    component2.FieldExitPoint = "Altro";

    FormEnhancer.storeState("FrmRiassegna", component2);
    expect(FormEnhancer.FrmRiassegna.TxtField.unwrap()).toEqual("Ermenegildo");
    expect(FormEnhancer.FrmRiassegna.MskDtField.unwrap().getTime()).toEqual(new Date(1970, 12, 30).getTime());
    expect(FormEnhancer.FrmRiassegna.BoolField.unwrap()).toEqual(true);
    expect(FormEnhancer.FrmRiassegna.NumField.unwrap()).toEqual(1000);
    expect(FormEnhancer.FrmRiassegna.FieldExitPoint.unwrap()).toEqual("Altro");

    FormEnhancer.cleanForm(FormEnhancer.FrmRiassegna);
  });

  test('should store a state and restore it in a new instance of FrmRiassegnaComponent', () => {
    component2 = new FrmRiassegnaComponent();

    component2.TxtField = "Ermenegildo";
    component2.MskDtField = new Date(1990, 2, 25);
    component2.BoolField = true;
    component2.NumField = 1000;
    component2.FieldExitPoint = "Altro";

    FormEnhancer.storeState("FrmRiassegna", component2);
    component2 = null;
    component2 = new FrmRiassegnaComponent();

    FormEnhancer.restoreState('FrmRiassegna', component2);
    expect(component2.TxtField).toEqual("Ermenegildo");
    expect(component2.MskDtField.getTime()).toEqual(new Date(1990, 2, 25).getTime());
    expect(component2.BoolField).toEqual(true);
    expect(component2.NumField).toEqual(1000);
    expect(component2.FieldExitPoint).toEqual("Altro");

    FormEnhancer.cleanForm(FormEnhancer.FrmRiassegna);
  });


  test('should store a state and restore it in a new instance of FrmRiassegnaComponent with a callerProp', async () => {
    component2 = new FrmRiassegnaComponent();

    component2.TxtField = "Ermenegildo";
    component2.MskDtField = new Date(1970, 5, 20);
    component2.BoolField = true;
    component2.NumField = 1000;
    component2.FieldExitPoint = "Altro";
    component2.applicationName = "NEWCA";

    FormEnhancer.storeState("FrmRiassegna", component2, "NavigateFromAToB");
    component2 = null;
    component2 = new FrmRiassegnaComponent();

    const callback = async (callerProp: string) => {
      if (callerProp === "NavigateFromAToB") {
        component2.NumField = 2000;
      }
    }

    await FormEnhancer.restoreState('FrmRiassegna', component2, callback);
    expect(component2.TxtField).toEqual("Ermenegildo");
    expect(component2.MskDtField.getTime()).toEqual(new Date(1970, 5, 20).getTime());
    expect(component2.BoolField).toEqual(true);
    expect(component2.NumField).toEqual(2000);
    expect(component2.FieldExitPoint).toEqual("Altro");
    expect(component2.applicationName).toEqual("CA");

    FormEnhancer.cleanForm(FormEnhancer.FrmRiassegna);
  });


  test('should store a state with additional props and restore it in a new instance of FrmRiassegnaComponent', () => {
    component2 = new FrmRiassegnaComponent();

    component2.TxtField = "Ermenegildo";
    component2.simpleArray = ['first', 'second'];

    FormEnhancer.storeState("FrmRiassegna", component2, undefined, [
      'simpleArray'
    ]);
    component2 = null;
    component2 = new FrmRiassegnaComponent();


    FormEnhancer.restoreState('FrmRiassegna', component2);
    expect(component2.TxtField).toEqual("Ermenegildo");
    expect(component2.simpleArray).toEqual(['first', 'second']);

    FormEnhancer.cleanForm(FormEnhancer.FrmRiassegna);
  });

  test('should clean all states', () => {
    FormEnhancer.FrmPersona.Enabled = true;
    FormEnhancer.FrmContatti.Name = 'Mario';

    FormEnhancer.clear()

    expect(FormEnhancer.FrmPersona.Enabled.unwrap()).toEqual(undefined);
    expect(FormEnhancer.FrmContatti.Name.unwrap()).toEqual(undefined);
  });

  test('should resolve props inside object', () => {
    const main: any = {
      sub: {
        subsub: 'hello',
        somearray: []
      }
    };
    const plain: any = {};

    expect(FormEnhancer['getPropByString'](main, 'sub.subsub')).toEqual('hello');

    FormEnhancer['setPropByString'](main, 'sub.subsub', 'ciao');
    expect(main.sub.subsub).toEqual('ciao');

    FormEnhancer['setPropByString'](main, 'sub.somearray', ['a', 'b']);
    expect(main.sub.somearray).toEqual(['a', 'b']);

    FormEnhancer['setPropByString'](plain, 'sub.subsub', 'new');
    expect(plain.sub.subsub).toEqual('new');
  });
});