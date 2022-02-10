/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { useEffect, useState,} from 'react';


import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  TextInput,
  Button,
} from 'react-native';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

import Horse from "./Horse"

import { RadioButton } from 'react-native-paper';



function App() { 

  const [mile1, setmile1] = useState(0);
  const [mile2, setmile2] = useState(0);
  const [ratio1, setratio1] = useState(2);
  const [ratio2, setratio2] = useState(2);
  // const [mile3, setmile3] = useState(0);
  // const [mile4, setmile4] = useState(0);
  const [balance,setbalance] = useState(20000);
  const [bethorse, setbethorse]=useState(0);
  const [betsize, setbetsize]=useState(0);

  const styles = StyleSheet.create({
    input: {
      height: 40,
      margin: 12,
      borderWidth: 1,
      padding: 10,
    },
  });

  //minor bug here, where you have to click twice to upadate radio button
  const MyComponent = () => {
    
    const [checked, setChecked] = React.useState(null);

    function onpress1 (){
      setChecked('first')
      setbethorse(1)
    }

    function onpress2 (){
      setChecked('second')
      setbethorse(2)
    }
  
    return (
      <View>
        <Text>H1: {ratio1}</Text>
        <RadioButton
          value="first"
          status={ checked === 'first' ? 'checked' : 'unchecked' }
          onPress={() => onpress1()}
        />
        <Text>H2: {ratio2}</Text>
        <RadioButton
          value="second"
          status={ checked === 'second' ? 'checked' : 'unchecked' }
          onPress={() => onpress2()}
        />
      </View>
    );
  };

  const getexrate = async () => {
    try {
      console.log("fetching")
      const response = await fetch(
        "http://api.exchangeratesapi.io/v1/latest?access_key=1fd1a2abaf347ce135f96bdc8618d59c"
      );
      console.log("fetch completed")
      exrate = await response.json();
      //GBP to USD
      console.log(exrate.rates.USD)
      console.log("------")
      return exrate;
  
    } catch (error) {
      console.log("fetch fail");
    }
  };

  //getexrate();

  

    // this function runs the race, then return an integer to indicate winner 
    function run(){
      // setInterval(() => {
      //   if(mile1<1){
      //     var RandomNumber1 = Math.floor(Math.random() * 100)*0.001  ;
      //     console.log(RandomNumber1)
      //     setmile1(mile1+RandomNumber1);
      //     console.log(mile1)
      //      }
      //   else{
      //     return;
      //   }
      // }, 1000);
      let winhorse=0;
      var RandomNumber = Math.floor(Math.random() * 2)+1;
      console.log(RandomNumber)
      if(RandomNumber==1){
        
        winhorse=1;
      }
      if(RandomNumber==2){
        winhorse=2;
      }
      return winhorse;
    }

    function update(winner,bet,betamount){

      if(winner==1){
        //adjust balance
        if(winner==bet){
          setbalance(balance+betamount*ratio1)
        }
        else{
          setbalance(balance-betamount)
        }
        //adjust ratio
        if(ratio1>2){
          setratio1(ratio1-0.1)
        }
        setratio2(ratio2+0.1)
      }

      if(winner==2){
        //adjust balance
        if(winner==bet){
          setbalance(balance+betamount*ratio2)
        }
        else{
          setbalance(balance-betamount)
        }
        //adjust ratio
        if(ratio2>2){
          setratio2(ratio2-0.1)
        }
        setratio1(ratio1+0.1)
      }
    }

    function start_race(){
      winner= run();
      update(winner,bethorse,betsize)
    }

  return (
   <View>
     <Text>Balance: {balance}</Text>  
     <Text>Bet size: {betsize}</Text>
     <Text>Bet Horse: {bethorse}</Text>
     <TextInput
        style={styles.input}
        onChangeText={setbetsize}
        value={betsize}
        placeholder="Enter Betsize"
        keyboardType="numeric"
      />
    <MyComponent></MyComponent>
    <Button
        title="StartRunning"
        onPress={() =>start_race() }
      />
    <Horse mile={mile1} >  
    </Horse>
    <Horse mile={mile2} >  
    </Horse>
    </View>
    
  );
};


export default App;
