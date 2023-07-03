import * as SQLite from 'expo-sqlite'

const db = SQLite.openDatabase("db.db")


db.transaction((tx) => {
  tx.executeSql(
    "CREATE TABLE IF NOT EXISTS piadas (id INTEGER PRIMARY KEY AUTOINCREMENT, setup TEXT, punchline TEXT);"
  );
});


const create = (obj) => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        "INSERT INTO piadas (setup, punchline) values (?, ?);",
        [obj.setup, obj.punchline],
        (_, { rowsAffected, insertId }) => {
          if (rowsAffected > 0) resolve(insertId);
          else reject("Error inserting obj: " + JSON.stringify(obj));
        },
        (_, error) => reject(error)
      );
    });
  });
};

const all = () => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
    
      tx.executeSql(
        "SELECT * FROM piadas;",
        [],
              (_, { rows }) => resolve(rows._array),
        (_, error) => reject(error) 
      );
    });
  });
};

fetchData = () => {
  db.transaction(tx => {
  tx.executeSql('SELECT * FROM agenda', null,
  (txObj, { rows: { _array } }) => this.setState({ data: _array })
  )
  })
  }

  <ScrollView >
{
this.state.data && this.state.data.map(data =>
(
<View key={data.id} style={styles.item}>
<TouchableOpacity
onPress={() => this.delete(data.id)}>
<Text>Nome:{data.nome} - Telefone:{data.telefone}</Text>
</TouchableOpacity>
</View>
)
)}
</ScrollView>

const dropTable = () => {
    db.transaction((tx) => {
        tx.executeSql("DROP TABLE piadas;");
    });
  }

export default {
  create,
  all,
  dropTable,
};