import {Component, OnDestroy, OnInit} from '@angular/core';
import {ToDoService} from '../../shared/services/to-do.service';
import {Subscription} from 'rxjs/Subscription';
import {ToDo} from '../../shared/models/ToDo';

@Component({
  selector: 'app-to-do',
  templateUrl: './to-do.component.html',
  styleUrls: ['./to-do.component.css']
})
export class ToDoComponent implements OnInit, OnDestroy {

  private toDoSubscription: Subscription;
  public toDoList: ToDo[] = [];
  public editingElement: number = -1;
  public editingElementText: string = '';

  constructor(private toDoService: ToDoService) {
  }

  ngOnInit() {
    this.getToDos();
  }

  ngOnDestroy() {
    this.toDoSubscription.unsubscribe();
  }

  private getToDos(): void {
    this.toDoSubscription = this.toDoService.getToDos().subscribe(value => {
      this.toDoList = value;
    });
  }

  public editToDo(index: number): void{
    if(this.editingElement !== index){ // Element wasn't edited before
      this.editingElement = index;
      this.editingElementText = this.toDoList[index].getText();
    }
    else { // Need to save the content into the element
      this.toDoService.updateToDo(this.editingElementText,index);
      this.editingElement = -1;
      this.editingElementText = '';
    }
  }

  public deleteToDo(index: number): void {
    this.toDoService.deleteToDo(index);
    this.resetEdit();
  }


  public completeToDo(index: number): void {
    this.toDoService.swapCompletion(index);
  }

  public addToDo(position: number){
    // 0 at the beginning, 1 at the end.
    this.toDoService.addToDo(new ToDo(''),position );
  }

  private resetEdit():void{
    this.editingElement = -1;
  }

  public editingElementChanged(index: number): void{
  }


  //public moveToDoUp(index: number): void {
  //  console.log('moveUp' + index);
  //}
  //
  //public moveToDoDown(index: number): void {
  //  console.log('moveDown' + index);
  //}
}
