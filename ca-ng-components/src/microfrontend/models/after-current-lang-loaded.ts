/**
 * A lifeycle hook that is called after translations for current lang are loaded. Define a caepAfterCurrentLangLoaded() method to execute computation after translation's loading.
 */
export interface ICaepAfterCurrentLangLoaded {
    caepAfterCurrentLangLoaded(): void;
}