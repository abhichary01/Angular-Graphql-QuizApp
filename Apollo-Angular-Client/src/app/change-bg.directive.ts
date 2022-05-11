import {
  Directive,
  Input,
  ElementRef,
  Renderer2,
  HostListener,
} from "@angular/core";

@Directive({
  selector: "[appChangeBg]",
})
export class ChangeBgDirective {
  // Input validation to change style acoorsing the answer correct or incorrect
  @Input() isCorrect: Boolean = false;
  constructor(private el: ElementRef, private render: Renderer2) {}

  @HostListener("click") answer() {
    if (this.isCorrect) {
      // If the answer is correct then background will change to green
      this.render.addClass(this.el.nativeElement, "bg-green-600");
    } else {
      // or else to red
      this.render.addClass(this.el.nativeElement, "bg-red-600");
    }
  }
}
