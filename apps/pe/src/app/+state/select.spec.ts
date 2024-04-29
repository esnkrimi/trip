import { TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { StoreModule } from '@ngrx/store';
import { AppState, state } from '@appBase/+state/state';
import { ILocationTypes } from './state';
import { reducerStates } from './reducer';
import { actions } from './actions';
import { selectILocationTypes } from './select';

export const mockInitialState: state = {
  autoCompleteFind: [],
  locationComments: [],
  tripUsers: [],
  userRates: [],
  tripRequests: [],
  myTripRequests: [],
  allTrips: [],
  trip: [],
  reviewtrip: [],
  location: [],
  citiesRoutes: [],
  sharedLocation: [],
  savedLocation: [],
  user: {
    id: '',
    name: '',
    lname: '',
    email: '',
    password: '',
  },
  usersOfSite: [],
  loginInfo: {},
  setview: {
    country_code: '',
    country_id: '',
    country_name: '',
    id: 0,
    latitude: '',
    longitude: '',
    name: '',
    state_code: '',
    state_id: 0,
    state_name: '',
    wikiDataId: '',
  },
  tripComments: [],
  iLocationTypes: [],
  city: [],
  destinationCity: [],
};
describe('MapComponent', () => {
  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), StoreModule.forRoot({})],
      providers: [],
    }).compileComponents();
  });

  it('reducer change state on fetch location type action', () => {
    const iLocationTypes: ILocationTypes = {
      type: [{ type: 'hotel' }, { type: 'club' }],
    };
    const mockstate = { ...mockInitialState, iLocationTypes };
    expect(selectILocationTypes.projector(mockstate)).toEqual(
      mockstate.iLocationTypes
    );
  });
});
