import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, ReactiveFormsModule, FormBuilder, Validators} from '@angular/forms';

@Component({
  selector: 'app-create-employee',
  templateUrl: './create-employee.component.html',
  styleUrl: './create-employee.component.css'
})
export class CreateEmployeeComponent implements OnInit{
  employeeForm!: FormGroup;




validationMessages:any = {
  'fullName': {
    'required':'Full name is required',
    'minlength':'Full name must be greater than 2 characters',
    'maxlength' : 'Full name must be less than 10 characters'
  },
  'email': {
    'required': 'Email is required'
  },
  'phone': {
    'required': 'Phone is required'
  },
    'skillName' :{
      'required':'Skill Name is required'
    },
    'experienceInYears':{
      'required':'Experience is required',
    },

    'proficiency': {
      'required':'Proficiency is required'
    }

};

formErrors: any = {
  'fullName' : '',
  'email' : '',
  'phone' : '',
  'skillName' : '',
  'experienceInYears' : '',
  'proficiency' : '',
};

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.employeeForm = this.fb.group({
      fullName:['',[Validators.required, Validators.minLength(2) , Validators.maxLength(10)]],
      contactprefernce:['email'],
      email:['', Validators.required],
      phone : [''],
      skills: this.fb.group({
        skillName :['', Validators.required],
        experienceInYears:['', Validators.required],
        proficiency:['', Validators.required],
      })
    });

    this.employeeForm.get('contactprefernce')?.valueChanges.subscribe((data:string)=> {
      this.OnContactPreferenceChange(data);
    });
    this.employeeForm.valueChanges.subscribe((data)=> {
      this.logValidationErrors(this.employeeForm)
    });
  }

  OnContactPreferenceChange(selectedvalue:string) {
    const phonecontrol= this.employeeForm.get('phone');
    if (selectedvalue === 'phone') {
      phonecontrol?.setValidators(Validators.required);
    } else {
      phonecontrol?.clearValidators();
    }
    phonecontrol?.updateValueAndValidity();
  }

  logValidationErrors(group: FormGroup = this.employeeForm):void {
    Object.keys(group.controls).forEach((key:string) => {
      const abstractControl = group.get(key);

      if(abstractControl instanceof FormGroup) {
        this.logValidationErrors(abstractControl);

      } else {
        this.formErrors[key] = '';
        if(abstractControl && !abstractControl.valid && (abstractControl.touched || abstractControl.dirty)) {
          const messages = this.validationMessages[key];

          for(const errorKey in abstractControl.errors) {
            if(errorKey) {
              this.formErrors[key] += messages[errorKey] + '';
            }
          };
        }
      }
    });
  }
  onLoadData():void {
  // this.logValidationErrors(this.employeeForm);
  // console.log(this.formErrors);
   }

  onSubmit(): void {
    console.log(this.employeeForm.touched);
    console.log(this.employeeForm.value);
    console.log(this.employeeForm.controls['fullName'].touched);
    console.log(this.employeeForm.get('fullName')?.value)

  }

}
