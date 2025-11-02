// src/app/components/contribution-graph-component/contribution-graph.component.ts
import {
  ChangeDetectorRef,
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import * as Plotly from 'plotly.js-dist-min';
import { GithubService } from '../../github.service';
import { ActivityChartComponent } from '../activity-chart-component/activity-chart.component';

@Component({
  selector: 'app-contribution-graph',
  standalone: true,
  imports: [CommonModule, ActivityChartComponent],
  templateUrl: './contribution-graph.component.html',
  styleUrls: ['./contribution-graph.component.css'],
})
export class ContributionGraphComponent implements OnInit, OnChanges {
  @Input() userLogin: string = '';
  currentYear: number = new Date().getFullYear();
  years: number[] = [];
  selectedYear: number = this.currentYear;
  contributionData: any;

  darkThemeColors: any = {
    NONE: '#161B22',
    FIRST_QUARTILE: '#0E4429',
    SECOND_QUARTILE: '#006D32',
    THIRD_QUARTILE: '#26A641',
    FOURTH_QUARTILE: '#39D353',
  };
  colorLegend = Object.values(this.darkThemeColors);

  constructor(private cdr: ChangeDetectorRef, private githubService: GithubService) {}

  ngOnInit() {
    for (let i = 0; i < 10; i++) {
      this.years.push(this.currentYear - i);
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['userLogin'] && this.userLogin && !changes['userLogin'].firstChange) {
      this.loadContributions();
    } else if (changes['userLogin'] && this.userLogin && changes['userLogin'].firstChange) {
      setTimeout(() => this.loadContributions(), 0);
    }
    if ((changes['contributionData'] || changes['selectedYear']) && this.contributionData) {
      this.renderContributionGraph();
    }
  }

  async loadContributions() {
    try {
      this.contributionData = await this.githubService.getContributions(
        this.userLogin,
        this.selectedYear
      );
      this.cdr.detectChanges();
      this.renderContributionGraph();
    } catch (error) {
      console.error('Error fetching contributions:', error);
    }
  }

  onYearSelected(year: number) {
    this.selectedYear = year;
    if (this.userLogin)
      this.githubService.getContributions(this.userLogin, this.selectedYear).then((res) => {
        this.contributionData = res;
        this.renderContributionGraph();
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
}
