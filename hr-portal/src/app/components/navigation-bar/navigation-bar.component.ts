import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';

@Component({
  selector: 'app-navigation-bar',
  templateUrl: './navigation-bar.component.html',
  styleUrls: ['./navigation-bar.component.scss'],
})
export class NavigationBarComponent implements OnInit {
  menuItems = [
    { path: '/home', label: 'Home', icon: 'home' },
    { path: '/employees', label: 'Employee Profiles', icon: 'people' },
    { path: '/visa', label: 'Visa Status Management', icon: 'article' },
    { path: '/hiring', label: 'Hiring Management', icon: 'work' },
    { path: '/housing', label: 'Housing Management', icon: 'house' },
  ];

  activeLink: string = '';

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.activeLink = this.router.url;

    // Listen to route changes
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event) => {
        this.activeLink = (event as NavigationEnd).urlAfterRedirects;
      });
  }
}
