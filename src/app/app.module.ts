import { BrowserModule } from '@angular/platform-browser'
import { NgModule } from '@angular/core'

import { AppRoutingModule } from './app-routing.module'
import { AppComponent } from './app.component'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { RouterModule, Routes } from '@angular/router'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { HttpClientModule} from '@angular/common/http'

import { MatDialogModule } from '@angular/material/dialog'
import { MatListModule } from '@angular/material/list'
import { MatTableModule } from '@angular/material/table'
import { MatCardModule } from '@angular/material/card'
import { MatChipsModule } from '@angular/material/chips'
import { MatButtonModule } from '@angular/material/button'
import { MatSnackBarModule } from '@angular/material/snack-bar'
import { MatMenuModule } from '@angular/material/menu'
import { MatSelectModule } from '@angular/material/select'
import { MatInputModule } from '@angular/material/input'
import { MAT_CHECKBOX_DEFAULT_OPTIONS, MatCheckboxDefaultOptions, MatCheckboxModule } from '@angular/material/checkbox'
import { MAT_FORM_FIELD_DEFAULT_OPTIONS, MatFormFieldModule } from '@angular/material/form-field'

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
import { SettingsComponent } from './components/settings.component'
import { AddRegistryComponent } from './components/add-registry.component'
import { RemoveConfirmationComponent } from './components/remove-confirmation.component'
import { AddPackageComponent } from './components/add-package.component'
import { AddUserComponent } from './components/add-user.component'
import {MatExpansionModule} from '@angular/material/expansion';

const routes: Routes = [
  { path: '', component: PackagesComponent },
  { path: 'settings', component: SettingsComponent },
  { path: 'registries', component: RegistriesComponent },
  { path: ':id', component: PackagesComponent },
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
    SettingsComponent,
    AddRegistryComponent,
    AddPackageComponent,
    AddUserComponent,
    RemoveConfirmationComponent,
    PackageFilterPipe
  ],
  imports: [
    RouterModule.forRoot(routes),
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
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
    MatExpansionModule
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
    {provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: {appearance: 'fill'}},
    {provide: MAT_CHECKBOX_DEFAULT_OPTIONS, useValue: { clickAction: 'noop' } as MatCheckboxDefaultOptions}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
