import 'jasmine';
import { AppPage } from './app.po';

describe('integration-tests App', () => {
  let page: AppPage;

  beforeEach(() => {
    page = new AppPage();
  });

  it('should navigate to the main page without errors', () => {
    expect(() => { page.navigateTo(); }).not.toThrow();
  });
});
