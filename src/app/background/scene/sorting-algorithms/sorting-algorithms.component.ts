import {Component, Input} from '@angular/core';
import {FpsService} from '../../../shared/services/fps.service';
import {ColorService} from '../../../shared/services/color.service';
import {Scene} from '../../../shared/models/Scene';

@Component({
  selector: 'app-sorting-algorithms',
  templateUrl: './sorting-algorithms.component.html',
  styleUrls: ['./sorting-algorithms.component.css']
})
export class SortingAlgorithmsComponent extends Scene {
  @Input() screenWidth: number;
  @Input() screenHeight: number;
  @Input() showFPS: boolean;

  private lists: number[][] = [];
  // [Top, Bottom, Left, Right]
  private values: number[][] = [];
  private nrOfSortingAlgorithms = 4;
  private nrOfElementsPerSet = 300;
  private padding: number = 10;

  private framesPerStep: number = 3;

  private algorithmStep = [];
  private lineWidth: number;


  constructor(public fpsService: FpsService, public colorService: ColorService) {
    super(fpsService, colorService);
  }

  public setup(): void {
    this.lineWidth = Math.floor(((this.screenWidth - 4 * this.padding) / 2) / this.nrOfElementsPerSet);

    // [Top, Bottom, Left, Right]
    this.lists.push([this.padding, this.screenHeight / 2 - this.padding / 2, this.padding, this.screenWidth / 2 - this.padding]); // Top Left - Selection Sort
    this.lists.push([this.padding, this.screenHeight / 2 - this.padding / 2, this.screenWidth / 2 + this.padding, this.screenWidth - this.padding]); // Top Right - Bubble Sort
    this.lists.push([this.screenHeight / 2 + this.padding, this.screenHeight - this.padding, this.padding, this.screenWidth / 2 - this.padding]); // Bottom Left
    this.lists.push([this.screenHeight / 2 + this.padding, this.screenHeight - this.padding, this.screenWidth / 2 + this.padding, this.screenWidth - this.padding]); // Bottom Right

    for (let i = 0; i < this.nrOfSortingAlgorithms; ++i) {
      this.values.push([]);
      this.algorithmStep.push(0);
      this.generateNewData(i);
    }
  }

  public update(): void {

    if (this.frameCount % this.framesPerStep === 0) {
      this.oneStepSelectionSort();
      this.oneStepBubbleSort();
      this.oneStepInsertionSort();
      this.oneStepHeapSort();
    }
  }

  public draw(): void {


    let ctx: CanvasRenderingContext2D = this.canvasRef.nativeElement.getContext('2d');
    ctx.fillStyle = this.seaGradient;
    ctx.fillRect(0, 0, this.screenWidth, this.screenHeight);

    // List: [Top, Bottom, Left, Right]

    for (let i = 0; i < this.nrOfSortingAlgorithms; i++) {
      let height = this.lists[i][1] - this.lists[i][0];
      let width = this.lists[i][3] - this.lists[i][2];
      let spaceBetweenLines = width / this.nrOfElementsPerSet;
      for (let j = 0; j < this.nrOfElementsPerSet; j++) {
        let fromX = this.lists[i][2] + (j) * spaceBetweenLines + spaceBetweenLines / 2;
        let fromY = this.lists[i][1];
        let toX = fromX;
        let toY = this.lists[i][1] - height * this.values[i][j];
        // draw lines
        ctx.strokeStyle = this.sandGradient;
        ctx.lineWidth = this.lineWidth;
        ctx.beginPath();
        ctx.moveTo(fromX, fromY);
        ctx.lineTo(toX, toY);
        ctx.closePath();
        ctx.stroke();
      }
    }


  }


  private generateNewData(listIndex: number): void {
    this.values[listIndex] = [];
    for (let j = 0; j < this.nrOfElementsPerSet; ++j) {
      //this.values[listIndex].push(Math.random());
      this.values[listIndex].push(1 - (j + 1) / this.nrOfElementsPerSet);
      this.values[listIndex] = this.shuffle(this.values[listIndex]);
    }
  }

  private shuffle(array: number[]): number[] {
    // Fisher-Yates (aka Knuth) Shuffle:
    let currentIndex = array.length, temporaryValue, randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;

      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }

    return array;
  }

  private oneStepSelectionSort(): void {
    // first list of numbers! list[0]!
    let startIndex = this.algorithmStep[0];
    let indexOfSmallestElement;
    let smallestElement = 2; // a value which will always be replaced
    // Find smallest element
    for (let i = startIndex; i < this.nrOfElementsPerSet; i++) {
      if (this.values[0][i] < smallestElement) {
        smallestElement = this.values[0][i];
        indexOfSmallestElement = i;
      }
    }
    // Swap smallest element to begin
    let temp = this.values[0][startIndex];
    this.values[0][startIndex] = this.values[0][indexOfSmallestElement];
    this.values[0][indexOfSmallestElement] = temp;

    this.algorithmStep[0]++;

    // Finished sorting
    if (this.algorithmStep[0] >= this.nrOfElementsPerSet) {
      this.generateNewData(0);
      this.algorithmStep[0] = 0;
    }
  }

  private oneStepBubbleSort(): void {
    // second list of numbers! list[1]!
    for (let i = 0; i < this.nrOfElementsPerSet - 1; i++) {
      if (this.values[1][i] >= this.values[1][i + 1]) {
        let temp = this.values[1][i];
        this.values[1][i] = this.values[1][i + 1];
        this.values[1][i + 1] = temp;
      }
    }
    this.algorithmStep[1]++;

    // Finished sorting
    if (this.algorithmStep[1] >= this.nrOfElementsPerSet) {
      this.generateNewData(1);
      this.algorithmStep[1] = 0;
    }
  }

  private oneStepInsertionSort(): void {
    //third list of numbers! list[2]!
    let startIndex = this.algorithmStep[2] + 1; // This is the index before which the array is already sorted
    if (startIndex < this.nrOfElementsPerSet) {
      let valueToInsert = this.values[2][startIndex];
      let insertIndex = 0;
      for (let i = 0; i < startIndex; i++) {
        if (valueToInsert > this.values[2][i]) {
          insertIndex = i + 1;
        }
      }
      for (let i = startIndex; i > insertIndex; i--) {
        this.values[2][i] = this.values[2][i - 1];
      }
      this.values[2][insertIndex] = valueToInsert;

      this.algorithmStep[2]++;
    } else {
      this.generateNewData(2);
      this.algorithmStep[2] = 0;
    }
  }

  private oneStepHeapSort(): void {
    //fourth list of numbers! list[3]!
    // The array has a sorted part at the end.
    if (this.algorithmStep[3] === 0) { // this ensures array is heapifyed at the beginning.
      // Build heap:
      for (let i = Math.floor(this.nrOfElementsPerSet / 2); i >= 0; i--) {
        this.heapify(i);
      }
    }

    let lastElementInHeap = this.nrOfElementsPerSet - this.algorithmStep[3] - 1;
    // Swap first position of heap and position right before the sorted part.
    let temp = this.values[3][0];
    this.values[3][0] = this.values[3][lastElementInHeap];
    this.values[3][lastElementInHeap] = temp;

    this.algorithmStep[3]++;
    this.heapify(0);
    // Finished sorting
    if (this.algorithmStep[3] >= this.nrOfElementsPerSet) {
      this.generateNewData(3);
      this.algorithmStep[3] = 0;
    }
  }

  private heapify(index: number): void {
    let s = this.nrOfElementsPerSet - this.algorithmStep[3] - 1;
    let m = index;
    let l = this.leftChild(index);
    let r = this.rightChild(index);
    if (l <= s && this.values[3][l] > this.values[3][m]) {
      m = l;
    }
    if (r <= s && this.values[3][r] > this.values[3][m]) {
      m = r;
    }
    if (index !== m) {
      // Exchange element at index and element at m
      let temp = this.values[3][index];
      this.values[3][index] = this.values[3][m];
      this.values[3][m] = temp;
      this.heapify(m);
    }

  }

  private leftChild(index: number): number {
    return 2 * index;
  }

  private rightChild(index: number): number {
    return 2 * index + 1;
  }
}
