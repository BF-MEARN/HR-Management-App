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

  sendInvite(payload: InviteRequest): Observable<{ token: RegistrationToken }> {
    return this.http.post<{ token: RegistrationToken }>(
      `${environment.backendBaseUrl}/hr/token/generate`,
      payload,
      { withCredentials: true }
    );
  }

  getTokenHistory(): Observable<RegistrationToken[]> {
    return this.http.get<RegistrationToken[]>(
      `${environment.backendBaseUrl}/hr/token/history`,
      { withCredentials: true }
    );
  }
  
}
