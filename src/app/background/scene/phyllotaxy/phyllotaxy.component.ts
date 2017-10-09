import {Component, ElementRef, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';

@Component({
  selector: 'app-phyllotaxy',
  templateUrl: './phyllotaxy.component.html',
  styleUrls: ['./phyllotaxy.component.css']
})
export class PhyllotaxyComponent implements OnInit, OnDestroy {

  @ViewChild('myCanvas') canvasRef: ElementRef;
  @Input() screenWidth: number;
  @Input() screenHeight: number;

  private running: boolean;

  private points: number[][] = [];
  // [x,y,size]
  private nrOfPoints: number = 6000;
  private counter: number = 0;
  private c = 20;

  constructor() {
  }

  ngOnInit() {
    this.running = true;
    this.loadPoints();
    this.paint();
  }

  ngOnDestroy() {
    this.running = false;
  }

  private paint(): void {
    // Check that we're still running.
    if (!this.running || this.counter >= this.nrOfPoints) {
      return;
    }

    // Paint current frame
    let ctx: CanvasRenderingContext2D = this.canvasRef.nativeElement.getContext('2d');
    ctx.fillStyle = 'rgba(0,0,0,0.05)';
    //ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, this.screenWidth, this.screenHeight);


    for (let i = 0; i < 10; i++) {
      ctx.beginPath();
      let color = Math.floor(this.counter * 0.2) % 100;
      if (color<17){
        color = 17;
      }
      ctx.fillStyle = '#' + color.toString(16) + color.toString(16) + color.toString(16);
      ctx.arc(this.points[this.counter][0], this.points[this.counter][1], this.points[this.counter][2], 0, 2 * Math.PI);
      ctx.fill();
      ctx.stroke();
      this.counter++;
    }

    // Schedule next
    requestAnimationFrame(() => this.paint());
  }

  private loadPoints(): void {
    let goldenAngle = Math.PI * (3 - Math.sqrt(5));
    for (let i = 0; i < this.nrOfPoints; i++) {
      let r = this.c * Math.sqrt(i)- 2*this.c;
      let x = this.screenWidth / 2 + r * Math.cos(i * goldenAngle);
      let y = this.screenHeight / 2 + r * Math.sin(i * goldenAngle);
      let size = 20;
      this.points.push([x, y, size]);
    }
  }
}
