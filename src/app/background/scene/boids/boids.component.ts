import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';

@Component({
  selector: 'app-boids',
  templateUrl: './boids.component.html',
  styleUrls: ['./boids.component.css']
})
export class BoidsComponent implements OnInit {
  @ViewChild('myCanvas') canvasRef: ElementRef;
  @Input() screenWidth: number;
  @Input() screenHeight: number;

  private running: boolean;

  public fps = 0;
  private now: number;
  private lastUpdate = new Date().getTime();
  public frameFps = 0;
  // The higher this value, the less the FPS will be affected by quick changes
  // Setting this to 1 will show you the FPS of the last sampled frame only
  public fpsFilter = 100;

  private numOfParticles: number = 200;
  private particles: number[][] = [];
  private particlesCenterOfMass: number [] = [];
  private particlesCenterDirection: number[] = [];

  private maxSpeed: number = 6;
  private boundaryPadding: number = 100;
  private rule1Weight: number = 0.0005;

  private rule2Distance: number = 30;
  private rule2Weight: number = 0.02;
  private rule3Weight: number = 0.007;
  private rule3Distance: number = 40;
  private rule4Weight: number = 0.04;

  // [posX, posY, vX,vY]

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
    // Check that we're still running.
    if (!this.running) {
      return;
    }

    // Calculates fps
    this.now = new Date().getTime();
    this.frameFps = 1000 / (this.now - this.lastUpdate);
    if (this.now != this.lastUpdate) {
      this.fps += (this.frameFps - this.fps) / this.fpsFilter;
      this.frameFps = Math.ceil(this.frameFps);
      this.lastUpdate = this.now;
    }


    // Paint current frame
    let ctx: CanvasRenderingContext2D = this.canvasRef.nativeElement.getContext('2d');

    //ctx.fillStyle = 'rgba(25,25,25,0.05)';
    ctx.fillStyle = 'rgba(25,25,25,1)';

    ctx.fillRect(0, 0, this.screenWidth, this.screenHeight);

    for (let i = 0; i < this.numOfParticles; i++) {
      ctx.strokeStyle = 'rgba(255,255,255,1)';
      ctx.beginPath();
      ctx.arc(this.particles[i][0], this.particles[i][1], 5, 0, 2 * Math.PI);
      ctx.stroke();
    }

    this.updateParticles();    // Schedule next
    requestAnimationFrame(() => this.paint());
  }

  private setup(): void {
    for (let i = 0; i < this.numOfParticles; i++) {
      let angle = Math.random()*Math.PI * 2;
      let radius = Math.random()* this.screenWidth/6 + this.screenWidth/6;
      let posX = (this.screenWidth/2)+ Math.cos(angle)*radius;
      let posY = (this.screenHeight/2)+ Math.sin(angle)*radius;
      let vX = Math.random() * this.maxSpeed* Math.cos(angle+ Math.PI/2);
      let vY = Math.random() * this.maxSpeed * Math.sin(angle+Math.PI/2);
      this.particles.push([posX, posY, vX, vY]);
    }
    this.updateCenterOfMass();
  }

  private updateCenterOfMass(): void {
    let centerX = 0;
    let centerY = 0;
    let vCenterX = 0;
    let vCenterY = 0;
    for (let i = 0; i < this.numOfParticles; i++) {
      centerX += this.particles[i][0];
      centerY += this.particles[i][1];
      vCenterX += this.particles[i][2];
      vCenterY += this.particles[i][3];
    }
    centerX /= this.numOfParticles;
    centerY /= this.numOfParticles;
    vCenterX /= this.numOfParticles;
    vCenterY /= this.numOfParticles;
    this.particlesCenterOfMass = [centerX, centerY];
    this.particlesCenterDirection = [vCenterX, vCenterY];
  }

  private updateParticlePositions(): void {
    for (let i = 0; i < this.numOfParticles; i++) {

      // Speed-check:
      let speedValue = Math.sqrt(Math.pow(this.particles[i][2], 2) + Math.pow(this.particles[i][3], 2));
      if (speedValue === 0) {
        speedValue = 0.01;
      }
      this.particles[i][2] *= this.maxSpeed / speedValue;
      this.particles[i][3] *= this.maxSpeed / speedValue;

      this.particles[i][0] += this.particles[i][2];
      this.particles[i][1] += this.particles[i][3];
    }
  }

  private updateParticles(): void {
    for (let i = 0; i < this.numOfParticles; i++) {
      // calculate rules
      let v1 = this.rule1(i);
      let v2 = this.rule2(i);
      let v3 = this.rule3(i);
      let v4 = this.rule4(i);

      // update single boid velocity:
      this.particles[i][2] += v1[0] + v2[0] + v3[0] + v4[0];
      this.particles[i][3] += v1[1] + v2[1] + v3[1] + v4[1];
    }

    this.updateParticlePositions();
  }

  private rule1(index: number): number[] {
    let vX = (this.particlesCenterOfMass[0] - this.particles[index][0]) * this.rule1Weight;
    let vY = (this.particlesCenterOfMass[1] - this.particles[index][1]) * this.rule1Weight;
    return [vX, vY];
  }

  private rule2(index: number): number[] {
    let vX = 0;
    let vY = 0;

    for (let otherBoidIndex = 0; otherBoidIndex < this.numOfParticles; otherBoidIndex++) {
      if (otherBoidIndex !== index) {
        let dX = this.particles[otherBoidIndex][0] - this.particles[index][0];
        let dY = this.particles[otherBoidIndex][1] - this.particles[index][1];
        let distanceFromOtherParticle = Math.sqrt(Math.pow(dX, 2) + Math.pow(dY, 2));
        if (distanceFromOtherParticle < this.rule2Distance) {

          vX -= dX;
          vY -= dY;
        }
      }
    }
    vX *= this.rule2Weight;
    vY *= this.rule2Weight;
    return [vX, vY];
  }

  private rule3(index: number): number[] {
    // OLD RULE 3: Matches velocity with velocity of entire flock:
    //let vX = (this.particlesCenterDirection[0] - this.particles[index][2]) * this.rule3Weight;
    //let vY = (this.particlesCenterDirection[1] - this.particles[index][3]) * this.rule3Weight;
    //return [vX, vY];


    // NEW RULE 3: Matches velocity with velocity of near boids (at max distance rule3Distance):
    let vX = 0;
    let vY = 0;
    let indexArray: number[] =  [];
    for (let otherBoidIndex = 0; otherBoidIndex < this.numOfParticles; otherBoidIndex++) {
      if (otherBoidIndex !== index) {
        let dX = this.particles[otherBoidIndex][0] - this.particles[index][0];
        let dY = this.particles[otherBoidIndex][1] - this.particles[index][1];
        let distanceFromOtherParticle = Math.sqrt(Math.pow(dX, 2) + Math.pow(dY, 2));
        if (distanceFromOtherParticle < this.rule3Distance) {
          indexArray.push(otherBoidIndex);
        }
      }
    }

    for(let i =0; i<indexArray.length;i++){
      vX+=this.particles[indexArray[i]][2];
      vY+=this.particles[indexArray[i]][3];
    }
    vX *= this.rule3Weight;
    vY *= this.rule3Weight;
    return [vX, vY];
  }

  // Single boid will tend to not fly out of the screen
  private rule4(index: number): number[] {
    let vX = 0;
    let vY = 0;

    // X-dimension:
    if (this.particles[index][0] < this.boundaryPadding) {
      vX = 10;
    }
    else if (this.particles[index][0] > this.screenWidth - this.boundaryPadding) {
      vX = -10;
    }
    // Y-dimension:
    if (this.particles[index][1] < this.boundaryPadding) {
      vY = 10;
    }
    else if (this.particles[index][1] > this.screenHeight - this.boundaryPadding) {
      vY = -10;
    }

    vX = vX * this.rule4Weight;
    vY = vY * this.rule4Weight;

    return [vX, vY];
  }
}
