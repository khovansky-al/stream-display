var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var DISPLAY_MEDIA_OPTIONS = {
    video: {
        cursor: 'never'
    },
    audio: false
};
var StreamDisplay = /** @class */ (function () {
    function StreamDisplay(callback) {
        var _this = this;
        this.rAFId = 0;
        this.streamHeight = 0;
        this.streamWidth = 0;
        this.startCapture = function () { return __awaiter(_this, void 0, void 0, function () {
            var devices, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        devices = navigator.mediaDevices;
                        _a = this.video;
                        return [4 /*yield*/, devices.getDisplayMedia(DISPLAY_MEDIA_OPTIONS)];
                    case 1:
                        _a.srcObject = _b.sent();
                        this.video.play();
                        this.setupCanvas();
                        this.rAFId = requestAnimationFrame(this.stream);
                        return [2 /*return*/];
                }
            });
        }); };
        this.stopCapture = function () {
            cancelAnimationFrame(_this.rAFId);
            var videoSource = _this.video.srcObject;
            var tracks = videoSource.getTracks();
            tracks.forEach(function (track) { return track.stop(); });
        };
        this.stream = function () {
            _this.drawVideoToCanvas();
            _this.callback(_this.getImageData());
            _this.rAFId = requestAnimationFrame(_this.stream);
        };
        this.video = document.createElement('video');
        this.canvas = document.createElement('canvas');
        var context = this.canvas.getContext('2d');
        if (context == null) {
            throw 'Cannot initialize canvas context';
        }
        this.canvasContext = context;
        this.callback = callback;
    }
    StreamDisplay.prototype.setupCanvas = function () {
        var videoSource = this.video.srcObject;
        var videoTrack = videoSource.getVideoTracks()[0];
        var _a = videoTrack.getSettings(), height = _a.height, width = _a.width;
        this.streamWidth = width || 0;
        this.streamHeight = height || 0;
        this.canvas.height = this.streamHeight;
        this.canvas.width = this.streamWidth;
    };
    StreamDisplay.prototype.drawVideoToCanvas = function () {
        var _a = this, streamHeight = _a.streamHeight, streamWidth = _a.streamWidth, video = _a.video, canvasContext = _a.canvasContext;
        canvasContext.drawImage(video, 0, 0, streamWidth, streamHeight);
    };
    StreamDisplay.prototype.getImageData = function () {
        var _a = this, streamHeight = _a.streamHeight, streamWidth = _a.streamWidth, canvasContext = _a.canvasContext;
        return canvasContext.getImageData(0, 0, streamWidth, streamHeight);
    };
    return StreamDisplay;
}());
export default StreamDisplay;
//# sourceMappingURL=StreamDisplay.js.map