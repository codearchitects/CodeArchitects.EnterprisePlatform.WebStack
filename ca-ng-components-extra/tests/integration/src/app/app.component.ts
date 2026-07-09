import { Component, OnInit, TemplateRef } from '@angular/core';
import { Aspect } from '@ca-webstack/ng-aspects';
import { CaepSidePanelService, CaepTextOptions, CaepValueChange, MockTextOptions } from '@ca-webstack/ng-components-extra';
import { Subject } from 'rxjs';
import { BaseInputChildOptions } from './components/base';
import { BaseChildOptions } from './components/base/base-child.component';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    standalone: false
})
export class AppComponent implements OnInit {
  title = 'integration';
  private _destroy$ = new Subject<void>();

  constructor(private _sidePanel: CaepSidePanelService) {}

  // Sidepanel
  openSideBar(event:Event,template: TemplateRef<any>) {
    this._sidePanel.open(event,template);
  }

  // Sidepanel

  //Base and BaseAuth

  //baseOptions = { autofocus: true } as ICaepBaseOptions;
  //baseOptions = new CaepBaseOptions({ autofocus: true });
  //baseOptions = {};
  //baseOptions = { type: 'reset' } as BaseChildOptions;
  baseOptions = new BaseChildOptions({ type: 'reset' });
  width = '500px';
  height = 100;
  containerClass = ['my-class1', 'my-class2']; //coercion
  person = { name: 'William' };
  tooltip = 'Test';

  handleClick() {
    this.height++;
    //this.baseOptions = { /*id: 'new-id',*/ autofocus: false };
    //this.baseOptions.autofocus = false;
    //this.baseOptions = new CaepBaseOptions({ autofocus: false });
    //this.baseOptions = { type: 'submit' } as IBaseChildOptions;
    //this.baseOptions.type = 'submit'; //<----change not detected if this.baseOptions is not a BaseChildOptions instance
    this.baseOptions = new BaseChildOptions({ type: 'submit' });
    this.tooltip += 'Test2';
    //this.containerClass = this.containerClass.concat(' my-class3');
  }


  //BaseModel

  showBaseModelComponent = true;
  showBaseModelInput = true;
  test = 'Prova';
  caepTextValue = 'This is a value in caep text';

  onValueChanges(value: string) {
    console.log('OnValueChanges: ' + value);
  }

  onBaseModelCanValueChange(valueChange: CaepValueChange<string>) {
    if (valueChange.nextValue !== 'unauthorized') {
      valueChange.authorize();
      console.log('Authorized change: ' + this['password'])
    }
  }

  onBaseModelFocus() {
    console.log('Focus base model input');
  }

  onBaseModelBlur() {
    console.log('Blur base model input');
    this.test += 'a';
  }

  onBaseModelClick() {
    //this.showBaseModelComponent = !this.showBaseModelComponent;
    this.showBaseModelInput = !this.showBaseModelInput;
  }


  //BaseInput

  enableBaseInput = true;
  showBaseInput = true;
  showBaseInputComponent = true;
  numbers = Array(1).fill(4).map((x, i) => i);  //Array(100).fill(4).map((x,i)=>i);
  //baseInputOptions = { isReadonly: false, placeholder: 'Input name', maxLength: 30, type: 'text' } as IBaseInputChildOptions;
  //baseInputOptions = { isReadonly: false, maxLength: 30, type: 'text' } as IBaseInputChildOptions; //options without placeeholder, call to AspectHelper
  baseInputOptions = new BaseInputChildOptions({ isReadonly: 'false', placeholder: 'Input name', maxLength: '30', type: 'text' });
  //objModel = {};
  //model = this;
  //name0 = 'value';

  onBaseInputClick() {
    //this.showBaseInputComponent = !this.showBaseInputComponent;
    this.enableBaseInput = !this.enableBaseInput;
    //this.baseInputOptions.isReadonly = true; //<----change not detected if this.baseInputOptions is not a BaseInputChildOptions instance
    //this.baseInputOptions = { isReadonly: true, maxLength: 30, type: 'text' } as IBaseInputChildOptions; //<----change detected, placeholder empty
    //this.baseInputOptions = { isReadonly: true, placeholder: 'New placeholder', type: 'text' } as IBaseInputChildOptions; //<----change detected, new placeholder and maxLength removed
    //this.baseInputOptions.isReadonly = true; //<----change detected because this.baseInputOptions is a BaseInputChildOptions instance
    this.baseInputOptions = new BaseInputChildOptions({ placeholder: 'New placeholder' });
    //this.model = this.objModel as any; //no memory leak if model changes
    /*for(let i of this.numbers) {
      this['name' + i] = this['name' + i] + '123456789';
    }*/
  }

  onBaseInputCanValueChange(valueChange: CaepValueChange<string>) {
    if (valueChange.nextValue !== 'unauthorized') {
      valueChange.authorize();
      console.log('Authorized change: ' + this['name0']);
    }
  }


  //Base Formatted

  //baseFormattedOptions = new BaseFormattedChildOptions({ isReadonly: false, placeholder: 'Input currency', maxLength: 30, transform: 'myCurrency', transformArgs: { format: '0,0.00 $', editFormat: '00.00', allowNegative: true, maximumFractionDigits: 2 }, step: 2 });
  currency0 = 100;
  showBaseFormattedComponent = true;

  onBaseFormattedClick() {
    console.log(this['currency0']);
    //this.showBaseFormattedComponent = !this.showBaseFormattedComponent;
    /*for(let i of this.numbers) {
      this['currency' + i] = this['currency' + i] + 100;
    }*/
  }


  //Base Lookup Single

  showBaseLookupSingleComponent = true;
  job: string = 'scrum-master';
  jobs = ['developer', 'system-admin', 'scrum-master'];
  customer = { name: 'Luca', surname: 'Rossi' }; //ATT: different instance
  customers = [
    { name: 'Mario', surname: 'Bianchi' },
    { name: 'Luca', surname: 'Rossi' },
    { name: 'Francesco', surname: 'Verdi' }
  ];
  pipeName = 'person';
  personPipeParam = 'test';
  showOption = true;
  customers$ = new Subject<{ name: string; surname: string }[]>();
  //customers$ = new BehaviorSubject<{name: string; surname: string}[]>(this.customers);
  jobs$ = new Subject<string[]>();

  onBaseLookupSingleClick() {
    //this.jobs = ['developer'];
    //this.jobs$.next(['developer', 'system-admin']);
    this.pipeName = 'personInverse';
    /*this.customers = [ 
      { name: 'Mattia', surname: 'Gialli' },
      { name: 'Marco', surname: 'Neri' },
      { name: 'Mario', surname: 'Bianchi' },
      { name: 'Franco', surname: 'Roma' }
    ];*/
    //this.personPipeParam = 'sample';
    /*this.customers$.next([
      { name: 'Fausto', surname: 'Gialli' },
      { name: 'Riccardo', surname: 'Neri' },
      { name: 'Mario', surname: 'Bianchi' },
      { name: 'Francesco', surname: 'Verdi' }
    ]);*/
    //this.showOption = false;
  }


  //Base Lookup Multi

  //showBaseLookupMultiComponent = true;
  selectedJobs = ['scrum-master', 'developer'];
  selectedCustomers = [{ name: 'Mario', surname: 'Bianchi' }]; //= [this.customers[0]];

  onBaseLookupMultiClick() {
    //this.jobs = ['developer'];
    //this.jobs$.next(['developer', 'system-admin']);
    //this.pipeName = 'personInverse';
    /*this.customers = [ 
      { name: 'Mattia', surname: 'Gialli' },
      { name: 'Luca', surname: 'Rossi' },
      { name: 'Marco', surname: 'Neri' },
      { name: 'Franco', surname: 'Roma' }
    ];*/
    //this.personPipeParam = 'sample';
    //this.selectedJobs = ['system-admin'];
    this.selectedCustomers = [{ name: 'Luca', surname: 'Rossi' }];
    /*this.customers$.next([
      { name: 'Fausto', surname: 'Gialli' },
      { name: 'Riccardo', surname: 'Neri' },
      { name: 'Mario', surname: 'Bianchi' },
      { name: 'Luca', surname: 'Rossi' },
      { name: 'Francesco', surname: 'Verdi' }
    ]);*/
    //this.showOption = false;
  }

  ngOnInit() {
    console.log('Initial base model value: ' + this['password']);
    //this.customers$.pipe(takeUntil(this._destroy$)).subscribe((customers) => this.customer = customers[0]);
    //this.customers$.pipe(takeUntil(this._destroy$)).subscribe((customers) => this.selectedCustomers = [customers[0]]);
  }

  ngOnDestroy() {
    this._destroy$.next();
    this._destroy$.complete();
  }


  //Aspect components

  @Aspect({
    default: {
      label: 'Aspect Label',
      template: 'mock-multiselect'
    }
  })
  aspectSelectedCustomers = [{ name: 'Mario', surname: 'Bianchi' }];

  @Aspect({
    default: {
      label: 'Aspect Label',
      template: 'mock-text'
    }
  })
  aspectText = 'test';
  showAspectContent = true;
  showAspectComponent = true;
  showMockText = true;
  enableMockText = true;
  mockTextOptions = new MockTextOptions({ isReadonly: 'false', placeholder: 'Input name', maxLength: '30', type: 'text' });
  aspectNumbers = Array(200).fill(4).map((x, i) => i);



  @Aspect({
    default: {
      label: 'Caep Text Label',
      template: 'text'
    }
  })
  caepProp = 'caepTextValue';
  showCaepText = true;
  enableCaepText = true;
  caepTextOptions = new CaepTextOptions({ isReadonly: 'false', placeholder: 'Input name', maxLength: '30', type: 'text' , icon: 'circle circle' });

  onAspectCanValueChange(valueChange: CaepValueChange<string>) {
    if (valueChange.nextValue !== 'unauthorized') {
      valueChange.authorize();
      console.log('Authorized change: ' + this.aspectText);
    }
  }

  onAspectBlur() {
    console.log('Blur aspect text input');
  }

  onAspectClick() {
    //this.height++;
    //this.tooltip += 'Test2';
    //this.mockTextOptions = new MockTextOptions({ placeholder: 'New placeholder' });
    //this.mockTextOptions.isReadonly = true; //<----change not detected even if this.mockTextOptions is a MockTextOptions instance because of caep-form-control
    //this.mockTextOptions.placeholder = 'Test new placeholder'; //<----change not detected even if this.mockTextOptions is a MockTextOptions instance because of caep-form-control
    //this.showMockText = !this.showMockText;
    this.showAspectContent = !this.showAspectContent;
    //this.showAspectComponent = !this.showAspectComponent;
  }

}
