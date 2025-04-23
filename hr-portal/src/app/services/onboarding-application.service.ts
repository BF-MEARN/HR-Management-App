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

  getApplicationById(id: string) {
    return this.http.get(`${environment.backendBaseUrl}/hr/onboarding/${id}`, {
      withCredentials: true,
    });
  }
  
  approveApplication(id: string) {
    return this.http.post(`${environment.backendBaseUrl}/hr/onboarding/${id}/approve`, {}, {
      withCredentials: true,
    });
  }
  
  rejectApplication(id: string, feedback: string) {
    return this.http.post(
      `${environment.backendBaseUrl}/hr/onboarding/${id}/reject`,
      { feedback },
      { withCredentials: true }
    );
  }
}
