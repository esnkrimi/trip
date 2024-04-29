import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { AppComponent } from './app.component';
import { MapService } from './master/map/service';
import { detectDevice, getUserSession } from './app.module';
import { LocalService } from './storage';
import { TranslateModule } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { LocationGeoService } from './drawer.service';
import { StoreModule } from '@ngrx/store';
import { MatDialogModule } from '@angular/material/dialog';
import { RouterModule } from '@angular/router';
import { LoadingProgressModule } from '@pe/loading-progress';
import { ResponsiveHeaderComponent } from './master/responsive-header/responsive-header.component';
import { HeaderComponent } from './master/header/header.component';
import { MapComponent } from './master/map/map.component';
import { RouterTestingModule } from '@angular/router/testing';
import { HelpComponent } from 'libs/help/src/lib/component/help.component';
import { MapBoardComponent } from 'libs/map/src/lib/component/map.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { PlacesComponent } from './master/places/places.component';
import { storeEffects } from './+state/effects';
import { AppState, state } from './+state/state';
import { LocationListsService } from './lazy/location-list/location-list.service';
import { By } from '@angular/platform-browser';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { actions } from './+state/actions';

describe('MapComponent', () => {
  let store: MockStore;
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let effects: storeEffects;
  let service: LocationListsService;
  let initialState: state;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      declarations: [
        AppComponent,
        ResponsiveHeaderComponent,
        HeaderComponent,
        MapComponent,
        HelpComponent,
        PlacesComponent,
        MapBoardComponent,
      ],
      imports: [
        TranslateModule.forRoot(),
        RouterTestingModule,
        HttpClientTestingModule,
        BrowserAnimationsModule,
        StoreModule.forRoot({}),
        MatDialogModule,
        RouterModule,
        LoadingProgressModule,
      ],
      providers: [
        MapService,
        LocationGeoService,
        provideMockStore({ initialState }),

        {
          provide: 'userSession',
          useFactory: getUserSession,
          deps: [LocalService],
        },
        {
          provide: 'deviceIsWide',
          useFactory: detectDevice,
        },
      ],
    }).compileComponents();
    store = TestBed.inject(MockStore);
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should init', () => {
    component.ngOnInit();
    expect(component).toBeTruthy();
  });

  it('should show UI', () => {
    component.showTours();
    fixture.detectChanges();

    expect(
      fixture.debugElement.queryAll(By.css('.text-font-fantasy')).length
    ).toBe(1);

    expect(
      fixture.debugElement
        .queryAll(By.css('.text-font-fantasy'))[0]
        .nativeElement.textContent.trim()
    ).toBe('Wellcome to Crown Plaza !');
  });

  it('should show  Image', fakeAsync(() => {
    component.openDialoge();
    tick(200);
    fixture.detectChanges();
    const img = fixture.debugElement.queryAll(By.css('.img-icon'))[0]
      .nativeElement;
    expect(img).toBeDefined();
  }));

  it('users function should dispatch startFetchUsersOfSites action', () => {
    const dispatchSpy = jest.spyOn(store, 'dispatch');
    component.users();
    fixture.detectChanges();
    expect(dispatchSpy).toHaveBeenCalledWith(actions.startFetchUsersOfSites());
  });
});
