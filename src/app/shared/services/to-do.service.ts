import {Injectable} from '@angular/core';
import {ToDo} from '../models/ToDo';
import {Subject} from 'rxjs/Subject';
import {Observable} from 'rxjs/Observable';

@Injectable()
export class ToDoService {

  constructor() {
    this.dummyToDos();

  }

  private toDoList: ToDo[] = [];
  private toDoListSubject = new Subject<ToDo[]>();

  public dummyToDos(): void {
    for (let i = 0; i < 4; i++) {
      this.toDoList.push(new ToDo('toDo as  f oiwe  osioi oia oipoaspom oas j fkasj lkasd  fow we jf  ' + i));
    }
    this.toDoList[1].swapCompletion();
  }

  public getToDos(): Observable<ToDo[]> {
    this.wakeToDos();
    return this.toDoListSubject.asObservable();
  }

  public addToDo(newToDo: ToDo, position: number): void {
    if (position>=0 && position < this.toDoList.length){
      this.toDoList.splice(position, 0, newToDo);
    }
    else {
      this.toDoList.push(newToDo);
    }
    this.updateTodoList();
  }

  public updateToDo(newText: string, index: number){
    this.toDoList[index].setText(newText);
  }

  public deleteToDo(index: number): void {
    this.toDoList.splice(index, 1);
  }


  private updateTodoList(): void {
    this.toDoListSubject.next(this.toDoList);
  }

  public swapCompletion(index : number): void {
    this.toDoList[index].swapCompletion();
    this.updateTodoList();
  }

  private wakeToDos(): void {
    setTimeout(() => { // Need to wait 1msec probably because Subjects are not ready before execution of updateToDos()
      this.updateTodoList();
    }, 1);
  }
}
