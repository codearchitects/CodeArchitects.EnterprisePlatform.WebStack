import { Component, Injector, Input, Output, EventEmitter, PipeTransform } from '@angular/core';
import { IShBaseOptions, ShBaseAuthComponent } from '../base';
import { TranslateService } from '@ngx-translate/core';
import { fromEvent, Observable } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { InitialsPipe } from '../../pipes/initials.pipe';

/**
 * UserPopover model API
 */
export interface IShUserModel<TRole = any> {
  /**
   * The user complete name
   */
  name: string;
  /**
   * The user email
   */
  email: string;
  /**
   * The profile image url
   */
  imageUrl?: string;
  /**
   * The user profile url
   */
  profileUrl?: string;
  /**
   * The company name
   */
  company?: string;
  /**
   * The user role
   */
  role?: TRole;
}


@Component({
  selector: 'sh-user-popover',
  templateUrl: './user-popover.component.html',
  styleUrls: ['./user-popover.component.scss'],
})
export class ShUserPopover<TRole = any> extends ShBaseAuthComponent<IShBaseOptions> {
  /**
   * Current translate service
   */
  private _translateService: TranslateService;
  /**
   * The initials pipe
   */
  private _initialsPipe = new InitialsPipe();
  /**
   * Whether detail panel is shown or not
   */
  public isDetailShown = false;
  /**
   * The computed color for the given name
   */
  public avatarColor: string;
  /**
   * The avatar icon style
   */
  public avatarIconStyle: { [index: string]: any };
  /**
   * The current language
   */
  public currentLang: string;
  /**
   * Available languages
   */
  public langs: string[];
  /**
   * The model
   */
  @Input() public model: IShUserModel<TRole>;
  /**
   * The palette of colors used to compute avatar background color
   */
  @Input() public colorPalette?: string[] = ['#E12019', '#E77514', '#A8CB4A', '#9FD5EA', '#5A8AC2', '#1D4795'];
  /**
   * Whether to show image profile
   */
  @Input() public showImage?: boolean;
  /**
   * Whether to allow the user to change it's profile image
   */
  @Input() public canChangeImage?: boolean;
  /**
   * Whether to show or not profile link
   */
  @Input() public showProfileLink?: boolean;
  /**
   * Whether to show company
   */
  @Input() public showCompany?: boolean;
  /**
   * Whether to show role
   */
  @Input() public showRole?: boolean;
  /**
   * Whether the user can change role
   */
  @Input() public canChangeRole?: boolean;
  /**
   * Role change options values
   */
  @Input() public changeRoleOptions?: Array<TRole> | Observable<Array<TRole>>;
  /**
   * Pipe applied to lookup values to format label
   */
  @Input() public changeRoleOptionsPipe?: PipeTransform;
  /**
   * Arguments applied to pipe transform call
   */
  @Input() public changeRoleOptionsPipeArgs?: Array<any>;
  /**
   * Whether to allow the user to change it's company
   */
  @Input() public canChangeCompany?: boolean;
  /**
   * Whether to allow the user to change i18n options
   */
  @Input() public canChangeLanguage?: boolean;
  /**
   * The profile click event
   */
  @Output() public profileClicked?: EventEmitter<MouseEvent> = new EventEmitter();
  /**
   * The company change event
   */
  @Output() public companyChanged?: EventEmitter<MouseEvent> = new EventEmitter();
  /**
   * The role change event
   */
  @Output() public roleChanged?: EventEmitter<TRole> = new EventEmitter();
  /**
   * The image change event
   */
  @Output() public imageChanged?: EventEmitter<File> = new EventEmitter();

  constructor(injector: Injector) {
    super(injector);
    this._translateService = injector.get(TranslateService);
  }

  ngOnInit() {
    super.ngOnInit();
    /**
     * Computing the avatar background color
     */
    this.avatarColor = this.computeColor(this._initialsPipe.transform(this.model.name));
    /**
     * Handling language settings
     */
    this.currentLang = this._translateService.currentLang;
    this.langs = this._translateService.langs.filter(lang => lang !== this.currentLang);
    this._translateService.onLangChange
      .pipe(takeUntil(this.destroy$))
      .subscribe(e => {
        this.currentLang = e.lang;
        this.langs = this._translateService.langs.filter(lang => lang !== this.currentLang);
      });
    /**
     * Closing popover menu logic
     */
    fromEvent(document.body, 'mousedown')
      .pipe(takeUntil(this.destroy$))
      .subscribe((evt: MouseEvent) => {
        if (this.isDetailShown) {
          const openedMenu = document.querySelector<HTMLDivElement>('#user-popover>.detail');
          if (openedMenu) {
            const target = evt.target as HTMLElement;
            if (!openedMenu.contains(target)) {
              this.isDetailShown = false;
            }
          }
        }
      });
  }

  ngOnChanges(changes: any) {
    super.ngOnChanges(changes);
    /**
     * Recomputing avatar color when any prop changes, in case of user name has changed
     */
    this.avatarColor = this.computeColor(this._initialsPipe.transform(this.model.name));
    this.avatarIconStyle = {
      'background-color': this.avatarColor,
      'background-image': this.showImage ? `url('${this.model.imageUrl}')` : ''
    };
  }

  /**
   * Toggles detail panel
   */
  public toggleDetailPanel() {
    this.isDetailShown = !this.isDetailShown;
  }

  /**
   * Computes the color index in the palette based on initials charcodes
   * @param initials The name initials
   * @returns The color
   */
  private computeColor(initials: string): string {
    const charCodes = initials.split('').map(char => char.charCodeAt(0)).join('');
    return this.colorPalette[Number(charCodes) % this.colorPalette.length];
  }

  /**
   * Emits the company change event
   * @param event The event
   */
  onCompanyChange(event: MouseEvent) {
    this.companyChanged.emit(event);
  }

  /**
   * Emits the profile click event
   * @param event The event
   */
  onProfileClick(event: MouseEvent) {
    this.profileClicked.emit(event);
  }

  /**
   * Emits the role change event
   * @param newRole The new role
   */
  onRoleChange(newRole: TRole) {
    this.roleChanged.emit(newRole);
  }

  /**
   * Show the file chooser to upload a new image
   * @param event The event
   */
  showFileChooser(event: MouseEvent) {
    const target = event.currentTarget as HTMLElement;
    const input = target.querySelector(`input[type='file']`);
    if (input) {
      const clickEvent = new MouseEvent('click', {
        'view': window,
        'bubbles': false,
        'cancelable': false
      });
      input.dispatchEvent(clickEvent);
    }
  }

  /**
   * Emits the image change event
   * @param files The files list
   */
  onImageChange(files: FileList) {
    this.imageChanged.emit(files.item(0));
  }

  /**
   * Event fired when language is changed
   * @param lang New language
   */
  public onLangChanges(lang: string) {
    this._translateService.use(lang);
    this.currentLang = this._translateService.currentLang;
  }
}
