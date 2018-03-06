import {Component, ElementRef, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import OpenSimplexNoise from 'open-simplex-noise';
import {FpsService} from '../../../shared/services/fps.service';
import {Subject} from 'rxjs/Subject';


@Component({
  selector: 'app-perlin-field',
  templateUrl: './perlin-field.component.html',
  styleUrls: ['./perlin-field.component.css']
})
export class PerlinFieldComponent implements OnInit, OnDestroy {

  @ViewChild('myCanvas') canvasRef: ElementRef;
  @Input() screenWidth: number;
  @Input() screenHeight: number;
  @Input() showFPS: boolean;

  private ngUnsubscribe: Subject<any> = new Subject<any>();
  private fpsValues: number[] = [0, 0];

  private running: boolean;

  //Declaration of noise type which provides noise functions
  private noise = new OpenSimplexNoise(Date.now()); // Date.now() is the seed

  private spacing = 20;
  private columns: number;
  private rows: number;
  private field: number[][] = [];
  private inc = 0.05;
  private time = 0;
  private timeInc = 0.001;

  private numOfParticles: number = 1000;
  private particles: number[][] = [];
  //[x,y,vx,vy,previousXPos,previousYPos]
  private maxSpeed: number = 1.5;
  private particlesSize = 1.5;
  private particleMass: number = 0.01; // NOT ZERO!

  constructor(private fpsService: FpsService) {
  }

  ngOnInit() {
    this.running = true;
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
    if (!this.running) {
      return;
    }
    // Calculates fps
    this.fpsService.updateFps();


    // Paint current frame
    let ctx: CanvasRenderingContext2D = this.canvasRef.nativeElement.getContext('2d');

    this.updateField();
    this.updateParticles();

    ctx.fillStyle = 'rgba(0,0,0,0.05)';
    //ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, this.screenWidth, this.screenHeight);

    // Draw vector field.
    //for (let k = 0; k < this.rows * this.columns; k++) {
    //  let angle = this.field[this.xPos][this.yPos] * 2 * Math.PI;
    //
    //  //output = output_start + ((output_end - output_start) / (input_end - input_start)) * (input - input_start)
    //
    //
    //  ctx.strokeStyle = '#777777';
    //  ctx.beginPath();
    //  ctx.moveTo(this.xPos * this.spacing, this.yPos * this.spacing);
    //  ctx.lineTo((this.xPos + Math.cos(angle)) * this.spacing, (this.yPos + Math.sin(angle)) * this.spacing);
    //  ctx.closePath();
    //  ctx.stroke();
    //
    //
    //  this.xPos += 1;
    //  if (this.xPos >= this.columns) {
    //    this.yPos += 1;
    //    this.xPos = 0;
    //  }
    //  if (this.yPos >= this.rows) {
    //    this.yPos = 0;
    //    //this.running = false;
    //    //console.log('ended');
    //  }
    //} // this is the other parenthesis of the for loop over

    for (let i = 0; i < this.numOfParticles; ++i) {
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(this.particles[i][0], this.particles[i][1], this.particlesSize, this.particlesSize);

      //ctx.beginPath();
      //ctx.fillStyle = '#999999';
      //ctx.strokeStyle= 'rgba(0,0,0,0)';
      //ctx.arc(this.particles[i][0], this.particles[i][1], this.particlesSize, 0, 2 * Math.PI);
      //ctx.fill();
      //ctx.stroke();

      ctx.strokeStyle = '#dddddd';
      ctx.lineWidth = 2;
      ctx.beginPath();
      // draw line from previousPos to newPos
      ctx.moveTo(this.particles[i][4], this.particles[i][5]);
      ctx.lineTo(this.particles[i][0], this.particles[i][1]);
      ctx.closePath();
      ctx.stroke();

    }


    // Schedule next
    requestAnimationFrame(() => this.paint());
  }

  private setup(): void {
    this.columns = Math.ceil(this.screenWidth / this.spacing);
    this.rows = Math.ceil(this.screenHeight / this.spacing);

    for (let x = 0; x < this.columns; x++) {
      this.field.push([]);
      for (let y = 0; y < this.rows; y++) {
        this.field[x].push(0.5 * this.noise.noise3D(x * this.inc, y * this.inc, this.time * this.timeInc) + 0.5);
      }
    }

    for (let i = 0; i < this.numOfParticles; i++) {
      let x = Math.random() * this.screenWidth;
      let y = Math.random() * this.screenHeight;
      this.particles.push([x, y, 0, 0, x, y]);
    }
  }


  private updateField(): void {
    for (let x = 0; x < this.columns; x++) {
      for (let y = 0; y < this.rows; y++) {
        //this.field[x][y] = Math.random();
        this.field[x][y] = (0.5 * this.noise.noise3D(x * this.inc, y * this.inc, this.time * this.timeInc) + 0.5);
        if (this.field[x][y] < 0.01) {
          this.field[x][y] = 0.01;
        }
      }
    }
    this.time++;
  }

  private updateParticles(): void {
    for (let i = 0; i < this.numOfParticles; i++) {
      let posOnGridX = Math.floor(this.particles[i][0] / this.spacing);
      let posOnGridY = Math.floor(this.particles[i][1] / this.spacing);
      let forceX = Math.cos(this.field[posOnGridX][posOnGridY] * 2 * Math.PI);
      let forceY = Math.sin(this.field[posOnGridX][posOnGridY] * 2 * Math.PI);

      // Apply Force
      this.particles[i][2] += forceX / this.particleMass;
      this.particles[i][3] += forceY / this.particleMass;

      // Check that speed is lower than maxSpeed
      let speedValue = Math.sqrt(Math.pow(this.particles[i][2], 2) + Math.pow(this.particles[i][3], 2));
      if (speedValue === 0) {
        speedValue = 0.01;
      }
      if (speedValue >= this.maxSpeed) {
        this.particles[i][2] *= this.maxSpeed / speedValue;
        this.particles[i][3] *= this.maxSpeed / speedValue;
      }
      this.particles[i][4] = this.particles[i][0];
      this.particles[i][5] = this.particles[i][1];
      this.particles[i][0] += this.particles[i][2];
      this.particles[i][1] += this.particles[i][3];


      // Boundary check
      if (this.particles[i][0] < 0) {
        //this.particles[i][0] = this.screenWidth -1;
        this.reSpawnParticle(i);
      }
      if (this.particles[i][0] >= this.screenWidth) {
        //this.particles[i][0] = 0;
        this.reSpawnParticle(i);
      }
      if (this.particles[i][1] < 0) {
        //this.particles[i][1] = this.screenHeight -1;
        this.reSpawnParticle(i);
      }
      if (this.particles[i][1] >= this.screenHeight) {
        //this.particles[i][1] = 0;
        this.reSpawnParticle(i);
      }
    }
  }

  private reSpawnParticle(index: number): void {
    let x = Math.random() * this.screenWidth;
    let y = Math.random() * this.screenHeight;
    this.particles[index] = [x, y, 0, 0, x, y];
  }
}
