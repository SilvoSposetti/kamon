export class ToDo {

  private dateGenerated: Date;
  private text: string;
  private completed: boolean;

  constructor(text: string) {
    this.dateGenerated = new Date();
    this.text = text;
    this.completed = false;
  }

  public setText(newText: string): void {
    this.text = newText;
  }

  public getText(): string {
    return this.text;
  }

  public getGeneratedDate(): Date {
    return this.dateGenerated;
  }

  public swapCompletion(): void {
    this.completed = !this.completed;
  }

  public getCompleted(): boolean {
    return this.completed;
  }

}
