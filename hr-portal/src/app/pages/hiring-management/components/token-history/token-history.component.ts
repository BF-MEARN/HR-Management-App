import { Component, OnInit } from '@angular/core';
import { RegistrationToken } from 'src/app/interfaces/registration-token';
import { TokenService } from 'src/app/services/token.service';

@Component({
  selector: 'app-token-history',
  templateUrl: './token-history.component.html',
  styleUrls: ['./token-history.component.scss']
})
export class TokenHistoryComponent implements OnInit {
  tokens: RegistrationToken[] = [];
  displayedColumns: string[] = ['name', 'email', 'used', 'expired', 'link'];

  constructor(private inviteService: TokenService) { }

  ngOnInit(): void {
    this.inviteService.getTokenHistory().subscribe({
      next: (data) => (this.tokens = data),
      error: (err) => console.error('Failed to fetch token history', err),
    })
  }

}
