export default class NoteObj {
  constructor(data) {
    const note = this.createNote(data);

    return note;
  }

  createNote(dataObj) {
    const { type, data, coords } = dataObj;
    const note = {
      time: Date.now(),
      type,
      coords,
    };

    if (type === 'text') {
      note.text = data;
    }

    if (type === 'media') {
      const typeArray = data[0].type.split('/');
      note.type = typeArray[0];

      const blob = new Blob(data, {
        type: note.type,
      });

      const src = URL.createObjectURL(blob);
      note.src = src;
    }

    return note;
  }
}
