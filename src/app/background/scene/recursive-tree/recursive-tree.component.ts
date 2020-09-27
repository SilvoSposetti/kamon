import {Component, Input} from '@angular/core';
import {Scene} from '../../../shared/models/Scene';
import {FpsService} from '../../../shared/services/fps.service';
import {ColorService} from '../../../shared/services/color.service';

@Component({
  selector: 'app-recursive-tree',
  templateUrl: './recursive-tree.component.html',
  styleUrls: ['./recursive-tree.component.css']
})
export class RecursiveTreeComponent extends Scene {
  @Input() screenWidth: number;
  @Input() screenHeight: number;
  @Input() showFPS: boolean;

  private time = 0;
  private timeIncrement = 0.001;

  private branchLength: number;
  private branchWidth: number;
  private branchAngle: number;
  private maxSteps: number;


  private lengthBase: number;
  private widthBase: number;
  private angleBase: number;
  private stepsBase: number;

  private lengthAmplitude: number;
  private widthAmplitude: number;
  private angleAmplitude: number;
  private stepsAmplitude: number;

  private lengthFrequency: number;
  private widthFrequency: number;
  private angleFrequency: number;
  private stepsFrequency: number;

  constructor(public fpsService: FpsService, public colorService: ColorService) {
    super(fpsService, colorService);
  }

  /*****************************************************************************************************************************************
   * SETUP */
  public setup(): void {
  }

  /*****************************************************************************************************************************************
   * UPDATE */
  public update(): void {
    this.fitScreen();
    this.branchWidth = this.widthBase + this.widthAmplitude * Math.sin(this.widthFrequency * this.time);
    this.branchLength = this.lengthBase + this.lengthAmplitude * Math.sin(this.lengthFrequency * this.time);
    this.branchAngle = this.angleBase + this.angleAmplitude * Math.sin(this.angleFrequency * this.time);
    this.maxSteps = this.stepsBase + this.stepsAmplitude * Math.sin(this.stepsFrequency * this.time);

    this.time += this.timeIncrement;
  }

  private fitScreen(): void {
    this.lengthBase = this.screenWidth / 15;
    this.widthBase = this.lengthBase / 20;
    this.angleBase = Math.PI / 7;
    this.stepsBase = 4;

    this.lengthAmplitude = this.lengthBase * 2 / 3;
    this.widthAmplitude = this.widthBase * 2 / 3;
    this.angleAmplitude = Math.PI / 15;
    this.stepsAmplitude = 3;

    this.lengthFrequency = 1;
    this.widthFrequency = 2;
    this.angleFrequency = 4;
    this.stepsFrequency = 2;
  }

  /*****************************************************************************************************************************************
   * DRAW */
  public draw(): void {
    this.drawLeftBackground();
    this.drawRightBackground();

    let ctx: CanvasRenderingContext2D = this.canvasRef.nativeElement.getContext('2d');
    let startPosition = [this.screenWidth / 2, this.screenHeight / 2];

    // Draw Left Tree:
    ctx.save();
    ctx.translate(startPosition[0], startPosition[1]);
    ctx.rotate(-Math.PI / 2);
    ctx.beginPath();
    this.drawTree(0, ctx);
    ctx.closePath();
    ctx.lineWidth = this.branchWidth;
    ctx.strokeStyle = this.sandGradient;
    ctx.stroke();
    ctx.restore();

    // Draw Right Tree:
    ctx.save();
    ctx.translate(startPosition[0], startPosition[1]);
    ctx.rotate(Math.PI / 2);
    ctx.beginPath();
    this.drawTree(0, ctx);
    ctx.closePath();
    ctx.lineWidth = this.branchWidth;
    ctx.strokeStyle = this.seaGradient;
    ctx.stroke();
    ctx.restore();
  }

  private drawTree(currentStep: number, ctx: CanvasRenderingContext2D): void {
    let length = this.getBranchLength(currentStep);
    let angle = this.getBranchAngle(currentStep);
    if (currentStep >= this.maxSteps) { // Am at a leaf of the tree and need to draw the tip of this branch.
      // ctx.fillStyle = 'white';
      // ctx.fillRect(-3, -3, 6, 6);
      return;
    } else { // Am at a non-leaf branch, which needs to be subdivided
      // Draw branch and move on top of it
      ctx.moveTo(0, 0);
      ctx.lineTo(0, -length);
      ctx.translate(0, -length);
      // Rotate already for the next right-child branch
      ctx.rotate(-angle);

      // Go on drawing the next left-child branch
      this.drawTree(currentStep + 1, ctx);

      // Rotate back for double the original angle for the left-child branch
      ctx.rotate(2 * angle);

      // Go on drawing the next right-child branch
      this.drawTree(currentStep + 1, ctx);

      // Rotate back and align with the branch of this step, then go back to the origin of this step
      ctx.rotate(-angle);
      ctx.translate(0, length);
    }

  }

  private drawLeftBackground(): void {
    let ctx: CanvasRenderingContext2D = this.canvasRef.nativeElement.getContext('2d');
    ctx.fillStyle = this.seaGradient;
    ctx.fillRect(0, 0, this.screenWidth / 2, this.screenHeight);
  }

  private drawRightBackground(): void {
    let ctx: CanvasRenderingContext2D = this.canvasRef.nativeElement.getContext('2d');
    ctx.fillStyle = this.sandGradient;
    ctx.fillRect(this.screenWidth / 2, 0, this.screenWidth / 2, this.screenHeight);
  }

  /*****************************************************************************************************************************************
   * OTHER */
  private getBranchLength(step: number): number {
    // return this.branchLength;
    return this.branchLength * (this.maxSteps - step) / this.maxSteps;
  }

  private getBranchAngle(step: number): number {
    // return this.branchAngle;
    return this.branchAngle * (this.maxSteps - step) / this.maxSteps;
  }
}
