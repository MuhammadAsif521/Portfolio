import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./core/components/layout/layout.component').then(m => m.LayoutComponent),
    children: [
      {
        path: 'home',
        loadComponent: () =>
          import('./Pages/home/home.page').then(m => m.HomePage),
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
          import('./Pages/about/about.page').then(m => m.AboutPage),
        data: { animation: 'AboutPage' },
      },
      {
        path: 'projects',
        loadComponent: () =>
          import('./Pages/projects/projects.page').then(m => m.ProjectsPage),
        data: { animation: 'ProjectsPage' },
      },
      {
        path: 'contact',
        loadComponent: () =>
          import('./Pages/contact/contact.page').then(m => m.ContactPage),
        data: { animation: 'ContactPage' },
      },
      {
        path: 'skills',
        loadComponent: () =>
          import('./Pages/skills/skills.page').then(m => m.SkillsPage),
        data: { animation: 'SkillsPage' },
      },
      {
        path: 'project-details/:id',
        loadComponent: () =>
          import('./Pages/project-details/project-details.page').then(m => m.ProjectDetailsPage),
        data: { animation: 'ProjectDetailsPage' },
      },
    ],
  },
];

