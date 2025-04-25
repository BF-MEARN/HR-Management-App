import { Component, OnInit } from '@angular/core';
import { VisaStatus } from 'src/app/interfaces/visa-status';
import { VisaManagementService } from 'src/app/services/visa-management.service';

@Component({
  selector: 'app-visa-in-progress',
  templateUrl: './visa-in-progress.component.html',
  styleUrls: ['./visa-in-progress.component.scss']
})
export class VisaInProgressComponent implements OnInit {
  visaStatuses: VisaStatus[] = [];
  filteredStatuses: VisaStatus[] = [];
  searchQuery = '';
  loading = true;
  displayedColumns: string[] = ['name', 'workAuth', 'dates', 'daysRemaining', 'nextStep', 'action'];

  constructor(private visaService: VisaManagementService) {}

  ngOnInit(): void {
    this.loadVisaStatuses();
  }

  loadVisaStatuses(): void {
    this.loading = true;
    this.visaService.getInProgressStatuses().subscribe({
      next: (data) => {
        this.visaStatuses = data;
        this.filteredStatuses = data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error fetching visa statuses:', error);
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
        (emp.preferredName?.toLowerCase().includes(query) ?? false) ||
        (emp.userId?.email?.toLowerCase().includes(query) ?? false)
      );
    });
  }

  getDaysRemaining(start: string, end: string): number {
    if (!end) return 0;
    
    const now = new Date();
    const endDate = new Date(end);
    return Math.max(0, Math.floor((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));
  }

  getNextStep(status: VisaStatus): string {
    if (status.optReceipt.status !== 'Approved') return 'Review OPT Receipt';
    if (status.optEAD.status !== 'Approved') return 'Review OPT EAD';
    if (status.i983.status !== 'Approved') return 'Review I-983';
    if (status.i20.status !== 'Approved') return 'Review I-20';
    return 'All documents approved';
  }
}