import { Injectable } from '@angular/core';
import { BehaviorSubject, map } from 'rxjs';
import { Ilocation, location } from '@appBase/+state/state';
import {
  HttpClient,
  HttpClientModule,
  HttpHeaders,
} from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class LocationGeoService {
  showMap = new BehaviorSubject(true);
  cityDistance = new BehaviorSubject({
    sourceLat: '',
    sourceLon: '',
    destinationLat: '',
    destinationLon: '',
  });
  showLocations = new BehaviorSubject({
    show: false,
    type: '',
    typeOfLocation: '',
    city: '',
  });
  showCityDistance = new BehaviorSubject({
    show: false,
  });
  initialIuser: location = {
    id: 1,
    country: 'Germany',
    city: 'Berlin',
    street: 'Haiser',
    county: 'Haiser',
    no: '700',
    email: 'esnkrimi@payever.com',
    phone: '+989188108019',
    lon: '28',
    lat: '28',
    title: 'Night Star',
    district: 'ROja',
    score: 0,
    web: 'www.berlin.com',
    describe: '',
    type: 'Night Club',
    submit: function (): void {},
    search: function (): object {
      return new Object();
    },
    vote: function (): void {},
    browse: function (): object {
      return new Object();
    },
  };
  localInformation = new BehaviorSubject<Ilocation>(this.initialIuser);
  formTripShow = new BehaviorSubject<boolean>(false);
  drawerType = new BehaviorSubject<string>('');

  urlGetLocation = 'https://api.geoapify.com/v1/geocode/reverse?';
  urlPostfix = '&format=json&apiKey=d611e7b9aa4a407883bd140f5181f856';

  constructor(private http: HttpClient) {}
  fetchLocationByLatlng(lat: any, lon: string) {
    let str: any;
    if (lat < 90)
      str =
        this.urlGetLocation + 'lat=' + lat + '&lon=' + lon + this.urlPostfix;
    return this.http.get(str).pipe(map((res: any) => res.results[0]));
  }

  fetchLocationByIpAddress(ipAddress: string) {
    const url = `https://burjcrown.com/drm/travel/index.php?id=51&ip=${ipAddress}`;
    return this.http.get(url);
  }

  getIPAddress() {
    return this.http.get('http://api.ipify.org/?format=json');
  }
}
