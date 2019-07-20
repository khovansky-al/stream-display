const DISPLAY_MEDIA_OPTIONS: MediaStreamConstraints = {
  video: {
    cursor: 'never'
  },
  audio: false
}

declare global {
  /*
    MediaDevices.getDisplayMedia is currently typed incorrectly
    https://github.com/microsoft/TypeScript/issues/31821
  */
  interface MediaDevices {
    getDisplayMedia(constraints: MediaStreamConstraints): Promise<MediaStream>;
  }

  interface MediaTrackConstraints {
    cursor: ConstrainDOMString;
  }

  interface MediaStreamConstraints {
    video?: MediaTrackConstraints | boolean;
    audio?: MediaTrackConstraints | boolean;
  }
}

type CallbackFn = (imageData: ImageData) => any
type Configuration = {
  scanInterval?: number;
}

export default class StreamDisplay {
  public static readonly DEFAULT_SCAN_INTERVAL_MS = 1000;

  private video: HTMLVideoElement;
  private canvas: HTMLCanvasElement;
  private canvasContext: CanvasRenderingContext2D;
  private callback: CallbackFn;
  private intervalId: number = 0;
  private scanInterval: number = StreamDisplay.DEFAULT_SCAN_INTERVAL_MS;

  public streamHeight: number = 0;
  public streamWidth: number = 0;

  constructor(callback: CallbackFn, options: Configuration = {}) {
    this.video = document.createElement('video');
    this.canvas = document.createElement('canvas');

    const context = this.canvas.getContext('2d');
    if (context == null) {
      throw 'Cannot initialize canvas context'
    }

    this.canvasContext = context;
    this.callback = callback;

    const { scanInterval } = (options || {}) as Configuration;
    this.scanInterval = scanInterval || this.scanInterval;
    this.validateScanInterval(this.scanInterval);
  }

  startCapture = async () => {
    const devices = navigator.mediaDevices as MediaDevices;
    this.video.srcObject = await devices.getDisplayMedia(DISPLAY_MEDIA_OPTIONS);
    this.video.play();

    this.setupCanvas();
    this.stream();
    this.intervalId = window.setInterval(this.stream, this.scanInterval);
  }

  stopCapture = () => {
    window.clearInterval(this.intervalId);

    const videoSource = this.video.srcObject as MediaStream;
    const tracks = videoSource.getTracks();

    tracks.forEach(track => track.stop());
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
    const { streamHeight, streamWidth, video, canvasContext } = this;
    canvasContext.drawImage(video, 0, 0, streamWidth, streamHeight);
  }

  private getImageData(): ImageData {
    const { streamHeight, streamWidth, canvasContext } = this;
    return canvasContext.getImageData(0, 0, streamWidth, streamHeight);
  }

  private validateScanInterval(interval: number) {
    if (interval >= 1000) return;
    console.warn('\
      [stream-display] Scan interval is set under 1000ms. \
      Will be overridden by the browser to 1000ms when tab is in background'
    );
  }
}
