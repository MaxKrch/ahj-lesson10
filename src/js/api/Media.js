export default class MediaAPI {
  async createMediaStream(type) {
    if (!navigator.mediaDevices) {
      return null;
    }

    const mediaOptions = {
      audio: true,
      video: false,
    };

    if (type === 'video') {
      mediaOptions.video = true;
    }

    const stream = navigator.mediaDevices.getUserMedia(mediaOptions);

    return stream;
  }

  createRecorder(stream) {
    if (!window.MediaRecorder) {
      return null;
    }
    const recorder = new MediaRecorder(stream);
    return recorder;
  }
}
