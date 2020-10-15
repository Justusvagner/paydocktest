import { Directive, HostListener } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[formControlName][appExpSec]',
})
export class ExpirySecurityDirective {
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
    let newVal = event.replace(/\D/g, '');
    if (backspace && newVal.length === 3) {
      newVal = newVal.substring(0, newVal.length - 1);
    }
    if (newVal.length === 0) {
      newVal = '';
    } else if (newVal.length > 2) {
      newVal = newVal.substring(0, 6);
      newVal = newVal.replace(/^(\d{0,2})(\d{0,4})/, '$1/$2');
    }
    this.ngControl.valueAccessor.writeValue(newVal);
  }
}
