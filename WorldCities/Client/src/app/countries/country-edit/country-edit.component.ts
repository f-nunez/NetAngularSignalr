import { HttpClient, HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, AsyncValidatorFn, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { map, Observable } from 'rxjs';
import { ICountry } from 'src/app/shared/models/country';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-country-edit',
  templateUrl: './country-edit.component.html',
  styleUrls: ['./country-edit.component.scss']
})
export class CountryEditComponent implements OnInit {
  baseApiUrl: string = environment.baseApiUrl;
  title?: string;
  form!: FormGroup;
  country?: ICountry;
  id?: number;
  countries?: ICountry[];

  constructor(
    private fb: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private http: HttpClient) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      name: ['',
        Validators.required,
        this.existsField("name")
      ],
      iso2: ['',
        [
          Validators.required,
          Validators.pattern(/^[a-zA-Z]{2}$/)
        ],
        this.existsField("iso2")
      ],
      iso3: ['',
        [
          Validators.required,
          Validators.pattern(/^[a-zA-Z]{3}$/)
        ],
        this.existsField("iso3")
      ]
    });

    this.loadData();
  }

  loadData() {
    let idParam = this.activatedRoute.snapshot.paramMap.get('id');
    this.id = idParam ? +idParam : 0;
    if (this.id) {
      this.http.get<ICountry>(this.baseApiUrl + "countries/" + this.id)
        .subscribe({
          next: response => {
            this.country = response;
            this.title = `Edit - ${this.country.name}`;
            this.form.patchValue(this.country);
          },
          error: error => console.log(error)
        });
    }
    else {
      this.title = "Create a new Country";
    }
  }

  onSubmit() {
    var country = (this.id) ? this.country : <ICountry>{};
    if (country) {
      country.name = this.form.controls['name'].value;
      country.iso2 = this.form.controls['iso2'].value;
      country.iso3 = this.form.controls['iso3'].value;
      if (this.id) {
        this.http.put<ICountry>(this.baseApiUrl + 'countries/' + country.id, country)
          .subscribe({
            next: response => {
              console.log("Country " + country!.id + " has been updated.");
              this.router.navigate(['/countries']);
            },
            error: error => console.log(error)
          });
      }
      else {
        this.http
          .post<ICountry>(this.baseApiUrl + 'countries', country)
          .subscribe({
            next: response => {
              console.log("Country " + response.id + " has been created.");
              this.router.navigate(['/countries']);
            },
            error: error => console.log(error)
          });
      }
    }
  }

  existsField(fieldName: string): AsyncValidatorFn {
    return (control: AbstractControl): Observable<{ [key: string]: any } | null> => {
      var params = new HttpParams()
        .set("countryId", (this.id) ? this.id.toString() : "0")
        .set("fieldName", fieldName)
        .set("fieldValue", control.value);

      return this.http.post<boolean>(this.baseApiUrl + 'countries/existsfield', null, { params })
        .pipe(map(result => {
          return (result ? { existsField: true } : null);
        }));
    }
  }

}
