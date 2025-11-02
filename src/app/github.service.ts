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

  getUser(username: string) {
    return this.octokit.request('GET /users/{username}', { username });
  }

  getRepos(username: string) {
    return this.octokit.request('GET /users/{username}/repos', { username, per_page: 6 });
  }

  async getContributions(username: string, year: number) {
    // 1. Define the start and end dates for the year
    const fromDate = `${year}-01-01T00:00:00Z`;
    const toDate = `${year}-12-31T23:59:59Z`;

    const data: any = await this.gql(
      // 2. Add $from and $to variables to the root query
      // The variables must be of type DateTime!
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
        // 3. Pass all three variables to the query execution
        login: username,
        from: fromDate, // New variable
        to: toDate, // New variable
      }
    );

    // The rest of your return logic remains the same
    return data.user.contributionsCollection.contributionCalendar;
  }

  // Example Call: To get contributions for the year 2024
  // this.getContributions('your-username', 2024);
}
