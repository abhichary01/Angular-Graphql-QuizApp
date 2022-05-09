import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

@Component({
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss'],
})
export class WelcomeComponent implements OnInit {
  @ViewChild('name') nameKey!: ElementRef;
  @ViewChild('email') emailKey!: ElementRef;
  constructor() {}

  ngOnInit(): void {}

  startQuiz() {
    localStorage.setItem('name', this.nameKey.nativeElement.value);
    localStorage.setItem('email', this.emailKey.nativeElement.value);
  }
}