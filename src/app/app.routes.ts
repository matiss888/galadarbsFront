import { Routes } from '@angular/router';

export const routes: Routes = [
    { path: '', redirectTo: '/login', pathMatch: 'full'},
    { path: 'login', loadComponent: () => import('./login/login').then(p => p.Login), title:'Login'},
    { path: 'home', loadComponent: () => import('./home/home').then(p => p.Home), title:'Home'}
];
