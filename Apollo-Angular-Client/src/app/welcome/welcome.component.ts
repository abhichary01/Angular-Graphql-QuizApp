import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

@Component({
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss'],
})
export class WelcomeComponent implements OnInit {
  // this will allow access to html element within 
  // same or child componenta
  @ViewChild('name') nameKey!: ElementRef;
  @ViewChild('email') emailKey!: ElementRef;
  constructor() {}

  ngOnInit(): void {}

  // Function to start the quiz when user enters his email and
  // name it will store in local storage so to accces it later in API
  startQuiz() {
    localStorage.setItem('name', this.nameKey.nativeElement.value);
    localStorage.setItem('email', this.emailKey.nativeElement.value);
  }
}
