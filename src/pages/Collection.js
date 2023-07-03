import { SafeAreaView, StyleSheet, Text, FlatList, View, Button} from "react-native"
import Database from "../services/Database"


export default function Collection(){

        const flatlistData = Database.all();

        const listViewItemSeparator = () => {
          return (
            <View
              style={{
                height: 0.2,
                width: '100%',
                backgroundColor: '#808080'
              }}
            />
          );
        };
      
        const listItemView = (item) => {
          return (
            <View
              key={item.user_id}
              style={{ backgroundColor: 'white', padding: 20 }}>
              <Text>{item.id}</Text>
              <Text>{item.setup}</Text>
              <Text>{item.punchline}</Text>
            </View>
          );
        };
      
    return (

        <SafeAreaView style={{ flex: 1 }}>
        <View style={{ flex: 1, backgroundColor: 'white' }}>
          <View style={{ flex: 1 }}>
            <FlatList
              data={flatlistData}
              ItemSeparatorComponent={listViewItemSeparator}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => listItemView(item)}
            />
          </View>

          {/* Outra tentativa de passar o array do select * para a flatlist com uma solução mais desacoplada, porem ainda sem sucesso */}

          <View style={{flex:0, marginTop:20, padding: 24}}>
                <Button title = "Apagar piadas" onPress={()=> Database.dropTable()}/> 
            </View>

        </View>
      </SafeAreaView>
      );
    }
    
    const styles = StyleSheet.create({
      container: {
        padding: 50,
        flex: 1,
      },
      item: {
        padding: 20,
        fontSize: 15,
        marginTop: 5,
      }
    });