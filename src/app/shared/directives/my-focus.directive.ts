import {Directive, HostListener, Input, Renderer2} from '@angular/core';

@Directive({
  selector: '[myFocus]',
})
export class MyFocusDirective {
  @Input('myFocus') isFocused: boolean;

  constructor(private renderer: Renderer2) {
    this.autoFocus();
  }

  // Used to focus on #search-input input at application startup
  autoFocus() {
    if(document.activeElement.className.substring(0,16) !== 'edit-to-do-input'){
      this.renderer.selectRootElement('#search-input').focus();
    }
  }

  // Used to focus again on #search-input input when focus is lost on it.
  //@HostListener('blur')
  //onBlur() {
  //  this.autoFocus();
  //}
  @HostListener('document:click')
  onClick() {
    this.autoFocus();
  }
}
