import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class ApiService {
    apiKey = 'd24a256c4b745a15d3585b72b576aa3d'
    baseURL = 'https://api.openweathermap.org/data/';

    constructor(private http: HttpClient) {
    }

    LoadForecastWeather(lat: any, long?: any): Observable<any> {
        return this.http.get(`${this.baseURL}/2.5/onecall?lat=${lat}&lon=${long}&APPID=d24a256c4b745a15d3585b72b576aa3d`);
    }

    LoadCurrentWeather(city: any): Observable<any> {
        return this.http.get(`${this.baseURL}2.5/weather?q=${city}&APPID=d24a256c4b745a15d3585b72b576aa3d`);
    }
}
