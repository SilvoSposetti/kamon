import {Component, ElementRef, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {FpsService} from '../../../shared/services/fps.service';
import {Subject} from 'rxjs/Subject';
import {ColorService} from '../../../shared/services/color.service';


@Component({
  selector: 'app-quad-tree',
  templateUrl: './quad-tree.component.html',
  styleUrls: ['./quad-tree.component.css']
})
export class QuadTreeComponent implements OnInit, OnDestroy {
  @ViewChild('myCanvas') canvasRef: ElementRef;
  @Input() screenWidth: number;
  @Input() screenHeight: number;
  @Input() showFPS: boolean;

  private ngUnsubscribe: Subject<any> = new Subject<any>();
  private fpsValues: number[] = [0, 0];

  private gradient1: CanvasGradient;
  private gradient2: CanvasGradient;

  //Particles:
  private numOfParticles: number = 200;
  private particles: number[][] = [];
  private particleSpeed: number = 2;
  private particleSize: number = 50;
  // Each particle contains: [posX, posY, vX, vY]



  private running: boolean;

  constructor(private fpsService: FpsService, private colorService: ColorService) {
  }

  ngOnInit() {
    this.running = true;
    this.setup();
    this.fpsService.getFps().takeUntil(this.ngUnsubscribe).subscribe(value => {
      this.fpsValues = value;
    });
    requestAnimationFrame(() => this.loop());
  }

  ngOnDestroy() {
    this.running = false;
    this.fpsService.reset();
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  private loop(): void {
    this.fpsService.updateFps();

    this.updateParticles();

    this.drawBackground();
    this.drawParticles();

    if (this.running) {
      requestAnimationFrame(() => this.loop());
    }
  }


  private setup(): void {
    let ctx: CanvasRenderingContext2D = this.canvasRef.nativeElement.getContext('2d');

    this.gradient1 = ctx.createLinearGradient(0, 0, this.screenWidth, this.screenHeight);
    this.gradient1.addColorStop(0, this.colorService.getBackgroundFirstStopHEX());
    this.gradient1.addColorStop(1, this.colorService.getBackgroundSecondStopHEX());

    this.gradient2 = ctx.createLinearGradient(0, 0, this.screenWidth, this.screenHeight);
    this.gradient2.addColorStop(0, this.colorService.getForegroundFirstStopHEX());
    this.gradient2.addColorStop(1, this.colorService.getForegroundSecondStopHEX());



    for (let i = 0; i < this.numOfParticles; i++) {
      let posX = Math.random() * this.screenWidth;
      let posY = Math.random() * this.screenHeight;
      let angle = Math.random() * 2 * Math.PI;
      let vX = this.particleSpeed * Math.cos(angle);
      let vY = this.particleSpeed * Math.sin(angle);
      this.particles.push([posX, posY, vX, vY]);
    }
  }

  private updateParticles(): void {
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

  private drawParticles(): void {
    let ctx: CanvasRenderingContext2D = this.canvasRef.nativeElement.getContext('2d');
    ctx.fillStyle = this.gradient2;
    for (let i = 0; i < this.numOfParticles; i++) {
      ctx.beginPath();
      ctx.arc(this.particles[i][0], this.particles[i][1],this.particleSize,0, Math.PI*2 );
      ctx.closePath();
      ctx.fill();

    }
  }

  private drawBackground(): void{
    let ctx: CanvasRenderingContext2D = this.canvasRef.nativeElement.getContext('2d');
    ctx.fillStyle = this.gradient1;
    ctx.fillRect(0,0,this.screenWidth, this.screenHeight);
  }
}
