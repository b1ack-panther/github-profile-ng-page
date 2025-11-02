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
      this.renderActivityChart();
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
  colorLegend = Object.values(this.darkThemeColors);

  renderActivityChart() {
    // Data points
    const dataPoints = {
      r: [100, 20, 50, 2],
      theta: ['Commits', 'Code review', 'Issues', 'Pull requests'],
      labels: ['100%', '20%', '50%', '2%'],
    };

    const chartData: Plotly.Data[] = [
      {
        type: 'scatterpolar',
        r: dataPoints.r,
        theta: dataPoints.theta,
        fill: 'toself',
        fillcolor: 'rgba(57, 211, 83, 0.38)',
        line: {
          color: 'rgba(57, 211, 83, 0)',
          width: 2,
        },
        mode: 'lines',
        hoverinfo: 'none',
      },
    ];

    const layout: any = {
      margin: { l: 80, r: 80, t: 60, b: 60 },
      height: 280,
      width: 320,
      plot_bgcolor: 'rgba(0,0,0,0)',
      paper_bgcolor: 'rgba(0,0,0,0)',
      showlegend: false,
      polar: {
        bgcolor: 'rgba(0,0,0,0)',
        radialaxis: {
          visible: false,
          range: [0, 100],
          gridwidth: 0,
        },
        angularaxis: {
          visible: true,
          showticklabels: false,
          showline: true,
          linecolor: 'rgba(134, 134, 134, 0)',
          linewidth: 2, // Thicker axis lines
          gridcolor: '#2e6f45ff',
          gridwidth: 2, // Thicker cross lines
          direction: 'clockwise',
          rotation: 90,
        },
      },
      annotations: [
        // Commits - Top
        {
          x: 0.5,
          y: 1.15,
          xref: 'paper',
          yref: 'paper',
          text: `<b style="color:#c9d1d9">${dataPoints.labels[0]}</b><br><span style="color:#8b949e;font-size:10px">${dataPoints.theta[0]}</span>`,
          showarrow: false,
          font: { size: 12 },
          xanchor: 'center',
          yanchor: 'bottom',
        },
        // Code review - Right
        {
          x: 1,
          y: 0.5,
          xref: 'paper',
          yref: 'paper',
          text: `<b style="color:#c9d1d9">${dataPoints.labels[1]}</b><br><span style="color:#8b949e;font-size:10px">${dataPoints.theta[1]}</span>`,
          showarrow: false,
          font: { size: 12 },
          xanchor: 'left',
          yanchor: 'middle',
        },
        // Issues - Bottom
        {
          x: 0.5,
          y: -0.15,
          xref: 'paper',
          yref: 'paper',
          text: `<b style="color:#c9d1d9">${dataPoints.labels[2]}</b><br><span style="color:#8b949e;font-size:10px">${dataPoints.theta[2]}</span>`,
          showarrow: false,
          font: { size: 12 },
          xanchor: 'center',
          yanchor: 'top',
        },
        // Pull requests - Left
        {
          x: 0,
          y: 0.5,
          xref: 'paper',
          yref: 'paper',
          text: `<b style="color:#c9d1d9">${dataPoints.labels[3]}</b><br><span style="color:#8b949e;font-size:10px">${dataPoints.theta[3]}</span>`,
          showarrow: false,
          font: { size: 12 },
          xanchor: 'right',
          yanchor: 'middle',
        },
      ],
    };

    Plotly.newPlot('activity-radar-chart', chartData, layout, {
      displayModeBar: false,
      staticPlot: true,
    });
  }

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
