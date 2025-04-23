import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EmployeeService } from 'src/app/services/employee.service';

@Component({
  selector: 'app-employee-profiles',
  templateUrl: './employee-profiles.component.html',
  styleUrls: ['./employee-profiles.component.scss'],
})
export class EmployeeProfilesComponent implements OnInit {
  allEmployees: any[] = [];
  filteredEmployees: any[] = [];
  searchQuery: string = '';
  isLoading = true;
  errorMessage = '';
  displayedColumns: string[] = ['name', 'ssn', 'auth', 'phone', 'email', 'action'];

  constructor(private employeeService: EmployeeService, private router: Router) {}

  ngOnInit(): void {
    this.loadEmployees();
  }

  loadEmployees(): void {
    this.isLoading = true;
    this.errorMessage = '';
    
    this.employeeService.getAllEmployees().subscribe({
      next: (data) => {
        // Exclude HR users
        const nonHR = data.filter(emp => emp.userId?.role === 'employee');
  
        this.allEmployees = nonHR.sort((a, b) =>
          a.lastName.localeCompare(b.lastName)
        );
        this.filteredEmployees = [...this.allEmployees];
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = 'Failed to load employee profiles. Please try again.';
        this.isLoading = false;
        console.error(err);
      },
    });
  }
  
  onSearchChange(): void {
    const q = this.searchQuery.trim().toLowerCase();
    
    if (!q) {
      this.filteredEmployees = [...this.allEmployees];
      return;
    }
    
    this.filteredEmployees = this.allEmployees.filter((emp) => {
      return (
        emp.firstName?.toLowerCase().includes(q) ||
        emp.lastName?.toLowerCase().includes(q) ||
        emp.preferredName?.toLowerCase().includes(q) ||
        (emp.userId?.email && emp.userId.email.toLowerCase().includes(q))
      );
    });
  }

  openProfile(id: string): void {
    this.router.navigate(['/view-profile', id]); 
  }
  
  // Helper method to retry loading if there was an error
  retryLoading(): void {
    this.loadEmployees();
  }
}