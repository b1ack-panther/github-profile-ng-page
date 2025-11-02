// src/app/app.component.ts
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as Plotly from 'plotly.js-dist-min';
import { GithubService } from './github.service';
import { achievements, activityItems } from './mockData';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './app.html',
  styleUrls: ['./app.css'],
})
export class AppComponent implements OnInit {
  activeTab = 'overview';
  loading = true;
  currentYear: number = new Date().getFullYear();
  years: number[] = [];
  selectedYear: number = this.currentYear;
  user: Awaited<ReturnType<typeof this.githubService.getAuthenticatedUser>>['data'] | null = null;
  repos: Awaited<ReturnType<typeof this.githubService.getRepos>>['data'] | null = null;
  contributionData: any;
  achievements = achievements;
  activityItems = activityItems;

  constructor(private cdr: ChangeDetectorRef, private githubService: GithubService) {}

  ngOnInit() {
    this.loadUserProfile();
    for (let i = 0; i < 10; i++) {
      this.years.push(this.currentYear - i);
    }
  }

  async loadUserProfile() {
    try {
      const response = await this.githubService.getAuthenticatedUser();
      this.user = response.data;
      console.log(this.user);
      this.repos = (await this.githubService.getRepos(this.user.login)).data;
      this.contributionData = await this.githubService.getContributions(
        this.user.login,
        this.selectedYear
      );
    } catch (error) {
      console.error('Error fetching user via Octokit:', error);
    } finally {
      this.loading = false;
      this.cdr.detectChanges();
      this.renderContributionGraph();
    }
  }

  onYearSelected(year: number) {
    this.selectedYear = year;
    if (this.user)
      this.githubService.getContributions(this.user.login, this.selectedYear).then((res) => {
        this.contributionData = res;
        this.renderContributionGraph();
      });
  }

  darkThemeColors: any = {
    NONE: '#161B22',
    FIRST_QUARTILE: '#0E4429',
    SECOND_QUARTILE: '#006D32',
    THIRD_QUARTILE: '#26A641',
    FOURTH_QUARTILE: '#39D353',
  };
  colorLegend = Object.values(this.darkThemeColors)

  renderContributionGraph() {
    const weeks = this.contributionData.weeks; // 53 weeks typically
    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    // Flatten out each contribution day for scatter plot
    const x: number[] = [];
    const y: string[] = [];
    const text: string[] = [];
    const colors: string[] = [];

    weeks.forEach((week: any, weekIndex: number) => {
      week.contributionDays.forEach((day: any, dayIndex: number) => {
        x.push(weekIndex);
        y.push(daysOfWeek[dayIndex]);
        text.push(`${day.date}: ${day.contributionCount} contributions`);
        colors.push(this.darkThemeColors[day.contributionLevel]);
      });
    });

    const data: any = [
      {
        x,
        y,
        text,
        type: 'scatter',
        mode: 'markers',
        hovertemplate: '%{text}<extra></extra>',
        marker: {
          symbol: 'square',
          size: 13,
          color: colors,
          line: {
            width: 2,
            color: '#0d1117',
          },
        },
      },
    ];

    const layout: any = {
      margin: { l: 30, r: 10, t: 10, b: 10 },
      xaxis: { visible: false, range: [-1, this.contributionData.weeks.length] },

      yaxis: {
        tickfont: { size: 9, color: '#8b949e' },
        autorange: 'reversed',
        showgrid: false,
        range: [1, 5],
      },
      plot_bgcolor: '#0d1117',
      paper_bgcolor: '#0d1117',
      height: 140,
    };

    const config = { displayModeBar: false, responsive: true };

    Plotly.newPlot('contribution-graph', data, layout, config);
  }

  setActiveTab(tab: string) {
    this.activeTab = tab;
  }
}
