import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Employee } from '../interfaces/employee';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OnboardingApplicationService {

  constructor(private http: HttpClient) { }

  getPending(): Observable<Employee[]> {
    return this.http.get<Employee[]>(
      `${environment.backendBaseUrl}/hr/onboarding/pending`, 
      {withCredentials: true}
    );
  }

  getApproved(): Observable<Employee[]> {
    return this.http.get<Employee[]>(`${environment.backendBaseUrl}/hr/onboarding/approved`, {
      withCredentials: true,
    });
  }

  getRejected(): Observable<Employee[]> {
    return this.http.get<Employee[]>(`${environment.backendBaseUrl}/hr/onboarding/rejected`, {
      withCredentials: true,
    });
  }
}
