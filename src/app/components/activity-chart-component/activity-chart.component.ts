// src/app/components/activity-chart-component/activity-chart.component.ts
import { Component, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as Plotly from 'plotly.js-dist-min';
import { activityItems } from '../../mockData';

@Component({
  selector: 'app-activity-chart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './activity-chart.component.html',
  styleUrls: ['./activity-chart.component.css'],
})
export class ActivityChartComponent implements OnInit, OnChanges {
  activityItems = activityItems;
  ngOnInit() {
    this.renderActivityChart();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes) {
      this.renderActivityChart();
    }
  }

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
}
