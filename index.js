/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import {createStore} from 'redux';

//actions 
const increment = () => {
    return{
        type:'Increment'
    }
}

const decrement = () => {
    return {
        type: 'Decrement'
    }
}

//reducer 
const counter =(state =0 , action, ) =>{
    switch (action.type){
        case "Increment":
            return state +1;
        case "Decrement":
            return state-1;
    }
}

let store = createStore(counter);

//display in console 
store.subscribe(() => console.log(store.getState()));

store.dispatch(increment());


AppRegistry.registerComponent(appName, () => App);
