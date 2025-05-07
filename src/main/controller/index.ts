import { windowController } from './baseController';
import { bizController } from './bizController';

export const initController = () => {
  windowController();
  bizController();
};
