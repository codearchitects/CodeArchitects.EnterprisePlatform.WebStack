import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';

@Component({
    selector: 'caep-container',
    templateUrl: './container.component.html',
    styleUrls: ['./container.component.scss'],
    encapsulation: ViewEncapsulation.Emulated,
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class CaepContainerComponent {}
