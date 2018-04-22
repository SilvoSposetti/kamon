import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {FpsService} from '../../../shared/services/fps.service';
import {Subject} from 'rxjs/Subject';
import {ColorService} from '../../../shared/services/color.service';

@Component({
  selector: 'app-boids',
  templateUrl: './boids.component.html',
  styleUrls: ['./boids.component.css']
})
export class BoidsComponent implements OnInit {
  @ViewChild('myCanvas') canvasRef: ElementRef;
  @Input() screenWidth: number;
  @Input() screenHeight: number;
  @Input() showFPS: boolean;

  private ngUnsubscribe: Subject<any> = new Subject<any>();
  private fpsValues: number[] = [0, 0];

  private running: boolean;
  private gradient1: CanvasGradient;
  private gradient2: CanvasGradient;

  private numOfBoids: number = 600;
  private boids: number[][] = [];
  // [posX, posY, vX,vY]
  private boidsCenterOfMass: number [] = [];


  //PREDATORS:
  private numOfPredators: number = 4;
  private predators: number[][] = [];
  // [posX, posY, vX, vY, boost]

  private predatorsMaxSpeed: number = 3;
  private predatorsMaxBoost: number = 6;
  private predatorsBoostTime: number = 30;
  private predatorsBoostCoolDown: number = 300;
  private predatorsLength: number = 30;

  private predatorsRule1Weight: number = 0.1;
  private predatorsRule2Weight: number = 0.005;
  private predatorsRule2Distance: number = 130;

  // BOIDS:
  private boidsLength: number = -10; // Negative if the line should be drawn "behind" the boid
  private maxSpeed: number = 5;

  private boidsRule1Weight: number = 0.0005;

  private boidsRule2Distance: number = 50;
  private boidsRule2ExtremeDistance: number = 15;
  private boidsRule2Weight: number = 0.05;

  private boidsRule3Weight: number = 0.007;
  private boidsRule3Distance: number = 60;

  private boundaryPadding: number = 100;
  private boidsRule4Weight: number = 0.04;

  private boidsRule5Weight: number = 2;
  private boidsRule5Distance: number = 100;
  private boidsRule5ExtremeDistance: number = 10;


  constructor(private fpsService: FpsService, private colorService: ColorService) {
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

    ctx.fillStyle = this.gradient1;
    ctx.fillRect(0, 0, this.screenWidth, this.screenHeight);

    // ***** DRAW BOIDS *****
    for (let i = 0; i < this.numOfBoids; i++) {
      ctx.strokeStyle = this.gradient2;
      let angle = Math.atan(this.boids[i][3] / this.boids[i][2]);
      if (this.boids[i][2] < 0) {
        angle = angle + Math.PI;
      }

      let tipX = this.boidsLength * Math.cos(angle);
      let tipY = this.boidsLength * Math.sin(angle);

      ctx.beginPath();
      ctx.moveTo(this.boids[i][0], this.boids[i][1]);
      ctx.lineTo(this.boids[i][0] + tipX, this.boids[i][1] + tipY);
      ctx.lineWidth = 2;
      ctx.stroke();
    }

    // ***** DRAW PREDATORS *****

    for (let i = 0; i < this.numOfPredators; i++) {
      let angle = Math.atan(this.predators[i][3] / this.predators[i][2]);
      if (this.predators[i][2] < 0) {
        angle = angle + Math.PI;
      }

      let tipX = this.predatorsLength * Math.cos(angle);
      let tipY = this.predatorsLength * Math.sin(angle);
      let angleLeft = angle - Math.PI / 4;
      let leftX = 0.3 * this.predatorsLength * Math.cos(angleLeft);
      let leftY = 0.3 * this.predatorsLength * Math.sin(angleLeft);
      let angleRight = angle + Math.PI / 4;
      let rightX = 0.3 * this.predatorsLength * Math.cos(angleRight);
      let rightY = 0.3 * this.predatorsLength * Math.sin(angleRight);

      ctx.fillStyle = this.gradient2;
      ctx.beginPath();
      ctx.moveTo(this.predators[i][0] + tipX, this.predators[i][1] + tipY);
      ctx.lineTo(this.predators[i][0] + leftX, this.predators[i][1] + leftY);
      ctx.lineTo(this.predators[i][0] + rightX, this.predators[i][1] + rightY);
      ctx.lineWidth = 2;
      ctx.fill();
      //ctx.stroke();

      //ctx.beginPath();
      //ctx.moveTo(this.predators[i][0], this.predators[i][1]);
      //ctx.lineTo(this.predators[i][0] + tipX, this.predators[i][1] + tipY);
      //ctx.lineWidth = 4;
      //ctx.stroke();
    }
    this.updateParticles();    // Schedule next
    requestAnimationFrame(() => this.paint());
  }

  /*********************************************************************************************************************
   * SETUP.
   ********************************************************************************************************************/


  private setup(): void {
    let ctx: CanvasRenderingContext2D = this.canvasRef.nativeElement.getContext('2d');
    this.gradient1 = ctx.createLinearGradient(0, 0, this.screenWidth, this.screenHeight);
    this.gradient1.addColorStop(0, this.colorService.getBackgroundFirstStopRGBA(0.9));
    this.gradient1.addColorStop(1, this.colorService.getBackgroundSecondStopRGBA(0.9));

    this.gradient2 = ctx.createLinearGradient(0, 0, this.screenWidth, this.screenHeight);
    this.gradient2.addColorStop(0, this.colorService.getForegroundFirstStopHEX());
    this.gradient2.addColorStop(1, this.colorService.getForegroundSecondStopHEX());


    for (let i = 0; i < this.numOfBoids; i++) {
      let angle = Math.random() * Math.PI * 2;
      let radius = Math.random() * this.screenWidth / 6 + this.screenWidth / 6;
      let posX = (this.screenWidth / 2) + Math.cos(angle) * radius;
      let posY = (this.screenHeight / 2) + Math.sin(angle) * radius;
      let vX = Math.random() * this.maxSpeed * Math.cos(angle);
      let vY = Math.random() * this.maxSpeed * Math.sin(angle);
      this.boids.push([posX, posY, vX, vY]);
    }
    this.updateCenterOfMass();

    for (let i = 0; i < this.numOfPredators; i++) {
      let posX = (this.screenWidth) * Math.random();
      let posY = (this.screenHeight) * Math.random();
      let startAngle = Math.random() * Math.PI * 2;
      let vX = this.predatorsMaxSpeed * Math.cos(startAngle);
      let vY = this.predatorsMaxSpeed * Math.sin(startAngle);
      this.predators.push([posX, posY, vX, vY, 0]);
      // A predator will not boost if it's [4] value is less than 0.
    }
  }

  /*********************************************************************************************************************
   * HELPER FUNCTIONS.
   ********************************************************************************************************************/

  private updateCenterOfMass(): void {
    let centerX = 0;
    let centerY = 0;
    for (let i = 0; i < this.numOfBoids; i++) {
      centerX += this.boids[i][0];
      centerY += this.boids[i][1];
    }
    centerX /= this.numOfBoids;
    centerY /= this.numOfBoids;
    this.boidsCenterOfMass = [centerX, centerY];
  }

  private updateParticlePositions(): void {
    for (let i = 0; i < this.numOfBoids; i++) {

      // Speed-check:
      let speedValue = Math.sqrt(Math.pow(this.boids[i][2], 2) + Math.pow(this.boids[i][3], 2));
      if (speedValue === 0) {
        speedValue = 0.01;
      }
      this.boids[i][2] *= this.maxSpeed / speedValue;
      this.boids[i][3] *= this.maxSpeed / speedValue;

      this.boids[i][0] += this.boids[i][2];
      this.boids[i][1] += this.boids[i][3];
    }


    for (let i = 0; i < this.numOfPredators; i++) {
      // Speed-check:
      let speedValue = Math.sqrt(Math.pow(this.predators[i][2], 2) + Math.pow(this.predators[i][3], 2));
      if (speedValue === 0) {
        speedValue = 0.01;
      }

      if (this.predators[i][4] > 1) {
        this.predators[i][2] *= this.predatorsMaxBoost / speedValue;
        this.predators[i][3] *= this.predatorsMaxBoost / speedValue;
        this.predators[i][4]--;
      }
      else if (this.predators[i][4] === 1) {
        this.predators[i][2] *= this.predatorsMaxSpeed / speedValue;
        this.predators[i][3] *= this.predatorsMaxSpeed / speedValue;
        this.predators[i][4] = -this.predatorsBoostCoolDown;
      }
      else {
        this.predators[i][2] *= this.predatorsMaxSpeed / speedValue;
        this.predators[i][3] *= this.predatorsMaxSpeed / speedValue;
        this.predators[i][4]++;
      }

      this.predators[i][0] += this.predators[i][2];
      this.predators[i][1] += this.predators[i][3];
    }
  }

  /*********************************************************************************************************************
   * UPDATE:
   ********************************************************************************************************************/

  private updateParticles(): void {
    for (let i = 0; i < this.numOfBoids; i++) {
      // calculate boids rules
      let v1 = this.boidRule1(i);
      let v2 = this.boidRule2(i);
      let v3 = this.boidRule3(i);
      let v4 = this.boidRule4(i);
      let v5 = this.boidRule5(i);

      // update single boid velocity:
      this.boids[i][2] += v1[0] + v2[0] + v3[0] + v4[0] + v5[0];
      this.boids[i][3] += v1[1] + v2[1] + v3[1] + v4[1] + v5[1];
    }

    for (let i = 0; i < this.numOfPredators; i++) {
      // calculate predators rules
      let v1 = this.predatorRule1(i);
      let v2 = this.predatorRule2(i);

      // update single predator velocity
      this.predators[i][2] += v1[0] + v2[0];
      this.predators[i][3] += v1[1] + v2[1];
    }

    this.updateParticlePositions();
  }

  /*********************************************************************************************************************
   * BOIDS RULES.
   ********************************************************************************************************************/


  // Each boid will tend to go towards the center of the whole flock
  private boidRule1(index: number): number[] {
    let vX = (this.boidsCenterOfMass[0] - this.boids[index][0]) * this.boidsRule1Weight;
    let vY = (this.boidsCenterOfMass[1] - this.boids[index][1]) * this.boidsRule1Weight;
    return [vX, vY];
  }


  // Each boid will try to keep his distance from another boid.
  private boidRule2(index: number): number[] {
    let vX = 0;
    let vY = 0;

    for (let otherBoidIndex = 0; otherBoidIndex < this.numOfBoids; otherBoidIndex++) {
      if (otherBoidIndex !== index) {
        let dX = this.boids[otherBoidIndex][0] - this.boids[index][0];
        let dY = this.boids[otherBoidIndex][1] - this.boids[index][1];
        let distanceFromOtherParticle = Math.sqrt(Math.pow(dX, 2) + Math.pow(dY, 2));
        if (distanceFromOtherParticle < this.boidsRule2Distance) {

          if (distanceFromOtherParticle < this.boidsRule2ExtremeDistance) {
            distanceFromOtherParticle = 1;
          }
          vX -= dX / distanceFromOtherParticle;
          vY -= dY / distanceFromOtherParticle;
        }

      }
    }
    vX *= this.boidsRule2Weight;
    vY *= this.boidsRule2Weight;
    return [vX, vY];
  }

  // Each boids tries to match the direction of the boids surrounding it
  private boidRule3(index: number): number[] {
    // OLD RULE 3: Matches velocity with velocity of entire flock:
    //let vX = (this.boidsCenterDirection[0] - this.particles[index][2]) * this.boidsRule3Weight;
    //let vY = (this.boidsCenterDirection[1] - this.particles[index][3]) * this.boidsRule3Weight;
    //return [vX, vY];


    // NEW RULE 3: Matches velocity with velocity of surrounding boids (at max distance boidsRule3Distance):
    let vX = 0;
    let vY = 0;
    let indexArray: number[] = [];
    for (let otherBoidIndex = 0; otherBoidIndex < this.numOfBoids; otherBoidIndex++) {
      if (otherBoidIndex !== index) {
        let dX = this.boids[otherBoidIndex][0] - this.boids[index][0];
        let dY = this.boids[otherBoidIndex][1] - this.boids[index][1];
        let distanceFromOtherParticle = Math.sqrt(Math.pow(dX, 2) + Math.pow(dY, 2));
        if (distanceFromOtherParticle < this.boidsRule3Distance) {
          indexArray.push(otherBoidIndex);
        }
      }
    }

    for (let i = 0; i < indexArray.length; i++) {
      vX += this.boids[indexArray[i]][2];
      vY += this.boids[indexArray[i]][3];
    }
    vX *= this.boidsRule3Weight;
    vY *= this.boidsRule3Weight;
    return [vX, vY];
  }

  // Single boid will tend to not fly out of the screen
  private boidRule4(index: number): number[] {
    let vX = 0;
    let vY = 0;

    // X-dimension:
    if (this.boids[index][0] < this.boundaryPadding) {
      vX = 10;
    }
    else if (this.boids[index][0] > this.screenWidth - this.boundaryPadding) {
      vX = -10;
    }
    // Y-dimension:
    if (this.boids[index][1] < this.boundaryPadding) {
      vY = 10;
    }
    else if (this.boids[index][1] > this.screenHeight - this.boundaryPadding) {
      vY = -10;
    }

    vX = vX * this.boidsRule4Weight;
    vY = vY * this.boidsRule4Weight;

    return [vX, vY];
  }

  // Single boid will tend to fly away from a predator
  private boidRule5(index: number): number[] {
    let predatorAverageY = 0;
    let predatorAverageX = 0;

    let indexArray: number[] = [];
    for (let predatorIndex = 0; predatorIndex < this.numOfPredators; predatorIndex++) {
      let dX = this.predators[predatorIndex][0] - this.boids[index][0];
      let dY = this.predators[predatorIndex][1] - this.boids[index][1];
      let distanceFromPredator = Math.sqrt(Math.pow(dX, 2) + Math.pow(dY, 2));
      if (distanceFromPredator < this.boidsRule5Distance) {
        indexArray.push(predatorIndex);
      }
    }
    for (let i = 0; i < indexArray.length; i++) {
      predatorAverageX += this.predators[indexArray[i]][0];
      predatorAverageY += this.predators[indexArray[i]][1];
    }
    let vX = 0;
    let vY = 0;
    if (indexArray.length > 0) {
      predatorAverageX /= indexArray.length;
      predatorAverageY /= indexArray.length;
      let dX = predatorAverageX - this.boids[index][0];
      let dY = predatorAverageY - this.boids[index][1];
      let distance = Math.sqrt(Math.pow(dX, 2) + Math.pow(dY, 2));
      if (distance <= this.boidsRule5ExtremeDistance) {
        distance = 0.1;
      }
      vX -= dX / distance;
      vY -= dY / distance;

    }
    vX = vX * this.boidsRule5Weight;
    vY = vY * this.boidsRule5Weight;

    return [vX, vY];
  }



  /*********************************************************************************************************************
   * PREDATOR RULES.
   ********************************************************************************************************************/

  // Predators will tend to not fly off of the screen.
  private predatorRule1(index: number): number[] {
    let vX = 0;
    let vY = 0;

    // X-dimension:
    if (this.predators[index][0] < this.boundaryPadding) {
      vX = 10;
    }
    else if (this.predators[index][0] > this.screenWidth - this.boundaryPadding) {
      vX = -10;
    }
    // Y-dimension:
    if (this.predators[index][1] < this.boundaryPadding) {
      vY = 10;
    }
    else if (this.predators[index][1] > this.screenHeight - this.boundaryPadding) {
      vY = -10;
    }

    vX = vX * this.predatorsRule1Weight;
    vY = vY * this.predatorsRule1Weight;

    return [vX, vY];
  }

  // Predators will tend to catch boids that are near enough.
  private predatorRule2(index: number): number[] {
    let posX = 0;
    let posY = 0;

    let indexArray: number[] = [];
    for (let otherBoidIndex = 0; otherBoidIndex < this.numOfBoids; otherBoidIndex++) {
      if (otherBoidIndex !== index) {
        let dX = this.boids[otherBoidIndex][0] - this.predators[index][0];
        let dY = this.boids[otherBoidIndex][1] - this.predators[index][1];
        let distanceFromOtherParticle = Math.sqrt(Math.pow(dX, 2) + Math.pow(dY, 2));
        if (distanceFromOtherParticle < this.predatorsRule2Distance) {
          indexArray.push(otherBoidIndex);
        }
      }
    }
    for (let i = 0; i < indexArray.length; i++) {
      posX += this.boids[indexArray[i]][0];
      posY += this.boids[indexArray[i]][1];
    }
    let vX = 0;
    let vY = 0;
    if (indexArray.length > 0) {
      posX /= indexArray.length;
      posY /= indexArray.length;
      vX = posX - this.predators[index][0];
      vY = posY - this.predators[index][1];
      if (this.predators[index][4] === 0) {
        this.predators[index][4] = this.predatorsBoostTime;
      }
    }
    if (this.predators[index][4] < 1) {
      vX /= 2;
      vY /= 2;
    }


    return [vX * this.predatorsRule2Weight, vY * this.predatorsRule2Weight];
  }

}
