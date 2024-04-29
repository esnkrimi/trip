import { TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { StoreModule } from '@ngrx/store';
import { actions } from './actions';
import { ILocationTypes } from './state';

describe('MapComponent', () => {
  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), StoreModule.forRoot({})],
      providers: [],
    }).compileComponents();
  });

  it('start fetch location type', () => {
    const expectAction = {
      type: actions.startFetchLocationType.type,
    };
    const action = actions.startFetchLocationType();
    expect(action).toEqual(expectAction);
  });

  it('fetch location type', () => {
    const mockLocationType: ILocationTypes = {
      type: [{ type: 'hotel' }, { type: 'club' }],
    };
    const expectAction = {
      type: actions.fetchLocationType.type,
      data: mockLocationType,
    };
    const action = actions.fetchLocationType({ data: mockLocationType });
    expect(action).toEqual(expectAction);
  });

  it('start fetch destination cities', () => {
    const mockSearchText = 'berlin';
    const expectAction = {
      type: actions.startFetchDestinationCities.type,
      searchItem: mockSearchText,
    };
    const action = actions.startFetchDestinationCities({
      searchItem: mockSearchText,
    });

    expect(action).toEqual(expectAction);
  });

  it('start share location', () => {
    const mockDataToShare = {
      userId: '1',
      locationId: '2500',
    };
    const expectAction = {
      type: actions.startShareLocation.type,
      userId: mockDataToShare.userId,
      locationId: mockDataToShare.locationId,
    };
    const action = actions.startShareLocation({
      userId: mockDataToShare.userId,
      locationId: mockDataToShare.locationId,
    });
    expect(action).toEqual(expectAction);
  });
});
