import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './core/layout/layout.component';
import { NoAuthGuard } from './core/services/no-auth-guard.service';

const routes: Routes = [
  { path: '', redirectTo: '/auth', pathMatch: 'full' },
  {
    path: 'auth',
    loadChildren: () =>
      import('./feature/auth/auth.module').then((m) => m.AuthModule),
    // canActivate: [NoAuthGuard],
  },
  {
    path: 'home',
    component: LayoutComponent,
    children: [
      {
        path: '',
        loadChildren: () =>
          import('./feature/home/home.module').then((m) => m.HomeModule),
      },
      {
        path: 'sponsor',
        loadChildren: () =>
          import('./feature/sponsor/sponsor.module').then(
            (m) => m.SponsorModule
          ),
      },
      {
        path: 'community',
        loadChildren: () =>
          import('./feature/community/community.module').then(
            (m) => m.CommunityModule
          ),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
