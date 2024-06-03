import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Question } from '../components/form-builder/form-builder.type';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  private questionsSource = new BehaviorSubject<Question[]>([]);
  currentQuestions = this.questionsSource.asObservable();

  constructor() { }

  changeQuestions(questions: Question[]) {
    this.questionsSource.next(questions);
  }
}