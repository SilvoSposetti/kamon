import {Directive, HostListener, Input, Renderer2} from '@angular/core';
import {ScreenSizeService} from '../services/screen-size.service';

@Directive({
  selector: '[myFocus]',
})
export class MyFocusDirective {
  @Input('myFocus') isFocused: boolean;
  private isWide : boolean;
  private widthThreshold = 769;


  constructor(private renderer: Renderer2, private screenSizeService: ScreenSizeService) {
    this.screenSizeService.getWidth().subscribe(value => {
      this.isWide = value >= this.widthThreshold;
    });
    this.autoFocus();
  }

  // Used to focus on #search-input input at application startup
  private autoFocus(): void {
    if (document.activeElement.className.substring(0, 16) !== 'edit-to-do-input') {
      //console.log(document.getElementById('search-input'));
      //if (document.getElementsByClassName('search-input').length >0){
      if (this.isWide){
      this.renderer.selectRootElement('#search-input').focus();
      }
    }
  }

  // Used to focus again on #search-input input when focus is lost on it.
  @HostListener('document:click')
  onClick() {
    this.autoFocus();
  }
}
