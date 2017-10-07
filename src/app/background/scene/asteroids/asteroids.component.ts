import {Component, ElementRef, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';

@Component({
  selector: 'app-asteroids',
  templateUrl: './asteroids.component.html',
  styleUrls: ['./asteroids.component.css']
})
export class AsteroidsComponent implements OnInit, OnDestroy {
  @ViewChild('myCanvas') canvasRef: ElementRef;
  @Input() screenWidth: number;
  @Input() screenHeight: number;

  private running: boolean;
  private asteroids: number[][] = [];
  // [posX,posY,velX,velY,mass]
  private massInCenter = 10;
  private gravConst = 100;
  private nrOfElements = 1000;
  private counter = 0;

  constructor() {
  }

  ngOnInit() {
    this.startAsteroids();
    this.running = true;
    this.paint();
  }

  ngOnDestroy() {
    this.running = false;
  }

  private paint(): void {
    // Check that we're still running.
    if (!this.running) {
      return;
    }

    // Paint current frame
    let ctx: CanvasRenderingContext2D =
      this.canvasRef.nativeElement.getContext('2d');
    ////Draw background (which also effectively clears any previous drawing)
    //let grd = ctx.createLinearGradient(0, 0, this.screenWidth, this.screenHeight);
    //grd.addColorStop(0, '10afa3');
    //grd.addColorStop(0.25, '10998e');
    //grd.addColorStop(0.5, '177181');
    //grd.addColorStop(0.75, '1b5978');
    //grd.addColorStop(1, '1b4564');
    //ctx.fillStyle = grd;
    ctx.fillStyle = 'rgba(25,25,25,0.05)';
    ctx.fillRect(0, 0, this.screenWidth, this.screenHeight);
    ctx.strokeStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(this.screenWidth / 2, this.screenHeight / 2, 30, 0, 2 * Math.PI);
    ctx.stroke();

    this.updateAsteroids();
    ctx.fillStyle = 'rgb(255,255,255)';
    for (let i = 0; i < this.nrOfElements; ++i) {
      ctx.beginPath();
      ctx.save();
      ctx.fillRect(this.asteroids[i][0], this.asteroids[i][1], 2, 2);
      ctx.restore();
    }

    // Schedule next
    requestAnimationFrame(() => this.paint());
  }

  private startAsteroids(): void {
    for (let i = 0; i < this.nrOfElements; ++i) {
      let element: number[] = [];
      let randomAngle = this.randomFloat(0, 2 * Math.PI);
      let x = this.screenWidth/2 - this.randomFloat(100,450)*Math.cos(randomAngle);
      let y = this.screenHeight/2 - this.randomFloat(100,450)*Math.sin(randomAngle);
      let randomAngleTurned = randomAngle+Math.PI/2;
      element.push(x);
      element.push(y);
      element.push(1.7*Math.cos(randomAngleTurned));
      element.push(1.7*Math.sin(randomAngleTurned));
      element.push(Math.random() * 5);
      this.asteroids.push(element);

    }
  }

  private updateAsteroids(): void {
    for (let i = 0; i < this.nrOfElements; ++i) {
      let vectorToCenterX = this.screenWidth / 2 - this.asteroids[i][0];
      let vectorToCenterY = this.screenHeight / 2 - this.asteroids[i][1];
      let distanceSquared = Math.pow(vectorToCenterX, 2) + Math.pow(vectorToCenterY, 2);
      if (distanceSquared <= 10000) {
        distanceSquared = 10000;
      }
      let force = this.gravConst * this.massInCenter * this.asteroids[i][4] / distanceSquared;

      let vectorToCenterLength = Math.sqrt(Math.pow(vectorToCenterX, 2) + Math.pow(vectorToCenterY, 2));
      vectorToCenterX /= vectorToCenterLength;
      vectorToCenterY /= vectorToCenterLength;
      this.asteroids[i][2] += force * vectorToCenterX / this.asteroids[i][4];
      this.asteroids[i][3] += force * vectorToCenterY / this.asteroids[i][4];
      this.asteroids[i][0] += this.asteroids[i][2];
      this.asteroids[i][1] += this.asteroids[i][3];

    }
  }

  private randomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  private randomFloat(min: number, max: number): number {
    return Math.random() * (max - min + 1) + min;
  }
}

//ctx.beginPath();
//ctx.save();

//ctx.restore();

