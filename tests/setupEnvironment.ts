import sinon = require('sinon');
import jsdom = require("jsdom");

const { JSDOM } = jsdom;

const setupEnvironment = () => {
  const contextFake = {
    getImageData: () => { },
    drawImage: () => { },
  };

  const videoTrackFake = {
    getSettings: () => ({}),
    stop: () => { },
  }

  const srcObjectFake = {
    getVideoTracks: () => ([videoTrackFake]),
    getTracks: () => ([videoTrackFake]),
  }

  const getDisplayMediaFake = sinon.fake.resolves(srcObjectFake);

  const navigatorFake = {
    mediaDevices: {
      getDisplayMedia: getDisplayMediaFake
    }
  }

  const { window } = new JSDOM(``);
  window.HTMLCanvasElement.prototype.getContext = () => contextFake as any;
  window.HTMLMediaElement.prototype.play = () => Promise.resolve();

  (global as any).navigator = navigatorFake;
  (global as any).document = window.document;

  const clock = sinon.useFakeTimers();
  (global as any).window = {
    setInterval: clock.setInterval,
    clearInterval: clock.clearInterval,
  }

  return { clock, getDisplayMediaFake }
}

export default setupEnvironment;
