import { Platform } from 'react-native';

let shadowStyle = {
    // shadowOpacity: 0.2,
    // shadowRadius: 1,
    // shadowColor: '#000000',
    shadowOpacity: 1,
    shadowRadius: 2,
    shadowColor: 'rgba(0, 0, 0, 0.04)',
    shadowOffset: {
      width: 0,
    //   height: 1,
      height: 4,
    },
};
  
if (Platform.OS === 'android') {
    // shadowStyle = { elevation: 1 };
    shadowStyle = { elevation: 0.5 };
}

export {
    shadowStyle
};

// shadow: {
//     ...Platform.select({
//       ios: {
//         shadowColor: '#000000',
//         shadowOffset: {width: 3, height: 3},
//         shadowOpacity: 0.4,
//         shadowRadius: 10,
//       },
//       android: {
//         elevation: 5,
//       },
//     }),
// }