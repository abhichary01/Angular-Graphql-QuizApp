import { Component, OnInit } from '@angular/core';
import { Apollo} from 'apollo-angular';
import {Get_Questions, Update_Score} from '../graphql/schema'
import { interval } from 'rxjs';

@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.scss'],
})
export class QuestionComponent implements OnInit {
 // var name where user input name will be stored
 public name: string = '';
 // var name where user input email will be stored
 public email: string = '';
 // This values will stores all the questions coming from API
 public questionList: any = [];
 // this value will keep track on question number incrementiong +1
 // whenevr user procceds to next question
 public currentQuestion: number = 0;
 // this variables keep track of score with each question
 public points: number = 0;
 // Counter will add 10 secs for next question
 counter = 10;
 // keeps track of no of correct questions answered
 correctAnswer: number = 0;
 // keeps track of no of incorrect questions answered
 incorrectAnswer: number = 0;
 // keeps track of no of  questions unanswered
 unattendedAnswer: number = 0;
 // Observable to execute a block of code at specific intervals of time
 interval$: any;
 // Completion status of quiz
 progress: string = '0';
 // State of quiz whether over or not
 isQuizCompleted: boolean = false;

 constructor(private apollo: Apollo) {}

 ngOnInit(): void {
   this.name = localStorage.getItem('name')!;
   this.email = localStorage.getItem('email')!;
   this.getAllQuestions();
   this.startCounter();
 }

 // Function to get questions from DB with graphql query API
 getAllQuestions() {
   this.apollo.watchQuery({
     query: Get_Questions
   })
   .valueChanges.subscribe((results: any) => {
     console.log(results?.data?.questions)
     this.questionList = results?.data?.questions;
     return this.questionList
   });
 }

 // Function to update user details and score with Graphql mutation API

 createUser(name: string, email: string, points: number){
   this.apollo.mutate({
     mutation: Update_Score,
     variables:{
       name: this.name,
       email: this.email,
       points: this.points
     }
   })
   .subscribe(() => {
     console.log('created user and updated score')
     alert('Your score is Succesfully updated');
   });
 
 }catch (e: any) {
   console.error(e);
 }

 // Simple function to increase question count or number index from question list

 nextQuestion() {
   this.currentQuestion++;
 }

 // Simple function to decrease question count or number index from question list

 prevQuestion() {
   this.currentQuestion--;
 }

 // Function to validate correct amswer from the list of options

 answer(currentQno: number, option: any) {
   if (currentQno === this.questionList.length) {
    //  quiz will be copleted in current question is last question.
     this.isQuizCompleted = true;
     this.stopCounter();
   }
   // if choosen option is correct then user will get 10 points, no of correct answered questions will increase, user can access next question and timer will restart
   if (option.correct) {
     this.points += 10;
     this.correctAnswer++;
     setTimeout(() => {
       this.currentQuestion++;
       this.resetCounter();
       this.getProgressPercent();
     }, 1000);
     // else if choosen incorrect option then user will get deducted 10 points, no of incorrect answered questions will increase, user can access next question and timer will restart
   } else {
     setTimeout(() => {
       this.currentQuestion++;
       this.resetCounter();
       this.incorrectAnswer++;
       this.getProgressPercent();
     }, 1000);
     this.points -= 10;
   }
 }

 // Start counter for interval of 1000ms or 10 secs
 startCounter() {
   this.interval$ = interval(1000).subscribe(() => {
     this.counter--;

     // If counter runs to 0 then time to answer current question is over and it goes into unanswer state
     if (this.counter === 0) {
       this.currentQuestion++;
       this.unattendedAnswer++;
       this.counter = 10;
       this.getProgressPercent();
     }
   });
   // Timer will stop counting at 50000 ms or 50secs from start time 
   setTimeout(() => {
     this.interval$.unsubscribe();
   }, 50000);
 }

 // this will stop listening to counter
 stopCounter() {
   this.interval$.unsubscribe();
   this.counter = 0;
 }

 // this will begin counter from beginning for fresh start quiz
 resetCounter() {
   this.stopCounter();
   this.counter = 10;
   this.startCounter();
 }

 // restart quiz resets all the below parameters to respective value
 resetQuiz() {
   this.resetCounter();
   this.getAllQuestions();
   this.points = 0;
   this.counter = 10;
   this.currentQuestion = 0;
   this.progress = '0';
 }
 
 // Completion percent of quiz shown with visual indicator
 getProgressPercent() {
   this.progress = ((this.currentQuestion / this.questionList.length) * 100)
     .toFixed(0)
     .toString();

   return this.progress;
 }
}
