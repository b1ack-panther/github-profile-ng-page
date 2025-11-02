// src/app/app.component.ts
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GithubService } from './github.service';
import { achievements } from './mockData';
import { ContributionGraphComponent } from './components/contribution-graph-component/contribution-graph.component';
import { environment } from '../environments/environment';
import { FooterComponent } from './components/footer/footer.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, ContributionGraphComponent, FooterComponent],
  templateUrl: './app.html',
  styleUrls: ['./app.css'],
})
export class AppComponent implements OnInit {
  activeTab = 'overview';
  loading = true;
  user: Awaited<ReturnType<typeof this.githubService.getAuthenticatedUser>>['data'] | null = null;
  repos: Awaited<ReturnType<typeof this.githubService.getRepos>>['data'] | null = null;
  achievements = achievements;
  hasToken = false;

  constructor(private cdr: ChangeDetectorRef, private githubService: GithubService) {
    this.hasToken = !!environment.githubToken && environment.githubToken.trim() !== '';
  }

  ngOnInit() {
    this.loadUserProfile();
  }

  async loadUserProfile() {
    try {
      const response = await this.githubService.getAuthenticatedUser();
      this.user = response.data;
      this.repos = (await this.githubService.getRepos(this.user.login)).data;
    } catch (error) {
      console.error('Error fetching user via Octokit:', error);
    } finally {
      this.loading = false;
      this.cdr.detectChanges();
    }
  }

  setActiveTab(tab: string) {
    this.activeTab = tab;
  }
}
