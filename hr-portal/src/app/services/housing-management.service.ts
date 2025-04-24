import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { FacilityReport, Housing, Resident } from '../interfaces/housing';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class HousingManagementService {
  private readonly baseUrl = `${environment.backendBaseUrl}/hr/housing`;

  constructor(private http: HttpClient) { }

  getAllHouses(): Observable<Housing[]> {
    return this.http.get<Housing[]>(this.baseUrl, { withCredentials: true });
  }

  createHouse(house: Partial<Housing>): Observable<Housing> {
    return this.http.post<Housing>(this.baseUrl, house, { withCredentials: true });
  }
  
  deleteHouse(id: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.baseUrl}/${id}`, {
      withCredentials: true,
    });
  }

  getHouseById(id: string): Observable<Housing> {
    return this.http.get<Housing>(`${this.baseUrl}/${id}`, { withCredentials: true });
  }  

  getResidents(id: string): Observable<Resident[]> {
    return this.http.get<Resident[]>(`${this.baseUrl}/${id}/residents`, { withCredentials: true });
  }
  
  getReports(id: string): Observable<FacilityReport[]> {
    return this.http.get<FacilityReport[]>(`${this.baseUrl}/${id}/reports`, { withCredentials: true });
  }

  addComment(reportId: string, description: string): Observable<any> {
    return this.http.post(
      `${this.baseUrl}/report/${reportId}/comments`, 
      { description }, 
      { withCredentials: true }
    );
  }

  updateComment(reportId: string, commentId: string, description: string): Observable<any> {
    return this.http.put(
      `${this.baseUrl}/report/${reportId}/comments/${commentId}`, 
      { description }, 
      { withCredentials: true }
    );
  }
}
