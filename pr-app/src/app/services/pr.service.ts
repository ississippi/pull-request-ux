import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export interface PullRequest {
  id: number;
  title: string;
  date: string;
  author: string;
  repo: string;
}

export interface PrDetails {
  id: number;
  title: string;
  date: string;
  author: string;
  prurl: string;
  review: string;
}

@Injectable({
  providedIn: 'root'
})
export class PrService {
  private apiBaseUrl: string = environment.apiUrl;

  constructor(private http: HttpClient) {}

  fetchPrs(): Observable<PullRequest[]> {
    return this.http.get<PullRequest[]>(`${this.apiBaseUrl}/api/pr`)
      .pipe(
        catchError(err => {
          console.error('Failed to fetch PRs', err);
          return throwError(() => new Error('Failed to fetch PRs'));
        })
      );
  }

  fetchPrDetails(id: number, repo: string): Observable<PrDetails> {
    return this.http.get<PrDetails>(`${this.apiBaseUrl}/api/pr/details?id=${id}&repo=${repo}`)
      .pipe(
        catchError(err => {
          console.error('Failed to fetch PR details', err);
          return throwError(() => new Error('Failed to fetch PR details'));
        })
      );
  }

  fetchPrReview(id: number): Observable<string> {
    return this.http.get(`${this.apiBaseUrl}/api/pr/review?id=${id}`, { responseType: 'text' })
      .pipe(
        catchError(err => {
          console.error('Failed to fetch PR review', err);
          return throwError(() => new Error('Failed to fetch PR review'));
        })
      );
  }

  sendFeedback(prNumber: number, vote: 'up' | 'down'): Observable<any> {
    return this.http.post(`${this.apiBaseUrl}/notification/feedback`, { prNumber, vote })
      .pipe(
        catchError(err => {
          console.error('Failed to send feedback', err);
          return throwError(() => new Error('Failed to send feedback'));
        })
      );
  }

  submitReviewAction(prNumber: number, decision: string): Observable<any> {
    return this.http.post(`${this.apiBaseUrl}/notification/decision`, { prNumber, decision })
      .pipe(
        catchError(err => {
          console.error('Failed to submit decision', err);
          return throwError(() => new Error('Failed to submit decision'));
        })
      );
  }

  setupWebSocket(onMessage: (pr: PullRequest) => void): void {
    const protocol = this.apiBaseUrl.startsWith('https') ? 'wss' : 'ws';
    const wsHost = this.apiBaseUrl.replace(/^https?:\/\//, '');
    const ws = new WebSocket(`${protocol}://${wsHost}/ws/prs`);

    ws.onmessage = (event) => {
      const newPr = JSON.parse(event.data);
      console.info('WebSocket message:', newPr);
      onMessage(newPr);
    };

    ws.onerror = (err) => console.error('WebSocket error', err);
  }

  closeWebSocket(): void {
    console.warn('WebSocket closure not implemented; consider storing WebSocket instance');
  }
}

