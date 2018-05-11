import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {Scene} from '../../../shared/models/Scene';
import {FpsService} from '../../../shared/services/fps.service';
import {ColorService} from '../../../shared/services/color.service';
import {Boundary, QuadTree} from '../../../shared/models/QuadTree';

@Component({
  selector: 'app-plexus',
  templateUrl: './plexus.component.html',
  styleUrls: ['./plexus.component.css']
})
export class PlexusComponent extends Scene implements OnInit, OnDestroy {
  @Input() screenWidth: number;
  @Input() screenHeight: number;
  @Input() showFPS: boolean;

  private numOfParticles: number = 300;
  private particlesSpeed: number = 1;
  private particlesSize: number = 2;
  private particles: number[][] = [];
  // Each particle contains: [posX, posY, vX, vY]
  private plexusDistance: number = 80;
  private quadTreeCapacity = 5;
  private quadTree: QuadTree;

  //Sample boundaries:
  private sampleBoundarySize: number = 120;

  //Sample boundary rectangle:
  private showBoundaryRectangle: boolean = false;
  private sampleBoundary: Boundary;
  private foundRectangle: number[][];

  //Sample boundary circle:
  private showBoundaryCircle: boolean = false;
  private foundCircle: number[][] = [];


  constructor(public fpsService: FpsService, public colorService: ColorService) {
    super(fpsService, colorService);
  }

  ngOnInit() {
    this.initialiseCore();
  }

  ngOnDestroy(): void {
    this.terminateCore();
  }

  /*********************************************************************************************************************
   * Setup:
   */

  public setup(): void {
    for (let i = 0; i < this.numOfParticles; i++) {
      let angle = Math.random() * Math.PI * 2;
      //let velocity = Math.random() * this.particlesSpeed;
      this.particles.push([Math.random() * this.screenWidth, Math.random() * this.screenHeight, Math.cos(angle) * this.particlesSpeed, Math.sin(angle) * this.particlesSpeed]);
    }
  }

  /*********************************************************************************************************************
   * Update:
   */

  public update(): void {
    this.updateParticles();
    this.updateQuadTree();

    if (this.showBoundaryRectangle) {
      this.updateBoundaryRectangle();
    }

    if (this.showBoundaryCircle) {
      this.updateBoundaryCircle();
    }
  }

  private updateParticles(): void {
    for (let i = 0; i < this.numOfParticles; i++) {
      this.particles[i][0] += this.particles[i][2];
      this.particles[i][1] += this.particles[i][3];

      // Boundary Checking:
      if (this.particles[i][0] < 0) {
        this.particles[i][0] = 0;
        this.particles[i][2] = -this.particles[i][2];
      }
      else if (this.particles[i][1] < 0) {
        this.particles[i][1] = 0;
        this.particles[i][3] = -this.particles[i][3];
      }
      else if (this.particles[i][0] > this.screenWidth) {
        this.particles[i][0] = this.screenWidth;
        this.particles[i][2] = -this.particles[i][2];
      }
      else if (this.particles[i][1] > this.screenHeight) {
        this.particles[i][1] = this.screenHeight;
        this.particles[i][3] = -this.particles[i][3];
      }
    }
  }

  private updateQuadTree(): void {
    this.quadTree = new QuadTree(0, 0, this.screenWidth, this.screenHeight, this.quadTreeCapacity);
    for (let i = 0; i < this.numOfParticles; i++) {
      this.quadTree.insertPoint(this.particles[i][0], this.particles[i][1]);
    }
  }

  private updateBoundaryRectangle(): void {
    this.sampleBoundary = new Boundary(this.particles[0][0] - this.sampleBoundarySize, this.particles[0][1] - this.sampleBoundarySize, this.sampleBoundarySize * 2, this.sampleBoundarySize * 2);
    this.foundRectangle = this.quadTree.queryRect(this.sampleBoundary);
  }

  private updateBoundaryCircle(): void {
    this.foundCircle = this.quadTree.queryCircle(this.particles[0][0], this.particles[0][1], this.sampleBoundarySize);
  }

  /*********************************************************************************************************************
   * Draw:
   */

  public draw(): void {
    this.drawBackground();
    this.drawParticles();

    this.drawPlexusLines();

    if (this.showBoundaryRectangle) {
      this.drawFoundRectangle();
      this.drawBoundaryRectangle();
    }

    if (this.showBoundaryCircle) {
      this.drawFoundCircle();
      this.drawBoundaryCircle();
    }
  }

  private drawBackground(): void {
    let ctx: CanvasRenderingContext2D = this.canvasRef.nativeElement.getContext('2d');
    ctx.fillStyle = this.seaGradient;
    ctx.fillRect(0, 0, this.screenWidth, this.screenHeight);
  }

  private drawParticles(): void {
    let ctx: CanvasRenderingContext2D = this.canvasRef.nativeElement.getContext('2d');
    ctx.fillStyle = this.sandGradient;
    for (let i = 0; i < this.numOfParticles; i++) {
      ctx.beginPath();
      ctx.arc(this.particles[i][0], this.particles[i][1], this.particlesSize, 0, Math.PI * 2);
      ctx.closePath();
      ctx.fill();
    }
  }

  private drawPlexusLines(): void {
    let ctx: CanvasRenderingContext2D = this.canvasRef.nativeElement.getContext('2d');
    ctx.strokeStyle = this.sandGradient;
    let found: number[][];
    for (let i = 0; i < this.numOfParticles; i++) {
      found = this.quadTree.queryRect(new Boundary(this.particles[i][0] - this.plexusDistance, this.particles[i][1] - this.plexusDistance, this.plexusDistance * 2, this.plexusDistance * 2));
      //found = this.quadTree.queryCircle(this.particles[i][0], this.particles[i][1], this.plexusDistance);

      for (let element of found) {
        ctx.beginPath();
        ctx.moveTo(this.particles[i][0], this.particles[i][1]);
        ctx.lineTo(element[0], element[1]);
        ctx.closePath();
        ctx.stroke();
      }
    }
  }

  private drawFoundRectangle(): void {
    let ctx: CanvasRenderingContext2D = this.canvasRef.nativeElement.getContext('2d');
    ctx.fillStyle = 'red';
    for (let i = 0; i < this.foundRectangle.length; i++) {
      ctx.beginPath();
      ctx.arc(this.foundRectangle[i][0], this.foundRectangle[i][1], 6, 0, Math.PI * 2);
      ctx.closePath();
      ctx.fill();
    }
  }

  private drawBoundaryRectangle(): void {
    let ctx: CanvasRenderingContext2D = this.canvasRef.nativeElement.getContext('2d');
    ctx.strokeStyle = 'red';
    ctx.rect(this.sampleBoundary.x, this.sampleBoundary.y, this.sampleBoundary.width, this.sampleBoundary.height);
    ctx.stroke();
  }

  private drawBoundaryCircle(): void {
    let ctx: CanvasRenderingContext2D = this.canvasRef.nativeElement.getContext('2d');
    ctx.strokeStyle = 'green';
    ctx.beginPath();
    ctx.arc(this.particles[0][0], this.particles[0][1], this.sampleBoundarySize, 0, Math.PI * 2);
    ctx.closePath();
    ctx.stroke();

  }

  private drawFoundCircle(): void {
    let ctx: CanvasRenderingContext2D = this.canvasRef.nativeElement.getContext('2d');
    ctx.fillStyle = 'green';
    for (let i = 0; i < this.foundCircle.length; i++) {
      ctx.beginPath();
      ctx.arc(this.foundCircle[i][0], this.foundCircle[i][1], 4, 0, Math.PI * 2);
      ctx.closePath();
      ctx.fill();
    }
  }
}
