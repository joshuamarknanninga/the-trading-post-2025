import { registerRootComponent } from 'expo';
import App from './App';

console.log('App:', App); // should not be undefined or {}

registerRootComponent(App);
