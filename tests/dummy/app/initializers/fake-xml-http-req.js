export function initialize(/* application */) {
  if (window.FakeXMLHttpRequest) {
    window.XMLHttpRequestFake = window.XMLHttpRequest;
  }
}

export default {
  initialize
};
