import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class LocationListsService {
  urlBase = 'https://burjcrown.com/drm/travel/index.php?';

  constructor(
    private httpClient: HttpClient,
    @Inject('userSession') public userSession: any
  ) {}
  fetchLocations() {
    this.urlBase = 'https://burjcrown.com/drm/travel/index.php?id=26';
    return this.httpClient.get(this.urlBase);
  }

  fetchSharedLocations() {
    this.urlBase = 'https://burjcrown.com/drm/travel/index.php?id=47';
    return this.httpClient.get(this.urlBase);
  }
  fetchSavedLocations() {
    this.urlBase =
      'https://burjcrown.com/drm/travel/index.php?id=50&uid=' +
      JSON.parse(this.userSession)?.id;
    return this.httpClient.get(this.urlBase);
  }

  deleteLocation(locationId: string) {
    this.urlBase =
      'https://burjcrown.com/drm/travel/index.php?id=48&locationid=' +
      locationId;
    return this.httpClient.get(this.urlBase);
  }

  setCurrentLocation(uid: string, location: string, city: string) {
    this.urlBase =
      'https://burjcrown.com/drm/travel/index.php?id=49&currentLocatin=' +
      location +
      '&uid=' +
      uid +
      '&city=' +
      city;
    return this.httpClient.get(this.urlBase);
  }
}
