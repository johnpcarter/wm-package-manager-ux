import { BrowserModule } from '@angular/platform-browser'
import { NgModule } from '@angular/core'

import { AppRoutingModule } from './app-routing.module'
import { AppComponent } from './app.component'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { RouterModule, Routes } from '@angular/router'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import {HttpClient, HttpClientModule} from '@angular/common/http'

import { MarkdownModule } from 'ngx-markdown'

import { MatSnackBarModule } from '@angular/material/snack-bar'

import { MatLegacyListModule as MatListModule } from '@angular/material/legacy-list'
import { MatLegacyCardModule as MatCardModule } from '@angular/material/legacy-card'
import { MatLegacyChipsModule as MatChipsModule } from '@angular/material/legacy-chips'
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button'
import { MatLegacyMenuModule as MatMenuModule } from '@angular/material/legacy-menu'
import { MatLegacySelectModule as MatSelectModule } from '@angular/material/legacy-select'
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input'
import { MatExpansionModule } from '@angular/material/expansion'
import { MatLegacySlideToggleModule as MatSlideToggleModule } from '@angular/material/legacy-slide-toggle'
import { MatLegacyRadioModule as MatRadioModule } from '@angular/material/legacy-radio'
import { MAT_LEGACY_CHECKBOX_DEFAULT_OPTIONS as MAT_CHECKBOX_DEFAULT_OPTIONS, MatLegacyCheckboxDefaultOptions as MatCheckboxDefaultOptions, MatLegacyCheckboxModule as MatCheckboxModule } from '@angular/material/legacy-checkbox'
import { MAT_LEGACY_FORM_FIELD_DEFAULT_OPTIONS as MAT_FORM_FIELD_DEFAULT_OPTIONS, MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field'
import { MatTableModule } from '@angular/material/table'
import { MatTabsModule } from '@angular/material/tabs'
import { MatButtonToggleModule } from '@angular/material/button-toggle'
import { MatDialogModule } from '@angular/material/dialog'

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome'

import { PackagesComponent } from './components/packages.component'
import { RegistriesService } from './services/registries.service'
import { PackagesServices } from './services/packages.service'
import { RegistriesComponent } from './components/registries.component'
import { PackageFilterPipe } from './support/package-filter.pipe'
import { PackageDetailsComponent } from './components/package-details.component'
import { TagInfoComponent } from './components/tag-info.component'
import { SettingsService } from './services/settings.service'
import { LoginComponent } from './components/login.component'
import { LoginPageComponent } from './components/login-page.component'
import { LoginModalComponent } from './components/login-modal.component'
import { SettingsComponent } from './components/settings.component'
import { AddRegistryComponent } from './components/add-registry.component'
import { RemoveConfirmationComponent } from './components/remove-confirmation.component'
import { AddPackageComponent } from './components/add-package.component'
import { AddUserComponent } from './components/add-user.component'
import { ListRegistriesComponent } from './components/list-registries.component'
import { NotificationsService } from './services/notifications-service'
import { ListPackagesRegistriesComponent } from './components/list-package-registries.component'
import { ManageUsersComponent } from './components/manage-users.component'
import {CreateAccessTokenComponent} from './components/create-access-token.component'


const routes: Routes = [
  { path: '', component: PackagesComponent },
  { path: 'package/:packageName', component: PackageDetailsComponent },
  { path: 'login/:registry', component: LoginPageComponent},
  { path: 'login', component: LoginPageComponent},
  { path: 'settings', component: SettingsComponent },
  { path: 'registries', component: RegistriesComponent },
  { path: ':registry', component: PackagesComponent },
  { path: '**', component: PackagesComponent }
]

@NgModule({
  declarations: [
    AppComponent,
    RegistriesComponent,
    PackagesComponent,
    PackageDetailsComponent,
    TagInfoComponent,
    LoginComponent,
    LoginPageComponent,
    LoginModalComponent,
    SettingsComponent,
    AddRegistryComponent,
    AddPackageComponent,
    AddUserComponent,
    CreateAccessTokenComponent,
    ManageUsersComponent,
    RemoveConfirmationComponent,
    ListRegistriesComponent,
    ListPackagesRegistriesComponent,
    PackageFilterPipe,
  ],
  imports: [
    RouterModule.forRoot(routes),
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    MarkdownModule.forRoot({ loader: HttpClient }),
    FontAwesomeModule,
    MatDialogModule,
    MatListModule,
    MatTableModule,
    MatCardModule,
    MatChipsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatMenuModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatCheckboxModule,
    MatExpansionModule,
    MatSlideToggleModule,
    MatRadioModule,
    MatTabsModule,
    MatButtonToggleModule
  ],
  exports: [
    RouterModule,
    MatListModule,
    MatDialogModule,
    MatSnackBarModule
  ],
  providers: [
    RegistriesService,
    PackagesServices,
    SettingsService,
    NotificationsService,
    {provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: {appearance: 'fill'}},
    {provide: MAT_CHECKBOX_DEFAULT_OPTIONS, useValue: { clickAction: 'noop' } as MatCheckboxDefaultOptions}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
