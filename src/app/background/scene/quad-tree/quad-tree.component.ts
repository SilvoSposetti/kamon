import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {FpsService} from '../../../shared/services/fps.service';
import {ColorService} from '../../../shared/services/color.service';
import {Scene} from '../../../shared/models/Scene';


@Component({
  selector: 'app-quad-tree',
  templateUrl: './quad-tree.component.html',
  styleUrls: ['./quad-tree.component.css']
})
export class QuadTreeComponent extends Scene implements OnInit, OnDestroy {
  @Input() screenWidth: number;
  @Input() screenHeight: number;
  @Input() showFPS: boolean;


  //Particles:
  private numOfParticles: number = 200;
  private particles: number[][] = [];
  private particleSpeed: number = 2;
  private particleSize: number = 50;

  // Each particle contains: [posX, posY, vX, vY]


  constructor(public fpsService: FpsService, public colorService: ColorService) {
    super(fpsService, colorService);
  }

  ngOnInit(): void {
    this.initialiseCore();
  }

  ngOnDestroy(): void {
    this.terminateCore();
  }

  public setup(): void {
    for (let i = 0; i < this.numOfParticles; i++) {
      let posX = Math.random() * this.screenWidth;
      let posY = Math.random() * this.screenHeight;
      let angle = Math.random() * 2 * Math.PI;
      let vX = this.particleSpeed * Math.cos(angle);
      let vY = this.particleSpeed * Math.sin(angle);
      this.particles.push([posX, posY, vX, vY]);
    }
  }

  public update(): void {
    for (let i = 0; i < this.numOfParticles; i++) {
      this.particles[i][0] += this.particles[i][2];
      this.particles[i][1] += this.particles[i][3];

      //boundary checking:

      if (this.particles[i][0] <= 0 || this.particles[i][0] >= this.screenWidth) {
        this.particles[i][2] = -this.particles[i][2];
      }
      else if (this.particles[i][1] <= 0 || this.particles[i][1] >= this.screenHeight) {
        this.particles[i][3] = -this.particles[i][3];
      }
    }
  }

  public draw(): void {
    this.drawBackground();
    this.drawParticles();
  }

  private drawParticles(): void {
    let ctx: CanvasRenderingContext2D = this.canvasRef.nativeElement.getContext('2d');
    ctx.fillStyle = this.sandGradient;
    for (let i = 0; i < this.numOfParticles; i++) {
      ctx.beginPath();
      ctx.arc(this.particles[i][0], this.particles[i][1], this.particleSize, 0, Math.PI * 2);
      ctx.closePath();
      ctx.fill();

    }
  }

  private drawBackground(): void {
    let ctx: CanvasRenderingContext2D = this.canvasRef.nativeElement.getContext('2d');
    ctx.fillStyle = this.seaGradient;
    ctx.fillRect(0, 0, this.screenWidth, this.screenHeight);
  }
}
