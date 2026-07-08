import { ShComponentsModule } from './components.module';

describe('ComponentsModule', () => {
  let componentsModule: ShComponentsModule;

  beforeEach(() => {
    componentsModule = new ShComponentsModule();
  });

  it('should create an instance', () => {
    expect(componentsModule).toBeTruthy();
  });
});
