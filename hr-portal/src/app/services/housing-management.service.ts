import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Housing } from '../interfaces/housing';
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

  createHouse(house: Partial<Housing>) {
    return this.http.post<Housing>(this.baseUrl, house, { withCredentials: true });
  }

  deleteHouse(id: string) {
    return this.http.delete(`${this.baseUrl}/${id}`, { withCredentials: true });
  }

  getResidents(id: string) {
    return this.http.get(`${this.baseUrl}/${id}/residents`, { withCredentials: true });
  }

  getReports(id: string) {
    return this.http.get(`${this.baseUrl}/${id}/reports`, { withCredentials: true });
  }

  addComment(reportId: string, description: string) {
    return this.http.post(
      `${this.baseUrl}/report/${reportId}/comments`, 
      { description }, 
      { withCredentials: true }
    );
  }

  updateComment(reportId: string, commentId: string, description: string) {
    return this.http.put(
      `${this.baseUrl}/report/${reportId}/comments/${commentId}`, 
      { description }, 
      { withCredentials: true }
    );
  }
}
