import { FixedMediaDevices, FixedMediaStreamConstraints } from './globals';

const DISPLAY_MEDIA_OPTIONS: FixedMediaStreamConstraints = {
  video: {
    cursor: 'never',
  },
  audio: false,
};

type CallbackFn = (imageData: ImageData) => void
type Configuration = {
  scanInterval?: number;
}

export default class StreamDisplay {
  static readonly DEFAULT_SCAN_INTERVAL_MS = 1000;

  private video: HTMLVideoElement;
  private canvas: HTMLCanvasElement;
  private canvasContext: CanvasRenderingContext2D;
  private callback: CallbackFn;
  private intervalId: number = 0;
  private scanInterval: number = StreamDisplay.DEFAULT_SCAN_INTERVAL_MS;

  private _isCapturing: boolean = false;

  streamHeight: number = 0;

  streamWidth: number = 0;

  constructor(callback: CallbackFn, options: Configuration = {}) {
    this.video = document.createElement('video');
    this.canvas = document.createElement('canvas');

    const context = this.canvas.getContext('2d');
    if (context == null) {
      throw new Error('Cannot initialize canvas context');
    }

    this.canvasContext = context;
    this.callback = callback;

    const { scanInterval } = (options || {}) as Configuration;
    this.scanInterval = scanInterval || this.scanInterval;
    StreamDisplay.validateScanInterval(this.scanInterval);
  }

  startCapture = async () => {
    const devices = navigator.mediaDevices as FixedMediaDevices;
    this.video.srcObject = await devices.getDisplayMedia(DISPLAY_MEDIA_OPTIONS);
    this.video.play();

    this.setupCanvas();
    this.stream();
    this.intervalId = window.setInterval(this.stream, this.scanInterval);
    this._isCapturing = true;
  }

  stopCapture = () => {
    window.clearInterval(this.intervalId);

    const videoSource = this.video.srcObject as MediaStream;
    const tracks = videoSource.getTracks();

    tracks.forEach(track => track.stop());
    this._isCapturing = false;
  }

  get isCapturing() {
    return this._isCapturing;
  }

  private setupCanvas = () => {
    const videoSource = this.video.srcObject as MediaStream;
    const videoTrack = videoSource.getVideoTracks()[0];

    const { height, width } = videoTrack.getSettings();

    this.streamWidth = width || 0;
    this.streamHeight = height || 0;

    this.canvas.height = this.streamHeight;
    this.canvas.width = this.streamWidth;
  }

  private stream = () => {
    this.drawVideoToCanvas();
    this.callback(this.getImageData());
  }

  private drawVideoToCanvas() {
    const {
      streamHeight, streamWidth, video, canvasContext,
    } = this;
    canvasContext.drawImage(video, 0, 0, streamWidth, streamHeight);
  }

  private getImageData(): ImageData {
    const { streamHeight, streamWidth, canvasContext } = this;
    return canvasContext.getImageData(0, 0, streamWidth, streamHeight);
  }

  private static validateScanInterval(interval: number) {
    if (interval >= 1000) return;

    throw new Error('\
      [stream-display] Scan interval is set under 1000ms. \
      Will be overridden by the browser to 1000ms when tab is in background');
  }
}
