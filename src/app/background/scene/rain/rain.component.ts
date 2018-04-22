import {Component, ElementRef, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {FpsService} from '../../../shared/services/fps.service';
import {Subject} from 'rxjs/Subject';
import {ColorService} from '../../../shared/services/color.service';

@Component({
  selector: 'app-rain',
  templateUrl: './rain.component.html',
  styleUrls: ['./rain.component.css']
})
export class RainComponent implements OnInit, OnDestroy {
  @ViewChild('myCanvas') canvasRef: ElementRef;
  @Input() screenWidth: number;
  @Input() screenHeight: number;
  @Input() showFPS: boolean;

  private ngUnsubscribe: Subject<any> = new Subject<any>();
  private fpsValues: number[] = [0, 0];

  private running: boolean;
  private gradient1: CanvasGradient;
  private gradient2: CanvasGradient;

  private numOfRainDrops: number = 500;
  private rainDrops: number[][] = [];
  //[x,y,vx,vy,ax,ay,previousXPOs,previousYPos]
  private gravity: number = 1;
  private maxSpeed: number = 10;

  private numOfUmbrellas: number = 4;
  private umbrellas: number[][] = [];
  //[x,y,vx,vy,r,stepOffset,heightOffset]
  private umbrellasSize = 300;
  private umbrellaRatio = 2 / 3;
  private cutOff: number = this.umbrellasSize * this.umbrellaRatio;
  private slideForce: number = 5;
  private bounceForce: number = 5;
  private spacingBetweenUmbrellas: number;
  private umbrellasMaxSpeed = 3;
  private umbrellasMinSpeed = 1;
  private umbrellasStepSize = 5;
  private umbrellasCounter = 0;



  constructor(private fpsService: FpsService, private colorService: ColorService) {
  }

  ngOnInit() {
    this.running = true;
    this.spacingBetweenUmbrellas = this.screenHeight / (this.numOfUmbrellas + 1);
    this.setup();
    this.fpsService.getFps().takeUntil(this.ngUnsubscribe).subscribe(value => {
      this.fpsValues = value;
    });
    requestAnimationFrame(() => this.paint());
  }

  ngOnDestroy() {
    this.running = false;
    this.fpsService.reset();
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  private paint(): void {
    // Check that we're still running.

    this.fpsService.updateFps();
    this.updateUmbrellas();
    this.updateRainDrops();
    // Paint current frame
    let ctx: CanvasRenderingContext2D = this.canvasRef.nativeElement.getContext('2d');
    ctx.fillStyle = this.gradient1;
    //ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, this.screenWidth, this.screenHeight);


    // draw rain drops
    for (let i = 0; i < this.numOfRainDrops; ++i) {
      //ctx.beginPath();
      //ctx.fillStyle = '#ffffff';
      //ctx.arc(this.rainDrops[i][0], this.rainDrops[i][1], 1, 0, 2 * Math.PI);
      //ctx.fill();

      ctx.strokeStyle = this.gradient2;
      ctx.lineWidth = 2;
      ctx.beginPath();
      // draw line from previousPos to newPos
      ctx.moveTo(this.rainDrops[i][6], this.rainDrops[i][7]);
      ctx.lineTo(this.rainDrops[i][0], this.rainDrops[i][1]);
      ctx.closePath();
      ctx.stroke();
    }

    //draw umbrellas:
    //for (let j = 0; j < this.numOfUmbrellas; ++j) {
    //  ctx.beginPath();
    //  ctx.fillStyle = '#000000';
    //  ctx.strokeStyle = '#dddddd';
    //  ctx.arc(this.umbrellas[j][0], this.umbrellas[j][1], this.umbrellas[j][4], 4.0, 5.4);
    //  ctx.fill();
    //  ctx.stroke();
    //}

    //Schedule next
    if(this.running){
      requestAnimationFrame(() => this.paint());
    }
  }

  private setup(): void {
    let ctx: CanvasRenderingContext2D = this.canvasRef.nativeElement.getContext('2d');

    this.gradient1 = ctx.createLinearGradient(0, 0, this.screenWidth, this.screenHeight);
    this.gradient1.addColorStop(0, this.colorService.getBackgroundFirstStopRGBA(0.3));
    this.gradient1.addColorStop(1, this.colorService.getBackgroundSecondStopRGBA(0.3));

    this.gradient2 = ctx.createLinearGradient(0, 0, this.screenWidth, this.screenHeight);
    this.gradient2.addColorStop(0, this.colorService.getForegroundFirstStopHEX());
    this.gradient2.addColorStop(1, this.colorService.getForegroundSecondStopHEX());

    for (let i = 0; i < this.numOfRainDrops; ++i) {
      let posX = Math.random() * this.screenWidth;
      let posY = Math.random() * this.screenHeight;
      this.rainDrops.push([posX, posY, 0, 0, 0, 0, posX, posY]);
    }
    for (let j = 0; j < this.numOfUmbrellas; ++j) {
      let ySpeed = this.umbrellasMinSpeed + (this.umbrellasMaxSpeed - this.umbrellasMinSpeed) * Math.random();
      if (Math.random() < 0.5) {
        this.umbrellas.push([Math.random() * this.screenWidth, (j + 2) * this.spacingBetweenUmbrellas, ySpeed, 0, this.umbrellasSize, Math.random() * Math.PI * 2, (j + 2) * this.spacingBetweenUmbrellas]);
      }
      else {
        this.umbrellas.push([Math.random() * this.screenWidth, (j + 2) * this.spacingBetweenUmbrellas, -ySpeed, 0, this.umbrellasSize, Math.random() * Math.PI * 2, (j + 2) * this.spacingBetweenUmbrellas]);
      }
    }
  }

  private updateRainDrops() {

    for (let i = 0; i < this.numOfRainDrops; ++i) {
      let collision = false;
      let collisionLeft = false;
      let collisionRight = false;
      let collidedUmbrella: number;
      // Apply Force
      for (let j = 0; j < this.numOfUmbrellas; j++) {
        let distanceToUmbrella = Math.sqrt(Math.pow(this.rainDrops[i][0] - this.umbrellas[j][0], 2) + Math.pow(this.rainDrops[i][1] - this.umbrellas[j][1], 2));
        let isInCutOff = ((this.rainDrops[i][0] > this.umbrellas[j][0] - this.cutOff) && this.rainDrops[i][0] < (this.umbrellas[j][0] + this.cutOff));
        let isUnderUmbrella = this.rainDrops[i][1] > this.umbrellas[j][1] - this.cutOff;
        if (distanceToUmbrella <= this.umbrellas[j][4] && isInCutOff && !isUnderUmbrella) {
          if (this.rainDrops[i][0] < this.umbrellas[j][0]) {
            collisionLeft = true;
          }
          else {
            collisionRight = true;
          }
          // collision detected!
          collision = true;
          collidedUmbrella = j;
        }
      }

      if (collision) {
        this.rainDrops[i][3] = 0;
        if (collisionLeft) {
          this.rainDrops[i][4] = -this.slideForce;
          this.rainDrops[i][5] = -this.bounceForce;
        }
        else {
          this.rainDrops[i][4] = this.slideForce;
          this.rainDrops[i][5] = -this.bounceForce;
        }
        this.rainDrops[i][2] += this.rainDrops[i][4];
        this.rainDrops[i][3] += this.rainDrops[i][5];
      }
      else {
        this.rainDrops[i][4] = 0;
        this.rainDrops[i][5] = this.gravity;
        this.rainDrops[i][2] += this.rainDrops[i][4];
        this.rainDrops[i][3] += this.rainDrops[i][5];
      }


      // Check that speed is lower than maxSpeed
      let speedValue = Math.sqrt(Math.pow(this.rainDrops[i][2], 2) + Math.pow(this.rainDrops[i][3], 2));
      if (speedValue === 0) {
        speedValue = 0.01;
      }
      if (speedValue >= this.maxSpeed) {
        this.rainDrops[i][2] *= this.maxSpeed / speedValue;
        this.rainDrops[i][3] *= this.maxSpeed / speedValue;
      }
      this.rainDrops[i][6] = this.rainDrops[i][0];
      this.rainDrops[i][7] = this.rainDrops[i][1];
      this.rainDrops[i][0] += this.rainDrops[i][2];
      this.rainDrops[i][1] += this.rainDrops[i][3];

      // Boundary check
      if (this.rainDrops[i][0] < 0) {
        //this.particles[i][0] = this.screenWidth -1;
        this.rainDrops[i] = [Math.random() * this.screenWidth, 0, 0, 0,0,0];
      }
      if (this.rainDrops[i][0] >= this.screenWidth) {
        //this.particles[i][0] = 0;
        this.rainDrops[i] = [Math.random() * this.screenWidth, 0, 0, 0,0,0];
      }
      if (this.rainDrops[i][1] < 0) {
        //this.particles[i][1] = this.screenHeight -1;
        this.rainDrops[i] = [Math.random() * this.screenWidth, 0, 0, 0,0,0];
      }
      if (this.rainDrops[i][1] >= this.screenHeight) {
        //this.particles[i][1] = 0;
        this.rainDrops[i] = [Math.random() * this.screenWidth, 0, 0, 0,0,0];
      }
    }
  }

  private updateUmbrellas(): void {
    for (let i = 0; i < this.numOfUmbrellas; i++) {
      this.umbrellas[i][0] += this.umbrellas[i][2];
      this.umbrellas[i][1] = this.umbrellas[i][6] + this.umbrellasStepSize * Math.cos(this.umbrellas[i][5] + this.umbrellasCounter / 5);
      if (this.umbrellas[i][0] > this.screenWidth + this.cutOff + 1) {
        this.umbrellas[i][0] = -this.cutOff;
      }
      if (this.umbrellas[i][0] < -this.cutOff - 1) {
        this.umbrellas[i][0] = this.screenWidth + this.cutOff;
      }
    }
    this.umbrellasCounter++;
  }
}
