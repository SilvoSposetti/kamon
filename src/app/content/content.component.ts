import {Component, Input, OnChanges, OnInit, SimpleChange, SimpleChanges} from '@angular/core';
import {animate, style, transition, trigger} from '@angular/animations';

type UIState = ('wide' | 'narrow');
type ArrowState = ('Up' | 'Down' | 'Left' | 'Right');

@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.css'],
  animations: [
    trigger(
      'myMenuEnterLeaveHorizontal',
      [
        transition('void => wide', [// :enter
          style({width: 0, opacity: 0}),
          animate('500ms ease', style({width: '*', opacity: 1}))
        ]),
        transition('wide => void', [ // :leave
          style({width: '*', opacity: 1}),
          animate('500ms ease', style({width: 0, opacity: 0}))
        ])
      ]
    ),
    trigger(
      'myMenuEnterLeaveVertical',
      [
        transition('void => narrow', [ // :enter
          style({height: 0, opacity: 0}),
          animate('500ms ease', style({height: '*', opacity: 1}))
        ]),
        transition('narrow => void', [ // :leave
          style({height: '*', opacity: 1}),
          animate('500ms ease', style({height: 0, opacity: 0}))
        ])
      ]
    )
  ],
})
export class ContentComponent implements OnInit, OnChanges {

  @Input() useScene: boolean;
  @Input() public isWide: boolean;
  @Input() public isTall: boolean;

  public showMenu: boolean = false;

  public state: UIState = 'wide';

  public arrowPath: string = '../assets/img/UI/ArrowLeft.png';

  constructor() {
  }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.isWide.currentValue) {
      this.state = 'wide';
    } else {
      this.state = 'narrow';
    }
    this.checkArrowPath();
  }

  public swapMenuVisibility(): void {
    this.showMenu = !this.showMenu;
    this.checkArrowPath();
  }

  private checkArrowPath(): void {
    let relativePath = '../assets/img/UI/Arrow';
    let arrowState: ArrowState = 'Right'; // Defaults to 'Left'
    let extension = '.png';
    if (this.showMenu && this.isWide) {
      arrowState = 'Left';
    } else if (!this.showMenu && !this.isWide) {
      arrowState = 'Down';
    } else if (this.showMenu && !this.isWide) {
      arrowState = 'Up';
    }

    this.arrowPath = relativePath + arrowState + extension;
  }

}
