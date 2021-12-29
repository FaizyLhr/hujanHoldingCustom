import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './core/layout/layout.component';
import { AuthGuard } from './core/services/auth-guard.service';
import { NoAuthGuard } from './core/services/no-auth-guard.service';
import { HomeComponent } from './feature/home/home.component';

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
      { path: '', component: HomeComponent },
      {
        path: 'sponsor',
        loadChildren: () =>
          import('./feature/sponsor/sponsor.module').then(
            (m) => m.SponsorModule
          ),
        canActivate: [AuthGuard],
      },
      {
        path: 'community',
        loadChildren: () =>
          import('./feature/community/community.module').then(
            (m) => m.CommunityModule
          ),
        // canActivate: [AuthGuard],
      },
      {
        path: 'approvals',
        loadChildren: () =>
          import('./feature/approval/approval.module').then(
            (m) => m.ApprovalModule
          ),
        // canActivate: [AuthGuard],
      },
      {
        path: 'users',
        loadChildren: () =>
          import('./feature/users/users.module').then((m) => m.UsersModule),
        // canActivate: [AuthGuard],
      },
    ],
    // canActivate: [AuthGuard],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
