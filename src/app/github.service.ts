import { Injectable } from '@angular/core';
import { Octokit } from '@octokit/rest';
import { graphql } from '@octokit/graphql';

@Injectable({ providedIn: 'root' })
export class GithubService {
  private octokit = new Octokit({
    auth: '<TOKEN>',
  });

  private gql = graphql.defaults({
    headers: {
      authorization: `Bearer <TOKEN>`,
    },
  });

  getAuthenticatedUser() {
    return this.octokit.request('GET /user');
  }

  getRepos(username: string) {
    return this.octokit.request('GET /users/{username}/repos', { username, per_page: 6 });
  }

  async getContributions(username: string, year: number) {
    const fromDate = `${year}-01-01T00:00:00Z`;
    const toDate = `${year}-12-31T23:59:59Z`;

    const data: any = await this.gql(
      `
      query ($login: String!, $from: DateTime!, $to: DateTime!) {
        user(login: $login) {
          contributionsCollection(from: $from, to: $to) { 
            contributionCalendar {
              totalContributions
              weeks {
                contributionDays {
                  date
                  contributionCount
                  color
                  contributionLevel
                }
              }
            }
          }
        }
      }`,
      {
        login: username,
        from: fromDate,
        to: toDate,
      }
    );

    return data.user.contributionsCollection.contributionCalendar;
  }
}
