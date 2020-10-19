import tape from 'tape';
import sinon from 'sinon';

import setupEnvironment from './setupEnvironment';
import StreamDisplay from '../src/StreamDisplay';

const { DEFAULT_SCAN_INTERVAL_MS } = StreamDisplay;
const { clock, getDisplayMediaFake } = setupEnvironment();

tape('It calls getDisplayMedia', async t => {
  t.plan(1);

  const stream = new StreamDisplay(() => {});

  await stream.startCapture();

  t.assert(getDisplayMediaFake.calledOnce);
});

tape('It runs once immediately at start', async t => {
  t.plan(1);

  const callback = sinon.fake();
  const stream = new StreamDisplay(callback);

  await stream.startCapture();

  stream.stopCapture();
  t.equal(callback.callCount, 1);
});

tape(`It runs once per at least default ${DEFAULT_SCAN_INTERVAL_MS}ms`, async t => {
  t.plan(1);

  const callback = sinon.fake();
  const stream = new StreamDisplay(callback);

  await stream.startCapture();

  clock.tick(DEFAULT_SCAN_INTERVAL_MS);
  stream.stopCapture();
  t.equal(callback.callCount, 2); // with initial invocation
});

tape('It honors a custom scanInterval', async t => {
  t.plan(1);

  const scanInterval = 3000;
  const timedInvocations = 4;

  const callback = sinon.fake();
  const stream = new StreamDisplay(callback, { scanInterval });

  await stream.startCapture();

  clock.tick(scanInterval * timedInvocations);
  stream.stopCapture();
  t.equal(callback.callCount, timedInvocations + 1);
});

tape('It stops after stopCapture', async t => {
  t.plan(1);

  const callback = sinon.fake();
  const stream = new StreamDisplay(callback);
  const timedInvocations = 4;

  await stream.startCapture();

  clock.tick(DEFAULT_SCAN_INTERVAL_MS * timedInvocations);
  stream.stopCapture();
  clock.tick(DEFAULT_SCAN_INTERVAL_MS * timedInvocations);
  t.equal(callback.callCount, timedInvocations + 1);
});

tape('It exposes capture state through isCapturing property', async t => {
  t.plan(2);

  const stream = new StreamDisplay(() => {});

  await stream.startCapture();
  t.assert(stream.isCapturing);

  stream.stopCapture();
  t.false(stream.isCapturing);
});
