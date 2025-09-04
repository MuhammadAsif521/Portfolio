import { Routes } from '@angular/router';
import { AuthGuard } from 'src/app/Admin/Server/auth.guard';

export const adminroutes: Routes = [
  {
    path: 'admin',
    children: [
      {
        path: 'login',
        loadComponent: () =>
          import('../../Admin/Pages/login/login.component').then((m) => m.LoginComponent),
      },
      {
        path: '',
        loadComponent: () =>
          import('../../Admin/Pages/admin-layout/admin-layout.component').then((m) => m.AdminLayoutComponent),
        canActivate: [AuthGuard],
        children: [
          {
            path: '',
            redirectTo: 'dashboard',
            pathMatch: 'full',
          },
          {
            path: 'dashboard',
            loadComponent: () =>
              import('../../Admin/Pages/dashboard/dashboard.component').then((m) => m.DashboardComponent),
          },
          {
            path: 'project',
            loadComponent: () =>
              import('../../Admin/Pages/admin-projects/admin-projects.component').then((m) => m.AdminProjectsComponent),
          },
          {
            path: 'add-project',
            loadComponent: () =>
              import('../../Admin/Pages/add-edit-projects/add-edit-projects.component').then((m) => m.AddEditProjectsComponent),
          },
          {
            path: 'edit-project/:id',
            loadComponent: () =>
              import('../../Admin/Pages/add-edit-projects/add-edit-projects.component').then((m) => m.AddEditProjectsComponent),
          },
          {
            path: 'messages',
            loadComponent: () =>
              import('../../Admin/Pages/messages/messages.component').then((m) => m.MessagesComponent),
          },
        ],
      },
    ],
  }
];
