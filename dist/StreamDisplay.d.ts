declare global {
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
declare type CallbackFn = (imageData: ImageData) => any;
export default class StreamDisplay {
    private video;
    private canvas;
    private canvasContext;
    private rAFId;
    private callback;
    streamHeight: number;
    streamWidth: number;
    constructor(callback: CallbackFn);
    startCapture: () => Promise<void>;
    stopCapture: () => void;
    private setupCanvas;
    private stream;
    private drawVideoToCanvas;
    private getImageData;
}
export {};
