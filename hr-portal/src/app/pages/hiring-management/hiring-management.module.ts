import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';

import { OnboardingEffects } from 'src/app/store/onboarding/onboarding.effects';
import { onboardingReducer } from 'src/app/store/onboarding/onboarding.reducer';
import { TokenEffects } from 'src/app/store/token/token.effects';
import { tokenReducer } from 'src/app/store/token/token.reducers';

import { InviteFormModalComponent } from './components/invite-form-modal/invite-form-modal.component';
import { OnboardingApplicationsComponent } from './components/onboarding-applications/onboarding-applications.component';
import { TokenHistoryComponent } from './components/token-history/token-history.component';
import { HiringManagementRoutingModule } from './hiring-management-routing.module';
import { HiringManagementComponent } from './hiring-management.component';

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
