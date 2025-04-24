import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { tokenReducer } from 'src/app/store/token/token.reducers';
import { TokenEffects } from 'src/app/store/token/token.effects';


import { HiringManagementRoutingModule } from './hiring-management-routing.module';
import { HiringManagementComponent } from './hiring-management.component';
import { InviteFormModalComponent } from './components/invite-form-modal/invite-form-modal.component';
import { TokenHistoryComponent } from './components/token-history/token-history.component';
import { MatCardModule } from '@angular/material/card';
import { OnboardingApplicationsComponent } from './components/onboarding-applications/onboarding-applications.component';
import { MatIconModule } from '@angular/material/icon';
import { onboardingReducer } from 'src/app/store/onboarding/onboarding.reducer';
import { OnboardingEffects } from 'src/app/store/onboarding/onboarding.effects';

@NgModule({
  declarations: [HiringManagementComponent, OnboardingApplicationsComponent, InviteFormModalComponent, TokenHistoryComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    HttpClientModule,
    HiringManagementRoutingModule,
    StoreModule.forFeature('token', tokenReducer),
    StoreModule.forFeature('onboarding', onboardingReducer),
    EffectsModule.forFeature([TokenEffects, OnboardingEffects]),

    // Angular Material modules used in dialog
    MatFormFieldModule,
    MatInputModule,
    MatDialogModule,
    MatButtonModule,
    MatSnackBarModule,
    MatTableModule,
    MatCardModule,
    MatTabsModule,
    MatIconModule,
  ],
})
export class HiringManagementModule {}
