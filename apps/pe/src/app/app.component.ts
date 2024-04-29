import {
  Component,
  Inject,
  OnInit,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { LocationGeoService } from './drawer.service';
import { Router } from '@angular/router';
import { IScope, Iuser } from '@appBase/+state/state';
import { EntryService } from './lazy/entry/entry.service';
import { Store } from '@ngrx/store';
import { MapService } from './master/map/service';
import { APPSetting, SettingService } from './setting';
import { actions } from './+state/actions';
import { MapApiService } from 'libs/map/src/lib/component/map.service';
import { selectAllTrips, selectTripRequests } from './+state/select';
import { MatDialog } from '@angular/material/dialog';
import { ChangeDetectorRef, AfterContentChecked } from '@angular/core';
@Component({
  selector: 'pe-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
})
export class AppComponent implements OnInit, AfterContentChecked {
  @ViewChild('drawer')
  showMap = true;
  typeFromList = '';
  setting: APPSetting = {
    showMap: true,
    open: true,
    SelectedLanguage: '',
    openModalLocationRoute: false,
    loadingProgress: false,
    savedLocationFlag: false,
    bgLoader: false,
    showTour: false,
  };

  skip = -1;
  scope: IScope;
  drawerTypeTmp = '';
  tmpUser: Iuser = {
    id: '',
    name: '',
    lname: '',
    email: '',
    mobile: '',
    password: '',
  };

  constructor(
    private mapService: MapService,
    @Inject('userSession') public userSession: string,
    @Inject('deviceIsWide') public deviceIsWide: any,
    private translate: TranslateService,
    private draswerService: LocationGeoService,
    private settingService: SettingService,
    private router: Router,
    private entryService: EntryService,
    private store: Store,
    private mapApiService: MapApiService,
    private drawerService: LocationGeoService,
    public dialog: MatDialog,
    private changeDetector: ChangeDetectorRef
  ) {}
  ngAfterContentChecked(): void {
    this.changeDetector.detectChanges();
  }
  users() {
    this.store.dispatch(actions.startFetchUsersOfSites());
  }
  zoomActivatorFunction() {
    this.openDialoge();
  }

  fetchTrip() {
    if (JSON.parse(this.userSession)?.id)
      this.store.dispatch(actions.startFetchTrip());
  }
  savedLocation(e: any) {
    this.setting.savedLocationFlag = e;
  }
  getRoute() {
    this.drawerService.showMap.subscribe((res: boolean) => {
      this.showMap = res;
    });
  }
  fetchMyTripRequests() {
    const uid = JSON.parse(this.userSession)?.id;
    if (uid)
      this.store.dispatch(actions.getStartFetchMyTripRequests({ uid: uid }));
  }
  fetchRequests() {
    const uid = JSON.parse(this.userSession)?.id;
    if (uid)
      this.store.dispatch(actions.getStartFetchTripRequests({ uid: uid }));
  }
  fetchAllUserRates() {
    this.store.dispatch(actions.getStartFetchUserRates());
  }
  fetchAllTrips() {
    this.store.dispatch(actions.startFetchAllTrips());
  }
  fetchUserOfTrip() {
    this.store.dispatch(actions.startFetchUsersOfTrip());
  }
  fetchUsersOfTrips() {
    const requestsAll: any = [
      {
        tripTitle: '',
        users: [],
      },
    ];
    this.store.select(selectAllTrips).subscribe((res) => {
      for (let i = 0; i < res.length; i++) {
        for (let j = 0; j < res[i].tripjson.length; j++) {
          requestsAll.push({
            tripTitle: res[i]?.tripjson[j]?.title,
            users: [],
          });
        }
      }
      this.store.select(selectTripRequests).subscribe((res) => {
        for (let i = 0; i < requestsAll.length; i++) {
          for (let j = 0; j < res.length; j++) {
            if (res[j].tripTitle === requestsAll[i].tripTitle)
              requestsAll[i].users.push({
                name: res[j].reqUserName,
                family: res[j].reqUserFamily,
                confirmed: res[j].adminConfirm,
                uid: res[j].uid,
              });
          }
        }
      });
    });
  }
  fetchLocationTypes() {
    this.store.dispatch(actions.startFetchLocationType());
  }

  fetchSharedLocation() {
    this.store.dispatch(actions.startFetchShareLocation());
  }
  fetchSavedLocation() {
    this.store.dispatch(actions.startFetchSavedLocations());
  }

  ngOnInit(): void {
    this.fetchSavedLocation();
    this.fetchSharedLocation();
    this.fetchLocationTypes();
    this.getRoute();
    this.users();
    this.fetchRequests();
    this.fetchUsersOfTrips();
    this.fetchAllTrips();
    this.fetchAllUserRates();
    this.fetchMyTripRequests();
    this.fetchUserOfSite();
    this.mapApiService.bgLoader.subscribe((res) => {
      this.setting.bgLoader = res;
    });

    this.fetchTrip();
    this.settingService.language.subscribe((res) => {
      this.setting.SelectedLanguage = res;
      this.translate.setDefaultLang(res);
      this.translate.use(res);
    });
    this.mapService.loadingProgress.next(true);
    const tmpUser = JSON.parse(this.userSession);
    if (tmpUser) {
      this.tmpUser = {
        id: tmpUser.id,
        name: tmpUser.name,
        lname: tmpUser.lname,
        email: tmpUser.email,
        mobile: '',
        password: '',
      };
      this.entryService.userLoginInformation.next(this.tmpUser);
    }
    this.listener();
    setTimeout(() => {
      this.skip = 0;
    }, 2000);
    this.fetchUserOfTrip();
  }

  showTours() {
    this.setting.showTour = true;
    this.skip = 2;
  }

  skipNext() {
    this.skip = 3;
  }

  fetchUserOfSite() {
    this.store.dispatch(actions.startFetchUsersOfSites());
  }
  resultOutputs(e: IScope) {
    this.scope = e;
  }

  resultOutputss(e: IScope) {
    this.scope = e;
  }
  openDialoge() {
    setTimeout(() => {
      this.setting.openModalLocationRoute = true;
    }, 200);
  }

  listener() {
    this.mapService.loadingProgress.subscribe((res) => {
      this.setting.loadingProgress = res;
    });
    this.draswerService.drawerType.subscribe((res: any) => {
      this.drawerTypeTmp = res;
      this.router.navigateByUrl('lazy' + res);
      setTimeout(() => {
        this.draswerService.showMap.next(true);
      }, 2000);
    });
  }
}
