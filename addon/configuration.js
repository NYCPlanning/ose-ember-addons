let configuration = {};

export function setConfiguration(settings) {
  configuration = settings;
}

export default function getConfiguration() {
  return configuration;
}
