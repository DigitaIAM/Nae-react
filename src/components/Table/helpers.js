import {isArray} from 'lodash';

/**
 * The function check events according to special configuration. If html event compare to the config event, will return true, if no return false.
 * @param e
 * @param shortcuts
 * @returns {boolean}
 */
export const checkEventKey = (e, shortcuts) => {
  const isShortcutsArray = isArray(shortcuts);

  if (isShortcutsArray) {
    const equalShortcuts = shortcuts.filter((shortcut) => {
      const isKeysArray = isArray(shortcut.key);

      if (isKeysArray) {
        return shortcut.key.includes(e.code) && e.shiftKey === shortcut.shift && e.ctrlKey === shortcut.ctrl
      }
      return e.code === shortcut.key && e.shiftKey === shortcut.shift && e.ctrlKey === shortcut.ctrl
    });

    return !!equalShortcuts?.length;
  }

  return e.code === shortcuts.key && e.shiftKey === shortcuts.shift && e.ctrlKey === shortcuts.ctrl;
}

/**
 * The function will create empty object copy.
 * @param data
 * @returns {{}|null|*}
 */
export const createEmptyObjectCopy = (data) => {
  if (isArray(data)) {
    return data.map((i) => {
      return createEmptyObjectCopy(i);
    })
  }
  if (data === Object(data)) {
    const n = {};

    Object.entries(data).forEach(([key, value]) => {
      n[key] = createEmptyObjectCopy(value);
    });

    return n;
  }

  return null;
}

export const isObjectEmpty = (object) => {
  let isEmpty = true;

  const checker = (object) => {
    if (isArray(object)) {
      return object.map((i) => {
        return checker(i);
      });
    }

    if (object === Object(object)) {
      Object.values(object).forEach((value) => {
        return checker(value);
      });

      return;
    }

    if (object !== null && object !== '') {
      isEmpty = false;
    }
  };

  checker(object);

  return isEmpty;
}
