import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { VisaStatus } from '../interfaces/visa-status';

@Injectable({
  providedIn: 'root'
})
export class VisaManagementService {
  private readonly baseUrl = `${environment.backendBaseUrl}/hr/visa`;

  constructor(
    private http: HttpClient,
  ) { }

  getInProgressStatuses(): Observable<VisaStatus[]> {
    return this.http.get<VisaStatus[]>(`${this.baseUrl}/in-progress`, { withCredentials: true });
  }

  getAllVisaStatuses(): Observable<VisaStatus[]> {
    return this.http.get<VisaStatus[]>(`${this.baseUrl}/all`, { withCredentials: true });
  }

  getVisaStatusById(id: string): Observable<VisaStatus> {
    return this.http.get<VisaStatus>(`${this.baseUrl}/${id}`, { withCredentials: true });
  }


  sendReminder(id: string) {
    return this.http.post(`${this.baseUrl}/${id}/notify`, {}, { withCredentials: true });
  }

  approveDocument(id: string, documentType: string) {
    return this.http.patch(`${this.baseUrl}/${id}/approve`, { documentType }, { withCredentials: true });
  }
  
  rejectDocument(id: string, documentType: string, feedback: string) {
    return this.http.patch(`${this.baseUrl}/${id}/reject`, { documentType, feedback }, { withCredentials: true });
  }
  

}
