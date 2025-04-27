import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HousingManagementService } from 'src/app/services/housing-management.service';
import { FacilityReport, Housing } from 'src/app/interfaces/housing';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-house-detail',
  templateUrl: './house-detail.component.html',
  styleUrls: ['./house-detail.component.scss']
})
export class HouseDetailComponent implements OnInit {
  houseId: string = '';
  house?: Housing;
  residents: any[] = [];
  reports: FacilityReport[] = [];
  loading = true;
  currentPage = 1;
  pageSize = 3;
  newComments: { [reportId: string]: string } = {};
  editingCommentId: string | null = null;
  editedCommentText: string = '';
  currentUserId: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private housingService: HousingManagementService,
    private snackBar: MatSnackBar,
    private authService: AuthService
  ) { }

  // ngOnInit(): void {
  //   this.houseId = this.route.snapshot.paramMap.get('id') || '';
  //   this.loadHouseData();
  
  //   this.authService.getCurrentUser().subscribe({
  //     next: (res) => {
  //       this.currentUserId = res.user._id;
  //     },
  //     error: () => {
  //       this.currentUserId = '';
  //       console.warn('Failed to fetch current user');
  //     },
  //   });
    
  // }
  
  ngOnInit(): void {
    this.houseId = this.route.snapshot.paramMap.get('id') || '';
    this.loadHouseData();
  
    this.authService.getCurrentUser().subscribe({
      next: (res) => {
        // Store the employee ID instead of user ID if available
        if (res.user && res.user.employeeId) {
          this.currentUserId = res.user.employeeId;
        } else {
          this.currentUserId = res.user._id;
        }
      },
      error: () => {
        this.currentUserId = '';
        console.warn('Failed to fetch current user');
      },
    });
  }

  loadHouseData(): void {
    // Load house details
    this.housingService.getHouseById(this.houseId).subscribe({
      next: (data) => {
        this.house = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Failed to load house details', err);
        this.loading = false;
        this.showErrorMessage('Failed to load house details');
      }
    });

    // Load residents
    this.housingService.getResidents(this.houseId).subscribe({
      next: (data) => this.residents = data,
      error: (err) => {
        console.error('Failed to load residents', err);
        this.showErrorMessage('Failed to load resident information');
      }
    });

    // Load facility reports
    this.refreshReports();
  }

  paginatedReports(): FacilityReport[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.reports.slice(start, start + this.pageSize);
  }

  nextPage() {
    if (!this.endOfReports()) this.currentPage++;
  }

  prevPage() {
    if (this.currentPage > 1) this.currentPage--;
  }

  endOfReports(): boolean {
    return this.currentPage * this.pageSize >= this.reports.length;
  }

  getTotalPages(): number {
    return Math.ceil(this.reports.length / this.pageSize);
  }

  submitComment(reportId: string) {
    const text = this.newComments[reportId]?.trim();
    if (!text) return;
  
    this.housingService.addComment(reportId, text).subscribe({
      next: (response) => {
        this.newComments[reportId] = '';
        
        const updatedStatus = response?.updatedStatus;
        if (updatedStatus) {
          const index = this.reports.findIndex(r => r._id === reportId);
          if (index !== -1) {
            this.reports[index].status = updatedStatus;
          }
        }
  
        this.refreshReports();
        this.showSuccessMessage('Comment added successfully');
      },
      error: (err) => {
        console.error('Failed to add comment', err);
        this.showErrorMessage('Failed to add comment');
      }
    });
  }

  startEditing(comment: any): void {
    this.editingCommentId = comment._id;
    this.editedCommentText = comment.description;
  }
  
  cancelEdit(): void {
    this.editingCommentId = null;
    this.editedCommentText = '';
  }
  
  saveComment(reportId: string, commentId: string): void {
    const newText = this.editedCommentText.trim();
    if (!newText) return;
  
    this.housingService.updateComment(reportId, commentId, newText).subscribe({
      next: () => {
        // Update local state
        const report = this.reports.find(r => r._id === reportId);
        const comment = report?.comments.find(c => c._id === commentId);
        if (comment) {
          comment.description = newText;
          comment.timestamp = new Date().toISOString();
        }
  
        this.cancelEdit();
        this.showSuccessMessage('Comment updated');
      },
      error: (err) => {
        console.error('Failed to update comment', err);
        this.showErrorMessage('Failed to update comment');
      }
    });
  }
  

  refreshReports(): void {
    this.housingService.getReports(this.houseId).subscribe({
      next: (data) => {
        this.reports = data;
      },
      error: (err) => {
        console.error('Failed to load reports:', err);
        this.showErrorMessage('Failed to load facility reports');
      }
    });
  }

  getReportStatusClass(status: string): Record<string, boolean> {
    return {
      'open': status === 'Open',
      'in-progress': status === 'In Progress',
      'closed': status === 'Closed'
    };
  }

  showErrorMessage(message: string): void {
    this.snackBar.open(message, 'Dismiss', {
      duration: 5000,
      panelClass: ['error-snackbar']
    });
  }

  showSuccessMessage(message: string): void {
    this.snackBar.open(message, 'Dismiss', {
      duration: 3000,
      panelClass: ['success-snackbar']
    });
  }
}