import Panels from './Panels';
import Modals from './Modals';
import Note from './Note';

export default class Render {
  constructor(container) {
    this.container = container;
    this.timeline = null;
    this.notelist = null;
    this.panels = new Panels();
    this.modals = new Modals();

    this.record = {
      id: null,
      time: 0,
    };

    this.init();
  }

  init() {
    this.renderPage();
    this.registerEventListeners();
  }

  registerEventListeners() {
    this.panels.registerEventListeners();
    this.modals.registerEventListeners();
  }

  renderPage() {
    const main = document.createElement('main');
    main.classList.add('container', 'main-container');

    const timeline = this.renderTimeline();
    const notelist = this.renderNoteList();
    const panels = this.renderPanels();
    const modals = this.renderModals();

    main.append(timeline, notelist, panels, modals);

    this.container.append(main);
  }

  renderTimeline() {
    const timeline = document.createElement('aside');
    timeline.classList.add('box-timeline', 'timeline', 'hidden-item');

    const line = document.createElement('div');
    line.classList.add('timeline-line');

    timeline.append(line);
    this.timeline = timeline;

    return timeline;
  }

  renderNoteList() {
    const list = document.createElement('ul');
    list.classList.add('box-list', 'list-note');
    this.notelist = list;

    return list;
  }

  renderPanels() {
    const panels = this.panels.buildPanels();
    return panels;
  }

  renderModals() {
    const modals = this.modals.buildModals();
    return modals;
  }

  addNoteToPage(data) {
    const note = new Note(data);
    this.notelist.prepend(note);
    this.showTimeline();
  }

  showTimeline() {
    this.timeline.classList.remove('hidden-item');
  }

  getInputCoords() {
    const coords = this.modals.getDataFromConfirm();

    return coords;
  }

  getInputMessage() {
    const message = this.panels.getTextFromCreatePanel();

    return message;
  }

  showCreatePanel() {
    this.panels.showPanelCreate();
    this.panels.hidePanelRecord();
  }

  showRecordVideoPanel() {
    this.panels.hidePanelCreate();
    this.panels.showPanelRecord();
    this.panels.showRecordVideo();
  }

  showRecordAudioPanel() {
    this.panels.hidePanelCreate();
    this.panels.showPanelRecord();
    this.panels.hideRecordVideo();
  }

  showConfirmation(message) {
    const {
      functions: { ok, cancel },
    } = message;
    this.modals.saveEventListener('confirm', 'ok', 'clickTemp', ok);
    this.modals.saveEventListener('confirm', 'cancel', 'clickTemp', cancel);

    this.container.classList.add('no-scroll');
    this.modals.showModalConfirm(message);
  }

  showInformation(message) {
    this.container.classList.add('no-scroll');
    this.modals.showModalInform(message);
  }

  updateConfirmInfo(message) {
    this.modals.updateConfirmInfo(message);
  }

  clearConfirmInfo() {
    this.modals.updateConfirmInfo('');
  }

  hideConfirmation() {
    this.container.classList.remove('no-scroll');
    this.modals.hideModalConfirm();
  }

  hideInformation() {
    this.container.classList.remove('no-scroll');
    this.modals.hideModalInform();
  }

  showStreamOnPanel(stream) {
    this.panels.record.video.srcObject = stream;
  }

  clearStreamOnPanel() {
    this.panels.record.video.srcObject = null;
  }

  showTimeRecord() {
    this.clearTimeRecord();
    this.record.id = setInterval(() => {
      this.record.time += 1;
      this.panels.updateTimeRecord(this.record.time);
    }, 1000);
  }

  panelCreateBlur() {
    this.panels.createBlur();
  }

  clearTimeRecord() {
    if (this.record.id) {
      clearInterval(this.record.id);
      this.record.id = null;
    }
    this.record.time = 0;
    this.panels.updateTimeRecord(0);
  }

  clearCreatePanel() {
    this.panels.clearCreatePanel();
  }

  activationModalButton(modal, button) {
    if (modal === 'confirm') {
      this.modals.activationConfirmButton(button);
    }
  }

  deActivationModalButton(modal, button) {
    if (modal === 'confirm') {
      this.modals.deActivationConfirmButton(button);
    }
  }
}
