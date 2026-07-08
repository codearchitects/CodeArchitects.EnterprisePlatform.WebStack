import { ChangeDetectionStrategy } from '@angular/core';

export let CHANGE_DETECTION_STRATEGY = ChangeDetectionStrategy.Default;

export function setChangeDetectionStrategy(strategy: ChangeDetectionStrategy) {
    CHANGE_DETECTION_STRATEGY = strategy;
    console.log(`%c CHANGE DETECTION STRATEGY CHANGED TO ${ChangeDetectionStrategy[strategy]}`, 'background:#129bdb;color:white');
}

export function shChangeDetectorStrategy(): ChangeDetectionStrategy.OnPush | ChangeDetectionStrategy.Default {
    return CHANGE_DETECTION_STRATEGY;
}
