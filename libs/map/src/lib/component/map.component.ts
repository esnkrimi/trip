import {
  AfterViewInit,
  Component,
  EventEmitter,
  Inject,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { MapService } from '@appBase/master/map/service';
import { LocationGeoService } from '@appBase/drawer.service';
import { Ilocation } from '@appBase/+state/state';
import { MapApiService } from './map.service';
import { map, tap } from 'rxjs';
import { Store } from '@ngrx/store';
import { actions } from '@appBase/+state/actions';
import {
  selectILocationTypes,
  selectLocation,
  selectUsersOfSite,
} from '@appBase/+state/select';
import { JoyrideService } from 'ngx-joyride';
import { DistancePipe } from '@appBase/pipe/distance-to-time.pipe';
import { HelpService } from 'libs/help/src/lib/component/help.service';
import { MapDetailsSetting } from '@appBase/setting';

import * as L from 'leaflet';
import 'leaflet-control-geocoder/dist/Control.Geocoder.js';
import 'leaflet-routing-machine';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'pe-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
  providers: [DistancePipe],
})
export class MapBoardComponent implements OnInit, OnChanges, AfterViewInit {
  currentPosition: any;
  colorOfRoute = ['#99d60a', '#6295f3', '#ffbc0d', '#0d3d50'];
  colorOfRouteIndex = 0;
  setting: MapDetailsSetting = {
    openModalLocationListFlag: false,
    openModalLocationFlag: false,
    toolsShow: false,
    savedLocationFlag: false,
    showCityDistanceFlag: false,
    showMap: true,
    createTripActivate: false,
    tripSelectIndex: 1,
    distanceValue: 0,
    distanceActivated: false,
    selectLocationActivated: false,
    loadingProgress: true,
    currentLocationActivated: false,
    routingActivated: false,
    showLocationsToLocationList: '',
    citySelectToLocationList: '',
  };

  @Input() typeForceChange: any;
  @Input() formTripShow: any;
  @Output() formTripShowAction = new EventEmitter<any>();
  @Input() country: any;
  @Input() city: any;
  @Input() center: any;
  @Input() state: any;
  @Input() typeFromList: any;

  @Input() showTour: any;
  @Input() tripLocations: any;
  @Input() savedLocation = false;
  @Output() zoomActivator = new EventEmitter<any>();
  private map: any;
  locationForModal: any;
  draggingLocation = {
    country: 'United States',
    city: 'New York',
    street: '',
    suburb: ' ',
  };
  distanceFrom: any;
  distanceTo: any;

  positionView: any;
  selectedType = 'restaurant';
  previous: any = null;
  distance = 0;
  fromOrTo = 'from';

  icon: any = new L.Icon({
    className: 'my-markers',
    iconUrl: 'assets/img/mall.png',
    iconSize: [30, 30],
  });
  title = '';
  locationSelected: Ilocation = {
    id: 0,
    country: '',
    city: '',
    street: '',
    county: '',
    no: '',
    email: '',
    phone: '',
    web: '',
    describe: '',
    type: '',
    lon: '',
    lat: '',
    title: '',
    district: '',
    score: 0,
  };
  cityRoutes = new Set();

  locationTypes: any = [];

  fetch() {
    const tmpArray: any = [];
    this.store.select(selectLocation).subscribe((res: any) => {
      for (let i = 0; i < res.length; i++) {
        tmpArray.push(res[i].type);
      }
      this.locationTypes = Array.from(new Set(tmpArray));
    });
  }

  constructor(
    @Inject('userSession') public userSession: any,
    @Inject('deviceIsWide') public deviceIsWide: boolean,
    private translate: TranslateService,
    private helpService: HelpService,
    private router: Router,
    private mapService: MapService,
    private geoService: LocationGeoService,
    private distancePipe: DistancePipe,
    private mapApiService: MapApiService,
    private store: Store
  ) {}

  getShowLocationState() {
    this.geoService.showLocations.subscribe((res: any) => {
      this.setting.openModalLocationListFlag = res.show;
      this.setting.savedLocationFlag = res.type;
      this.setting.savedLocationFlag = res.typeOfLocation;
      this.setting.citySelectToLocationList = res.city;
    });
  }
  getShowCityDistanceState() {
    this.geoService.showCityDistance.subscribe((res: any) => {
      this.setting.showCityDistanceFlag = res.show;
    });
  }

  setViewMylocation() {
    this.changeCenter(22);
    this.addMarker(
      this.center,
      'current',
      [44, 44],
      0,
      'https://cdn-icons-png.flaticon.com/512/4860/4860667.png'
    );
  }

  submitedForm(e: any) {
    this.setting.selectLocationActivated = e.selectLocationActivated;
    this.title = e.title;
  }

  distanceDrawer(from: any, to: any) {
    const lineLng = [from, to];
    this.setting.distanceValue = from.distanceTo(to);
    const polyline = L.polyline(lineLng, {
      smoothFactor: 50,
      noClip: false,
      color: 'purple',
      weight: 13,
      className: 'line',
    })

      .setStyle({
        fillColor: 'red',
      })
      .bindPopup(
        '<strong>' +
          Math.round(this.setting.distanceValue) / 1000 +
          'km </strong><hr>' +
          this.distancePipe.transform(this.setting.distanceValue, 'car') +
          '<br>' +
          this.distancePipe.transform(this.setting.distanceValue, 'walk')
      )

      .on('click', (event) => {
        // this.closeSnackBar();
        polyline.openPopup();
      });
    polyline.addTo(this.map);
    setTimeout(() => {
      polyline.openPopup();
    }, 100);
  }
  getMultilanguagesMessages(message: string) {
    return this.translate.get(message).subscribe((res) => {
      this.helpService.messageWrite(res);
    });
  }
  distanceActive(e: any) {
    this.addMarker(e.latlng, 'location', [30, 30]);
    if (this.fromOrTo === 'from') {
      this.distanceFrom = e.latlng;
      this.fromOrTo = 'to';
      this.setting.distanceValue = 0;

      this.getMultilanguagesMessages('destinationPoint');
    } else {
      this.getMultilanguagesMessages('selectLine');
      this.distanceTo = e.latlng;
      this.fromOrTo = 'from';
      this.distanceDrawer(this.distanceFrom, this.distanceTo);
    }
  }

  getRoute() {
    this.geoService.showMap.subscribe((res) => {
      this.setting.showMap = res;
    });
  }
  activeDistanceMeter() {
    this.setting.toolsShow = false;
    if (!this.setting.distanceActivated)
      this.getMultilanguagesMessages('startPoint');
    else this.helpService.messageWrite('');
    this.setting.distanceActivated = !this.setting.distanceActivated;
    this.setting.currentLocationActivated = false;
    this.setting.routingActivated = false;
  }
  activeRouting() {
    if (JSON.parse(this.userSession)?.id) {
      if (this.currentPosition) {
        const sourceLocation = L.latLng(JSON.parse(this.currentPosition));
        this.addMarker(
          sourceLocation,
          'current',
          [80, 88],
          0,
          'https://burjcrown.com/drm/travel/users/profile/' +
            JSON.parse(this.userSession)?.id +
            '/1.jpg?id=' +
            this.timeStamp()
        );
        this.setting.toolsShow = false;
        if (!this.setting.routingActivated)
          this.getMultilanguagesMessages('destinationPoint');
        else this.helpService.messageWrite('');
        this.setting.routingActivated = !this.setting.routingActivated;
        this.setting.currentLocationActivated = false;
        this.setting.distanceActivated = false;
      } else {
        this.alertToSelectCurrentPosition();
      }
    } else {
      this.router.navigate([{ outlets: { secondRouter: 'lazy/login' } }]);
    }
  }

  alertToSelectCurrentPosition() {
    this.getMultilanguagesMessages('setCurrentLocationAlert');
  }

  routing(destinationLocation: any) {
    this.colorOfRouteIndex =
      this.colorOfRouteIndex + 1 < 4 ? this.colorOfRouteIndex + 1 : 0;
    const colorOfRoute = this.colorOfRoute[this.colorOfRouteIndex];
    const sourceLocation = L.latLng(JSON.parse(this.currentPosition));
    const map = this.map;
    const center = this.center;
    L.Routing.control({
      showAlternatives: false,
      waypoints: [sourceLocation, destinationLocation.latlng],
      routeLine: function (route) {
        const line: any = L.Routing.line(route, {
          addWaypoints: true,
          extendToWaypoints: true,
          missingRouteTolerance: 1,
          styles: [{ color: colorOfRoute, weight: 12, stroke: true }],
        });

        if (line._route.summary.totalDistance > 500000) map?.setView(center, 5);
        else if (line._route.summary.totalDistance > 50000)
          map?.setView(center, 10);
        return line;
      },
      routeWhileDragging: false,
    }).addTo(this.map);
  }

  routingDirectLatlng(destinationLocation: any) {
    const sourceLocation = L.latLng(JSON.parse(this.currentPosition));
    L.Routing.control({
      showAlternatives: false,
      waypoints: [sourceLocation, destinationLocation],
      routeLine: function (route) {
        const line = L.Routing.line(route, {
          addWaypoints: true,
          extendToWaypoints: true,
          missingRouteTolerance: 1,
          styles: [{ color: '#99d60a', weight: 12, stroke: true }],
        });
        return line;
      },
      routeWhileDragging: false,
    }).addTo(this.map);
  }

  activeCUrrentLocation() {
    if (JSON.parse(this.userSession)?.id) {
      this.setting.routingActivated = false;
      this.setting.toolsShow = false;
      if (!this.setting.currentLocationActivated)
        this.getMultilanguagesMessages('setYourCurrent');
      else this.helpService.messageWrite('');
      this.setting.distanceActivated = false;
      this.setting.currentLocationActivated =
        !this.setting.currentLocationActivated;
    } else this.router.navigate([{ outlets: { secondRouter: 'lazy/login' } }]);
  }

  cancelTools() {
    this.setting.distanceActivated = false;
    this.setting.currentLocationActivated = false;
    this.listener(true);
    this.helpService.messageWrite('');
  }
  turnOffProgress(time: number) {
    setTimeout(() => {
      this.mapService.loadingProgress.next(false);
    }, time);
  }
  capitalizeFirstLetter(str: string): string {
    return str?.charAt(0).toUpperCase() + str?.slice(1);
  }

  fetchByCity(city: string, changedCity: boolean) {
    city = city.toLowerCase();
    if (changedCity) {
      if (!this.cityRoutes.has(city)) {
        this.cityRoutes.add(city);
        this.store.dispatch(
          actions.startFetchCountryLocationAction({
            city: this.city,
          })
        );
      }
    }
    this.store
      .select(selectLocation)
      .pipe(
        map((res) => res.filter((res) => res.saved || !this.savedLocation)),
        map((res) => res.filter((res) => this.selectedType === res?.type)),
        tap((r) => {
          if (r.length === 0) this.mapService.loadingProgress.next(false);
        })
      )
      .subscribe((data) => {
        for (let i = 0; i < data.length; i++) {
          const obj: any = {
            lat: data[i]?.lat,
            lng: data[i]?.lon,
          };
          if (obj) this.addMarker(obj, data[i]?.type, [35, 35]);
        }
      });
  }

  savedLocationActive() {
    this.map?.eachLayer((layer: any) => {
      if (!layer._url) layer.remove();
    });
    this.changeCenter(22);
    this.listener(true);
  }

  change(type: string) {
    if (type) this.setting.toolsShow = false;
    this.mapService.loadingProgress.next(true);
    this.selectedType = type === this.selectedType ? '' : type;
    this.map.eachLayer((layer: any) => {
      if (!layer._url) layer.remove();
    });
    this.listener(true);
  }
  getRouteHere(t: any) {
    const tmp = L.latLng(t.lat, t.lon);
    this.setting.openModalLocationFlag = false;
    this.routingDirectLatlng(tmp);
  }
  clickOnMap() {
    this.map.on('click', (e: any) => {
      if (this.setting.routingActivated) this.routing(e);
      else if (this.setting.distanceActivated) this.distanceActive(e);
      else if (this.setting.currentLocationActivated)
        this.setCurrentLocation(e.latlng);
      else this.bind(e);
    });
  }

  bind(e: any) {
    this.mapService.loadingProgress.next(true);
    this.zoomActivator.emit(true);
    this.locationSelected.lon = e.latlng.lng;
    this.locationSelected.lat = e.latlng.lat;
    this.geoService.localInformation.next(this.locationSelected);
  }

  bindExistsLocation(location: any) {
    this.mapService.loadingProgress.next(true);
    this.setting.openModalLocationFlag = false;
    this.zoomActivator.emit(true);
    this.locationSelected.lon = location.lon;
    this.locationSelected.lat = location.lat;
    this.geoService.localInformation.next(this.locationSelected);
  }

  async changeCenter(zoom: number) {
    this.positionView = await this.map?.setView(this.center, zoom);
  }
  getDistanceCIty() {
    this.geoService?.cityDistance?.subscribe((res) => this.cityDistance(res));
  }
  cityDistance(location: any) {
    const sourceLocation = L.latLng(location.sourceLat, location.sourceLon);
    const sourceAndDestination = L.latLng(
      location.destinationLat,
      location.destinationLon
    );
    //this.addMarker(sourceLocation, 'current', [50, 50]);
    //this.addMarker(sourceAndDestination, 'current', [50, 50]);
    if (this.map)
      L.Routing.control({
        showAlternatives: false,
        waypoints: [sourceLocation, sourceAndDestination],
        routeLine: function (route) {
          const line = L?.Routing?.line(route, {
            addWaypoints: true,
            extendToWaypoints: true,
            missingRouteTolerance: 1,
            styles: [{ color: '#99d60a', weight: 12, stroke: true }],
          });
          return line;
        },
        routeWhileDragging: true,
      })?.addTo(this.map);
    setTimeout(() => {
      this.mapService.loadingProgress.next(false);
    }, 3000);
  }
  listener(changedCity: boolean) {
    this.getDistanceCIty();
    const fetchByLocation = this.state ? this.state : this.city;
    this.fetchByCity(fetchByLocation, changedCity);
  }

  private loadMap(): void {
    this.map = L.map('map', {
      crs: L.CRS.EPSG900913,
      zoomControl: false,
    });
    L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      detectRetina: true,
    }).addTo(this.map);
    L.control
      .zoom({
        position: 'topright',
      })
      .addTo(this.map);
  }

  timeStamp() {
    return new Date().getTime();
  }

  setCurrentLocation(latlng: any) {
    const tmp = typeof latlng.lat;
    latlng.lat = String(latlng.lat);
    latlng.lng = String(latlng.lng);
    this.currentPosition = JSON.stringify(latlng);
    this.store.dispatch(
      actions.startSetCurrentLocation({
        uid: JSON.parse(this.userSession)?.id,
        myLocation: JSON.stringify(latlng),
        city: this.city,
      })
    );
    if (String(tmp) === 'number') {
      setTimeout(() => {
        this.mapService.loadingProgress.next(true);
        location.reload();
      }, 1000);
    }
    this.helpService.messageWrite('');
    this.mapService.locationPrevious.subscribe((res: any) => {
      this.mapService.loadingProgress.next(true);
      this.map.eachLayer((layer: any) => {
        if (!layer._url) layer.remove();
      });
    });
    this.mapService.locationPrevious.next(latlng);
    this.addMarker(
      latlng,
      'current',
      [80, 88],
      0,
      'https://burjcrown.com/drm/travel/users/profile/' +
        JSON.parse(this.userSession)?.id +
        '/1.jpg?id=' +
        this.timeStamp()
    );
    this.mapService.myLocation.next(latlng);
  }

  dragMap() {
    this.map.on('mouseup', (e: any) => {
      this.geoService
        .fetchLocationByLatlng(e.latlng.lat, e.latlng.lng)
        .subscribe((res) => {
          this.draggingLocation.country = res.country;
          this.draggingLocation.street =
            res.street && res.suburb ? ' - ' + res.street : res.street;
          this.draggingLocation.city =
            res.city && res.country ? ' - ' + res.city : res.city;
          this.draggingLocation.suburb = res.suburb;
          if (res.city !== this.city && res.city) {
            this.fetchByCity(res.city, true);
            this.city = res.city;
          }
        });
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.typeForceChange) this.selectedType = this.typeForceChange;
    this.draggingLocation.city = this.city;
    this.draggingLocation.country = this.country;
    this.draggingLocation = {
      country: this.country,
      city: this.city,
      street: '',
      suburb: '',
    };
    this.savedLocationActive();
    this.mapApiService.savedLocation.subscribe((res) => {
      this.changeCenter(22);
    });

    this.highlightLocation();
  }
  fetchUserLocation() {
    this.store
      .select(selectUsersOfSite)
      .pipe(
        map((res) =>
          res.filter((res: any) => res.id === JSON.parse(this.userSession)?.id)
        )
      )
      .subscribe((res: any) => {
        if (res[0]?.location?.length > 1 && res[0] !== 'undefined') {
          const tmpLocation = new L.LatLng(
            JSON.parse(res[0]?.location)?.lat,
            JSON.parse(res[0]?.location)?.lng
          );
          this.center = tmpLocation;
          this.changeCenter(22);
          this.city = res[0]?.city;
          this.fetchByCity(res[0]?.city, true);
          this.setCurrentLocation(JSON.parse(res[0]?.location));
        }
      });
  }

  ngOnInit(): void {}
  imageexists(url: any) {
    const image = new Image();
    image.src = url;
    if (image.width == 0) {
      return false;
    } else {
      return true;
    }
  }
  addMarker(
    position: any,
    icona: string,
    sizes: any,
    num?: number,
    url?: string
  ) {
    if (position) {
      let icon: any;
      if (url) {
        icon = new L.Icon({
          iconUrl: url,
          iconSize: [75, 75],
        });
      } else if (num) {
        icon = new L.Icon({
          iconUrl: `https://raw.githubusercontent.com/sheiun/leaflet-color-number-markers/main/dist/img/red/marker-icon-2x-red-${num}.png`,
          iconSize: [50, 88],
        });
      } else {
        if (this.imageexists(`assets/img/${icona}.png`))
          icon = new L.Icon({
            iconUrl: `assets/img/${icona}.png`,
            iconSize: sizes,
            className: 'custom-marker',
          });
        else
          icon = new L.Icon({
            iconUrl: `assets/img/location.png`,
            iconSize: sizes,
          });
      }
      if (this.map)
        L?.marker(position, { icon: icon })
          ?.addTo(this.map)
          .on('click', (e) => {
            if (this.setting.distanceActivated) this.distanceActive(e);
            else {
              this.popInformationOfLocation(e);
            }
            //this.bind(e);
          })
          .on('mouseover', (e) => {
            if (this.deviceIsWide) {
              this.popUpMouseOver(e);
            }
          })
          .on('mouseout', (e) => {
            //  tooltipPopup.remove();
          });
      this.turnOffProgress(1);
    }
  }
  popUpMouseOver(e: any) {
    let tooltipPopup: any;
    this.store
      .select(selectLocation)
      .pipe(
        map((res) => {
          return res.filter((res: any) => res.lat == e.target.getLatLng().lat);
        })
      )
      .subscribe((res) => {
        tooltipPopup = L.popup({
          offset: L.point(0, -20),
          closeButton: false,
          className: 'leaflet-popup',
        });
        if (res[0]?.title) {
          tooltipPopup.setContent(
            `<span class='border-bottom '>${
              res[0]?.id
            }  ) <b>${this.capitalizeFirstLetter(res[0]?.title)} ${res[0]?.type}
              </span></b>`
          );
          tooltipPopup.setLatLng(e.target.getLatLng());
          tooltipPopup.openOn(this.map);
        }
      });
  }

  popInformationOfLocation(e: any) {
    this.setting.openModalLocationFlag = true;
    this.store
      .select(selectLocation)
      .pipe(
        map((res) => {
          return res.filter((res: any) => res.lat == e.target.getLatLng().lat);
        })
      )
      .subscribe((res) => {
        this.locationForModal = res;
      });
  }
  extractRate(rate: string) {
    const tmp = rate.split('-');
    return tmp;
  }

  numberToArray(i: number) {
    const arr = ['0', '0', '0', '0', '0'];
    return arr.fill('1', 0, i);
  }
  highlightLocation() {
    //popup after location-list component
    this.store
      .select(selectLocation)
      .pipe(
        map((res) =>
          res.filter((res: any) => Number(res.lat) === Number(this.center[0]))
        )
      )
      .subscribe((res) => {
        if (res[0]?.title) {
          L.popup({
            autoClose: false,
            className: 'selected-popup',
            closeButton: false,
          })
            .setLatLng(this.center)
            .setContent(
              `<span><b>${this.capitalizeFirstLetter(res[0]?.title)} ${
                res[0]?.type
              }
          </span></b>  `
            )
            .openOn(this.map);
        }
      });
  }

  searchBox() {
    (L.Control as any)
      .geocoder({
        defaultMarkGeocode: false,
        placeholder: 'Search heres...',
      })
      .on('finishgeocode', (e: any) => {
        const result: any = [];
        let t: {
          country: '';
          city: '';
          geo: [1, 2];
        };
        const array = e.results;
        for (let i = 0; i < array.length; i++) {
          let country = array[i].name
            .split(',')
            [array[i].name.split(',').length - 1].replaceAll(' ', '-');
          country = country.slice(1, country.length);
          t = {
            country: country,
            city: array[i].name.split(',')[0].replaceAll(' ', '-'),
            geo: [array[i].center.lat, array[i].center.lng],
          };
          result.push(t);
        }
        this.store.dispatch(actions.autocompleteAction({ result: result }));
      })

      .addTo(this.map);
  }

  ngAfterViewInit(): void {
    this.loadMap();
    setTimeout(() => {
      this.fetchUserLocation();
      this.fetch();
      this.mapService.loadingProgress.next(true);
      this.getRoute();
      this.getShowLocationState();
      this.getShowCityDistanceState();
      this.fetchByCity(this.city, true);
      this.clickOnMap(); //CLICK ON MAP
      this.dragMap(); //CLICK ON MAP
      if (JSON.parse(this.userSession)?.id) this.changeCenter(22);
      else this.changeCenter(15);
    }, 1000);
    this.searchBox();
  }

  selectedLocation(event: any) {
    //select location in location-list
    this.setting.openModalLocationListFlag = false;
    this.center = [Number(event.lat), Number(event.lon)];
    this.changeCenter(22); //center focus
    this.addMarker(event, 'current', [50, 50]);
    this.highlightLocation(); //popup
  }
  openModalLocationList(toggle: boolean) {
    this.geoService.showLocations.next({
      show: toggle,
      type: '',
      typeOfLocation: '',
      city: '',
    });
    this.geoService.showCityDistance.next({
      show: toggle,
    });
  }
}
