import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {FpsService} from '../../../shared/services/fps.service';
import {ColorService} from '../../../shared/services/color.service';
import {Scene} from '../../../shared/models/Scene';
import {QuadTree} from '../../../shared/models/QuadTree';


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
  private numOfParticles: number = 1000;
  private particles: number[][] = [];
  // Each particle contains: [posX, posY, vX, vY]
  private particleMaxSpeed: number = 2;
  private particleSize: number = 2;

  private quadTree: QuadTree;
  private quadTreeCapacity: number = 1;

  private centerLimit: number = 3;


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
      let vX = this.particleMaxSpeed * Math.cos(angle);
      let vY = this.particleMaxSpeed * Math.sin(angle);
      this.particles.push([posX, posY, vX, vY]);
    }
  }

  public update(): void {

    //x^2+2*x*y,y^2+2*x*y


    for (let i = 0; i < this.numOfParticles; i++) {
      let posX = this.particles[i][0] - this.screenWidth / 2;
      let posY = this.particles[i][1] - this.screenHeight / 2;
      //let aX = posX * posX + 2 * posX * posY;
      //let aY = posY * posY + 0.2 * posX * posY;
      //let aX = -posY;
      let aX = (posY * posY - posX * posX) / (2 * posY);
      //let aY = (posX * posX - posY * posY) / (2 * posX);
      let aY = -posX;

      this.particles[i][2] += aX;
      this.particles[i][3] += aY;

      //Speed checking:
      let absoluteLength = Math.sqrt(this.particles[i][2] * this.particles[i][2] + this.particles[i][3] * this.particles[i][3]);

      if (absoluteLength >= this.particleMaxSpeed) {
        this.particles[i][2] = (this.particles[i][2] / absoluteLength) * this.particleMaxSpeed;
        this.particles[i][3] = (this.particles[i][3] / absoluteLength) * this.particleMaxSpeed;
      }
      this.particles[i][0] += this.particles[i][2];
      this.particles[i][1] += this.particles[i][3];

      //boundary checking:

      if (this.particles[i][0] < 0) {
        this.particles[i][0] = this.screenWidth;
        this.particles[i][2] = -this.particles[i][2];
      }
      else if (this.particles[i][0] > this.screenWidth) {
        this.particles[i][0] = 0;
        this.particles[i][2] = -this.particles[i][2];
      }
      else if (this.particles[i][1] < 0) {
        this.particles[i][1] = this.screenHeight;
        this.particles[i][3] = -this.particles[i][3];
      }
      else if (this.particles[i][1] > this.screenHeight) {
        this.particles[i][1] = 0;
        this.particles[i][3] = -this.particles[i][3];
      }
      else if (this.particles[i][0] < this.screenWidth / 2 + this.centerLimit &&
        this.particles[i][0] > this.screenWidth / 2 - this.centerLimit &&
        this.particles[i][1] < this.screenHeight / 2 + this.centerLimit &&
        this.particles[i][1] > this.screenHeight / 2 - this.centerLimit) {
        this.particles[i][0] = Math.random() * this.screenWidth;
        this.particles[i][1] = Math.random() * this.screenHeight;
      }
    }

    this.quadTree = new QuadTree(0, 0, this.screenWidth, this.screenHeight, this.quadTreeCapacity);
    for (let i = 0; i < this.numOfParticles; i++) {
      this.quadTree.insertPoint(this.particles[i][0], this.particles[i][1]);
    }
  }

  public draw(): void {
    this.drawBackground();
    this.drawParticles();
    this.drawQuadTree();
  }

  private drawParticles(): void {
    let ctx: CanvasRenderingContext2D = this.canvasRef.nativeElement.getContext('2d');
    ctx.fillStyle = this.sandGradient;
    for (let i = 0; i < this.numOfParticles; i++) {
      ctx.beginPath();
      ctx.arc(this.particles[i][0], this.particles[i][1], this.particleSize, 0, Math.PI * 2);
      ctx.closePath();
      ctx.fill();
      //ctx.fillRect(this.particles[i][0], this.particles[i][1], this.particleSize, this.particleSize);
    }

  }

  private drawBackground(): void {
    let ctx: CanvasRenderingContext2D = this.canvasRef.nativeElement.getContext('2d');
    ctx.fillStyle = this.seaGradient;
    ctx.fillRect(0, 0, this.screenWidth, this.screenHeight);
  }

  private drawQuadTree(): void {
    let ctx: CanvasRenderingContext2D = this.canvasRef.nativeElement.getContext('2d');
    ctx.strokeStyle = this.sandGradient;
    this.drawQuadTreeElement(this.quadTree, ctx);
  }

  private drawQuadTreeElement(quadTree: QuadTree, ctx: CanvasRenderingContext2D): void {
    if (quadTree.isDivided) {
      this.drawQuadTreeElement(quadTree.northWest, ctx);
      this.drawQuadTreeElement(quadTree.northEast, ctx);
      this.drawQuadTreeElement(quadTree.southWest, ctx);
      this.drawQuadTreeElement(quadTree.southEast, ctx);
    }
    else {
      ctx.strokeRect(quadTree.boundary.x, quadTree.boundary.y, quadTree.boundary.width, quadTree.boundary.height);
    }
  }

}
