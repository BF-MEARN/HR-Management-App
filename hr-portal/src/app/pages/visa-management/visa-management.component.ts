import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-visa-management',
  templateUrl: './visa-management.component.html',
  styleUrls: ['./visa-management.component.scss']
})
export class VisaManagementComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    console.log('VisaManagementComponent initialized');
  }

}
