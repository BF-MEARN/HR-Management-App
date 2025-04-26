import { Component, OnInit } from '@angular/core';
import { VisaStatus } from 'src/app/interfaces/visa-status';
import { VisaManagementService } from 'src/app/services/visa-management.service';

@Component({
  selector: 'app-visa-all',
  templateUrl: './visa-all.component.html',
  styleUrls: ['./visa-all.component.scss']
})
export class VisaAllComponent implements OnInit {
  visaStatuses: VisaStatus[] = [];
  filteredStatuses: VisaStatus[] = [];
  searchQuery = '';
  loading = true;
  displayedColumns: string[] = ['name', 'workAuth', 'dates', 'daysRemaining', 'status', 'action'];

  constructor(private visaService: VisaManagementService) {}

  ngOnInit(): void {
    this.loadAllVisaStatuses();
  }

  loadAllVisaStatuses(): void {
    this.loading = true;
    this.visaService.getAllVisaStatuses().subscribe({
      next: (data) => {
        this.visaStatuses = data;
        this.filteredStatuses = data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error fetching all visa statuses:', error);
        this.loading = false;
      }
    });
  }

  filterList(): void {
    const query = this.searchQuery.toLowerCase().trim();
    
    if (!query) {
      this.filteredStatuses = [...this.visaStatuses];
      return;
    }
    
    this.filteredStatuses = this.visaStatuses.filter(status => {
      const emp = status.employeeId;
      return (
        emp.firstName.toLowerCase().includes(query) ||
        emp.lastName.toLowerCase().includes(query) ||
        (emp.preferredName?.toLowerCase().includes(query) ?? false)
      );
    });
  }

  getDaysRemaining(start: string, end: string): number {
    if (!end) return 0;
    
    const now = new Date();
    const endDate = new Date(end);
    return Math.max(0, Math.floor((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));
  }

  getDocumentStatus(status: VisaStatus): string {
    // Check if this is an F1 visa
    if (status.workAuthorization?.type !== 'F1') {
      return 'N/A';
    }

    // Check the status of each document in sequence
    if (status.optReceipt.status !== 'Approved') {
      return `OPT Receipt: ${status.optReceipt.status}`;
    }
    
    if (status.optEAD.status !== 'Approved') {
      return `OPT EAD: ${status.optEAD.status}`;
    }
    
    if (status.i983.status !== 'Approved') {
      return `I-983: ${status.i983.status}`;
    }
    
    if (status.i20.status !== 'Approved') {
      return `I-20: ${status.i20.status}`;
    }
    
    return 'All Documents Approved';
  }
}