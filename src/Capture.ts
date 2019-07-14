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

export default class Capture {
  private video: HTMLVideoElement;
  private canvas: HTMLCanvasElement;
  private canvasContext: CanvasRenderingContext2D;
  private rAFId: number = 0;
  private callback: CallbackFn;

  public streamHeight: number = 0;
  public streamWidth: number = 0;

  constructor(callback: CallbackFn) {
    this.video = document.createElement('video');
    this.canvas = document.createElement('canvas');

    const context = this.canvas.getContext('2d');
    if (context == null) {
      throw 'Cannot initialize canvas context'
    }

    this.canvasContext = context;
    this.callback = callback;
  }

  startCapture = async () => {
    const devices = navigator.mediaDevices as MediaDevices;
    this.video.srcObject = await devices.getDisplayMedia(DISPLAY_MEDIA_OPTIONS);
    this.video.play();

    this.setupCanvas();
    this.rAFId = requestAnimationFrame(this.stream);
  }

  stopCapture = () => {
    cancelAnimationFrame(this.rAFId);

    const videoSource = this.video.srcObject as MediaStream;
    const tracks = videoSource.getTracks();

    tracks.forEach(track => track.stop());
    // this.video.srcObject = null;
  }

  private setupCanvas() {
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

    this.rAFId = requestAnimationFrame(this.stream);
  }

  private drawVideoToCanvas() {
    const { streamHeight, streamWidth, video, canvasContext } = this;
    canvasContext.drawImage(video, 0, 0, streamWidth, streamHeight);
  }

  private getImageData(): ImageData {
    const { streamHeight, streamWidth, canvasContext } = this;
    return canvasContext.getImageData(0, 0, streamWidth, streamHeight);
  }
}
