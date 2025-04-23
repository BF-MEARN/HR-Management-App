import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-housing-management',
  templateUrl: './housing-management.component.html',
  styleUrls: ['./housing-management.component.scss']
})
export class HousingManagementComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    console.log('HousingManagementComponent initialized');
  }

}
