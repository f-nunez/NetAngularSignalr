import { ComponentFixture, TestBed } from "@angular/core/testing";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { RouterTestingModule } from '@angular/router/testing';
import { of } from "rxjs";
import { AngularMaterialModule } from "../angular-material.module";
import { IApiResult } from "../shared/models/apiResult";
import { ICity } from "../shared/models/city";
import { CitiesComponent } from "./cities.component";
import { CityService } from "./city.service";

describe('CitiesComponent', () => {
    let component: CitiesComponent;
    let fixture: ComponentFixture<CitiesComponent>;

    beforeEach(async () => {
        // Create mock cityService object with a mock 'getData' method
        let cityService = jasmine.createSpyObj<CityService>('CityService', ['getData']);
        // Configure the 'getData' spy method
        cityService.getData.and.returnValue(
            // return an Observable with some test data
            of<IApiResult<ICity>>(<IApiResult<ICity>>{
                data: [
                    <ICity>{
                        name: 'TestCity1',
                        id: 1,
                        lat: 1,
                        lon: 1,
                        countryId: 1,
                        countryName: 'TestCountry1'
                    },
                    <ICity>{
                        name: 'TestCity2',
                        id: 2,
                        lat: 2,
                        lon: 2,
                        countryId: 2,
                        countryName: 'TestCountry2'
                    },
                    <ICity>{
                        name: 'TestCity3',
                        id: 3,
                        lat: 3,
                        lon: 3,
                        countryId: 3,
                        countryName: 'TestCountry3'
                    }
                ],
                totalCount: 3,
                pageIndex: 0,
                pageSize: 10
            })
        );

        await TestBed.configureTestingModule({
            declarations: [
                CitiesComponent
            ],
            imports: [
                BrowserAnimationsModule,
                AngularMaterialModule,
                RouterTestingModule
            ],
            providers: [
                {
                    provide: CityService,
                    useValue: cityService
                }
            ]
        }).compileComponents();
    });

    beforeEach(async () => {
        fixture = TestBed.createComponent(CitiesComponent);
        component = fixture.componentInstance;
        component.paginator = jasmine.createSpyObj(
            'MatPaginator', ['length', 'pageIndex', 'pageSize']
        );
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should display a "Cities" title', () => {
        let title = fixture.nativeElement.querySelector('h1');
        expect(title.textContent).toEqual('Cities');
    });

    it('should contain a table with a list of one or more cities', () => {
        let table = fixture.nativeElement.querySelector('table.mat-table');
        let tableRows = table.querySelectorAll('tr.mat-row');
        expect(tableRows.length).toBeGreaterThan(0);
    });
});