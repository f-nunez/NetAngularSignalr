import { HttpClient, HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { map, Observable } from 'rxjs';
import { BaseFormComponent } from 'src/app/shared/components/base-form/base-form.component';
import { environment } from 'src/environments/environment';
import { ICity } from '../../shared/models/city';
import { ICountry } from '../../shared/models/country';

@Component({
  selector: 'app-city-edit',
  templateUrl: './city-edit.component.html',
  styleUrls: ['./city-edit.component.scss']
})
export class CityEditComponent extends BaseFormComponent implements OnInit {
  baseApiUrl: string = environment.baseApiUrl;
  title?: string;
  city?: ICity;
  id?: number;
  countries?: ICountry[];

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private http: HttpClient) {
    super();
  }

  ngOnInit(): void {
    this.form = new FormGroup({
      name: new FormControl('', Validators.required),
      lat: new FormControl('', [
        Validators.required,
        Validators.pattern(/^[-]?[0-9]+(\.[0-9]{1,4})?$/)
      ]),
      lon: new FormControl('', [
        Validators.required,
        Validators.pattern(/^[-]?[0-9]+(\.[0-9]{1,4})?$/)
      ]),
      countryId: new FormControl('', Validators.required)
    }, null, this.existsCity());

    this.loadData();
  }

  loadData() {
    this.loadCountries();
    let idParam = this.activatedRoute.snapshot.paramMap.get('id');
    this.id = idParam ? +idParam : 0;

    if (!this.id) {
      this.title = 'Create a new City';
      return;
    }

    this.http.get<ICity>(this.baseApiUrl + 'cities/' + this.id)
      .subscribe({
        next: response => {
          this.city = response;
          this.title = `Edit - ${this.city.name}`;
          this.form.patchValue(this.city);
        },
        error: error => console.log(error)
      });
  }

  onSubmit() {
    let city = this.id ? this.city : <ICity>{};
    if (city) {
      city.name = this.form.controls['name'].value;
      city.lat = this.form.controls['lat'].value;
      city.lon = this.form.controls['lon'].value;
      city.countryId = +this.form.controls['countryId'].value;

      if (this.id) {
        this.http.put<ICity>(this.baseApiUrl + 'cities/' + city.id, city)
          .subscribe({
            next: response => {
              console.log(`The City with id: ${city!.id} has been updated`);
              this.router.navigate(['/cities']);
            },
            error: error => console.log(error)
          });
      } else {
        this.http.post<ICity>(this.baseApiUrl + 'cities', city)
          .subscribe({
            next: response => {
              console.log(`The City id: ${response.id} has been created`);
              this.router.navigate(['/cities']);
            },
            error: error => console.log(error)
          });
      }
    }
  }

  existsCity() {
    return (control: AbstractControl): Observable<{ [key: string]: any } | null> => {
      let city = <ICity>{};
      city.id = this.id ? this.id : 0;
      city.name = this.form.controls['name'].value;
      city.lat = this.form.controls['lat'].value;
      city.lon = this.form.controls['lon'].value;
      city.countryId = +this.form.controls['countryId'].value;

      return this.http.post<boolean>(this.baseApiUrl + 'cities/existscity', city)
        .pipe(map(response => {
          return response ? { existsCity: true } : null;
        }));
    };
  }

  private loadCountries() {
    var params = new HttpParams()
      .set("pageIndex", "0")
      .set("pageSize", "9999")
      .set("sortColumn", "name");

    this.http.get<any>(this.baseApiUrl + 'countries', { params })
      .subscribe({
        next: response => {
          this.countries = response.data;
        },
        error: error => console.log(error)
      });
  }

}
