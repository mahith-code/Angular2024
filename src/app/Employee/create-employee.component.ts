import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormControl,
  ReactiveFormsModule,
  FormBuilder,
  Validators,
  AbstractControl,
  FormArray,
} from '@angular/forms';
import { CustomValidators } from '../shared/custom.validators';
import { ActivatedRoute } from '@angular/router';
import { EmployeeService } from './employee.service';
import { ISkill } from './ISkill';
import { IEmployee } from './IEmployee';
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
    experienceInYears: {
      required: 'Experience is required',
    },

    proficiency: {
      required: 'Proficiency is required',
    },
  };

  formErrors: any = {

  };

  constructor(private fb: FormBuilder,
              private route:ActivatedRoute,
              private employeeService:EmployeeService
  ) {}

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
      skills: this.fb.array([
        this.addSkillFormGroup()
      ]),
    });

    this.employeeForm
      .get('contactprefernce')
      ?.valueChanges.subscribe((data: string) => {
        this.OnContactPreferenceChange(data);
      });
    this.employeeForm.valueChanges.subscribe((data) => {
      this.logValidationErrors(this.employeeForm);
    });

    this.route.paramMap.subscribe(params => {
     const empId = +(params.get('id') ?? 0);;//typecasting to number
      if(empId) {
        this.getEmployee(empId);
      }
    }

    );
  }

  getEmployee(id:number){
    this.employeeService.getEmployee(id).subscribe(
      (employee:IEmployee) => this.editEmployee(employee),
      (err:any) => console.log(err)
    );
  }
  editEmployee(employee:IEmployee) {
    this.employeeForm.patchValue({
      fullName : employee.fullName,
      contactPrefernce: employee.contactPreference,
      emailGroup : {
        email:employee.email,
        confirmEmail:employee.email
      },
      phone:employee.phone
    });
  }
  addSkillButtonClick():void {
    (<FormArray>this.employeeForm.get('skills')).push(this.addSkillFormGroup());
  }
  removeSkillButton(skillGroupIndex:number):void {
    (<FormArray>this.employeeForm.get('skills')).removeAt(skillGroupIndex);
  }
  get skillsFormArray() {
    return this.employeeForm.get('skills') as FormArray;
  }

  addSkillFormGroup():FormGroup {
   return this.fb.group({
      skillName: ['', Validators.required],
      experienceInYears: ['', Validators.required],
      proficiency: ['', Validators.required],
    })
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
        (abstractControl.touched || abstractControl.dirty ||
          abstractControl.value !== ''
        )
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
    const formArray1= this.fb.array([
      new FormControl('mahith',Validators.required),
      new FormControl('IT',Validators.required),
      new FormControl('',Validators.required)
    ]);
    const formGroup= this.fb.group([
      new FormControl('mahith',Validators.required),
      new FormControl('IT',Validators.required),
      new FormControl('',Validators.required)
    ]);
    console.log(formArray1);
    console.log(formGroup);
  }

  onSubmit(): void {
    // console.log(this.employeeForm.touched);
    // console.log(this.employeeForm.value);
    // console.log(this.employeeForm.controls['fullName'].touched);
    // console.log(this.employeeForm.get('fullName')?.value);
  }
}

function matchEmail(group:AbstractControl): { [key:string]:any} | null {
  const emailControl = group.get('email');
  const ConfirmemailControl = group.get('confirmEmail');

  if (emailControl?.value === ConfirmemailControl?.value
    || (ConfirmemailControl?.pristine && ConfirmemailControl.value === '')){
    return null
  } else {
    return {'emailMismatch': true}
  }
}

