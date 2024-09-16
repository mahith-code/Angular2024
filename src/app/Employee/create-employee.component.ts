import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormControl,
  ReactiveFormsModule,
  FormBuilder,
  Validators,
  AbstractControl,
} from '@angular/forms';
import { CustomValidators } from '../shared/custom.validators';

@Component({
  selector: 'app-create-employee',
  templateUrl: './create-employee.component.html',
  styleUrl: './create-employee.component.css',
})
export class CreateEmployeeComponent implements OnInit {
  employeeForm!: FormGroup;

  validationMessages: any = {
    fullName: {
      required: 'Full name is required',
      minlength: 'Full name must be greater than 2 characters',
      maxlength: 'Full name must be less than 10 characters',
    },
    email: {
      required: 'Email is required',
      emailDomain: 'Email domain should be quickfms.com',
    },
    confirmEmail: {
      required: 'Confirm Email is required',
      emailDomain: 'Email domain should be quickfms.com',
    },
    emailGroup: {
      emailMismatch: 'Email and Confirm email do not match'
    },

    phone: {
      required: 'Phone is required',
    },
    skillName: {
      required: 'Skill Name is required',
    },
    experienceInYears: {
      required: 'Experience is required',
    },

    proficiency: {
      required: 'Proficiency is required',
    },
  };

  formErrors: any = {
    fullName: '',
    email: '',
    confirmEmail:'',
    emailGroup: '',
    phone: '',
    skillName: '',
    experienceInYears: '',
    proficiency: '',
  };

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.employeeForm = this.fb.group({
      fullName: [
        '',
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(10),
        ],
      ],
      contactprefernce: ['email'],
      emailGroup: this.fb.group({
        email: [
          '',
          [Validators.required, CustomValidators.emailDomain('quickfms.com')],
        ],
        confirmEmail: ['', Validators.required],
      },{validator: matchEmail} ),

      phone: [''],
      skills: this.fb.group({
        skillName: ['', Validators.required],
        experienceInYears: ['', Validators.required],
        proficiency: ['', Validators.required],
      }),
    });

    this.employeeForm
      .get('contactprefernce')
      ?.valueChanges.subscribe((data: string) => {
        this.OnContactPreferenceChange(data);
      });
    this.employeeForm.valueChanges.subscribe((data) => {
      this.logValidationErrors(this.employeeForm);
    });
  }

  OnContactPreferenceChange(selectedvalue: string) {
    const phonecontrol = this.employeeForm.get('phone');
    if (selectedvalue === 'phone') {
      phonecontrol?.setValidators(Validators.required);
    } else {
      phonecontrol?.clearValidators();
    }
    phonecontrol?.updateValueAndValidity();
  }

  logValidationErrors(group: FormGroup = this.employeeForm): void {
    Object.keys(group.controls).forEach((key: string) => {
      const abstractControl = group.get(key);
      this.formErrors[key] = '';
      if (
        abstractControl &&
        !abstractControl.valid &&
        (abstractControl.touched || abstractControl.dirty)
      ) {
        const messages = this.validationMessages[key];

        for (const errorKey in abstractControl.errors) {
          if (errorKey) {
            this.formErrors[key] += messages[errorKey] + ' ';
          }
        }
      }

      if (abstractControl instanceof FormGroup) {
        this.logValidationErrors(abstractControl);
      } 
    });
  }
  onLoadData(): void {
    // this.logValidationErrors(this.employeeForm);
    // console.log(this.formErrors);
  }

  onSubmit(): void {
    console.log(this.employeeForm.touched);
    console.log(this.employeeForm.value);
    console.log(this.employeeForm.controls['fullName'].touched);
    console.log(this.employeeForm.get('fullName')?.value);
  }
}

function matchEmail(group:AbstractControl): { [key:string]:any} | null {
  const emailControl = group.get('email');
  const ConfirmemailControl = group.get('confirmEmail');

  if (emailControl?.value === ConfirmemailControl?.value || ConfirmemailControl?.pristine ){
    return null
  } else {
    return {'emailMismatch': true}
  }
}

