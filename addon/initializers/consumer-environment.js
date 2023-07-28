import { setConfiguration } from '../configuration';

export function initialize(application) {
  setConfiguration(application.resolveRegistration('config:environment'));
}

export default {
  initialize,
};
