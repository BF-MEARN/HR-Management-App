import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { InviteFormModalComponent } from './components/invite-form-modal/invite-form-modal.component';
import { ActivatedRoute, Router } from '@angular/router';
import { TokenHistoryComponent } from './components/token-history/token-history.component';

@Component({
  selector: 'app-hiring-management',
  templateUrl: './hiring-management.component.html',
  styleUrls: ['./hiring-management.component.scss'],
})
export class HiringManagementComponent implements OnInit{
  tabIndex: number = 0;

  constructor(
    private dialog: MatDialog,
    private route: ActivatedRoute,
    private router: Router,
  ) {}

  ngOnInit(): void {
    const map = { pending: 0, rejected: 1, approved: 2 };
  
    this.route.queryParams.subscribe(params => {
      const tabKey = params['tab'];
      if (tabKey && tabKey in map) {
        this.tabIndex = map[tabKey as keyof typeof map];
      }
    });
  }

  openInviteDialog(): void {
    this.dialog.open(InviteFormModalComponent, {
      width: '450px',
      disableClose: true,
    });
  }
  
  openHistoryDialog(): void {
    this.dialog.open(TokenHistoryComponent, {
      width: '1200px',
      maxHeight: '90vh',
      disableClose: true,
    });
  }
  

  onTabChange(index: number): void {
    this.tabIndex = index;
    const reverseMap = ['pending', 'rejected', 'approved'];
    const selectedTab = reverseMap[index];
  
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { tab: selectedTab },
      queryParamsHandling: 'merge',
    });
  }
  
  
}
