import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/list/list.component').then((m) => m.ListComponent),
  },
  {
    path: 'pokemon/:id',
    loadComponent: () =>
      import('./features/detail/detail.component').then((m) => m.DetailComponent),
  },
  {
    path: 'favorites',
    loadComponent: () =>
      import('./features/favorite/favorite.component').then((m) => m.FavoriteComponent),
  },
  { path: '**', redirectTo: '' },
];
