import {Component, Input, OnDestroy, AfterViewInit} from '@angular/core';
import {makeNoise3D} from 'open-simplex-noise';
import {FpsService} from '../../../shared/services/fps.service';
import {ColorService} from '../../../shared/services/color.service';
import {Scene} from '../../../shared/models/Scene';


@Component({
  selector: 'app-perlin-field',
  templateUrl: './perlin-field.component.html',
  styleUrls: ['./perlin-field.component.css']
})
export class PerlinFieldComponent extends Scene implements AfterViewInit, OnDestroy {
  @Input() screenWidth: number;
  @Input() screenHeight: number;
  @Input() showFPS: boolean;

  private alphaGradient: CanvasGradient;

  private noise = makeNoise3D(Date.now()); // Date.now() is the seed

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
  private particleMass: number = 0.01; // NOT ZERO!

  constructor(public fpsService: FpsService, public colorService: ColorService) {
    super(fpsService, colorService);
  }

  ngAfterViewInit() {
    this.initialiseCore();
  }

  ngOnDestroy() {
    this.terminateCore();
  }

  private drawBackground(): void {
    let ctx: CanvasRenderingContext2D = this.canvasRef.nativeElement.getContext('2d');

    this.updateField();
    this.updateParticles();

    ctx.fillStyle = this.alphaGradient;
    ctx.fillRect(0, 0, this.screenWidth, this.screenHeight);
  }

  public drawVectorField(): void {
    let ctx: CanvasRenderingContext2D = this.canvasRef.nativeElement.getContext('2d');

    for (let j = 0; j < this.rows; j++) {
      for(let k = 0; k<this.columns; k++){
        let angle = this.field[k][j] * 2 * Math.PI;

        //output = output_start + ((output_end - output_start) / (input_end - input_start)) * (input - input_start)


        ctx.strokeStyle = '#777777';
        ctx.beginPath();
        ctx.moveTo(k * this.spacing, j* this.spacing);
        ctx.lineTo((k + Math.cos(angle)) * this.spacing, (j + Math.sin(angle)) * this.spacing);
        ctx.closePath();
        ctx.stroke();
      }

    }
  }

  public drawParticles(): void {
    let ctx: CanvasRenderingContext2D = this.canvasRef.nativeElement.getContext('2d');

    for (let i = 0; i < this.numOfParticles; ++i) {

      ctx.strokeStyle = this.sandGradient;
      ctx.lineWidth = 2;
      ctx.beginPath();
      // draw line from previousPos to newPos
      ctx.moveTo(this.particles[i][4], this.particles[i][5]);
      ctx.lineTo(this.particles[i][0], this.particles[i][1]);
      ctx.closePath();
      ctx.stroke();
    }
  }

  public draw(): void {
    this.drawBackground();
    //this.drawVectorField();
    this.drawParticles();

  }



  public setup(): void {
    let ctx: CanvasRenderingContext2D = this.canvasRef.nativeElement.getContext('2d');

    this.alphaGradient = ctx.createLinearGradient(0, 0, this.screenWidth / 2, this.screenHeight / 2);
    this.alphaGradient.addColorStop(0, this.colorService.getBackgroundFirstStopRGBA(0.1));
    this.alphaGradient.addColorStop(1, this.colorService.getBackgroundSecondStopRGBA(0.1));

    this.columns = Math.ceil(this.screenWidth / this.spacing);
    this.rows = Math.ceil(this.screenHeight / this.spacing);

    for (let x = 0; x < this.columns; x++) {
      this.field.push([]);
      for (let y = 0; y < this.rows; y++) {
        this.field[x].push(0.5 * this.noise(x * this.inc, y * this.inc, this.time * this.timeInc) + 0.5);
      }
    }

    for (let i = 0; i < this.numOfParticles; i++) {
      let x = Math.random() * this.screenWidth;
      let y = Math.random() * this.screenHeight;
      this.particles.push([x, y, 0, 0, x, y]);
    }
  }

  public update(): void {
    this.updateField();
    this.updateParticles();
  }

  private updateField(): void {
    for (let x = 0; x < this.columns; x++) {
      for (let y = 0; y < this.rows; y++) {
        //this.field[x][y] = Math.random();
        this.field[x][y] = (0.5 * this.noise(x * this.inc, y * this.inc, this.time * this.timeInc) + 0.5);
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
