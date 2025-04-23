import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Employee } from '../interfaces/employee';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EmployeeService {
  private readonly baseUrl = `${environment.backendBaseUrl}/hr/profiles`;

  constructor(private http: HttpClient) {}

  getAllEmployees() {
    return this.http.get<Employee[]>(this.baseUrl, {
      withCredentials: true,
    });
  }
  
  getProfileById(id: string): Observable<Employee> {
    return this.http.get<Employee>(`${this.baseUrl}/${id}`, {
      withCredentials: true,
    });
  }
  
}
