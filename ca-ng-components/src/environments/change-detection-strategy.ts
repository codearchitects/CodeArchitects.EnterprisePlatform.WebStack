import { ChangeDetectionStrategy } from '@angular/core';

let CHANGE_DETECTION_STRATEGY = ChangeDetectionStrategy.Default;

export function setChangeDetectionStrategy(strategy: ChangeDetectionStrategy) {
    CHANGE_DETECTION_STRATEGY = strategy;
    console.log(`%c CHANGE DETECTION STRATEGY CHANGED TO ${ChangeDetectionStrategy[strategy]}`, 'background:#129bdb;color:white');
}

export const SH_CHANGE_DETECTOR = {
    get STRATEGY() {
        return CHANGE_DETECTION_STRATEGY;
    }
};
