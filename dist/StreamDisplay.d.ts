declare type CallbackFn = (imageData: ImageData) => void;
declare type Configuration = {
    scanInterval?: number;
};
export default class StreamDisplay {
    static readonly DEFAULT_SCAN_INTERVAL_MS = 1000;
    private video;
    private canvas;
    private canvasContext;
    private callback;
    private intervalId;
    private scanInterval;
    private _isCapturing;
    streamHeight: number;
    streamWidth: number;
    constructor(callback: CallbackFn, options?: Configuration);
    startCapture: () => Promise<void>;
    stopCapture: () => void;
    get isCapturing(): boolean;
    private setupCanvas;
    private stream;
    private drawVideoToCanvas;
    private getImageData;
    private static validateScanInterval;
}
export {};
