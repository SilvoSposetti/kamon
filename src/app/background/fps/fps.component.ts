import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {FpsService} from '../../shared/services/fps.service';
import {Subject} from 'rxjs/Subject';

@Component({
  selector: 'app-fps',
  templateUrl: './fps.component.html',
  styleUrls: ['./fps.component.css']
})
export class FpsComponent implements OnInit {
  @ViewChild('fpsCanvas') canvasRef: ElementRef;

  private screenWidth: number = 200;
  private screenHeight: number = 150;

  private ngUnsubscribe: Subject<any> = new Subject<any>();
  private fpsValues: number[] = [0, 0];


  private graphValues: number[] = [];
  private amountOfGraphValues: number = 30;
  private stepSize: number;
  private valuesCount: number = 0;
  private graphMin: number;
  private graphMax: number;
  private graphIntervalMax: number = 100;
  private graphIntervalMin: number = 0;


  constructor(private fpsService: FpsService) {
  }

  ngOnInit() {

    // Screen height and width must be the same as in the HTML and css file.
    this.screenWidth = this.canvasRef.nativeElement.width;
    this.screenHeight = this.canvasRef.nativeElement.height;

    this.stepSize = this.screenHeight / (this.graphIntervalMax - this.graphIntervalMin);

    for (let i = 0; i < this.amountOfGraphValues; i++) {
      this.graphValues.push(-1);
    }

    this.getFPSData();

  }

  private getFPSData(): void {
    this.fpsService.getFps().takeUntil(this.ngUnsubscribe).subscribe(value => {
      this.fpsValues = value;


      if (this.fpsValues[0] === 0) {
        this.valuesCount = 0;
        for (let i = 0; i < this.amountOfGraphValues; i++) {
          this.graphValues[i] = -1;
        }
      }
      this.valuesCount++;

      // Find max and min:
      this.graphMax = 0;
      this.graphMin = 200;
      for(let i = 0; i < this.amountOfGraphValues; i++){
        if(this.graphValues[i] !== -1 && this.graphValues[i] !== 0){
          if(this.graphMax < this.graphValues[i]){
            this.graphMax = this.graphValues[i];
          }
          if(this.graphMin > this.graphValues[i]){
            this.graphMin = this.graphValues[i];
          }
        }
      }

      this.graphValues.shift();
      this.graphValues.push(this.fpsValues[0]);
      this.paintFPSCanvas();
    });
  }


  private paintFPSCanvas(): void {
    let ctx: CanvasRenderingContext2D = this.canvasRef.nativeElement.getContext('2d');

    // Clear the canvas:
    ctx.clearRect(0, 0, this.screenWidth, this.screenHeight);
    ctx.fill();

    // Draw average:
    let averageY = this.getYCoordinate(this.fpsValues[1]);
    ctx.strokeStyle = '#0000ff';
    ctx.beginPath();
    ctx.moveTo(0, averageY);
    ctx.lineTo(this.screenWidth, averageY);
    ctx.closePath();
    ctx.stroke();

    // Draw min:
    let minY = this.getYCoordinate(this.graphMin);
    ctx.strokeStyle = '#ff0000';
    ctx.beginPath();
    ctx.moveTo(0, minY);
    ctx.lineTo(this.screenWidth, minY);
    ctx.closePath();
    ctx.stroke();

    // Draw max:
    let maxY = this.getYCoordinate(this.graphMax);
    ctx.strokeStyle = '#00ff00';
    ctx.beginPath();
    ctx.moveTo(0, maxY);
    ctx.lineTo(this.screenWidth, maxY);
    ctx.closePath();
    ctx.stroke();

    // Draw graph:
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1.5;
    ctx.moveTo(this.screenWidth, this.getYCoordinate(this.graphValues[this.graphValues.length - 1]));
    ctx.beginPath();

    for (let i = this.amountOfGraphValues - 1; i >= 0; i--) {
      if (this.graphValues[i] !== -1) {
        let x = this.getXCoordinate(i);
        let y = this.getYCoordinate(this.graphValues[i]);
        ctx.lineTo(x, y);
        ctx.moveTo(x, y);
      }
    }
    ctx.closePath();
    ctx.stroke();
  }

  private getXCoordinate(index: number): number {
    return (this.screenWidth / this.graphValues.length) * (index + 1);
  }

  private getYCoordinate(value: number): number {
    return this.screenHeight - this.stepSize * value;

  }

}
