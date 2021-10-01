import {Component, OnInit} from '@angular/core';
import {ApiService} from "../../api.service";
import * as moment from "moment";

@Component({
  selector: 'app-weather',
  templateUrl: './weather.component.html',
  styleUrls: ['./weather.component.scss']
})
export class WeatherComponent implements OnInit {

  listFilter: any;
  city: any;
  showForecast: boolean = false;
  forecastData: any = {};
  noFound: string = 'Enter the city name to show weather';

  constructor(private forecastService: ApiService) {
  }

  ngOnInit() {
  }

  dateFormat(timestamp: any) {
    return moment.unix(timestamp).format("DD MMM YYYY");
  }

  loadForecastWeather(lat?: any, long?: any, city?: any) {
    this.forecastService.LoadForecastWeather(lat, long).subscribe(
      res => {
        this.noFound = '';
        this.forecastData.name = city;
        this.forecastData.details = [];
        res.daily.map((re: any, i: any) => {
          if (i <= 4) {
            this.forecastData.details.push({
              date: this.dateFormat(re.dt),
              maxTemperature: this.fToC(re.temp.max),
              morningTemp: this.fToC(re.temp.morn),
              nightTemp: this.fToC(re.temp.night),
              dayTemp: this.fToC(re.temp.day),
              meanTemp: this.fToC(((re.temp.day + re.temp.eve + re.temp.max + re.temp.min + re.temp.morn + re.temp.night) / 6)),
              mode: this.fToC(this.mode([re.temp.day, re.temp.eve, re.temp.max, re.temp.min, re.temp.morn, re.temp.night])[0]),
              minTemperature: this.fToC(re.temp.min),
              humidity: re.humidity,
              description: re.weather[0].description,
              icon: res.daily[i].weather[0].icon,
            });//Pushing the data to the to created object
          }
        })
        this.showForecast = true;
      }, error => {
        console.log(error, 'asdasdasd');
      }
    )
  }

  fToC(fahrenheit: any) {
    return (fahrenheit - 274.15).toFixed(2) + '\xB0C';
  }

  mode(numbers: any) {
    // as result can be bimodal or multi-modal,
    // the returned result is provided as an array
    // mode of [3, 5, 4, 4, 1, 1, 2, 3] = [1, 3, 4]
    let modes = [];
    let count: any = [];
    let i;
    let number;
    let maxIndex = 0;

    for (i = 0; i < numbers.length; i += 1) {
      number = numbers[i];
      count[number] = (count[number] || 0) + 1;
      if (count[number] > maxIndex) {
        maxIndex = count[number];
      }
    }

    for (i in count)
      if (count.hasOwnProperty(i)) {
        if (count[i] === maxIndex) {
          modes.push(Number(i));
        }
      }
    return modes;
  }

  loadCurrentWeather() {
    this.forecastService.LoadCurrentWeather(this.city).subscribe(
      res => {
        this.loadForecastWeather(res.coord.lat, res.coord.lon, res.name)
      }, error => {
        this.forecastData = null;
        this.showForecast = false;
        this.noFound = error.error.message;
      }
    )
  }
}
