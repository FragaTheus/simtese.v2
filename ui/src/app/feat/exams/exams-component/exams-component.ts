import { Component } from '@angular/core';
import { CreateExamComponent } from '../create-exam-component/create-exam-component';

@Component({
  selector: 'app-exams-component',
  imports: [CreateExamComponent],
  templateUrl: './exams-component.html',
})
export class ExamsComponent {}
