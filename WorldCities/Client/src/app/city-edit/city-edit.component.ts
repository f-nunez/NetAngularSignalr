import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { ICity } from '../shared/models/city';

@Component({
  selector: 'app-city-edit',
  templateUrl: './city-edit.component.html',
  styleUrls: ['./city-edit.component.scss']
})
export class CityEditComponent implements OnInit {
  baseApiUrl: string = environment.baseApiUrl;
  title?: string;
  form!: FormGroup;
  city?: ICity;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private http: HttpClient
  ) { }

  ngOnInit(): void {
    this.form = new FormGroup({
      name: new FormControl(''),
      lat: new FormControl(''),
      lon: new FormControl('')
    });

    this.loadData();
  }

  loadData() {
    let idParam = this.activatedRoute.snapshot.paramMap.get('id');
    let id = idParam ? +idParam : 0;
    this.http.get<ICity>(this.baseApiUrl + 'cities/' + id)
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
    let city = this.city;

    if (!city) return;

    city.name = this.form.controls['name'].value;
    city.lat = this.form.controls['lat'].value;
    city.lon = this.form.controls['lon'].value;
    this.http.put<ICity>(this.baseApiUrl + 'cities/' + city.id, city)
      .subscribe({
        next: response => {
          console.log(`The City with id: ${city!.id} has been updated`);
          this.router.navigate(['/cities']);
        },
        error: error => console.log(error)
      });
  }

}
