import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [FormsModule, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
newTodo = '';
  todos: { id: number; task: string; done: boolean }[] = [];
  isEdit = false;
  editId: number | null = null;
  private url = 'http://localhost:9090/';

  constructor(private http: HttpClient) {
    this.getTodos();
  }

  getTodos() {
  this.http.get<{ id: number; task: string; done: boolean }[]>(`${this.url}/getTodos`)
    .subscribe(res => {
      this.todos = res;
    });
}

// ✅ Add new todo
onSubmit() {
  if (this.newTodo.trim()) {
    if (this.isEdit && this.editId !== null) {
      const updated = {
        task: this.newTodo,
        done: this.todos.find(t => t.id === this.editId)?.done || false
      };

      this.http.put(`${this.url}/${this.editId}`, updated).subscribe(() => {
        this.getTodos();
        this.resetForm();
      });

    } else {
      const newItem = { task: this.newTodo, done: false };
      this.http.post(`${this.url}/addTodo`, newItem).subscribe(() => {
        this.getTodos();
        this.newTodo = '';
      });
    }
  }
}
  toggleDone(id: number) {
    const todo = this.todos.find(t => t.id === id);
    if (todo) {
      const updated = { task: todo.task, done: !todo.done };
      this.http.put(`${this.url}/${id}`, updated).subscribe(() => {
        this.getTodos();
      });
    }
  }

  onCheckboxChange(id: number, event: Event) {
    const checked = (event.target as HTMLInputElement).checked;
    const todo = this.todos.find(t => t.id === id);
    if (todo) {
      const updated = { task: todo.task, done: checked };
      this.http.put(`${this.url}/${id}`, updated).subscribe(() => {
        this.getTodos();
      });
    }
  }

  deleteTodo(id: number) {
    this.http.delete(`${this.url}/${id}`).subscribe(() => {
      this.getTodos();
    });
  }

  deleteAll() {
    this.http.delete(this.url).subscribe(() => {
      this.todos = [];
    });
  }

  editTodo(id: number) {
    const todo = this.todos.find(t => t.id === id);
    if (todo) {
      this.newTodo = todo.task;
      this.isEdit = true;
      this.editId = id;
    }
  }

  resetForm() {
    this.newTodo = '';
    this.isEdit = false;
    this.editId = null;
  }

  exitApp() {
    alert('Exit requested (cannot close tab from script).');
  }

  // ngOnInit() {
  //   window.addEventListener('beforeunload', (event) => {
  //     this.exitApp();
  //     event.preventDefault();
  //     event.returnValue = '';
  //   });
  // }
  // ngOnDestroy() {
  //   window.removeEventListener('beforeunload', this.exitApp);
  // }   
}
