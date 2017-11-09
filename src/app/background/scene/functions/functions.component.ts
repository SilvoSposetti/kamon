import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';


@Component({
  selector: 'app-functions',
  templateUrl: './functions.component.html',
  styleUrls: ['./functions.component.css']
})
export class FunctionsComponent implements OnInit {


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

  private functionValues: number[][];
  // [t, xPos, yPos, previousXPos, previousYPos]
  private numOfFunctions: number = 4;

  private tForward: number[] = [0.01, 0.2, 0.04, 0.1];
  private startingT: number[] = [0, 1, 2, 3];

  //private loops: number[] = [];


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

    // Update data
    this.update();

    // Paint current frame
    let ctx: CanvasRenderingContext2D = this.canvasRef.nativeElement.getContext('2d');

    ctx.fillStyle = 'rgba(0,0,0,0.005)';
    ctx.fillRect(0, 0, this.screenWidth, this.screenHeight);

    for (let i = 0; i < this.numOfFunctions; i++) {

      ctx.strokeStyle = '#dddddd';
      ctx.lineWidth = 2;
      ctx.beginPath();
      // draw line from previousPos to newPos
      ctx.moveTo(this.functionValues[i][3], this.functionValues[i][4]);
      ctx.lineTo(this.functionValues[i][1], this.functionValues[i][2]);
      ctx.closePath();
      ctx.stroke();


    }


    // Schedule next
    requestAnimationFrame(() => this.paint());
  }

  private setup(): void {
    this.functionValues = [];
    for (let i = 0; i < this.numOfFunctions; i++) {
      this.functionValues.push([this.startingT[i]]);
      let startValues = this.functions(i);
      this.functionValues[i] = [this.startingT[i], startValues[0], startValues[1], startValues[0], startValues[1]];
    }
  }

  private update(): void {
    for (let i = 0; i < this.numOfFunctions; ++i) {
      this.functionValues[i][3] = this.functionValues[i][1];
      this.functionValues[i][4] = this.functionValues[i][2];
      let newCoordinates = this.functions(i);
      this.functionValues[i][1] = newCoordinates[0];
      this.functionValues[i][2] = newCoordinates[1];
      this.functionValues[i][0] = this.functionValues[i][0] + this.tForward[i];
    }
  }

  private functions(functionNumber: number): number[] {
    switch (functionNumber) {
      case 0:
        return this.function0(functionNumber);
      case 1:
        return this.function1(functionNumber);
      case 2:
        return this.function2(functionNumber);
      case 3:
        return this.function3(functionNumber);
    }
  }

  // Cardioid
  private function0(functionNumber: number): number[] {
    let t = this.functionValues[functionNumber][0];
    let a = 10;
    let x = 2 * a * (1 - Math.cos(t)) * Math.cos(t);
    let y = 2 * a * (1 - Math.cos(t)) * Math.sin(t);
    return [x + this.screenWidth / 2, y + this.screenHeight / 2];
  }

  // Fermat's Spiral
  private function1(functionNumber: number): number[] {
    let t = this.functionValues[functionNumber][0];
    let a = 1;
    let r = Math.sqrt(Math.pow(a, 2) * t);
    let x = r * Math.cos(t);
    let y = r * Math.sin(t);
    return [x + this.screenWidth / 2, y + this.screenHeight / 2];
    //return [0,0];
  }

  //Epicycloid
  private function2(functionNumber: number): number[] {
    let t = this.functionValues[functionNumber][0];
    let k = 10 / 19;
    //let r = this.screenHeight/4;
    let r = this.screenHeight / 2;
    let x = r * (k + 1) * Math.cos(t) - r * Math.cos((k + 1) * t);
    let y = r * (k + 1) * Math.sin(t) - r * Math.sin((k + 1) * t);
    return [x + this.screenWidth / 2, y + this.screenHeight / 2];
  }

  // Spiral
  private function3(functionNumber: number): number[] {
    let t = this.functionValues[functionNumber][0];
    if (t >= 8 * Math.PI) {
      this.functionValues[functionNumber]=[0,this.screenWidth/2,this.screenHeight/2,this.screenWidth/2,this.screenHeight/2];
      return [this.screenWidth/2, this.screenHeight/2];
    }
    let phi = (1 + Math.sqrt(5)) / 2;
    let r = Math.pow(phi, t / Math.PI);

    let x = r * Math.cos(t);
    let y = r * Math.sin(t);
    return [x + this.screenWidth / 2, y + this.screenHeight / 2];
  }
}

