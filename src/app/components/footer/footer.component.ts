import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css'],
})
export class FooterComponent {
  currentYear = new Date().getFullYear();

  links = [
    {
      name: 'Terms',
      url: 'https://docs.github.com/site-policy/github-terms/github-terms-of-service',
    },
    {
      name: 'Privacy',
      url: 'https://docs.github.com/site-policy/privacy-policies/github-privacy-statement',
    },
    { name: 'Security', url: 'https://github.com/security' },
    { name: 'Status', url: 'https://www.githubstatus.com/' },
    { name: 'Community', url: 'https://github.com/community' },
    { name: 'Docs', url: 'https://docs.github.com' },
    { name: 'Contact', url: 'https://support.github.com' },
    { name: 'Manage cookies', url: '#' },
    { name: 'Do not share my personal information', url: '#' },
  ];
}
