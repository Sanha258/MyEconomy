import { Platform } from 'react-native';

export const cardShadow = Platform.select({
  web: {
    boxShadow: '0px 2px 4px rgba(0,0,0,0.1)',
  },
  default: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
});

export const buttonShadow = Platform.select({
  web: {
    boxShadow: '0px 1px 2px rgba(0,0,0,0.05)',
  },
  default: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
});