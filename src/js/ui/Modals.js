export default class Modals {
  constructor() {
    this.container;
    this.confirm = {
      container: null,
      title: null,
      text: null,
      request: null,
      input: null,
      info: null,
      buttons: {
        ok: null,
        cancel: null,
      },
    };
    this.inform = {
      container: null,
      title: null,
      text: null,
      ok: null,
    };

    this.eventListeners = {
      confirm: {
        ok: {
          click: [],
          clickTemp: [],
        },
        cancel: {
          click: [],
          clickTemp: [],
        },
        input: {
          keyup: [],
        },
      },
      inform: {
        ok: {
          click: [],
        },
      },
    };
  }

  registerEventListeners() {
    try {
      this.confirm.input.addEventListener('keyup', (event) => {
        this.eventListeners.confirm.input.keyup.forEach((item) => item(event));
      });
      this.confirm.buttons.ok.addEventListener('click', (event) => {
        if (!this.isActiveButtons(event)) {
          return false;
        }
        this.eventListeners.confirm.ok.clickTemp.forEach((item) => item(event));
        this.eventListeners.confirm.ok.click.forEach((item) => item(event));
      });
      this.confirm.buttons.cancel.addEventListener('click', (event) => {
        if (!this.isActiveButtons(event)) {
          return false;
        }
        this.eventListeners.confirm.cancel.clickTemp.forEach((item) => item(event));
        this.eventListeners.confirm.cancel.click.forEach((item) => item(event));
      });

      this.inform.ok.addEventListener('click', (event) => {
        if (!this.isActiveButtons(event)) {
          return false;
        }
        this.eventListeners.inform.ok.click.forEach((item) => item(event));
      });
    } catch (err) {
      console.log(`Неверный запрос ${err}`);
    }
  }

  buildModals() {
    const modals = document.createElement('aside');
    modals.classList.add('modal', 'hidden-item');
    this.container = modals;

    const modalConfirm = this.createModalConfirm();
    const modalInform = this.createModalInform();

    this.confirm.container = modalConfirm;
    this.inform.container = modalInform;

    modals.append(modalConfirm, modalInform);

    return modals;
  }

  createModalConfirm() {
    const modal = document.createElement('article');
    modal.classList.add('modal-body', 'modal-confirm', 'hidden-item');

    const textContainer = document.createElement('div');
    textContainer.classList.add('modal-text', 'modal-confirm-text');

    const name = 'confirm';

    const title = this.createTitleField(name);
    const text = this.createTextField(name);
    const request = this.createTextField(name);
    const info = this.createInfoField(name);
    const input = this.createInputField(name, {
      type: 'text',
    });

    const buttonsContainer = document.createElement('div');
    buttonsContainer.classList.add(`modal-buttons`, `modal-confirm-buttons`);

    const buttonOk = this.createButton(name, 'ok');
    buttonOk.classList.add('button_inactive');

    const buttonCancel = this.createButton(name, 'cancel');

    this.confirm.container = modal;
    this.confirm.title = title;
    this.confirm.text = text;
    this.confirm.request = request;
    this.confirm.input = input;
    this.confirm.info = info;
    this.confirm.buttons.ok = buttonOk;
    this.confirm.buttons.cancel = buttonCancel;

    textContainer.append(title, text, request);
    buttonsContainer.append(buttonOk, buttonCancel);
    modal.append(textContainer, input, info, buttonsContainer);

    return modal;
  }

  createModalInform() {
    const modal = document.createElement('article');
    modal.classList.add('modal-body', 'modal-inform', 'hidden-item');

    const textContainer = document.createElement('div');
    textContainer.classList.add('modal-text', 'modal-inform-text');

    const name = `inform`;
    const title = this.createTitleField(name);
    const text = this.createTextField(name);

    const buttonsContainer = document.createElement('div');
    buttonsContainer.classList.add(`modal-buttons`, `modal-inform-buttons`);

    const buttonOk = this.createButton(name, 'ok');

    this.inform.container = modal;
    this.inform.title = title;
    this.inform.text = text;
    this.inform.ok = buttonOk;

    textContainer.append(title, text);
    buttonsContainer.append(buttonOk);
    modal.append(textContainer, buttonsContainer);

    return modal;
  }

  createTitleField(name) {
    const title = document.createElement('h2');
    title.classList.add(`modal-title`, `modal-${name}-title`);

    return title;
  }

  createTextField(name) {
    const text = document.createElement('p');
    text.classList.add(`modal-descr`, `modal-${name}-descr`);

    return text;
  }

  createInputField(name, options) {
    const input = document.createElement('input');
    input.classList.add(`modal-input`, `modal-${name}-input`);

    for (let key in options) {
      input.setAttribute(key, options[key]);
    }

    return input;
  }

  createInfoField(name) {
    const info = document.createElement('p');
    info.classList.add(`modal-info`, `modal-${name}-info`);

    return info;
  }

  createButton(name, descr) {
    const button = document.createElement('button');
    button.classList.add(`button`, `modal-button`, `modal-${name}-button`, `modal-${name}-${descr}`);
    button.textContent = descr;

    return button;
  }

  addDataToConfirm(data) {
    const { title, text, request, info, options } = data;
    this.confirm.title.textContent = title;
    this.confirm.text.textContent = text;
    this.confirm.request.textContent = request;
    this.confirm.info.textContent = info;

    for (let key in options) {
      this.confirm.input.setAttribute(key, options[key]);
    }
  }

  addDataToInform(data) {
    const { title, text } = data;
    this.inform.title.textContent = title;
    this.inform.text.textContent = text;
  }

  showModalConfirm(message) {
    this.container.classList.remove('hidden-item');
    this.confirm.container.classList.remove('hidden-item');
    this.addDataToConfirm(message);
  }

  updateConfirmInfo(message) {
    this.confirm.info.textContent = message;
  }

  showModalInform(message) {
    this.container.classList.remove('hidden-item');
    this.inform.container.classList.remove('hidden-item');
    this.addDataToInform(message);
  }

  hideModalConfirm() {
    this.container.classList.add('hidden-item');
    this.confirm.container.classList.add('hidden-item');
    this.clearModalConfirm();
  }

  hideModalInform() {
    this.container.classList.add('hidden-item');
    this.inform.container.classList.add('hidden-item');
    this.clearModalInform();
  }

  clearModalConfirm() {
    this.clearConfirmTempListeners();
    this.confirm.title.textContent = '';
    this.confirm.text.textContent = '';
    this.confirm.request.textContent = '';
    this.confirm.info.textContent = '';

    (this.confirm.input.value = ''), this.confirm.input.setAttribute('placeholder', '');
  }

  clearConfirmTempListeners() {
    this.eventListeners.confirm.ok.clickTemp = [];
    this.eventListeners.confirm.cancel.clickTemp = [];
  }

  clearModalInform() {
    this.inform.title.textContent = '';
    this.inform.text.textContent = '';
  }

  getDataFromConfirm() {
    const data = this.confirm.input.value.trim();
    console.log(this.confirm.input);
    return data;
  }

  saveEventListener(modal, field, event, callback) {
    try {
      this.eventListeners[modal][field][event].push(callback);
    } catch (err) {
      console.log(`Неверный запрос ${err}`);
    }
  }

  isActiveButtons(event) {
    if (event.target.classList.contains('button_inactive')) {
      return false;
    }
    return true;
  }

  activationConfirmButton(button) {
    this.confirm.buttons[button].classList.remove('button_inactive');
  }
  deActivationConfirmButton(button) {
    this.confirm.buttons[button].classList.add('button_inactive');
  }
}
