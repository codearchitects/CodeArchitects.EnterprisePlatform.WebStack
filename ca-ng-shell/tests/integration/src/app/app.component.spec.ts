import { TestBed, async } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { CaShellModule } from '@ca-webstack/ng-shell';

describe('AppComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AppComponent
      ],
      imports: [
        CaShellModule
      ]
    }).compileComponents();
  }));
  it('should create the app importing the ng-shell module', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));
});
