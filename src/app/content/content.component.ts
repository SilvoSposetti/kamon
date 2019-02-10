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
          animate('500ms ease', style({height: '*', opacity: 1}))
        ]),
        transition('narrow => void', [ // :leave
          style({height: '*'}),
          animate('500ms ease', style({height: 0, opacity: 0}))
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

  public showMenu: boolean = false; // ToDo: set this back to false

  public state: UIState = 'wide';

  public arrowPath: string = '../assets/img/UI/ArrowRight.svg';

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
      this.checkArrowPath();
    }
  }

  public swapMenuVisibility(): void {
    this.showMenu = !this.showMenu;
    this.checkArrowPath();
  }

  private checkArrowPath(): void {
    let relativePath = '../assets/img/UI/Arrow';
    let arrowState: ArrowState = 'Right';
    let extension = '.svg';
    if (this.isWide) {
      arrowState = 'Right';
    } else {
      arrowState = 'Down';
    }

    this.arrowPath = relativePath + arrowState + extension;
  }

  public closeMenu(): void {
    this.showMenu = false;
  }

}
