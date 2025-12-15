import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { AuthGuard } from './guards/auth.guard';
import { RefugisComponent } from './pages/refugis/refugis.component';
import { RutesComponent } from './pages/rutes/rutes.component';
import { ViesFerradesComponent } from './pages/vies-ferrades/vies-ferrades.component';


import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', loadComponent: () => import('./pages/register/register.component').then(m => m.RegisterComponent) },
  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', loadComponent: () => import('./pages/dashboard/dashboard.component').then(m => m.DashboardComponent) },
      { path: 'refugis', component: RefugisComponent },
      { path: 'perfil', loadComponent: () => import('./pages/perfil/perfil.component').then(m => m.PerfilComponent) },
      { path: 'refugis/:id', loadComponent: () => import('./pages/refugi-detall/refugi-detall.component').then(m => m.RefugiDetallComponent) },
      { path: 'refugi/:id', loadComponent: () => import('./pages/refugi-detall/refugi-detall.component').then(m => m.RefugiDetallComponent) },
      { path: 'rutes', component: RutesComponent },
      { path: 'rutes/:id', loadComponent: () => import('./pages/ruta-detall/ruta-detall.component').then(m => m.RutaDetallComponent) },
      { path: 'pics', loadComponent: () => import('./pages/pics/pics.component').then(m => m.PicsComponent) },
      { path: 'pics/:id', loadComponent: () => import('./pages/pic-detall/pic-detall.component').then(m => m.PicDetallComponent) },
      { path: 'estanys', loadComponent: () => import('./pages/estanys/estanys.component').then(m => m.EstanysComponent) },
      { path: 'estanys/:id', loadComponent: () => import('./pages/estany-detall/estany-detall.component').then(m => m.EstanyDetallComponent) },
      { path: 'vies-ferrades', component: ViesFerradesComponent },
      { path: 'vies-ferrades/:id', loadComponent: () => import('./pages/vies-ferrades-detall/vies-ferrades-detall.component').then(m => m.ViesFerradesDetallComponent) },
    ]
  },

  // Sempres ha de ser l'ultima
  { path: '**', redirectTo: 'login' }
];