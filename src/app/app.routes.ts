import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./core/components/layout/layout.component').then(
        (m) => m.LayoutComponent
      ),
    children: [
      {
        path: 'home',
        loadComponent: () =>
          import('./home/home.page').then((m) => m.HomePage),
        data: { animation: 'HomePage' },
      },
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full',
      },
      {
        path: 'about',
        loadComponent: () =>
          import('./about/about.page').then((m) => m.AboutPage),
        data: { animation: 'AboutPage' },
      },
      {
        path: 'projects',
        loadComponent: () =>
          import('./projects/projects.page').then((m) => m.ProjectsPage),
        data: { animation: 'ProjectsPage' },
      },
      {
        path: 'contact',
        loadComponent: () =>
          import('./contact/contact.page').then((m) => m.ContactPage),
        data: { animation: 'ContactPage' },
      },
      {
        path: 'skills',
        loadComponent: () =>
          import('./skills/skills.page').then((m) => m.SkillsPage),
        data: { animation: 'SkillsPage' },
      },
    ],
  },
];
