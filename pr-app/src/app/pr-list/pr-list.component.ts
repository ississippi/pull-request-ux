import { Component, OnInit, OnDestroy } from '@angular/core';
import { PrService, PullRequest } from '../services/pr.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-pr-list',
  template: `
    <div id="pr-list" class="list-group">
      <button *ngFor="let pr of prList" class="list-group-item list-group-item-action" (click)="showDetailView(pr.id, pr.repo)">
        <strong>{{ pr.title }}</strong><br>
        <small>#{{ pr.id }} opened on {{ pr.date || 'Unknown' }} by {{ pr.author || 'Unknown' }}</small>
      </button>
    </div>
  `,
  styles: []
})
export class PrListComponent implements OnInit, OnDestroy {
  prList: PullRequest[] = [];

  constructor(private prService: PrService, private router: Router) {}

  ngOnInit(): void {
    console.info('Initial fetch PRs');
    this.fetchPrs();
    console.info('Setting up WebSocket');
    this.prService.setupWebSocket((newPr) => {
      this.prList.unshift(newPr);
    });
  }

  ngOnDestroy(): void {
    this.prService.closeWebSocket();
  }

  fetchPrs(): void {
    this.prService.fetchPrs().subscribe({
      next: (prs) => {
        this.prList = prs;
      },
      error: (err) => console.error('Failed to fetch PRs', err)
    });
  }

  showDetailView(id: number, repo: string): void {
    this.router.navigate(['/pr', id, repo]);
  }
}
