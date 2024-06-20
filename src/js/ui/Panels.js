import moment from 'moment';

export default class Panels {
  constructor() {
    this.container;
    this.create = {
      container: null,
      input: null,
      micro: null,
      camera: null,
    };
    this.record = {
      container: null,
      video: null,
      controll: {
        container: null,
        ok: null,
        info: null,
        cancel: null,
      },
    };

    this.eventListeners = {
      create: {
        input: {
          keyup: [],
        },
        micro: {
          click: [],
        },
        camera: {
          click: [],
        },
      },
      record: {
        ok: {
          click: [],
        },
        cancel: {
          click: [],
        },
      },
    };
  }

  registerEventListeners() {
    try {
      this.create.input.addEventListener('keyup', (event) => {
        this.eventListeners.create.input.keyup.forEach((item) => item(event));
      });
      this.create.micro.addEventListener('click', (event) => {
        this.eventListeners.create.micro.click.forEach((item) => item(event));
      });
      this.create.camera.addEventListener('click', (event) => {
        this.eventListeners.create.camera.click.forEach((item) => item(event));
      });

      this.record.controll.ok.addEventListener('click', (event) => {
        this.eventListeners.record.ok.click.forEach((item) => item(event));
      });
      this.record.controll.cancel.addEventListener('click', (event) => {
        this.eventListeners.record.cancel.click.forEach((item) => item(event));
      });
    } catch (err) {
      console.log(`Неверный запрос ${err}`);
    }
  }

  buildPanels() {
    const panels = document.createElement('section');
    panels.classList.add('box-panels', 'panels');

    const panelCreate = this.buildPanelCreate();
    const panelRecord = this.buildPanelRecord();

    this.container = panels;

    panels.append(panelCreate, panelRecord);

    return panels;
  }

  buildPanelCreate() {
    const panel = document.createElement('div');
    panel.classList.add('container', 'panel-create');

    const textField = this.createInputField();
    const micro = this.createButton('create', 'micro');
    const camera = this.createButton('create', 'camera');

    this.create.container = panel;
    this.create.input = textField;
    this.create.micro = micro;
    this.create.camera = camera;

    panel.append(textField, micro, camera);

    return panel;
  }

  buildPanelRecord() {
    const panel = document.createElement('div');
    panel.classList.add('container', 'panel-record', 'hidden-item');

    const video = this.createVideoItem();
    const controls = this.createControlls();

    this.record.container = panel;
    this.record.video = video;

    panel.append(video, controls);

    return panel;
  }

  createVideoItem() {
    const video = document.createElement('video');
    video.classList.add('record-video', 'hidden-item');

    video.muted = 'muted';
    video.setAttribute('autoplay', 'autoplay');

    return video;
  }

  createControlls() {
    const block = document.createElement('div');
    block.classList.add('record-control', 'record-only-audio');

    const recordOk = this.createButton('record', 'ok');
    const recordShow = this.createShowField();
    const recordCancel = this.createButton('record', 'cancel');

    recordOk.innerHTML = `&#10004;`;
    recordShow.textContent = '00:00';
    recordCancel.innerHTML = `&#10006;`;

    this.record.controll.container = block;
    this.record.controll.ok = recordOk;
    this.record.controll.info = recordShow;
    this.record.controll.cancel = recordCancel;

    block.append(recordOk, recordShow, recordCancel);

    return block;
  }

  createButton(type, name) {
    const button = document.createElement('div');
    button.classList.add(`${type}-button`, `${type}-${name}`);

    return button;
  }

  createInputField() {
    const textField = document.createElement('textarea');
    textField.classList.add('create-field');
    textField.setAttribute('type', 'text');

    return textField;
  }

  createShowField() {
    const showItem = document.createElement('div');
    showItem.classList.add('record-info');

    return showItem;
  }

  getTextFromCreatePanel() {
    const text = this.create.input.value.trim();

    return text;
  }

  showPanelCreate() {
    this.create.container.classList.remove('hidden-item');
  }

  hidePanelCreate() {
    this.create.container.classList.add('hidden-item');
  }

  showPanelRecord() {
    this.record.container.classList.remove('hidden-item');
  }

  showRecordVideo() {
    this.record.video.classList.remove('hidden-item');
  }

  hideRecordVideo() {
    this.record.video.classList.add('hidden-item');
  }

  hidePanelRecord() {
    this.record.container.classList.add('hidden-item');
  }

  clearCreatePanel() {
    this.create.input.value = '';
  }

  createBlur() {
    this.create.input.blur();
  }

  saveEventListener(panel, field, event, callback) {
    try {
      this.eventListeners[panel][field][event].push(callback);
    } catch (err) {
      console.log(`Неверный запрос ${err}`);
    }
  }

  updateTimeRecord(time) {
    const timeForPage = moment(time, 's').format('mm:ss');
    this.record.controll.info.textContent = timeForPage;
  }
}
