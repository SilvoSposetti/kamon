import {Component, Input, OnChanges, OnInit, SimpleChange, SimpleChanges} from '@angular/core';
import {animate, style, transition, trigger} from '@angular/animations';

type UIState = ('wide' | 'narrow');
type ArrowState = ('Up' | 'Down' | 'Left' | 'Right');

@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.css'],
  animations: [
    // Stretch:
    trigger(
      'myMenuEnterLeaveHorizontalStretch',
      [
        transition('void => wide', [ // :enter
          style({width: 0}),
          animate('500ms ease', style({width: '*'}))
        ]),
        transition('wide => void', [ // :leave
          style({width: '*'}),
          animate('500ms ease', style({width: 0}))
        ])
      ]
    ),
    trigger(
      'myMenuEnterLeaveVerticalStretch',
      [
        transition('void => narrow', [ // :enter
          style({height: 0}),
          animate('500ms ease', style({height: '*'}))
        ]),
        transition('narrow => void', [ // :leave
          style({height: '*'}),
          animate('500ms ease', style({height: 0}))
        ])
      ]
    ),
    // Slide:
    trigger(
      'myMenuEnterLeaveHorizontalSlide',
      [
        transition('void => wide', [// :enter
          style({transform: 'translateX(-100%)'}),
          animate('500ms ease', style({transform: 'translateX(0%)'}))
        ]),
        transition('wide => void', [ // :leave
          style({transform: 'translateX(0%)'}),
          animate('500ms ease', style({transform: 'translateX(-100%)'}))
        ])
      ]
    ),
    trigger(
      'myMenuEnterLeaveVerticalSlide',
      [
        transition('void => narrow', [// :enter
          style({transform: 'translateY(-100%)'}),
          animate('500ms ease', style({transform: 'translateY(0%)'}))
        ]),
        transition('narrow => void', [ // :leave
          style({transform: 'translateY(0%)'}),
          animate('500ms ease', style({transform: 'translateY(-100%)'}))
        ])
      ]
    ),
  ],
})


export class ContentComponent implements OnInit, OnChanges {

  @Input() useScene: boolean;
  @Input() public isWide: boolean;
  @Input() public isTall: boolean;

  public showMenu: boolean = true; // ToDo: set this back to false!

  public state: UIState = 'wide';

  constructor() {
  }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(changes.isWide !== undefined){
      if (changes.isWide.currentValue) {
        this.state = 'wide';
      } else {
        this.state = 'narrow';
      }
    }
  }

  public swapMenuVisibility(): void {
    this.showMenu = !this.showMenu;
  }


  public closeMenu(): void {
    this.showMenu = false;
  }

}
