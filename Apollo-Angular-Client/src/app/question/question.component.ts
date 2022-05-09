import { Component, OnInit } from '@angular/core';
import { Apollo} from 'apollo-angular';
import { gql } from 'apollo-angular';
import { interval, Observable } from 'rxjs';


// Graphql Schema to fetch questions API
const Get_Questions = gql`
query{
  questions {
    question
    options {
      answer
      correct
    }
    
  }
}
`;

// Graphql Schema to update user details API
const Update_Score = gql`
mutation ($name: String,$email: String,$points: Int){
  createUser(userInput:{name: $name, email: $email, points: $points}){
    _id
    name
    email
    points
  }
}

`

@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.scss'],
})
export class QuestionComponent implements OnInit {
  public name: string = '';
  public email: string = '';
  public questionList: any = [];
  public currentQuestion: number = 0;
  public points: number = 0;
  counter = 10;
  correctAnswer: number = 0;
  incorrectAnswer: number = 0;
  unattendedAnswer: number = 0;
  interval$: any;
  progress: string = '0';
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
      alert(JSON.stringify(this.questionList))
      console.log(this.questionList)
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

  // restart quiz
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
