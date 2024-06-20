export default class GeolocationAPI {
  async getAutoCoords() {
    const available = this.chekUserAvailableAPI();
    if (available) {
      try {
        const position = await new Promise((res, rej) => {
          navigator.geolocation.getCurrentPosition(res, rej);
        });
        const { latitude, longitude } = position.coords;
        const coords = [latitude, longitude];

        return {
          success: true,
          coords,
        };
      } catch (err) {
        return {
          success: false,
        };
      }
    }
  }

  chekUserAvailableAPI() {
    if (!navigator.geolocation) {
      return false;
    }
    return true;
  }

  validationCoords(data) {
    const isValid = {
      status: true,
    };

    const coords = this.splittingCoords(data);
    if (!coords) {
      isValid.status = false;
    }

    if (coords) {
      const regexp = /^\[?-?\d{1,2}(\.\d{0,7}|)\]{0,1}$/;
      coords.forEach((item) => {
        const chek = regexp.exec(item);
        if (!chek) {
          isValid.status = false;
        }
      });
    }

    if (!isValid.status) {
      isValid.message = 'Неверно записаны координаты. Укажите широту и долготу через запятую';
    }

    return isValid;
  }

  splittingCoords(data) {
    const clearData = data.replaceAll(' ', '');
    const coords = clearData.split(',');

    if (coords.length === 2) {
      return coords;
    }

    return false;
  }

  formattingCoords(data) {
    const coords = this.splittingCoords(data);
    if (!coords) {
      return false;
    }

    const clearCoords = coords.map((item) => {
      let newItem = item.replaceAll(/\[|\]/g, '');

      if (newItem.indexOf('.') > -1) {
        const arrayCoord = newItem.split('.');

        let minutes = arrayCoord[1];
        if (minutes.length < 7) {
          for (let i = minutes.length; i < 5; i += 1) {
            minutes += '0';
          }
        }
        newItem = `${arrayCoord[0]}.${minutes}`;
        return newItem;
      }
      return `${newItem}.00000`;
    });

    return clearCoords;
  }
}
