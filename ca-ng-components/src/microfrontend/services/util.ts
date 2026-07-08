/**
 * Event name of remote translations' loading
 */
export const CAEP_MICROFRONTEND_REMOTE_TRANSLATIONS_LOAD_EVENT_NAME = 'ɵcaepmfremotetranslationsload';

/**
 * Event name of remote translations' change
 */
export const CAEP_MICROFRONTEND_REMOTE_TRANSLATIONS_CHANGE_EVENT_NAME = 'ɵcaepmfremotetranslationschange';

/**
 * Event name of shell's default lang request from remote
 */
export const CAEP_MICROFRONTEND_SHELL_DEFAULT_LANG_REQUEST_EVENT_NAME = 'ɵcaepmfrequireshelldefaultlang';

/**
 * Returns the event name for internal translations' management of remote translations' change
 * 
 * @param remoteName name of the remote in the multi-application architecture
 * @returns event name
 */
export function getMfRemoteInternalTranslationsChangeEventName(remoteName: string) {
    return 'ɵcaepmf' + remoteName + 'translationschange';
}

/**
 * Returns the event name for internal translations' management of remote translations' request
 * 
 * @param remoteName name of the remote in the multi-application architecture
 * @returns event name
 */
export function getMfRemoteInternalTranslationsRequestEventName(remoteName: string) {
    return 'ɵcaepmfrequire' + remoteName + 'translations';
}

/**
 * Returns the event name for shell's default lang change response to remote
 * 
 * @param remoteName name of the remote in the multi-application architecture
 * @returns event name
 */
export function getMfShellDefaultLangChangeEventName(remoteName: string) {
    return 'ɵcaepmfshelldefaultlangchangeto' + remoteName;
}