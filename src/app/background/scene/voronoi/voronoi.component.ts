import {Component, ElementRef, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';

@Component({
  selector: 'app-voronoi',
  templateUrl: './voronoi.component.html',
  styleUrls: ['./voronoi.component.css']
})
export class VoronoiComponent implements OnInit, OnDestroy {

  @ViewChild('myCanvas') canvasRef: ElementRef;
  @Input() screenWidth: number;
  @Input() screenHeight: number;
  @Input() showFPS: boolean;


  private running: boolean;

  private numOfPoints = 10;
  private points: number[][] = [];

  private parabolas: number [][] =[];
  //ax^2 + bx + c = 0 [a,b,c]
  private edges : number [][] = [];
  //[startX,startY,endX,endY,edgeL,edgeR]


  constructor() {
  }

  ngOnInit() {
    this.running = true;
    this.setup();
    requestAnimationFrame(() => this.paint());
  }

  ngOnDestroy() {
    this.running = false;
  }

  private paint(): void {

    this.fortune();


    // Paint current frame
    let ctx: CanvasRenderingContext2D = this.canvasRef.nativeElement.getContext('2d');
    ctx.fillStyle = 'rgba(0,0,0,0.005)';
    ctx.fillRect(0, 0, this.screenWidth, this.screenHeight);

    ctx.fillStyle = 'rgb(255,255,255)';
    for (let i = 0; i < this.numOfPoints; i++) {
      ctx.fillRect(this.points[i][0], this.points[i][1], 3, 3);
    }


    //Schedule next
    if (this.running) {
      requestAnimationFrame(() => this.paint());
    }
  }

  private setup(): void {
    for (let i = 0; i < this.numOfPoints; i++) {
      let posX = Math.random() * this.screenWidth;
      let posY = Math.random() * this.screenHeight;
      this.points.push([posX, posY]);
    }
  }

  private fortune(): void {
    let queue = this.getStartEvents();
    while (queue.length > 0) {
      let event = queue.shift();
      // The third element of event decides the type of the event is: 0 is site event, 1 is not
      if (event[2] === 0) { // Site event
        this.addParabola(event);
      }
      else { // Not site event
        //this.removeParabola(porcodio);
      }
    }
  }

  private getStartEvents(): number[][] {
    let orderedPoints = this.points.sort(function (a, b) {
      return a[1] - b[1];
    });
    let sites: number[][] = [];
    for (let i = 0; i < this.numOfPoints; i++) {
      sites.push([orderedPoints[i][0], orderedPoints[i][1], 0]);
    }
    // now sites is a set of point ordered by their x-positions.
    return sites;
  }

  private getCenterAndRadius(index: number): number[][] {
    return;
  }

  private addParabola(event: number[]): void {
    // pars need to keep track if they have a circle event already
    let par = [0,0,0];

    let a  = 'arca';
    let b  = 'arcb';
    let c  = 'arcc';


  }

  private removeParabola(parabola: number[]): void {

  }

  private checkCircleEvent(parabola: number[]): void{

  }

}
