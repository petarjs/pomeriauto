import { db } from '../../services/firebase'

export default class Messages {
  static async getAll () {
    return new Promise(resolve => {
      let data = []
      db.collection('messages').get().then(function(querySnapshot) {
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

  static onMessageChange(id, cb) {
    db.collection('messages').doc(id)
      .onSnapshot(function(doc) {
          cb(doc)
      });
  }
}