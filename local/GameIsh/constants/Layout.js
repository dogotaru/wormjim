import {Dimensions, Image, View, Text} from 'react-native';
import {animated} from "react-spring";
import {COLORS} from "./Colors";

export const ViewAnimated = animated(View);
export const ImageAnimated = animated(Image);
export const TextAnimated = animated(Text);
export const WIDTH = Dimensions.get('window').width;
export const HEIGHT = Dimensions.get('window').height;
export const BODY_DIAMETER = Math.trunc(Math.max(WIDTH, HEIGHT) * (WIDTH > 400 ? 0.06 : 0.08));
export const HALF_DIAMETER = BODY_DIAMETER / 2;
export const COLLECTIBLE_DIAMETER = BODY_DIAMETER / 1.5;
export const MAX_WIDTH = Math.floor(WIDTH - HALF_DIAMETER);
export const MAX_HEIGHT = Math.floor(HEIGHT - HALF_DIAMETER);
export const MAX_WIDTH_COLLECTIBLE = Math.floor(MAX_WIDTH - COLLECTIBLE_DIAMETER + 1);
export const MAX_HEIGHT_COLLECTIBLE = Math.floor(MAX_HEIGHT - COLLECTIBLE_DIAMETER + 1);
export const BORDER_WIDTH = Math.trunc(BODY_DIAMETER * 0.08);
export const INDEX_MOD = COLORS.length;
export const IS_SMALL_DEVICE = WIDTH < 375;