import { db } from '../firebase'

export default class Responses {
  static async getAll () {
    return new Promise(resolve => {
      let data = []
      db.collection('responses').get().then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
          data.push({
            id: doc.id,
            ...doc.data()
          })
        });

        resolve(data)
      });
    })
  }

  static onMessage(id, cb) {
    db.collection('responses').doc(id)
      .onSnapshot(function(doc) {
          cb(doc)
      });
  }
}