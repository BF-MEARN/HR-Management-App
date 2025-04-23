import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { GuestGuard } from './guards/guest.guard';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
    path: 'login',
    canActivate: [GuestGuard],
    loadChildren: () =>
      import('./pages/login/login.module').then((m) => m.LoginModule),
  },
  {
    path: 'home',
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('./pages/home/home.module').then((m) => m.HomeModule),
  },
  {
    path: 'employee-profiles',
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('./pages/employee-profiles/employee-profiles.module').then(
        (m) => m.EmployeeProfilesModule
      ),
  },
  {
    path: 'view-profile/:id',
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('./pages/view-profile/view-profile.module').then(m => m.ViewProfileModule),
  },
  { 
    path: 'visa', 
    canActivate: [AuthGuard],
    loadChildren: () => import('./pages/visa-management/visa-management.module').then(
      m => m.VisaManagementModule
    ) 
  },
  {
    path: 'hiring',
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('./pages/hiring-management/hiring-management.module').then(
        (m) => m.HiringManagementModule
      ),
  },
  {
    path: 'application-review/:id',
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('./pages/application-review/application-review.module').then(
        m => m.ApplicationReviewModule
      ),
  },
  { 
    path: 'housing', 
    canActivate: [AuthGuard],
    loadChildren: () => import('./pages/housing-management/housing-management.module').then(
      m => m.HousingManagementModule
    ) 
  },
  { path: '**', redirectTo: 'home', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
