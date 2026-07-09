import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

@Component({
    selector: 'caep-app-header',
    templateUrl: './app-header.component.html',
    styleUrls: ['./app-header.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class CaepAppHeaderComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
