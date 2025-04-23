import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class EmployeeService {
  constructor(private http: HttpClient) {}

  getAllEmployees() {
    return this.http.get<any[]>(`${environment.backendBaseUrl}/hr/profiles/`, {
      withCredentials: true,
    });
  }
  
  getProfileById(id: string) {
    return this.http.get<any>(`${environment.backendBaseUrl}/hr/profiles/${id}`, {
      withCredentials: true,
    });
  }
  
}
