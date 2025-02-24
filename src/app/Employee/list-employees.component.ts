import { Component, OnInit } from '@angular/core';
import { EmployeeService } from './employee.service';
import { IEmployee } from './IEmployee';
import { Router } from '@angular/router';
@Component({
  selector: 'app-list-employees',
  templateUrl: './list-employees.component.html',
  styleUrl: './list-employees.component.css'
})
export class ListEmployeesComponent implements OnInit{
  employees:IEmployee[] | undefined;
  constructor(private _employeeservice:EmployeeService,
              private _router:Router
  ) {}
  ngOnInit() {
    this._employeeservice.getEmployees().subscribe(
      (listEmployees) => this.employees = listEmployees,
      (err) => console.log(err)
    );
  }
  editButtonClick(employeeID:number) {
    this._router.navigate(['/edit',employeeID]);
  }
}
