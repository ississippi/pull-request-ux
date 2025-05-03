import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PrService, PrDetails } from '../services/pr.service';

@Component({
  selector: 'app-pr-detail',
  template: `
    <div id="pr-detail">
      <button class="btn btn-link mb-3" (click)="showListView()">← Back to List</button>
      <div class="card">
        <div class="card-body">
          <h4 id="detail-title">{{ details?.title }}</h4>
          <p id="detail-meta" class="text-muted">#{{ details?.id }} opened on {{ details?.date || 'Unknown' }} by {{ details?.author || 'Unknown' }}</p>
          <p><a id="detail-giturl" [href]="details?.prurl" class="link-underline-dark">{{ details?.prurl }}</a></p>
          <h5 class="mt-4">Review:</h5>
          <div id="detail-review" class="border p-3 bg-white" style="min-height: 150px;">{{ review }}</div>
          <div class="mt-4">
            <h6>Rate the Review:</h6>
            <button class="btn btn-outline-success me-2" (click)="sendFeedback('up')">👍 Thumbs Up</button>
            <button class="btn btn-outline-danger" (click)="sendFeedback('down')">👎 Thumbs Down</button>
          </div>
          <div class="mt-4">
            <h6>Action:</h6>
            <div class="form-check">
              <input class="form-check-input" type="radio" name="reviewAction" id="approve" value="Approve" [(ngModel)]="reviewAction">
              <label class="form-check-label" for="approve">Approve</label>
            </div>
            <div class="form-check">
              <input class="form-check-input" type="radio" name="reviewAction" id="requestChanges" value="Request Changes" [(ngModel)]="reviewAction">
              <label class="form-check-label" for="requestChanges">Request Changes</label>
            </div>
          </div>
          <button class="btn btn-primary mt-3" (click)="submitReviewAction()">Submit</button>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class PrDetailComponent implements OnInit {
  details: PrDetails | null = null;
  review: string = '';
  reviewAction: string = '';
  prId: number = 0;
  repo: string = '';

  constructor(
    private prService: PrService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.prId = +this.route.snapshot.paramMap.get('id')!;
    this.repo = this.route.snapshot.paramMap.get('repo')!;
    this.fetchDetails();
    this.fetchReview();
  }

  fetchDetails(): void {
    this.prService.fetchPrDetails(this.prId, this.repo).subscribe({
      next: (details) => {
        console.info('Details received:', details);
        this.details = details;
      },
      error: (err) => console.error('Failed to fetch PR details', err)
    });
  }

  fetchReview(): void {
    this.prService.fetchPrReview(this.prId).subscribe({
      next: (review) => {
        this.review = review;
      },
      error: (err) => console.error('Failed to fetch PR review', err)
    });
  }

  sendFeedback(vote: 'up' | 'down'): void {
    if (!this.prId) {
      alert('No PR selected.');
      return;
    }
    this.prService.sendFeedback(this.prId, vote).subscribe({
      next: () => {
        alert(`Thanks for your ${vote === 'up' ? 'positive' : 'negative'} feedback!`);
        console.info('Feedback received:', vote);
      },
      error: (err) => {
        console.error('Failed to send feedback', err);
        alert('Failed to send feedback.');
      }
    });
  }

  submitReviewAction(): void {
    console.info('Review submitted');
    if (!this.reviewAction) {
      alert('Please select an action before submitting.');
      return;
    }
    this.prService.submitReviewAction(this.prId, this.reviewAction).subscribe({
      next: () => {
        alert(`Your decision (${this.reviewAction}) has been submitted!`);
      },
      error: (err) => {
        console.error('Failed to submit decision', err);
        alert('Failed to submit your decision.');
      }
    });
  }

  showListView(): void {
    this.router.navigate(['/']);
  }
}

