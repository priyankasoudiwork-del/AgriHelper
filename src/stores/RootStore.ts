import { types, Instance } from 'mobx-state-tree';
import { AuthStore } from './AuthStore';

export const RootStore = types.model('RootStore', {
  authStore: types.optional(AuthStore, {}),
  // Add more stores here as needed in the future:
  // weatherStore: types.optional(WeatherStore, {}),
  // sprayRecordsStore: types.optional(SprayRecordsStore, {}),
});

export interface IRootStore extends Instance<typeof RootStore> {}
