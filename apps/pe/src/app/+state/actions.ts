import {
  IAllTrips,
  ITrip,
  ITripUsers,
  Ilocation,
  IloginInfo,
  Iuser,
  IuserOfSite,
} from '@appBase/+state/state';
import { ILocationTypes } from '@appBase/+state/state';
import { createActionGroup, props, emptyProps } from '@ngrx/store';
export const actions = createActionGroup({
  source: 'store',
  events: {
    'fetch destination cities': props<{ data: any }>(),
    'start fetch destination cities': props<{ searchItem: string }>(),
    'fetch cities': props<{ data: any }>(),
    'start fetch cities': props<{ searchItem: string }>(),
    'fetch saved locations': props<{ data: any }>(),
    'start fetch saved locations': emptyProps(),
    'set current location': emptyProps(),
    'start set current location': props<{
      uid: any;
      myLocation: any;
      city: string;
    }>(),
    'start update distance': props<{ data: any; myLocation: any }>(),
    'delete location': emptyProps(),
    'start delete location': props<{ locationId: string }>(),
    'fetch share location': props<{ data: any }>(),
    'start fetch share location': emptyProps(),
    'share location': emptyProps(),
    'start share location': props<{ userId: string; locationId: string }>(),
    'fetch location type': props<{ data: ILocationTypes }>(),
    'start fetch location type': emptyProps(),
    'trip picture uploading': emptyProps(),
    'start trip picture uploading': props<{
      uid: number;
      tripTitle: number;
      formData: any;
    }>(),

    'profile picture uploading': emptyProps(),
    'start profile picture uploading': props<{
      uid: number;
      formData: any;
    }>(),
    'update setting': props<{ data: Iuser[] }>(),
    //I must change any to specified types:
    'update setting about me': props<{ data: any }>(),
    'get start update setting about me': props<{ uid: any; about: any }>(),
    'get start update setting': props<{ data: any }>(),
    'delete trip': props<{ data: any }>(),
    'get start delete trip': props<{ userId: any; tripTitle: any }>(),
    'fetch trip rates': props<{ data: any }>(),
    'get start fetch trip rates': props<{ userId: any; tripTitle: any }>(),
    'write trip rates': props<{ data: any }>(),
    'get start write trip rates': props<{ data: any }>(),
    'write user rates': props<{ data: any }>(),
    'get start write user rates': props<{ data: any }>(),
    'fetch user rates': props<{ data: any }>(),
    //--------------------------------------
    'get start fetch user rates': emptyProps(),
    'remove user from trip': emptyProps(),
    'get start remove user from trip': props<{
      userId: string;
      tripTitle: string;
      ownerId: string;
    }>(),
    'delete location comments': props<{ data: any }>(),
    'get start delete location comments': props<{
      locationId: any;
      userId: string;
      id: string;
    }>(),
    'fetch location comments': props<{ data: any }>(),
    'get start fetch location comments': props<{ locationId: any }>(),
    'confirm invite': props<{ data: any }>(),
    'get start confirm invite': props<{
      uid: any;
      ownerId: any;
      tripTitle: any;
      action: any;
    }>(),

    'fill user trips': props<{ data: ITripUsers[] }>(),
    'confirm requests': props<{ data: any }>(),
    'get start confirm requests': props<{
      uid: any;
      ownerId: any;
      tripTitle: any;
      action: any;
    }>(),
    'fetch my trip requests': props<{ data: any }>(),
    'get start fetch my trip requests': props<{ uid: any }>(),
    'fetch trip requests': props<{ data: any }>(),
    'get start fetch trip requests': props<{ uid: any }>(),
    'ask to join': props<{ data: any }>(),
    'get start ask to join': props<{ data: any }>(),
    'fetch all trips': props<{ trips: IAllTrips[] }>(),
    'start fetch all trips': emptyProps(),
    'fetch users of trip': props<{ userOfTrip: any }>(),
    'start fetch users of trip': emptyProps(),
    'fetch users of site': props<{ userOfSite: IuserOfSite[] }>(),
    'start fetch users of sites': emptyProps(),
    'add user to trip': emptyProps(),
    'add user to trip preparing': props<{
      guestId: string;
      tripTitle: string;
      ownerId: string;
    }>(),
    'start fetch country location action': props<{ city: string }>(),
    'fetch action': props<{ location: Ilocation[] }>(),
    'start login action': props<{ user: IloginInfo }>(),
    'start signup action': props<{ user: IloginInfo }>(),
    'signup action': props<{ user: IloginInfo }>(),
    'login action': props<{ user: Iuser }>(),
    'start autocomplete action': props<{ text: string }>(),
    'autocomplete action': props<{ result: any }>(),
    'start setview action': props<{ location: any }>(),
    'setview action': props<{ setview: any }>(),
    'start save action': props<{ updateSaved: any }>(),
    'save action': props<{ updateSaved: any }>(),
    'start rate action': props<{ updateSaved: any }>(),
    'rate action': props<{ updateSaved: any }>(),
    'start submit location': props<{
      form: object;
      uid: number;
      formData: any;
    }>(),
    'submit location': props<{ form: object }>(),
    'start share experience': props<{
      uid: number;
      id: number;
      describtion: any;
      formData: any;
    }>(),
    'share experience': emptyProps(),
    'start add trip point': props<{
      trip: any;
      title: string;
      finish: boolean;
    }>(),
    'add trip point': emptyProps(),
    'start fetch trip': emptyProps(),
    'fetch trip': props<{ trip: any; reviewtrip: any }>(),
    'add trip': props<{ title: string; trip: any; finish: boolean }>(),
    'start fetch review trip': emptyProps(),
    'fetch review trip': props<{ trip: any }>(),
    'start review update': props<{
      trip: any;
      location: any;
      field: any;
      vals: any;
    }>(),
    'review update': emptyProps(),
    'start trip factors update': props<{
      trip: any;
      location: any;
      field: any;
      vals: any;
    }>(),
    'trip factors update': emptyProps(),
  },
});
