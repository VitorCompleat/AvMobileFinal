import React, { useState, useEffect } from "react";
import { Alert, FlatList, StyleSheet, View, Text, Button, SafeAreaView, ActivityIndicator } from "react-native";
import * as SQLite from 'expo-sqlite';
import axios from "axios";

export default ApiContainer = () => {

    const db = SQLite.openDatabase("piadas.db")
    const [setup, setSetup] = useState(null);
    const [punchline, setPunchline] = useState(null);
    const [empty, setEmpty] = useState([]);
    const [items, setItems] = useState([]);
    const [bolinha, setBolinha] = useState(false);
    const [fromAxios, setFromAxios] = useState(false)
    const [loading, setLoading] = useState(false) 

  db.transaction((tx) => {
    tx.executeSql("CREATE TABLE IF NOT EXISTS piadas (indice INTEGER PRIMARY KEY AUTOINCREMENT, setup TEXT, punchline TEXT");
  });

    const setJoke = (json) => {
    setSetup(json.setup);
    setPunchline(json.punchline);
    saveJoke(json.setup, json.punchline)
  }

  const getJoke = () => {
    setFromAxios(false);
    setLoading(true);

    axios.get(`https://official-joke-api.appspot.com/random_joke`)
      .then(response => {
        console.log(response.data);
        setTimeout(() => {
          setLoading(false);
          setJoke(response.data);
          setFromAxios(true);
          setBolinha(false);
        }, 2000)
      })
      .catch(error => {
        console.log(error);
      });
  }

  /* const listarPiadas = async () => {
    console.log('listar piada');
    setBolinha(true);
    setFromAxios(false);
    db.transaction((tx) => {
      tx.executeSql(
        'SELECT * FROM piada order by indice',
        [],
        (tx, results) => {
          var temp = [];
          for (let i = 0; i < results.rows.length; ++i) {
            temp.push(results.rows.item(i));
            setItems(temp);
            console.log(temp);
            if (results.rows.length >= 1) {
              setEmpty(false);
              console.log('alguma coisa')
            } else {
              setEmpty(true)
              console.log('vazio')
            }
          }
        }
      );
    });
  } */
  
  const [flatListItems, setFlatListItems] = useState([]);
  
  const listarPiadas = () =>{ 
  useEffect(() => {
    db.transaction((tx) => {
      tx.executeSql(
        'SELECT * FROM piadas order by indice',
        [],
        (tx, results) => {
          var temp = [];
          for (let i = 0; i < results.rows.length; ++i)
            temp.push(results.rows.item(i));
          setFlatListItems(temp);
        }
      );
    });
    listarPiadas();
  }, []);
}

  
  const apagarPiadas = () => {
    console.log('piadas apagadas')
    db.transaction((tx) => {
      tx.executeSql("drop table if exists piadas;");
    });
    setEmpty(true);
    setItems(null);
  }



  const saveJoke = (json) => {
    console.log('salvar piada');
    db.transaction(
      (tx) => {
        tx.executeSql('INSERT INTO piadas (setup, punchline) VALUES (?, ?)',
          [json.setup, json.punchline], (resultSet) => {
            Alert.alert("Alerta", "Piada armazenada");
          }, (error) => {
            console.log(error);
          }
        )
      }
    );
    setEmpty(false);
  };



  const separadorItem = () => {
    return (
      <View
        style={{
          height: 1,
          width: '100%',
          backgroundColor: '#000'
        }}
      />
    );
  };

  const mensagemVazia = (status) => {
    return (
      <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}>
        <Text style={{ fontSize: 25, textAlign: 'center' }}>Nenhum registro
        </Text>
      </View>
    );
  }

  return (
      <SafeAreaView style={{ marginTop:20, flex: 1}}>
      <View style={{ margin: 80}}>
        <View style={{ marginTop:20}}>
          <Button 
            title={'Nova piada'}
            onPress={() => { getJoke() }}

            />
        </View>
          
        {/*  <Button
            title={'Listar piadas'}
          onPress={() => { listarPiadas() }}
            color='green'
          /> */}
        <View style={{ marginTop:20}}>
          <Button
            title={'Apagar piadas'}
            onPress={() => { apagarPiadas() }}
          />
        </View>
      </View>
            <FlatList
            data={flatListItems}
            renderItem={({ item }) => <Text>{item.indice} {item.setup} {item.punchline} </Text>}
            keyExtractor={(item) => item.indice}
          />

          {/* Tentei fazer essa flatlist aparecer de qualquer forma, mas nem forçando com useEffect ela carrega, ainda não sei se é problema do banco ou de renderização */}
   
      {fromAxios ?
        <View style={{ marginTop:20, flex: 1}}>
          <Text style={{ margin: 18 }}>{setup}</Text>
          <Text style={{ margin: 18 }}>{punchline}</Text>
        </View>
        :
        <Text style={{ margin: 18 }}></Text>
      }
      {loading &&
        <View style={{ marginTop:20, flex: 1}} >
          <Text style={{ fontSize: 16, color: 'red', margin: 18}}>Carregando...</Text>
          <ActivityIndicator size="large" color="red" />
        </View>
      }
    </SafeAreaView>
  )
}
  


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 5,
    marginTop: 5,
    padding: 5,
  },
});