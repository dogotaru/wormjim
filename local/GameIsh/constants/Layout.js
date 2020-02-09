import {Dimensions, Image, View} from 'react-native';
import {animated} from "react-spring";

export const ViewAnimated = animated(View);
export const ImageAnimated = animated(Image);
export const WIDTH = Dimensions.get('window').width;
export const HEIGHT = Dimensions.get('window').height;
export const BODY_DIAMETER = Math.trunc(Math.max(WIDTH, HEIGHT) * (WIDTH > 400 ? 0.07 : 0.08));
export const HALF_DIAMETER = BODY_DIAMETER / 2;
export const MAX_WIDTH = Math.floor(WIDTH - HALF_DIAMETER);
export const MAX_HEIGHT = Math.floor(HEIGHT - HALF_DIAMETER);
export const BORDER_WIDTH = Math.trunc(BODY_DIAMETER * 0.08);
export const COLLECTIBLE_DIAMETER = BODY_DIAMETER / 1.5;

export default {
  window: {
    width: WIDTH,
    height: HEIGHT,
  },
  isSmallDevice: WIDTH < 375,
};