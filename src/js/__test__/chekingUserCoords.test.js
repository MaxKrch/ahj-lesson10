import App from '../API/App';

const correctCoords = ['[05.5015, -55.5745210]', '-00.00575, 12.1234567]', '0, -50.5741]', '54 ,-41.5470 ', '12.5,1.0 '];

const unCorrectCoords = ['54.00 12.50', '1248.05 , 12.0', '-[54.0, 44.25 '];

document.body.innerHTML = '<div class="app" id="app"></div';
const app = new App('#app');

test.each(correctCoords)(`currect coords: %s`, (coords) => {
  const valid = app.geo.validationCoords(coords);
  const received = valid.status;

  expect(received).toBe(true);
});

test.each(unCorrectCoords)(`uncorrect coords: %s`, (coords) => {
  const valid = app.geo.validationCoords(coords);
  const received = valid.status;

  expect(received).toBe(false);
});
