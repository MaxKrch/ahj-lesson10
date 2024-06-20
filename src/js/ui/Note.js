import moment from 'moment';

export default class NoteEl {
  constructor(obj) {
    const noteEl = this.buildNote(obj);

    return noteEl;
  }

  buildNote(obj) {
    const { type, time, coords, text = null, src = null } = obj;

    const noteEl = document.createElement('li');
    noteEl.classList.add('note');

    const timeEl = this.renderTimeBlock(time);
    const contentEl = this.renderContentBlock(type, text, src);
    const geoEl = this.renderGeoBlock(coords);

    noteEl.append(timeEl, contentEl, geoEl);
    console.log(noteEl);
    return noteEl;
  }

  renderTimeBlock(time) {
    const timeEl = document.createElement('div');
    timeEl.classList.add('note-info', 'note-time');

    const formatedTime = moment(time).locale('ru').format('DD.MM.YY HH:MM');
    timeEl.textContent = formatedTime;

    return timeEl;
  }

  renderContentBlock(type, text, src) {
    const contentEl = document.createElement('div');
    contentEl.classList.add(`note-content`, `note-${type}`);

    let content;
    switch (type) {
      case 'text':
        content = this.renderTextBlock(text);
        break;
      case 'audio':
        content = this.renderMediaBlock(type, src);
        break;
      case 'video':
        content = this.renderMediaBlock(type, src);
        break;
    }
    contentEl.append(content);

    return contentEl;
  }

  renderMediaBlock(type, src) {
    const mediaEl = document.createElement(type);
    mediaEl.classList.add(`note-content__${type}`);
    mediaEl.setAttribute('src', src);
    mediaEl.setAttribute('controls', 'controls');

    return mediaEl;
  }

  renderTextBlock(text) {
    const textEl = document.createElement('p');
    textEl.classList.add('note-content__text');
    textEl.innerHTML = text;

    return textEl;
  }

  renderGeoBlock(coords) {
    const coordsEl = document.createElement('div');
    coordsEl.classList.add('note-info', 'note-geo');
    coordsEl.textContent = `
			[${coords[0]}, ${coords[1]}]
		`;
    return coordsEl;
  }
}
