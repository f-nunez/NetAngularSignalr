import { ComponentFixture, TestBed } from "@angular/core/testing";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { RouterTestingModule } from '@angular/router/testing';
import { AngularMaterialModule } from "../angular-material.module";
import { CitiesComponent } from "./cities.component";

describe('CitiesComponent', () => {
    let component: CitiesComponent;
    let fixture: ComponentFixture<CitiesComponent>;

    beforeEach(async () => {
        // TODO: declare and initialize required providers
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
                // TODO: reference required
            ]
        }).compileComponents();
    });

    beforeEach(async () => {
        fixture = TestBed.createComponent(CitiesComponent);
        component = fixture.componentInstance;
        // TODO: configure fixture/component/children/etc
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
    // TODO: implement some other tests
});