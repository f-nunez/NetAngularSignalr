import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CitiesComponent } from './cities/cities.component';
import { CityEditComponent } from './cities/city-edit/city-edit.component';
import { AuthGuard } from './core/guards/auth.guard';
import { CountriesComponent } from './countries/countries.component';
import { CountryEditComponent } from './countries/country-edit/country-edit.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';

const routes: Routes = [
  { path: '', component: HomeComponent, pathMatch: 'full' },
  { path: 'cities', component: CitiesComponent },
  { path: 'city', component: CityEditComponent, canActivate: [AuthGuard] },
  { path: 'city/:id', component: CityEditComponent, canActivate: [AuthGuard] },
  { path: 'countries', component: CountriesComponent },
  { path: 'country', component: CountryEditComponent, canActivate: [AuthGuard] },
  { path: 'country/:id', component: CountryEditComponent, canActivate: [AuthGuard] },
  { path: 'login', component: LoginComponent }
];

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule { }
