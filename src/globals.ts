/*
  MediaDevices.getDisplayMedia is currently typed incorrectly
  https://github.com/microsoft/TypeScript/issues/33232
*/
interface FixedMediaDevices extends MediaDevices {
  getDisplayMedia(constraints: MediaStreamConstraints): Promise<MediaStream>;
}

interface FixedMediaTrackConstraints extends MediaTrackConstraints {
  cursor: ConstrainDOMString;
}

interface FixedMediaStreamConstraints extends MediaStreamConstraints {
  video?: FixedMediaTrackConstraints | boolean;
  audio?: FixedMediaTrackConstraints | boolean;
}

export {
  FixedMediaDevices, FixedMediaStreamConstraints, FixedMediaTrackConstraints,
};
