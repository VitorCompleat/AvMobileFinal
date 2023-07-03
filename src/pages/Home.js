import {useEffect, useState} from 'react';
import {Text, View, Button} from 'react-native';
import Database from '../services/Database';

export default function Home ({navigation}){
    
    const [setup, setSetup] = useState(null);
    const [punchline, setPunchline] = useState(null);
   
    function setJoke(json){
        setSetup(json.setup);
        setPunchline(json.punchline);
    }

    const getJoke = async () => {
        try {
          const response = await fetch('https://official-joke-api.appspot.com/random_joke');
          const json = await response.json();
          setJoke(json); 
        } catch (error) {
          console.error(error);
        }
      };
    
      useEffect(() => {
        getJoke();
      }, []); 

      Database.create(setup, punchline);
      
      
      return (
        <View style={{marginTop: 10, flex: 1}}>
            <View style={{flex:0, marginTop:20, padding: 24, alignItems:'center'}}>
              <Text style={{fontSize: 16, fontWeight:'bold'}}>{setup}</Text>
              <Text style={{fontSize: 16}}>{punchline}</Text>
            </View>
            <View style={{flex:0, marginTop:20, padding: 24}}>
              <Button title = "Nova Piada" onPress={()=> getJoke()}/> 
            </View>
           <View style={{flex:1, marginTop: 1, padding: 24}} >
               <Button title = "Coleção" onPress={()=> navigation.navigate('Collection')}/>
            </View>
        </View>
        
      );
}