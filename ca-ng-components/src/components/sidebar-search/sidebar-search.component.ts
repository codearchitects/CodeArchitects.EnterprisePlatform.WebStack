import { Component, EventEmitter, Injector, Input, Output, PipeTransform } from '@angular/core';
import { Router } from '@angular/router';
import { shChangeDetectorStrategy } from '../../environments/change-detection-strategy';
import { SidebarCommand } from '../../models/sidebar';
import { AssetsService } from '../../services/assets.service';
import { IShBaseOptions, ShBaseAuthComponent } from '../base';
import { IShComboOptions } from '../combo/combo.component';
import { CAEP_SIDEBAR_SEARCH_DEFAULT_ICON } from '../../utilities/common.utility';

/**
 * Sidebar Search Pipe
 */
class ShSidebarSearchPipe implements PipeTransform {
  transform(value: SidebarCommand): any {
    return value && value.title;
  }
}

@Component({
    selector: 'sh-sidebar-search',
    templateUrl: './sidebar-search.component.html',
    styleUrls: ['./sidebar-search.component.scss'],
    changeDetection: shChangeDetectorStrategy(),
    standalone: false
})
/**
 * Sidebar Search Component
 */
export class ShSidebarSearchComponent extends ShBaseAuthComponent<IShBaseOptions> {
  /**
   * Current command
   */
  @Input() public model: SidebarCommand;
  /**
   * Model change event
   */
  @Output() public modelChange = new EventEmitter<SidebarCommand>();
  /**
   * The application name
   */
  @Input() public applicationName: string;
  /**
   * The icon name
   * @default 'search'
   */
  @Input() public icon: string = CAEP_SIDEBAR_SEARCH_DEFAULT_ICON;
  /**
   * Combo Configuration
   */
  /*protected*/ public combo: IShComboOptions<SidebarCommand>;
  /**
   * Angular Router Service
   */
  private _router: Router;
  /**
   * Assets service
   */
  private _assetsService: AssetsService;

  /**
   * Sidebar Search Component
   */
  constructor(injector: Injector) {
    super(injector);
    this._router = injector.get(Router);
    this._assetsService = injector.get(AssetsService);
  }

  public async ngOnInit() {
    super.ngOnInit();
    const commands = await this._assetsService.get<SidebarCommand[]>('sidebar.json', true);
    this.combo = {
      values: this.getIndexableCommands(commands),
      valuesPipe: new ShSidebarSearchPipe(),
      minChars: 1,
      placeholder: 'search-something'
    };
  }

  /**
   * Event fired on command changes
   * @param value New selected command
   */
  /*protected*/ public onChange(value: SidebarCommand) {
    this.modelChange.emit(this.model = value);
    if (value) {
      if (this.applicationName) {
        this._router.navigate([this.applicationName, ...(value.routerLink as string[])]);
      } else {
        throw new Error('Please gives to the component the applicationName input');
      }
    }
  }

  /**
   * Retrieves indexable commands based on a source
   * @param commands The source
   */
  private getIndexableCommands(commands: SidebarCommand[] = []) {
    const retval: SidebarCommand[] = [];
    retval.push(...commands.filter(command => {
      if (command.children) {
        retval.push(...this.getIndexableCommands(command.children));
      }
      return !!command.hasIndex;
    }));
    return retval;
  }

}
