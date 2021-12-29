import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './core/layout/layout.component';
import { NoAuthGuard } from './core/services/no-auth-guard.service';
import { HomeComponent } from './feature/home/home.component';

const routes: Routes = [
  { path: '', redirectTo: '/auth', pathMatch: 'full' },
  {
    path: 'auth',
    loadChildren: () =>
      import('./feature/auth/auth.module').then((m) => m.AuthModule),
    canActivate: [NoAuthGuard],
  },
  {
    path: 'home',
    component: LayoutComponent,
    children: [
      { path: '', component: HomeComponent },
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
      {
        path: 'approvals',
        loadChildren: () =>
          import('./feature/approval/approval.module').then(
            (m) => m.ApprovalModule
          ),
      },
      {
        path: 'users',
        loadChildren: () =>
          import('./feature/users/users.module').then((m) => m.UsersModule),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
