import * as SQLite from 'expo-sqlite'
import { useState } from 'react';

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

  const [flatListItems, setFlatListItems] = useState([]);
  useEffect(() => {
    Database.db.transaction((tx) => {
      tx.executeSql(
        'SELECT * FROM piadas',
        [],
        (tx, results) => {
          var temp = [];
          for (let i = 0; i < results.rows.length; ++i)
            temp.push(results.rows.item(i));
          setFlatListItems(temp);
          return(flatListItems);
        }
      );
    });
    
  }, []);
  }
/* 
  Tentativa inicial usando o retorno .array direto no data de uma flatlist mais simples que a atual porem não deu certo
  ____________________________________
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
  }; */

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