import { InjectionToken } from "@angular/core";

export const CAEP_MICROFRONTEND_REMOTE_DICTIONARY_TOKEN = new InjectionToken<{ [key: string]: any }>('Remote dictionary');

/**
 * Clears the remote dictionary.
 * 
 * @param remoteDictionary remote dictionary
 */
export function clearRemoteDictionary(remoteDictionary: { [key: string]: any }) {
    for(const remote in remoteDictionary) {
        remoteDictionary[remote].onDestroy();
        delete remoteDictionary[remote];
    }
}