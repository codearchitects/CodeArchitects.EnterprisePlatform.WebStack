import { TestBed, async } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { I18nModule } from '@ca-webstack/ng-i18n';

describe('AppComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AppComponent
      ],
      imports: [
        I18nModule
      ]
    }).compileComponents();
  }));
  it('should create the app importing the i18n module', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));
});
