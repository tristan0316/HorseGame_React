/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { useEffect, useState, } from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  TextInput,
  Button,
  FlatList,
  ScrollView,
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
import { openDatabase } from 'react-native-sqlite-storage';

//Open database
const db = openDatabase(
  {
    name: 'MainDB',
  },
  () => { console.log("Database Created!") },
  error => { console.log(error) }
);

function App() {

  const createTable = () => {
    db.transaction(txn => {
      txn.executeSql(
        `CREATE TABLE IF NOT EXISTS `
        + `History `
        + `(ID INTEGER PRIMARY KEY AUTOINCREMENT, BetHorse INTEGER, WinHorse INTEGER, BetSize INTEGER, Balance REAL)`,
        [],
        (sqlTxn, res) => {
          console.log("table created successfully");
        },
        error => {
          console.log("error on creating table " + error.message);
        },
      );
    });
  };

  const insert_data = () => {
    db.transaction(txn => {
      txn.executeSql(
        `INSERT INTO History (BetHorse,WinHorse,BetSize,Balance) VALUES (?,?,?,?)`,
        [bethorse, winhorse, betsize, balance],
        (sqlTxn, res) => {
          console.log("data added successfully");
        },
        error => {
          console.log("error on adding data: " + error.message);
        },
      );
    })
  }

  const get_data = () => {
    db.transaction(txn => {
      txn.executeSql(
        `SELECT * FROM History ORDER BY ID DESC`,
        [],
        (sqlTxn, res) => {
          console.log("data retrieved successfully");
          let len = res.rows.length;

          if (len > 0) {
            let results = [];
            for (let i = 0; i < len; i++) {
              let item = res.rows.item(i);
              results.push({ id: item.ID, bet_horse: item.BetHorse, win_horse: item.WinHorse, bet_size: item.BetSize, balancee: item.Balance });
            }

            setbethistory(results);
          }
        },
        error => {
          console.log("error on getting data " + error.message);
        },
      );
    });
  };

  const renderHistory = ({ item }) => {
    return (
      <View style={{
        flexDirection: "row",
        paddingVertical: 12,
        paddingHorizontal: 10,
        borderBottomWidth: 1,
        borderColor: "#ddd",
      }}>
        <Text style={{ marginRight: 40 }}>{item.id}</Text>
        <Text style={{ marginRight: 40 }}> {item.bet_horse}</Text>
        <Text style={{ marginRight: 40 }}>{item.win_horse}</Text>
        <Text style={{ marginRight: 40 }}>{item.bet_size}</Text>
        <Text style={{ marginRight: 40 }}>{item.balancee}</Text>
      </View>
    );
  };

  useEffect(() => {
    createTable();
    get_data();
  }, []);


  const [mile1, setmile1] = useState(0);
  const [mile2, setmile2] = useState(0);
  const [ratio1, setratio1] = useState(2);
  const [ratio2, setratio2] = useState(2);
  // const [mile3, setmile3] = useState(0);
  // const [mile4, setmile4] = useState(0);
  const [balance, setbalance] = useState(20000);
  const [bethorse, setbethorse] = useState(0);
  const [betsize, setbetsize] = useState(0);
  const [winhorse, setwinhorse] = useState(0);
  const [bethistory, setbethistory] = useState([]);
  const [isrunning, setisrunning] =useState(0);

  if(isrunning==2){
    insert_data();
    setisrunning(0);
  }

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
    function onpress1() {
      setChecked('first')
      setbethorse(1)
    }
    function onpress2() {
      setChecked('second')
      setbethorse(2)
    }
    return (
      <View>
        <Text>H1: {ratio1}</Text>
        <RadioButton
          value="first"
          status={checked === 'first' ? 'checked' : 'unchecked'}
          onPress={() => onpress1()}
        />
        <Text>H2: {ratio2}</Text>
        <RadioButton
          value="second"
          status={checked === 'second' ? 'checked' : 'unchecked'}
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
  async function run() {
    var winner = 0;
    setisrunning(1);
    await new Promise(function (resolve, reject) {
      setmile1(0);
      setmile2(0);
      var countmile1 = 0;
      var Idd1 = setInterval(() => {
        if (countmile1 < 1) {
          var RandomNumber1 = Math.floor(Math.random() * 100) * 0.002;
          console.log("Random=", RandomNumber1);
          setmile1(mile1 => mile1 + RandomNumber1);
          countmile1 = countmile1 + RandomNumber1
        }
        else {
          if (winner == 0) {
            winner = 1;
            setwinhorse(1);
            resolve(1);

            //console.log("Winner: ", winner)
          }
          clearInterval(Idd1);
        }
      }, 1000);

      var countmile2 = 0;
      var Idd2 = setInterval(() => {
        if (countmile2 < 1) {
          var RandomNumber2 = Math.floor(Math.random() * 100) * 0.002;
          console.log("Random=", RandomNumber2);
          setmile2(mile2 => mile2 + RandomNumber2);
          countmile2 = countmile2 + RandomNumber2
        }
        else {
          if (winner == 0) {
            winner = 2;
            setwinhorse(2);
            resolve(2);
            //console.log("Winner: ", winner)
          }
          clearInterval(Idd2);
        }
      }, 1000);
    });
    console.log("Winner: " + winner);


    await new Promise(function (resolve, reject) {
      update(winner, bethorse, betsize);
      console.log("Update succesffully")

      resolve(() => { console.log("Update succesffully") }
      );
    });

    setisrunning(2);

    get_data();
  }

  async function update(winner, bet, betamount) {

    await new Promise(function (resolve, reject) {
      if (winner == 1) {
        //adjust balance
        if (winner == bet) {
          setbalance(balance + betamount * ratio1)
        }
        else {
          setbalance(balance - betamount)
        }
        //adjust ratio
        if (ratio1 > 2) {
          setratio1(ratio1 - 0.1)
        }
        setratio2(ratio2 + 0.1)
        resolve(1);
      }

      if (winner == 2) {
        //adjust balance
        if (winner == bet) {
          setbalance(balance + betamount * ratio2)
        }
        else {
          setbalance(balance - betamount)
        }
        //adjust ratio
        if (ratio2 > 2) {
          setratio2(ratio2 - 0.1)
        }
        setratio1(ratio1 + 0.1)
        resolve();
      }
    })
    console.log("The balance is: ", balance)
  }

  function start_race() {
    run();
  }

  function inertdatabutton() {
    insert_data();
    get_data();
  }

  return (
    <View>
      <ScrollView>
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
          onPress={() => start_race()}
        />
        <Text>H1: {mile1}</Text>
        <Horse mile={mile1} >
        </Horse>
        <Text>--------------------------------------------------</Text>
        <Text>H2: {mile2}</Text>
        <Horse mile={mile2} >
        </Horse>
        <Text>--------------------------------------------------</Text>
        <Text>ID   BetHorse   WinHorse   Amount   Balance</Text>
        <FlatList
          data={bethistory}
          renderItem={renderHistory}
        />
      </ScrollView>
    </View>

  );
};


export default App;




