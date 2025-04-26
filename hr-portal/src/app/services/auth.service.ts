import { Injectable } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = `${environment.backendBaseUrl}/user`;

  constructor(private http: HttpClient) {}

  login(credentials: {
    username: string;
    password: string;
  }): Observable<{ message: string; user: any }> {
    return this.http.post<{ message: string; user: any }>(
      `${this.apiUrl}/login`,
      credentials,
      { withCredentials: true },
    );
  }

  logout(): Observable<any> {
    return this.http.post(`${this.apiUrl}/logout`, {}, { withCredentials: true });
  }
  
  getCurrentUser(): Observable<{ user: any }> {
    return this.http.get<{ user: any }>(`${this.apiUrl}/hr/me`, {
      withCredentials: true,
    });
  }
}