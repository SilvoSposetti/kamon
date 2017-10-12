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
    this.renderer.selectRootElement('#search-input').focus();
    console.log('fired');
  }

  // Used to focus again on #search-input input when focus is lost on it.
  @HostListener('blur')
  onBlur() {
    this.autoFocus();
  }
  @HostListener('document:click')
  onClick() {
    this.autoFocus();
  }
}
