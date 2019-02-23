import {Component, Input, OnInit} from '@angular/core';

type Tab = ('default' | 'scene-selector' | 'shortcut-list' | 'how-to' | 'about');

@Component({
  selector: 'app-menu-window',
  templateUrl: './menu-window.component.html',
  styleUrls: ['./menu-window.component.css'],
})
export class MenuWindowComponent implements OnInit {

  @Input() isWide: boolean;
  public tabs: Tab[] = ['scene-selector', 'shortcut-list', 'how-to', 'about'];
  public tabNames: string[] = ['Scene Selector', 'Shortcut List', 'How To', 'About'];
  private selectedTabNr: number = -1; // Follows indices in the tabs array.
  public selectedTab: Tab = 'default';

  constructor() {
  }

  ngOnInit() {
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


}
