import State from '../data/AppState';
import Render from '../ui/AppRender';
import MediaAPI from './Media';
import GeolocationAPI from './Geolocation';
import NoteObj from './Note';

export default class App {
  constructor(container) {
    this.container = document.querySelector(container);
    this.state = new State();
    this.media = new MediaAPI();
    this.geo = new GeolocationAPI();

    this.render = new Render(this.container);

    this.init();
  }

  init() {
    this.addEventListeners();
  }

  addEventListeners() {
    this.render.panels.saveEventListener('create', 'input', 'keyup', this.onKeyupCreatePanelInput.bind(this));
    this.render.panels.saveEventListener('create', 'micro', 'click', this.onClickCreatePanelMicro.bind(this));
    this.render.panels.saveEventListener('create', 'camera', 'click', this.onClickCreatePanelCamera.bind(this));

    this.render.panels.saveEventListener('record', 'ok', 'click', this.onClickRecordPanelOk.bind(this));
    this.render.panels.saveEventListener('record', 'cancel', 'click', this.onClickRecordPanelCancel.bind(this));

    this.render.modals.saveEventListener('confirm', 'ok', 'click', this.onClickConfirmModalOk.bind(this));
    this.render.modals.saveEventListener('confirm', 'cancel', 'click', this.onClickConfirmModalCancel.bind(this));
    this.render.modals.saveEventListener('confirm', 'input', 'keyup', this.onKeyupConfirmModalInput.bind(this));
    this.render.modals.saveEventListener('confirm', 'input', 'input', this.onInputConfirmModalInput.bind(this));

    this.render.modals.saveEventListener('inform', 'ok', 'click', this.onClickInformModalOk.bind(this));
  }

  onKeyupCreatePanelInput(event) {
    if (event.key === 'Enter' && !event.shiftKey) {
      const content = this.render.getInputMessage();
      if (content.length === 0) {
        return;
      }
      this.render.panelCreateBlur();
      this.createNote('text');
    }
  }

  onClickCreatePanelMicro() {
    this.startRecordingMedia('audio');
  }

  onClickCreatePanelCamera() {
    this.startRecordingMedia('video');
  }

  onClickRecordPanelOk() {
    this.stopingMediaStream();
    this.render.showCreatePanel();
    this.createNote('media');
  }

  onClickRecordPanelCancel() {
    this.cancelRecording();
  }

  onClickConfirmModalOk() {}

  onClickConfirmModalCancel() {
    this.render.hideConfirmation();
  }

  onKeyupConfirmModalInput(event) {
    if (event.key === 'Enter' && !event.shiftKey) {
      this.clickConfirmOk();
    }
  }

  onInputConfirmModalInput() {
    const coords = this.render.getInputCoords();
    this.lagingChekCoords(coords);
  }

  onClickInformModalOk() {
    this.render.hideInformation();
  }

  clickConfirmOk() {
    this.render.modals.confirm.buttons.ok.dispatchEvent(new MouseEvent('click'));
  }

  async startRecordingMedia(type) {
    try {
      const stream = await this.media.createMediaStream(type);
      this.state.stream = stream;

      if (stream === null) {
        const message = {
          title: 'Невозможно начать запись',
          text: 'Извините, ваш браузер не поддерживает запись медиа. Попробуйте обновить бразуер или открыть сайт в другом браузере',
        };
        this.render.showInformation(message);
        return;
      }

      if (type === 'video') {
        this.render.showStreamOnPanel(stream);
      }

      this.createRecorder();
    } catch (err) {
      const devices = type === 'audio' ? 'микрофону' : 'микрофону и камере';
      const message = {
        title: `Разрешите доступ к ${devices}`,
        text: `Чтобы начать запись, приложению нужен доступ к ${devices}. Вы сможете отменить разрешение в любой момент`,
      };

      this.render.showInformation(message);
      this.cancelRecording();
      return;
    }
  }

  createRecorder() {
    const recorder = this.media.createRecorder(this.state.stream);
    this.state.recorder = recorder;

    recorder.addEventListener('start', (event) => {
      this.onMediaRecorderStart(event);
    });
    recorder.addEventListener('error', (event) => {
      this.onMediaRecorderError(event);
    });
    recorder.addEventListener('dataavailable', (event) => {
      this.onMediaRecorderDataavailable(event);
    });
    recorder.addEventListener('stop', (event) => {
      this.onMediaRecorderStop(event);
    });

    recorder.start();
  }

  onMediaRecorderStart(event) {
    this.render.showTimeRecord();
    if (event.target.mimeType.startsWith('audio')) {
      this.render.showRecordAudioPanel();
    }

    if (event.target.mimeType.startsWith('video')) {
      this.render.showRecordVideoPanel();
    }
  }

  onMediaRecorderError() {
    const message = {
      title: 'Что-то пошло не так',
      text: 'Извинете, не получилось закончить и сохранить запись. Попробуйте начать снова',
    };

    this.render.clearTimeRecord();
    this.render.showInformation(message);
    this.render.clearStreamOnPanel();
    this.stopingMediaStream();
    this.state.clearTempData();
  }

  onMediaRecorderDataavailable(event) {
    this.state.savingTempData(event.data);
  }

  onMediaRecorderStop() {
    this.stopingMediaStream();
    this.render.clearTimeRecord();
    this.state.clearRecorder();
  }

  stopingMediaStream() {
    this.state.stream?.getTracks().forEach((track) => track.stop());
    this.state.clearStream();
  }

  cancelRecording() {
    this.render.showCreatePanel();
    this.stopingMediaStream();
    this.state.recorder?.stop();
    this.state.clearTempData();
    this.state.clearRecorder();
    this.render.clearStreamOnPanel();
  }

  async createNote(type) {
    if (this.state.recorder) {
      await this.state.recorder.stop();
    }

    const coords = await this.getCoords();

    if (!coords) {
      this.render.showInformation({
        title: `Запись не добавлена`,
        text: `Чтобы сохранить запись, нужно указать свои координаты - написав их вручную или дав разрешение на их получение браузеру`,
      });

      this.state.clearTempData();
      this.state.clearRecorder();
      this.render.clearCreatePanel();
      this.deActivatingSendCoordsButtons()

      return;
    }

    const data = type === 'text' ? this.render.getInputMessage() : this.state.tempMedia;

    this.state.clearTempData();
    this.render.clearCreatePanel();
    this.deActivatingSendCoordsButtons();

    const dataObj = {
      type,
      data,
      coords,
    };

    const note = new NoteObj(dataObj);

    this.state.addNoteToList(note);
    this.render.addNoteToPage(note);
  }

  async getCoords() {
    const autoCoords = await this.geo.getAutoCoords();

    if (autoCoords.success) {
      return autoCoords.coords;
    }

    const manualCoords = await this.requestCoordsFromUser();

    if (manualCoords.success) {
      return manualCoords.coords;
    }

    return false;
  }

  async requestCoordsFromUser() {
    try {
      await new Promise((res, rej) => {
        this.render.showConfirmation({
          title: `Что-то пошло не так`,
          text: `Мы не смогли определить ваше местоположение. Пожалуйста, разрешите определение геолокации или введите координаты вручную`,
          request: `Широта и долгота через запятую`,
          info: ``,
          options: {
            placeholder: `Например: -2.1234501, 10.6700000`,
          },
          functions: {
            ok: res,
            cancel: rej,
          },
        });
      });

      const coords = this.render.getInputCoords();
      const formatedCoords = this.geo.formattingCoords(coords);

      return {
        success: true,
        coords: formatedCoords,
      };
    } catch (err) {
      console.log(err);
      return {
        success: false,
      };
    } finally {
      this.render.hideConfirmation();
    }
  }

  lagingChekCoords(data) {
    this.deActivatingSendCoordsButtons();
    this.render.updateConfirmInfo('Проверяю корректность координат. Пожалуйста, подождите');
    if (this.state.geoValidation.timer.keyup) {
      clearTimeout(this.state.geoValidation.timer.keyup);
    }

    this.state.geoValidation.timer.keyup = setTimeout(
      (data) => {
        this.state.geoValidation.timer.keyup = null;
        this.chekingUserCoords(data);
      },
      this.state.geoValidation.lag,
      data,
    );
  }

  chekingUserCoords(data) {
    if (this.state.geoValidation.timer.cheking) {
      clearTimeout(this.state.geoValidation.timer);

      this.state.geoValidation.timer = setTimeout(
        (data) => {
          this.chekingUserCoords(data);
        },
        this.state.geoValidation.lag,
        data,
      );

      return;
    }

    const isCurrectCoords = this.geo.validationCoords(data);

    if (isCurrectCoords.status) {
      this.activatingSendCoordsButtons();
    }
    if (!isCurrectCoords.status) {
      this.deActivatingSendCoordsButtons();
      this.showMessErrorCoords(isCurrectCoords.message);
    }

    this.state.geoValidation.timer.cheking = setTimeout(() => {
      this.state.geoValidation.timer.cheking = null;
    }, this.state.geoValidation.lag);
  }

  activatingSendCoordsButtons() {
    this.render.clearConfirmInfo();
    this.render.activationModalButton('confirm', 'ok');
  }

  deActivatingSendCoordsButtons() {
    this.render.deActivationModalButton('confirm', 'ok');
  }

  showMessErrorCoords(message) {
    this.render.updateConfirmInfo(message);
    this.deActivatingSendCoordsButtons();
  }
}
