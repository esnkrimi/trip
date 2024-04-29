import { createFeature, createReducer, on } from '@ngrx/store';
import { actions } from './actions';
import { AppState } from '@appBase/+state/state';

export const reducerStates = createFeature({
  name: 'store',
  reducer: createReducer(
    AppState,
    on(actions.askToJoin, function (states: any, action: any) {
      return {
        ...states,
        tripUsers: states.tripUsers.map((res: any) => {
          if (res.tripTitle === action.data.data.tripTitle) {
            const tmp = {
              confirmed: '0',
              family: '',
              name: '',
              uid: action.data.data.uid,
            };
            return {
              ...res,
              users: states?.users?.push(tmp),
            };
          } else {
            return {
              ...res,
              // users: [...states.tripUsers],
            };
          }
        }),
      };
    }),

    on(actions.fetchAction, function (states: any, action: any) {
      return {
        ...states,
        location: [...states.location, ...Object.values(action.location)],
        citiesRoutes: new Set([
          ...states.citiesRoutes,
          action.location[0].city,
        ]),
      };
    }),
    on(actions.startUpdateDistance, function (states: any, action: any) {
      function degreesToRadians(degrees: any) {
        return (degrees * Math.PI) / 180;
      }

      function distanceInKmBetweenEarthCoordinates(
        lat1: any,
        lon1: any,
        lat2: any,
        lon2: any
      ) {
        const earthRadiusKm = 6371;

        const dLat = degreesToRadians(lat2 - lat1);
        const dLon = degreesToRadians(lon2 - lon1);

        lat1 = degreesToRadians(lat1);
        lat2 = degreesToRadians(lat2);

        const a =
          Math.sin(dLat / 2) * Math.sin(dLat / 2) +
          Math.sin(dLon / 2) *
            Math.sin(dLon / 2) *
            Math.cos(lat1) *
            Math.cos(lat2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return earthRadiusKm * c;
      }
      return {
        ...states,
        location: states.location.map((res: any) => {
          return {
            ...res,
            distanceFromMyLocation: distanceInKmBetweenEarthCoordinates(
              res.lat,
              res.lon,
              action.myLocation.lat,
              action.myLocation.lng
            ),
          };
        }),
      };
    }),
    on(actions.fetchCities, function (states: any, action: any) {
      return {
        ...states,
        city: action.data,
      };
    }),
    on(actions.fetchDestinationCities, function (states: any, action: any) {
      return {
        ...states,
        destinationCity: action.data,
      };
    }),
    on(actions.fetchSavedLocations, function (states: any, action: any) {
      return {
        ...states,
        savedLocation: action.data,
      };
    }),
    on(actions.fetchShareLocation, function (states: any, action: any) {
      return {
        ...states,
        sharedLocation: action.data,
      };
    }),
    on(actions.fetchLocationType, function (states: any, action: any) {
      return {
        ...states,
        iLocationTypes: action.data,
      };
    }),
    on(actions.updateSettingAboutMe, function (states: any, action: any) {
      return {
        ...states,
        usersOfSite: action.data,
      };
    }),
    on(actions.updateSetting, function (states: any, action: any) {
      return {
        ...states,
        usersOfSite: action.data,
      };
    }),

    on(actions.deleteTrip, function (states: any, action: any) {
      return {
        ...states,
        tripRequests: action.data,
      };
    }),
    on(actions.writeTripRates, function (states: any, action: any) {
      return {
        ...states,
        tripComments: action.data,
      };
    }),

    on(actions.fetchTripRates, function (states: any, action: any) {
      return {
        ...states,
        tripComments: action.data,
      };
    }),

    on(actions.writeUserRates, function (states: any, action: any) {
      return {
        ...states,
        userRates: action.data,
      };
    }),
    on(actions.fetchUserRates, function (states: any, action: any) {
      return {
        ...states,
        userRates: action.data,
      };
    }),

    on(actions.fetchUsersOfTrip, function (states: any, action: any) {
      action;
      return {
        ...states,
        tripUsers: action.userOfTrip,
      };
    }),
    on(actions.deleteLocationComments, function (states: any, action: any) {
      return {
        ...states,
        locationComments: action.data,
      };
    }),
    on(actions.fetchLocationComments, function (states: any, action: any) {
      return {
        ...states,
        locationComments: action.data,
      };
    }),
    on(actions.confirmInvite, function (states: any, action: any) {
      return {
        ...states,
        tripRequests: action.data,
      };
    }),

    on(actions.confirmRequests, function (states: any, action: any) {
      action.data;
      return {
        ...states,
        tripRequests: action.data,
      };
    }),

    on(actions.fetchMyTripRequests, function (states: any, action: any) {
      return {
        ...states,
        myTripRequests: action.data,
      };
    }),
    on(actions.fetchTripRequests, function (states: any, action: any) {
      return {
        ...states,
        tripRequests: action.data,
      };
    }),
    on(actions.fetchAllTrips, function (states: any, action: any) {
      return {
        ...states,
        allTrips: action.trips,
      };
    }),
    on(actions.fetchUsersOfSite, (states: any, action: any) => ({
      ...states,
      usersOfSite: action.userOfSite,
    })),
    on(actions.startFetchTrip, (states: any, action: any) => ({
      ...states,
    })),
    on(actions.fetchTrip, (states: any, action: any) => ({
      ...states,
      trip: action.trip,
      reviewtrip: action.reviewtrip,
    })),
    on(actions.addTripPoint, (states: any, action: any) => ({
      ...states,
    })),
    on(actions.startFetchCountryLocationAction, (states: any, action: any) => ({
      ...states,
      country: action.country,
    })),
    on(actions.startFetchCountryLocationAction, (states: any, action: any) => ({
      ...states,
      country: action.country,
    })),
    on(actions.startLoginAction, (states: any, action: any) => ({
      ...states,
      loginInfo: action.loginInfo,
    })),
    on(actions.loginAction, (states: any, action: any) => ({
      ...states,
      user: action.user,
    })),
    on(actions.startAutocompleteAction, (states: any, action: any) => ({
      ...states,
    })),
    on(actions.autocompleteAction, function (states: any, action: any) {
      return {
        ...states,
        autoCompleteFind: Object.values(action.result),
      };
    }),
    on(actions.startSetviewAction, (states: any, action: any) => ({
      ...states,
    })),
    on(actions.setviewAction, (states: any, action: any) => ({
      ...states,
      setview: Object.values(action.setview),
    })),
    on(actions.saveAction, (states: any, action: any) => ({
      ...states,
    })),
    on(actions.startSaveAction, function (states: any, action: any) {
      return {
        ...states,
        location: states.location.map((res: any) => {
          if (res.id === action.updateSaved[0])
            return {
              ...res,
              saved: !res.saved,
            };
          else
            return {
              ...res,
            };
        }),
      };
    }),
    on(actions.startRateAction, (states: any, action: any) => ({
      ...states,
    })),

    on(actions.rateAction, function (states: any, action: any) {
      return {
        ...states,
        location: states.location.map((res: any) => {
          if (res.id === action.updateSaved[1]) {
            return {
              ...res,
              score: action.updateSaved[2],
            };
          } else
            return {
              ...res,
            };
        }),
      };
    }),
    on(actions.startAddTripPoint, function (states: any, action: any) {
      return {
        ...states,
        trip: [...states.trip, action.trip],
        title: action.title,
      };
    }),
    on(actions.addTrip, function (states: any, action: any) {
      return {
        ...states,
      };
    }),
    on(actions.startReviewUpdate, function (states: any, action: any) {
      return {
        ...states,
        reviewtrip: states.reviewtrip.map((res: any) => {
          if (res.title === action.trip) {
            return {
              ...res,
              trip: res.trip.map((res: any) => {
                if (res.locationTitle === action.location) {
                  return {
                    ...res,
                    [action.field]: action.vals,
                  };
                } else return { ...res };
              }),
            };
          } else
            return {
              ...res,
            };
        }),
      };
    }),
    on(actions.startTripFactorsUpdate, function (states: any, action: any) {
      return {
        ...states,
        trip: states.trip.map((res: any) => {
          if (res.title === action.trip) {
            return {
              ...res,
              trip: res.trip.map((res: any) => {
                if (res.locationTitle === action.location) {
                  return {
                    ...res,
                    [action.field]: action.vals,
                  };
                } else return { ...res };
              }),
            };
          } else
            return {
              ...res,
            };
        }),
      };
    })
  ),
});
