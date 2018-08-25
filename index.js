import { AppRegistry, YellowBox } from 'react-native';
import App from './App';

// при навигации (swiper) возникает ошибка. Косяк реакта или либы (самой популярной), поэтому пока что просто уберу warning
YellowBox.ignoreWarnings(['Warning: isMounted(...) is deprecated', 'Module RCTImageLoader']);

AppRegistry.registerComponent('br4', () => App);
