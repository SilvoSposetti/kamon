import {Component, ElementRef, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';

@Component({
  selector: 'app-start-scene',
  templateUrl: './start-scene.component.html',
  styleUrls: ['./start-scene.component.css']
})
export class StartSceneComponent implements OnInit, OnDestroy {
  @ViewChild('myCanvas') canvasRef: ElementRef;
  @Input() sceneWidth: number;
  @Input() sceneHeight: number;

  private running: boolean;

  private elements: number[][] = [];
  private nrOfElements= 100;
  private counter = 0;

  constructor() {
  }

  ngOnInit() {
    this.startFlock();
    this.running = true;
    this.paint();
  }

  ngOnDestroy() {
    this.running = false;
  }

  private paint(): void {
    // Check that we're still running.
    if (!this.running) {
      return;
    }

    // Paint current frame
    let ctx: CanvasRenderingContext2D =
      this.canvasRef.nativeElement.getContext('2d');

    //Draw background (which also effectively clears any previous drawing)
    //ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
    //ctx.fillRect(0, 0, this.sceneWidth, this.sceneHeight);

    this.updateFlock();

    for (let i = 0; i < this.nrOfElements; ++i) {
      ctx.beginPath();
      ctx.save();
      ctx.fillStyle = 'rgb(0,0,0)';
      ctx.fillRect(this.elements[i][0], this.elements[i][1], 1, 1);
      ctx.restore();

    }


    // Schedule next
    requestAnimationFrame(() => this.paint());
  }

  private startFlock(): void {
    for (let i = 0; i < this.nrOfElements; ++i) {
      let element: number[] = [];
      element.push(this.sceneWidth / 2);
      element.push(this.sceneHeight / 2);
      element.push(this.randomInt(0, 100));
        this.elements.push(element);
    }
  }

  private updateFlock(): void {
    for (let i = 0; i < this.nrOfElements; ++i) {
      this.elements[i][2] += Math.sin(0.001*this.counter);
      this.elements[i][0] += 3*Math.cos(this.elements[i][2]);
      this.elements[i][1] += 3*Math.sin(this.elements[i][2]);
      this.counter++;
    }
  }

  private randomInt(lowerBound: number, upperBound: number): number {
    return Math.floor(Math.random() * upperBound) + lowerBound;
  }
}

//ctx.beginPath();
//ctx.save();

//ctx.restore();

