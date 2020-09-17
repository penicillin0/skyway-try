export const isUseWidth = (h, w) => {
  if (h / w > 9 / 16) {
    return true;
  } else {
    return false;
  }
};

export const STANDARD_WIDTH = 16;
export const STANDARD_HEIGHT = 9;
