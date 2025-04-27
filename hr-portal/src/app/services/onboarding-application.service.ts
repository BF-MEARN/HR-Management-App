import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Employee } from '../interfaces/employee';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OnboardingApplicationService {
  private readonly baseUrl = `${environment.backendBaseUrl}/hr/onboarding`;

  constructor(private http: HttpClient) {}

  getPending(): Observable<Employee[]> {
    return this.http.get<Employee[]>(`${this.baseUrl}/pending`, {
      withCredentials: true,
    });
  }

  getApproved(): Observable<Employee[]> {
    return this.http.get<Employee[]>(`${this.baseUrl}/approved`, {
      withCredentials: true,
    });
  }

  getRejected(): Observable<Employee[]> {
    return this.http.get<Employee[]>(`${this.baseUrl}/rejected`, {
      withCredentials: true,
    });
  }

  getApplicationById(id: string): Observable<Employee> {
    return this.http.get<Employee>(`${this.baseUrl}/${id}`, {
      withCredentials: true,
    });
  }

  approveApplication(id: string): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/${id}/approve`, {}, {
      withCredentials: true,
    });
  }

  rejectApplication(id: string, feedback: string): Observable<void> {
    return this.http.post<void>(
      `${this.baseUrl}/${id}/reject`,
      { feedback },
      { withCredentials: true }
    );
  }

  approveAndAssignHousing(employeeId: string) {
    return this.http.patch(
      `${this.baseUrl}/approve-and-assign/${employeeId}`,
      {},
      { withCredentials: true }
    );
  }
  
}
