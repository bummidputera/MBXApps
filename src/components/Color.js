import {store} from '@src/state/redux';
import {useSelector} from 'react-redux';

const staticColors = {
  primary: '#96C63B',
  primaryDark: '#033F59',
  primarySoft: '#DAEBF2',
  primaryYellow: '#FAC255',
  oldGreen: '#557D09',
  secondary: '#FB9850',
  disabled: '#A1A1A1',
  success: '#0BBC2E',
  info: '#0787D7',
  warning: '#F5B72C',
  error: '#D83030',
  green: '#59A12F',
  gray: '#666666',
  red: '#D83030',
  yellow: '#FFD35B',
  blue: '#027BC9',
  timer: '#F94918',
  icon: '#667786',
  bid: '#E6E9EA',
  text: '#FFFFFF',
  white: '#FFFFFF',
  infosecond: '#DAE9F2',
};

export const lightModeColors = {
  ...staticColors,
  overflow: 'rgba(0, 0, 0, 0.3)',
  reverseOverflow: 'rgba(f, f, f, 0.3)',
  colorDominant: 'light',
  theme: '#FFFFFF', // '#EEF2E6', // '#F4F4F4',
  text: '#0D0006',
  textInput: '#FFFFFF',
  border: '#DDDDDD',
  semiwhite: '#E5E5E5',
};

export const darkModeColors = {
  ...staticColors,
  overflow: 'rgba(f, f, f, 0.3)',
  reverseOverflow: 'rgba(0, 0, 0, 0.3)',
  colorDominant: 'dark',
  theme: '#161c00',
  text: '#FFFFFF',
  textInput: '#0D0006',
  border: '#707070',
  semiwhite: '#353535',
};

export const useColor = isRoot => {
  const theme = isRoot
    ? store.getState()['theme'].theme
    : useSelector(state => state['theme'].theme);

  const Color = theme === 'dark' ? darkModeColors : lightModeColors;
  return {Color};
};

export default lightModeColors;
