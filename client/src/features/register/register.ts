import { Component, inject, input, OnInit, output, signal } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { RegisterCreds, User } from '../../types/user';
import { AccountService } from '../../core/services/account-service';
import { TextInput } from "../../shared/text-input/text-input";
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, TextInput],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {

  protected creds = {} as RegisterCreds;
  private accountService = inject(AccountService);
  cancelRegistration = output<boolean>();
  protected credentialsForm: FormGroup;
  protected profileForm: FormGroup;
  private fb = inject(FormBuilder);
  protected currentStep = signal(1);
  protected validationErrors = signal<string[]>([]);
  private router = inject(Router);

  constructor() {
    this.credentialsForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      displayName: ['', Validators.required],
      password: ['', [Validators.required, Validators.maxLength(8), Validators.minLength(4)]],
      confirmPassword: ['', [Validators.required, this.matchValues('password')]]
    });
    this.credentialsForm.controls['password'].valueChanges.subscribe(() => {
      this.credentialsForm.controls['confirmPassword'].updateValueAndValidity();
    })

    this.profileForm = this.fb.group({
      gender: ['male', Validators.required],
      dateOfBirth: ['', Validators.required],
      city: ['', Validators.required],
      country: ['', Validators.required]
    })
  }

  nextStep() {
    if (this.credentialsForm.valid)
      this.currentStep.update(prevStep => prevStep + 1)
  }

  prevStep() {
    this.currentStep.update(prevStep => prevStep - 1);
  }

  matchValues(matchTo: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const parent = control.parent;
      if (!parent) return null;
      const matchValue = parent?.get(matchTo)?.value;

      return control.value === matchValue ? null : { passwordMismatch: true }
    }
  }

  getMaxDate() {
    const today = new Date();
    today.setFullYear(today.getFullYear() - 18);
    return today.toISOString().split('T')[0];
  }

  register() {

    if (this.credentialsForm.valid && this.profileForm.valid) {
      const formData = { ...this.credentialsForm.value, ...this.profileForm.value };

      this.accountService.register(formData).subscribe(
        {
          next: () => {
            this.router.navigateByUrl('/members');
          },
          error: err => {
            console.log(err);
            this.validationErrors.set(err);
          }
        }
      );
      //console.log('form data:' , formData);
    }
  }

  cancel() {
    console.log('cancelled');
    this.cancelRegistration.emit(false);
  }
}
