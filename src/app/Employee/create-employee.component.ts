import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, ReactiveFormsModule, FormBuilder} from '@angular/forms';

@Component({
  selector: 'app-create-employee',
  templateUrl: './create-employee.component.html',
  styleUrl: './create-employee.component.css'
})
export class CreateEmployeeComponent implements OnInit{
  employeeForm!: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.employeeForm = this.fb.group({
      fullName:[''],
      email:[''],
      skills: this.fb.group({
        skillName :[''],
        experienceInYears:[''],
        proficiency:['beginner'],
      })
    });
  }

  onLoadData():void {
    this.employeeForm.patchValue({
      fullName: 'Mahith',
      email:'mahith@gmail.com',
      skills: ({
        skillName : 'Angular',
        experienceInYears : '2',
        proficiency: 'advanced'
    })
  })
   }

  onSubmit(): void {
    console.log(this.employeeForm.touched);
    console.log(this.employeeForm.value);
    console.log(this.employeeForm.controls['fullName'].touched);
    console.log(this.employeeForm.get('fullName')?.value)

  }

}
