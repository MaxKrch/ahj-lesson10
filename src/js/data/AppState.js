export default class State {
  constructor() {
    this.tempMedia = [];
    this.listNotes = [];
    this.stream = null;
    this.recorder = null;
    this.geoValidation = {
      timer: {
        keyup: null,
        cheking: null,
      },
      lag: 1000,
    };
  }

  savingTempData(data) {
    this.tempMedia.push(data);
  }

  clearTempData() {
    this.tempMedia = [];
  }

  clearStream() {
    this.stream = null;
  }

  clearRecorder() {
    this.recorder = null;
  }

  addNoteToList(note) {
    this.listNotes.push(note);
  }
}
