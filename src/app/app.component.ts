import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PaydockService } from './paydock.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  form: FormGroup;

  constructor(
    fb: FormBuilder,
    private paydockService: PaydockService
  ) {
    this.form = fb.group({
      amount: '',
      currency: 'USD',
      description: '',
      reference: '',
      nameOnCard: '',
      cardNumber: '',
      expsec: '',
      seccvc: '',
      email: ['', [
        Validators.required,
        Validators.email,
        Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]
      ],
      phone: ['', [
        Validators.pattern('^\\+?[1-9]\\d{1,14}$')
      ]]
    });
  }

  async logForm(): Promise<void> {
    console.log(this.form.value, this.form.status);
    if (this.form.valid) {
      await this.paydockService.main(this.form.value);
    }
  }

}
