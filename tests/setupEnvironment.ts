/* eslint-disable @typescript-eslint/no-explicit-any */

import sinon from 'sinon';
import jsdom from 'jsdom';

import { FixedMediaDevices } from '../src/globals';

const { JSDOM } = jsdom;

type NavigatorFake = {
  mediaDevices: Pick<FixedMediaDevices, 'getDisplayMedia'>;
}

type InjectedFakes = {
  navigator: NavigatorFake;
  document: Document;
  window: {
    setInterval: sinon.SinonFakeTimers['setInterval'];
    clearInterval: sinon.SinonFakeTimers['clearInterval'];
  };
}

type ExtendedGlobal = NodeJS.Global & InjectedFakes;
declare let global: ExtendedGlobal;

const setupEnvironment = () => {
  const contextFake = {
    getImageData: () => {},
    drawImage: () => {},
  };

  const videoTrackFake = {
    getSettings: () => ({}),
    stop: () => {},
  };

  const srcObjectFake = {
    getVideoTracks: () => ([videoTrackFake]),
    getTracks: () => ([videoTrackFake]),
  };

  const getDisplayMediaFake = sinon.fake.resolves(srcObjectFake);

  const navigatorFake = {
    mediaDevices: {
      getDisplayMedia: getDisplayMediaFake,
    },
  };

  const { window } = new JSDOM('');
  window.HTMLCanvasElement.prototype.getContext = () => contextFake as any;
  window.HTMLMediaElement.prototype.play = () => Promise.resolve();

  /*
    Warning: when JSDOM initializes it performs some time-based calculations
    If sinon clock is installed BEFORE that initialization -- tests hang
    Because clock is not ticking after that
  */
  const clock = sinon.useFakeTimers();

  const injectedFakes: InjectedFakes = {
    navigator: navigatorFake,
    document: window.document,
    window: {
      setInterval: clock.setInterval,
      clearInterval: clock.clearInterval,
    },
  };

  Object.entries(injectedFakes).forEach(([key, fake]) => {
    global[key as keyof ExtendedGlobal] = fake;
  });

  return { clock, getDisplayMediaFake };
};

export default setupEnvironment;
