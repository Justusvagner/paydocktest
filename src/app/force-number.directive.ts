import { Directive, HostListener } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[formControlName][appForceNum]',
})
export class ForceNumberDirective {
  constructor(public ngControl: NgControl) { }

  @HostListener('ngModelChange', ['$event'])
  onModelChange(event): void {
    this.onInputChange(event, false);
  }

  @HostListener('keydown.backspace', ['$event'])
  keydownBackspace(event): void {
    this.onInputChange(event.target.value, true);
  }

  onInputChange(event, backspace): void {
    const newVal = event.replace(/\D/g, '');
    this.ngControl.valueAccessor.writeValue(newVal);
  }
}
