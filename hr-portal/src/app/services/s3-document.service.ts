import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

interface PresignedUrlResponse {
  url: string;
}

@Injectable({
  providedIn: 'root'
})
export class S3DocumentService {
  private apiUrl = `${environment.backendBaseUrl}/hr/documents`;

  constructor(private http: HttpClient) {}


  getPresignedUrl(key: string): Observable<PresignedUrlResponse> {
    return this.http.get<PresignedUrlResponse>(`${this.apiUrl}/file`, {
      params: { key },
      withCredentials: true
    });
  }

  /**
   * Get a presigned URL specifically for downloading a document
   * Force browser to download the file
   */
  getDownloadUrl(key: string): Observable<PresignedUrlResponse> {
    return this.http.get<PresignedUrlResponse>(`${this.apiUrl}/download`, {
      params: { key },
      withCredentials: true
    });
  }
}