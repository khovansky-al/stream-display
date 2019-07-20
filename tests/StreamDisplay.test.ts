import tape = require('tape');
import sinon = require('sinon');

import setupEnvironment from './setupEnvironment';
import StreamDisplay from '../src/StreamDisplay';

const { DEFAULT_SCAN_INTERVAL_MS } = StreamDisplay;
const { clock, getDisplayMediaFake } = setupEnvironment();

tape('It is a function', t => {
  t.plan(1);
  t.equal(typeof StreamDisplay, 'function');
});

tape('It calls getDisplayMedia', function(t) {
  t.plan(1);

  const stream = new StreamDisplay(() => {});

  stream.startCapture().then(() => {
    t.assert(getDisplayMediaFake.calledOnce);
  });
});

tape(`It runs once immediately at start`, t => {
  t.plan(1);

  const callback = sinon.fake();
  const stream = new StreamDisplay(callback);

  stream.startCapture().then(() => {
    stream.stopCapture();
    t.equal(callback.callCount, 1);
  });
});

tape(`It runs once per at least default ${DEFAULT_SCAN_INTERVAL_MS}ms`, t => {
  t.plan(1);

  const callback = sinon.fake();
  const stream = new StreamDisplay(callback);

  stream.startCapture().then(() => {
    clock.tick(DEFAULT_SCAN_INTERVAL_MS);
    stream.stopCapture();
    t.equal(callback.callCount, 2); // with initial invocation
  });
});

tape('It honors a custom scanInterval', t => {
  t.plan(1);

  const scanInterval = 3000;
  const timedInvocations = 4;

  const callback = sinon.fake();
  const stream = new StreamDisplay(callback, { scanInterval });

  stream.startCapture().then(() => {
    clock.tick(scanInterval * timedInvocations);
    stream.stopCapture();
    t.equal(callback.callCount, timedInvocations + 1);
  });
});

tape(`It stops after stopCapture`, t => {
  t.plan(1);

  const callback = sinon.fake();
  const stream = new StreamDisplay(callback);
  const timedInvocations = 4

  stream.startCapture().then(() => {
    clock.tick(DEFAULT_SCAN_INTERVAL_MS * timedInvocations);
    stream.stopCapture();
    clock.tick(DEFAULT_SCAN_INTERVAL_MS * timedInvocations);
    t.equal(callback.callCount, timedInvocations + 1);
  });
});
