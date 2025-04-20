import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { InviteRequest, RegistrationToken } from '../interfaces/registration-token';

@Injectable({
  providedIn: 'root',
})
export class TokenService {
  constructor(private http: HttpClient) {}

  sendInvite(payload: InviteRequest): Observable<any> {
    return this.http.post(`${environment.apiUrl}/token/generate`, payload, {
      withCredentials: true,
    });
  }

  getTokenHistory(): Observable<RegistrationToken[]> {
    return this.http.get<RegistrationToken[]>(
      `${environment.apiUrl}/token/history`,
      { withCredentials: true }
    );
  }
  
}
