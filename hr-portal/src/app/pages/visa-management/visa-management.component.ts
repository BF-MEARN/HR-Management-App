import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-visa-management',
  templateUrl: './visa-management.component.html',
  styleUrls: ['./visa-management.component.scss']
})
export class VisaManagementComponent implements OnInit {
  tabIndex: number = 0;

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    const tabMap = { 'in-progress': 0, 'all': 1 };
    this.route.queryParams.subscribe(params => {
      const tabKey = params['tab'];
      if (tabKey && tabKey in tabMap) {
        this.tabIndex = tabMap[tabKey as keyof typeof tabMap];
      }
    });
  }

  onTabChange(index: number): void {
    this.tabIndex = index;
    const reverseMap = ['in-progress', 'all'];
    const selectedTab = reverseMap[index];

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { tab: selectedTab },
      queryParamsHandling: 'merge',
    });
  }
}
