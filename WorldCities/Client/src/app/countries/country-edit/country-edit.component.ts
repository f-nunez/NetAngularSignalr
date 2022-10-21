import { Component, OnInit } from '@angular/core';
import { AbstractControl, AsyncValidatorFn, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { map, Observable } from 'rxjs';
import { BaseFormComponent } from 'src/app/shared/components/base-form/base-form.component';
import { ICountry } from 'src/app/shared/models/country';
import { environment } from 'src/environments/environment';
import { CountryService } from '../country.service';

@Component({
  selector: 'app-country-edit',
  templateUrl: './country-edit.component.html',
  styleUrls: ['./country-edit.component.scss']
})
export class CountryEditComponent extends BaseFormComponent implements OnInit {
  baseApiUrl: string = environment.baseApiUrl;
  title?: string;
  country?: ICountry;
  id?: number;
  countries?: ICountry[];

  constructor(
    private fb: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private countryService: CountryService) {
    super();
  }

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
      this.countryService.get(this.id)
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
        this.countryService.put(country)
          .subscribe({
            next: response => {
              console.log("Country " + country!.id + " has been updated.");
              this.router.navigate(['/countries']);
            },
            error: error => console.log(error)
          });
      }
      else {
        this.countryService.post(country)
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
      return this.countryService.existsField(
        this.id ?? 0,
        fieldName,
        control.value)
        .pipe(map(result => {
          return (result ? { isDupeField: true } : null);
        }));
    }
  }

}
