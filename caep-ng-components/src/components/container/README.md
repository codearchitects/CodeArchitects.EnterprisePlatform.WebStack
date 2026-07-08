# Caep Launch Menu

Suite di _componenti_, _direttive_ e _servizi_, atti ad inserire un menu nella propria applicazione.

## Funzionalità

Il _core_ del menu è rappresentato dal _servizio_ `CaepSideMenuService` del quale viene automaticamente effettuata la _provide_ all'interno del _modulo_ `CaepContainerExtModule`.  
Ad ogni istanza di `CaepContainerExtModule` corrisponderà un _servizio_, pertanto volendo inserire un unico menu per tutta l'applicazione, si consiglia di effettuare l'_import_ nel _modulo_ relativo all'intero applicativo, solitamente denominato `AppModule`.

### <a id="container-module"></a> Container Module

Per effettuare un _import_ corretto di tale _modulo_ è necessario chiamare il suo metodo `forRoot`, il quale si occuperà di definire tutti i _providers_ in base alla configurazione fornita.  
Un esempio di utilizzo:

```ts
import { NgModule } from '@angular/core';
import { CaepContainerExtModule } from '@cf/ng-components';
import * as Shell from './storybook/models/shell';
...
@NgModule({
  ...
  imports: [
    ...
    CaepContainerExtModule.forRoot({
      taskSlotFactory: () => new Shell.TaskSlot(),
      stackFrameFactory: () => new Shell.StackFrame(),
    }),
    ...
  ],
  ...
})
export class AppModule {
}
```

Il metodo `forRoot` accetta una configurazione di tipo `CaepSideMenuServiceConfig` definita come segue:

```ts
export interface CaepSideMenuServiceConfig {
  /**
   * Task identifier index within url.
   * Be careful. Location starts with `/`, which is considered as an empty segment.
   * e.g.:
   *
   *  - `/application/domain/scenario/taskId/state`: `taskId` is at index `4`
   *  - `application/domain/scenario/taskId/state`: `taskId` is at index `3`
   *
   * So you should always consider the first empty segment when changing this property.
   * @default 4
   */
  taskIdIndex?: number;  
  /**
   * Preserve navigation flow callback implementation. This is called after base preserve navigation check success, unless override mode is set to true.
   */
  preserveNavigationFlow?: CaepSideMenuPreserveNavigationFlowCallback;
  /**
   * Whether preserve navigation flow is an override of base preserve navigation implementation.
   */
  preserveNavigationFlowOverride?: boolean;
  /**
   * Task slot factory used to create a new task slot when needed while navigating.
   */
  taskSlotFactory: () => ITaskSlot;
  /**
   * Stack frame factory used to create a new stack frame when needed while navigating.
   */
  stackFrameFactory: () => IStackFrame;
}
```

Essa consente dunque di personalizzare le _factories_ per la creazione di un `taskSlot` o di uno `stackFrame`, così come individuare l'indice del segmento relativo al `taskId`, e di personalizzare il comportamento di conservazione del flusso navigazionale.

In particolare tramite la proprietà `preserveNavigationFlow` è possibile fornire una _callback_ individuata come:

```ts
export type CaepSideMenuPreserveNavigationFlowCallback = (
  from: ICaepSideMenuNavigationArgs,
  to: ICaepSideMenuNavigationArgs
) => boolean;
```

la quale fornita la rotta attuale, `from`, e la rotta di destinazione `to`, ritorna un `boolean` atto ad indicare se mantenere il flusso navigazionale o meno. Inoltre mediante la proprietà `preserveNavigationFlowOverride` possiamo indicare tale _callback_ personalizzata, come _override_ del comportamento di default, illustrato alla sezione [flusso navigazionale](#navigation-flow).

### <a id="side-menu-entry"></a> Side Menu Entry

Il punto cardine del _core_ relativo al presente menu è il modello `ICaepSideMenuEntry`.  
Definito come segue:  

```ts
export interface ICaepSideMenuEntry {
  /**
   * Entry unique identifier.
   * If not provided a UUID will be automatically generated.
   * @default UUID.UUID()
   */
  id?: string;
  /**
   * Link displayed text.
   */
  label: string;
  /**
   * Displayed icon.
   * @default `placeholderIcon`
   */
  icon?: string;
  /**
   * Entry link.
   */
  link?: ICaepSideMenuLink;
  /**
   * Whether this entry is enabled or not.
   * If this entry has children, user will not be able to view them.
   * @default true
   */
  enable?: boolean;
  /**
   * Whether this entry is visible or not.
   * @default true
   */
  show?: boolean;
  /**
   * Linked resource name.
   */
  resource?: string;
  /**
   * Child entries.
   */
  children?: ICaepSideMenuEntry[];
  /**
   * Whether this entry lazy loads child entries navigating towards this entry link.
   * When falsy and this entry has children no navigation will occur: this menu entry will act just as a toggle.
   */
  lazy?: boolean;
  /**
   * When enabled and user navigates towards this entry, navigation flow is preserved when closest ancestor preserves navigation.
   */
  preserveNavigation?: boolean;
}
```

consente di assolvere tutte le funzionalità previste da una voce di menu, avvalendosi del modello `ICaepSideMenuLink`, utile alla gestione delle navigazioni, definito come:

```ts
export interface ICaepSideMenuLink {
  /**
   * Link kind.
   * @default CaepSideMenuLinkKind.RouterLink
   */
  kind?: CaepSideMenuLinkKind;
  /**
   * Resource locator.
   * This can be either a string following format /application/domain/scenario/state/...routeParams?queryParams#fragment, or a NavigationArgs object.
   * When kind is `CaepSideMenuLinkKind.CustomRouterLink`, url must be a string in order to be considered.
   */
  url: string | Omit<ICaepSideMenuNavigationArgs, 'entry'>;
  /**
   * HTML anchor element target attribute.
   */
  target?: string;
}
export enum CaepSideMenuLinkKind {
  /**
   * Navigation link.
   */
  RouterLink = 'router-link',
  /**
   * Custom navigation link. In this case navigation will occur as an absolute one.
   */
  CustomRouterLink = 'custom-router-link',
  /**
   * Generic link.
   */
  Link = 'link'
}
export interface ICaepSideMenuNavigationArgs {
  /**
   * Application name.
   */
  application?: string | string[];
  /**
   * Domain name.
   */
  domain?: string | string[];
  /**
   * Scenario name.
   */
  scenario?: string | string[];
  /**
   * Action name.
   */
  action?: string | string[];
  /**
   * Query parameters.
   */
  queryParams?: Params;
  /**
   * Related menu entry.
   */
  entry: ICaepSideMenuLinkedEntry;
}
export interface ICaepSideMenuLinkedEntry {
  /**
   * This entry.
   */
  entry: ICaepSideMenuEntry;
  /**
   * Parent entry reference.
   */
  parent?: ICaepSideMenuLinkedEntry;
}
```

**N.B.** come potrai vedere la _location_ viene recuperata tenendo in considerazione il `window.location.hash`, pertanto i link a risorse interne dovranno cominciare per `/`.

### Side Menu Service

Il servizio `CaepSideMenuService` si occupa di mantenere in memoria le informazioni vitali per il menu, e fornisce una serie di _hooks_ utili allo sviluppatore per _alimentare_ lo stesso.

#### CRUD

In particolare offre i metodi _CRUD_:

- `append`: date delle voce di menu, o una sola, le aggiunge in coda alle attuali;
- `set`: date delle voci di menu, o una sola, le imposta come voci attuali, dunque le esistenti verranno sovrascritte;
- `update`: date delle voci di menu, o una sola, ricerca le corrispondenti e le aggiorna;
- `createOrUpdate`: date delle voci di menu, o una sola, ricerca le corrispondenti e se individiuate le aggiorna, altrimenti le aggiunge in coda alle attuali;
- `delete`: dati degli identificativi, o uno solo, ricerca le voci di menu e le elimina;
- `getEntryById`: dato un identificativo ricerca la corrispondente voce di menu.

Tutti questi metodi ritornano le voci di menu argomento degli stessi, ad esempio il metodo `append` ritorna le voci di menu aggiunte, il metodo `delete` quelle eliminate, e così via.  
Inoltre è sempre possibile recuperare tutte le voci di menu attualmente memorizzate dal servizio, tramite la proprietà `snapshot`, o sottoscrivendosi all'osservabile `entries$` per esser notificati ogni qual volta vi è un aggiornamento.

#### State

In aggiunata ai metodi _CRUD_ abbiamo a disposizione dei metodi e delle proprietà utili a conoscere lo stato attuale del menu:

- `location$`: un osservabile multicast il quale emette ogni qual volta viene effettuata una navigazione, fornendo come argomento il percorso attuale, privo di `taskId` e _hash_;
- `isActive`: data una voce di menu, e la _location_ attuale, torna `true` nel momento in cui la voce di menu è attiva, di default - ma disattivabile - torna `true` anche se una voce figlia è a sua volta _active_;
- `getActiveEntry`: ritorna la voce di menu attiva, se individuata.

Una voce di menu è considerata attiva se parte dei segmenti del percorso, associato alla stessa, corrispondono in maniera sequenziale ai segmenti relativi alla _location_ attuale. Anche i _query params_ verrebbero confrontati nel caso in cui fossero indicati nella voce di menu, questa volta indipendentemente dall'ordine.  
Ognuna di queste comparazioni assegna un punteggio pari a `1` nel caso di uguaglianza, mentre scarta la voce di menu appena individuata una disuguaglianza. La voce di menu con il punteggio maggiore sarà considerata attiva, nel caso di parità, il quale non dovrebbe mai verificarsi in quanto andrebbe opportunamente evitato nella definizione delle voci di menu, ovvero nel momento in cui si hanno due voci con lo stesso percorso, o con lo stesso percorso e lo stesso numero di query params uguali, verrà restituita la prima.  
**Solo** una voce di menu alla volta può esser considerata attiva.

#### Navigation

Infine vi sono dei metodi che consentono di ottemperare alle esigenze navigazionali, quali:

- `mapToNavigationArgs`: dato un percorso recuperato da una voce di menu, ritorna il corrispondente `ICaepSideMenuNavigationArgs`;
- `mapToUrl`: dato un `ICaepSideMenuNavigationArgs` ritorna il corrispondente `URL`;
- `canPreserveNavigation`: dato il percorso attuale e data la voce di menu di destinazione, ritorna `true` nel momento in cui è possibile preservare il [flusso navigazionale](#navigation-flow), in base alla configurazione definita dallo sviluppatore.

#### <a id="navigation-flow"></a> Flusso Navigazionale

Si intende come flusso navigazionale, la sequenza di navigazioni effettuate sino allo stato corrente. Il menu è in grado di preservare lo stesso, su indicazione dello sviluppatore.  
In particolare è possibile mantenere lo stesso _taskId_, dunque _payload_, navigando da una voce di menu all'altra.  
Questo consente di poter costruire uno _stack navigazionale_ al fine di popolare opportunamente una _breadcrumb_, così come persistere informazioni tramite il _payload_.  

**N.B.** Questo meccanismo ha vita solo nelle navigazioni di tipo `CaepSideMenuLinkKind.RouterLink` e si naviga indicando almeno applicazione, dominio e scenario.

Nello specifico il `CaepSideMenuService` acconsentirà al mantenimento del flusso, nel momento in cui la voce di menu di destinazione e quella sorgente, o una delle voci di menu padre in comune, indicano la proprietà `preserveNavigation` a `true`, a meno che tra di loro non vi sia una che indica espressamente tale proprietà a `false`.  
Dato un menu (il numero di livelli sono è a puro titolo esemplificativo):

- 1
  - 1.1 (`preserveNavigation = true`)
    - 1.1.1
    - 1.1.2
  - 1.2
    - 1.2.1 (`preserveNavigation = true`)
    - 1.2.2
  (`preserveNavigation = true`)
- 2 (`preserveNavigation = true`)
  - 2.1
    - 2.1.1
    - 2.1.2
  - 2.2
    - 2.2.1
    - 2.2.2
    - 2.2.3 (`preserveNavigation = false`)
      - 2.2.3.1
      - 2.2.3.2

ecco alcuni esempi pratici di navigazione:

- navigando da `1.2.1` verso la stessa rotta `1.2.1`, ad esempio cambiandone i paramteri, verrà mantenuto il flusso in quanto questa voce ha la proprietà `preserveNavigation` al valore `true`;
- navigando da `1.1.1` verso `1.1.2` verrà mantenuto il flusso in quanto la voce padre `1.1` ha la proprietà `preserveNavigation` al valore `true`;
- navigando da `1.2.1` verso `1.1.1` e da `2` verso `1` non verrà mantenuto il flusso dato che non vi è nessuna voce padre che indica un valore `true` per la proprietà `preserveNavigation`;
- navigando da `2.1.1` verso `2.2.1` verrà mantenuto il flusso poiché la voce di menu `2` ha la proprietà `preserveNavigation` al valore `true`;
- navigando da `2.2.3.1` verso `2.2.2` non verrà mantenuto il flusso in quanto la voce `2.2.3` pone la proprietà `preserveNavigation` al valore `false` in maniera esplicita;
- navigando da `2.2.3.1` verso `2.2.3.2` non verrà mantenuto il flusso nonostante abbiano la voce `2` in comune, la quale indica `preserveNavigation` al valore `true`, poiché è presente una voce più vicina , `2.2.3`, la quale proprietà `preserveNavigation` contiene il valore `false`;

Naturalmente, come menzionato in precedenza, queste regole vengono imposte **in aggiunta** a quelle definite tramite la configurazione del _modulo_, o sostituite se indicato.

### Navigazioni

Per effettuare delle navigazioni, facendo riferimento alle voci di menu utilizzate mediante il `CaepSideMenuService`, è possibile utilizzare le _direttive_ `CaepRouterLinkDirective` e `CaepRouterLinkActiveDirective` entrambi applicabili su delle ancore _HTML_.

Esempio:

```html
<a [caepRouterLink]='entry' [caepRouterLinkActive]='active'>{{entry.label}}</a>
```

Queste direttive si occuperanno di gestire automaticamente la navigazione in base alla definizione della voce di menu associata, in aggiunta verrà applicata la classe _CSS_ di esempio `active`, nel momento in cui questa voce di menu, o una delle figlie, dovesse esser considerata attiva.  

La _direttiva_ `CaepRouterLinkDirective` si occupa di mettersi in ascolto dell'evento _click_ associato all'_ancora_ ad essa legata, e compiere diverse tipologie di navigazione a seconda della voce di menu, o della tipologia di _click_. Così come di definire correttamente l'attributo `href`. A tal proposito si **consiglia vivamente** di associare una risorsa esistente ad ogni voce di menu.

#### Navigazione esterna

Nel momento in cui la voce di menu presenta un _target_ differente dal contesto attuale, ad esempio _blank_, oppure il link è di tipo `CaepSideMenuLink.Link`, o ancora l'evento _click_ viene correlato da pulsanti di controllo, ad esempio `SHIFT`, `CTRL`, `ALT`, la _direttiva_ non eseguirà alcuna navigazione, bensì lascerà che grazie all'attributo `href` il browser sia in grado di compiere l'operazione desiderata:

- `CLICK`: navigazione verso la risorsa esterna;
- `SHIFT` + `CLICK`: navigazione in una nuova finestra;
- `CTRL` + `CLICK`: navigzione in una nuova scheda;

e così via. Naturalmente queste shortcut potrebbero differire nel risultato a seconda delle impostazioni del proprio browser.

#### Navigazione gerarchica

Nel momento in cui la voce di menu non presenta le regole di cui sopra, ma contiene delle voci di menu figlie, non viene effettuata alcuna navigazione, bensì la _direttiva_ emette l'evento `inward` utile a rappresentare un'operazione di _apertura_ o _chiusura_ della voce di menu.

#### Navigazione interna

Nel momento in cui la voce di menu non presenta le regole di cui sopra, la _direttiva_ prosegue con la navigazione verso la risorsa associata alla voce di _menu_, preoccupandosi di conservare il flusso navigazionale se opportuno.

### Side Menu Component

La suite mette a disposizione il _componente_ `CaepSideMenuComponent` il quale si occupa di mostrare le voci di menu disponibili, fornite dal `CaepSideMenuService`.

Il presente menu è caratterizzato da una navigazione gerarchica a scomparsa e gestisce un numero infinito di livelli.  
Nella fattispecie esso si occupa di mostrare tutte le voci di menu di primo livello se l'utente è posizionato alla radice, mentre si occupa di mostrare solo le voci relative al livello di appartenenza e un pulsante atto a tornare al livello superiore, nel momento in cui l'utente è posizionato su qualsiasi altro livello.

Grazie all'utilizzo della _direttiva_ `CaepRouterLinkDirective` esso è in grado di cosentire tutti i tipi di navigazione, oltre che una navigazione di tipo _lazy_.

#### Navigazione lazy

Indicando una voce di menu come _lazy_ , tramite la proprietà `lazy` impostata al valore `true`, informiamo il _componente_ che tale voce può contenere dei figli dei quali non siamo attualmente a conoscenza.  
Infatti il menu mostrerà tale voce di menu come se fosse un contenitore, e al primo _click_ sulla stessa, proverà a navigarci.

Una volta che a tale voce vengono associati i rispettivi figli, non sarà più necessario effettuare alcuna navigazione, verrà automaticamente considerata come _risolta_, dunque come le altre voci contenitore.

#### Ripristino dello stato

Il presente _componente_ è in grado di mantenere in memoria il livello visualizzato dall'utente in qualsiasi momento. Inoltre è in grado di raggiungere automaticamente il livello corrispondente alla voce attiva, ogni qual volta viene effettuata una navigazione, anche quella iniziale.

#### Modalità ridotta

È possibile ridurre le dimensioni del menu cliccando sull'apposito pulsante in corrispondenza del _logo_, al fine di visualizzare la modalità ridotta.

#### Personalizzazione

Il _componente_ accetta in _input_ diverse proprietà, le quali consentono di caratterizzarlo in base all'istanza:

- `placeholderIcon`: percorso dell'icona _placeholder_, default `'assets/menu/placeholder.svg'`;
- `backIcon`: percorso dell'icona _back_, default `'assets/menu/back.svg'`;
- `chevronRightIcon`: percorso dell'icona _chevron_right_, default `'assets/menu/chevron_right.svg'`;
- `logo`: percorso del logo, default `'assets/menu/placeholder.svg'`;
- `logoCollapsed`: percorso del logo in modalità _collapsed_, default: `'assets/menu/placeholder.svg'`;
- `expandIcon`: percorso dell'icona _expand_, default: `'assets/menu/expand.svg'`;
- `collapseIcon`: percorso dell'icona _collapse_, default `'assets/menu/collapse.svg'`;

È inoltre possibile, come si evince dalla sezione [side menu entry](#side-menu-entry), personalizzare ogni voce di menu con un'icona, anche in questo caso è necessario indicarne il percorso. Si raccomanda l'utilizzo del formato `svg` in modo tale da poter garantire le giuste dimensioni e proporzioni.

#### Accessibilità e internazionalizzazione

In base a quanto illustrato nelle precedenti sezioni, possiamo affermare che ogni _ancora_ definita dal _componente_ viene opportunamente associata ad una risorsa, se opportunamente configurata.  
Inoltre il _componente_ si fa carico di definire l'attributo `title` per ogni _ancora_ che viene valorizzato con la _label_ attribuita alla relativa voce di menu. La stessa impostazione viene applicata all'attributo `alt` e `aria-label` dell'immagine associata, se presente.

L'utilizzo della proprietà `label` viene correlato dalla _pipe_ `translate`, la quale si occupa di tradurre il contenuto della proprietà, in base alle opzioni relative alla lingua corrente, qualora venisse individuata una corrispondente chiave di traduzione.

#### Autorizzazioni

Ogni voce di menu può essere associata ad una risorsa del `Policy Engine` tramite la proprietà `resource`.  
Se tale risorsa esiste, il `Policy Engine` si occuperà di mostrare/nascondere e disabilitare/abilitare tale voce di menu.

### Container Component

Per terminare l'insieme delle _componenti_ messe a disposizione, abbiamo il `CaepContainerExtComponent`, il quale fornita un'istanza di `CaepSideMenuComponent` tramite _content projection_, consente di predisporre la pagina affinché il _componente_ menu si posizioni sulla sinistra, occupando tutto lo spazio verticale, mentre sulla destra si posiziona il resto del contenuto in _content projection_, in un contenitore che supporta lo scroll.

## Utilizzo

In uno scenario di esempio che abbiamo ipotizzato, andremo ad inserire il componente del menu direttamente all'interno dell'`AppComponent`, e dati due applicativi `Storybook` e `Demo`, andremo a costruire il menu di conseguenza.

### Prerequisiti

Piuttosto importante è verificare che la libreria `@caep/ng-components` sia installata correttamente e tutti i suoi assets siano serviti tramite **_angular.json_**.

```json
...
"architect": {
  ...
  "build": {
    ...
    "options": {
      ...
      "assets": [
        ...
        {
          "glob": "**/*",
          "input": "node_modules/@caep/ng-components/styles/fonts",
          "output": "/assets/fonts/caep"
        },
        {
          "glob": "**/*",
          "input": "node_modules/@caep/ng-components/assets",
          "output": "/assets"
        },
        ...
      ],
      ...
    },
    ...
  }
  ...
},
...

```

Assicurarsi che l'elemento `body` non abbia stili che vadano in conflitto con l'impostazione di questo menu, ad esempio eventuali scroll, margini, paddings.

**_styles.scss_**
```css
...
body {
  ...
  margin: 0;
  ...
}
...
```

### Esempio di implementazione

#### Container e Menu

Il primo step è quello di effettuare l'_import_ del modulo, così come da esempio nella sezione [container module](#container-module).  

Successivamente possiamo inglobare il componente menu all'interno dell'applicazione:  
**_app.component.html_**

```html
...
<caep-container-ext>
  <caep-side-menu
    logo='assets/menu/logo.png'
    logoCollapsed='assets/menu/logo_collapsed.png'
  ></caep-side-menu>
  <router-outlet></router-outlet>
</caep-container-ext>
...
```

e possiamo definire il menu relativo al primo livello in questo modo:  
**_app.component.html_**

```ts
import { Component, OnInit } from '@angular/core';
import {
  CaepSideMenuLinkKind,
  CaepSideMenuService,
  ICaepSideMenuEntry,
} from '@cf/ng-components';
...

const MENU: ICaepSideMenuEntry[] = [
  { label: 'Home', link: { url: '/home' }, icon: 'assets/menu/home.svg' },
  {
    id: 'storybook',
    label: 'Storybook',
    link: { url: '/storybook' },
    lazy: true,
  },
  {
    id: 'demo',
    label: 'Demo',
    link: {
      url: '/demo',
    },
    lazy: true,
  },
  {
    id: 'utils',
    label: 'Link utili',
    children: [
      {
        label: 'Google',
        link: {
          url: 'https://google.com',
          kind: CaepSideMenuLinkKind.Link,
          target: '_blank',
        },
      },
      {
        label: 'Linkedin',
        link: {
          url: 'https://it.linkedin.com/',
          kind: CaepSideMenuLinkKind.Link,
          target: '_blank',
        },
      },
    ],
  },
];
...
export class AppComponent implements OnInit {
  ...
  constructor(
    ...
    private _menuService: CaepSideMenuService,
    ...
  ) {
    ...
  }
  ...
  ngOnInit() {
    ...
    this._menuService.set(...MENU);
    ...
  }
  ...
}
...
```

In questo esempio abbiamo inserito la home globale per tutta la suite, le sezioni `Storybook` e `Demo`, infine una sezione `Link utili` la quale contiene link esterni.

**N.B.** eventuali altri contenitori devono essere rimossi.


#### Home globale

Inseriamo un componente di esempio che fungerà da home per tutto l'applicativo.

**_home.component.ts_**

```ts
import { Component } from '@angular/core';

@Component({
  template: `<h1>Suite Home component works!</h1>`,
})
export class HomeComponent {}

```

Dichiariamo il componente nell'`AppModule`:

**_app.module.ts_**

```ts
import { NgModule } from '@angular/core';
import { HomeComponent } from './home.component';

...
@NgModule({
  ...
  declarations: [
    ...
    HomeComponent,
    ...
  ],
  ...
})
export class AppModule {
}
```

Infine lo includiamo nelle rotte relative all'`AppModule`:

**_app.routes.ts_**

```ts
import { Routes } from '@angular/router';
import { HomeComponent } from './home.component';
...

export const APP_ROUTES: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  ...
];
...
```

##### Menu lazy

Negli applicativi `Storybook` e `Demo`, andremo a loro volta a richiamare il _servizio_ per aggiungere le voci di menu relative alle rispettive applicazioni.

**_storybook-index.component.ts_**

```ts
import { Component } from '@angular/core';
import { ApplicationShellComponent, IOnInit } from '@ca-webstack/ng-shell';
import { CaepSideMenuService, ICaepSideMenuEntry } from '@caep/ng-components';
...
const STORYBOOK_MENU: ICaepSideMenuEntry[] = [
  {
    label: 'Home',
    link: { url: '/storybook/home' },
  },
  {
    label: 'buttons',
    link: { url: '/storybook/buttons' },
    preserveNavigation: true,
    children: [
      {
        label: 'Button',
        link: { url: '/storybook/buttons/button' },
      },
      {
        label: 'Spinner',
        link: { url: '/storybook/buttons/spinner' },
      },
      {
        label: 'Toggle',
        link: { url: '/storybook/buttons/toggle' },
      },
      {
        label: 'help-button.title',
        link: { url: '/storybook/buttons/help-button' },
      },
    ],
  },
  {
    label: 'form-controls',
    children: [
      {
        label: 'Input',
        link: { url: '/storybook/form-controls/input' },
      },
      {
        label: 'action-center',
        link: { url: '/storybook/buttons/actioncenter' },
      },
      {
        label: 'Textarea',
        link: {
          url: '/storybook/form-controls/textarea',
          target: '_blank',
        },
      },
      {
        label: 'Caption',
        link: { url: '/storybook/form-controls/caption' },
      },
      {
        label: 'Checkbox Input',
        link: { url: '/storybook/form-controls/checkbox' },
      },
      {
        label: 'Combo Box',
        link: { url: '/storybook/form-controls/combo' },
      },
      {
        label: 'Date Input',
        link: { url: '/storybook/form-controls/date' },
      },
      {
        label: 'Time Input',
        link: { url: '/storybook/form-controls/time' },
      },
      {
        label: 'DateTime Input',
        link: { url: '/storybook/form-controls/datetime' },
      },
      {
        label: 'Select Input',
        link: { url: '/storybook/form-controls/select' },
      },
      {
        label: 'Multiselect Input',
        link: { url: '/storybook/form-controls/multiselect' },
      },
      {
        label: 'Radio Input',
        link: { url: '/storybook/form-controls/radio' },
      },
      {
        label: 'Timer Control',
        link: { url: '/storybook/form-controls/timer' },
      },
      {
        label: 'Audio player',
        link: { url: '/storybook/form-controls/audio-player' },
      },
      {
        label: 'Detailed prospectus',
        link: { url: '/storybook/form-controls/detailed-prospectus' },
      },
    ],
  },
];
...
@Component({
  template: `<router-outlet></router-outlet>`,
})
export class StorybookIndexComponent
  extends ApplicationShellComponent
  implements IOnInit
{
  ...
    constructor(
    ...
    private _menuService: CaepSideMenuService,
    ...
  ) {
    ...
  }
  ...
  onInit() {
    ...
    this._menuService.update({
      ...this._menuService.getEntryById('storybook'),
      children: STORYBOOK_MENU,
    });
    ...
  }
  ...
}
...
```

Nell'applicativo `Storybook` abbiamo definito due aree, associabili ai domini `buttons` e `form-controls`, inoltre la prima conserva il flusso navigazionale, dunque navigando in qualsiasi scenario o stato di tale dominio, verrà mantenuto il _taskId_.
A scopo dimostrativo abbiamo anche indicato per lo scenario `Textarea` un'apertura in un nuovo _target_, e spostato lo scenario `Action Center`, la quale label è una chiave di traduzione, dall'area relativa al dominio `buttons` a quella relativa al dominio `form-controls`, per dimostrare che non vi è nessun vincolo, anche se un'opportuna segregazione è sempre consigliabile.

**_demo-index.component.ts_**

```ts
import { Component } from '@angular/core';
import { ApplicationShellComponent, IOnInit } from '@ca-webstack/ng-shell';
import { CaepSideMenuService, ICaepSideMenuEntry } from '@caep/ng-components';
...
const DEMO_MENU: ICaepSideMenuEntry[] = [
  {
    id: 'crm',
    label: 'Crm',
    link: { url: '/demo/crm' },
    children: [
      {
        id: 'products',
        label: 'Products',
        link: { url: '/demo/crm/products' },
        children: [
          { label: 'Start', link: { url: '/demo/crm/products/start' } },
          {
            label: 'Browse',
            link: { url: '/demo/crm/products/browse' },
            preserveNavigation: true,
          },
        ],
      },
    ],
  },
];
...
@Component({
  ...
  template: `<router-outlet></router-outlet>`,
  ...
})
export class DemoIndexComponent
  extends ApplicationShellComponent
  implements IOnInit
{
  ...
  constructor(
    ...
    private _menuService: CaepSideMenuService,
    ...
  ) {
    ...
  }
  ...
  onInit(): void {
    ...
    this._menuService.update({
      ...this._menuService.getEntryById('demo'),
      children: DEMO_MENU,
    });
    ...
  }
  ...
}
```
