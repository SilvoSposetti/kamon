import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';

type Tab = ('default' | 'scene-selector' | 'shortcut-list' | 'how-to' | 'about');

@Component({
  selector: 'app-menu-window',
  templateUrl: './menu-window.component.html',
  styleUrls: ['./menu-window.component.css']
})
export class MenuWindowComponent implements OnInit, OnChanges {

  @Input() isWide: boolean;
  public tabs: Tab[] = ['scene-selector', 'shortcut-list', 'how-to', 'about'];
  public tabNames: string[] = ['Scene Selector', 'Shortcut List', 'How To', 'About'];
  private selectedTabNr: number = -1; // Follows indices in the tabs array.
  public selectedTab: Tab = 'shortcut-list';// ToDo: Set back to 'default'!
  public arrowPath: string = '../assets/img/UI/ArrowLeft.svg';

  public logoPath: string = '../assets/img/icon/icoShadow.svg';
  public backBtnPath: string = '../assets/img/UI/Close.svg';

  @Output() someEvent = new EventEmitter();

  public closeMenuParentMethod(): void {
    this.someEvent.emit();
  }

  constructor() {
  }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges): void {

    this.checkArrowPath();
  }

  private checkArrowPath(): void {
    let relativePath = '../assets/img/UI/Arrow';
    let arrowState: string = '';
    let extension = '.svg';
    if (this.isWide) {
      arrowState = 'Left';
    } else {
      arrowState = 'Up';
    }

    this.arrowPath = relativePath + arrowState + extension;
  }



  public resetSelectedTab(): void {
    this.selectTabNr(-1);
  }

  private selectTabNr(tabNr: number): void {
    if (tabNr < 0) {
      this.selectedTabNr = 2;
      this.selectedTab = 'default';
    } else {
      this.selectedTabNr = tabNr;
      this.selectedTab = this.tabs[this.selectedTabNr];
    }
  }

  public closeMenu(): void {
    this.closeMenuParentMethod();
  }

}
