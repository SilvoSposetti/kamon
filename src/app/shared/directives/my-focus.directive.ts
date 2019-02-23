import {Directive, HostListener, Input, Renderer2} from '@angular/core';
import {ConfigService} from '../services/config.service';


@Directive({
  selector: '[myFocus]',
})
export class MyFocusDirective {
  @Input('myFocus') isFocused: boolean;

  constructor(private renderer: Renderer2, private configService: ConfigService) {

    this.autoFocus();
  }

  // Used to focus on #search-input input at application startup
  private autoFocus(): void {
    if (this.configService.getShowUI()) {
      setTimeout(()=> {
        this.renderer.selectRootElement('#search-input').focus();
      }, 1); // Need to shortly wait before focus
    }
  }

  // Used to focus again on #search-input input when focus is lost on it.
  @HostListener('document:click')
  onClick() {
    this.autoFocus();
  }
}
