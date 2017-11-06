import {Directive, ElementRef, Renderer} from '@angular/core';

@Directive({
  selector: '[myBlink]'
})
export class MyBlinkDirective {

  constructor(el: ElementRef, renderer: Renderer) {
    setInterval(() => {
      let style = "hidden";
      if(el.nativeElement.style.visibility && el.nativeElement.style.visibility == "hidden") {
        style = "visible";
      }
      renderer.setElementStyle(el.nativeElement, 'visibility', style);
    }, 1000);
  }
}
