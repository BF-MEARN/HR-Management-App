import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { InviteRequest, RegistrationToken } from '../interfaces/registration-token';

@Injectable({
  providedIn: 'root',
})
export class TokenService {
  private readonly baseUrl = `${environment.backendBaseUrl}/hr/token`;

  constructor(private http: HttpClient) {}

  sendInvite(payload: InviteRequest): Observable<{ token: RegistrationToken }> {
    return this.http.post<{ token: RegistrationToken }>(
      `${this.baseUrl}/generate`,
      payload,
      { withCredentials: true }
    );
  }

  getTokenHistory(): Observable<RegistrationToken[]> {
    return this.http.get<RegistrationToken[]>(`${this.baseUrl}/history`, {
      withCredentials: true,
    });
  }
  
}
