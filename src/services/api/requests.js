import firebase, { db } from '../firebase'
import { getCurrentUser } from '../auth'

export default class Requests {
  static getMyRequests () {
    const collection = db.collection('requests')
    let user = getCurrentUser()

    return new Promise(resolve => {
      let data = []
      collection
        .where('car.ownerId', '==', user.uid)
        .orderBy('created', 'desc').limit(5)
        .get().then(function(querySnapshot) {
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

  static onRequestUpdated(id, cb) {
    const collection = db.collection('requests')

    collection.doc(id)
      .onSnapshot(function(doc) {
        cb(doc)
      });
  }

  static createRequest(data) {
    data.created = new Date().valueOf()

    const collection = db.collection('requests')

    collection.add(data)
  }

  static updateRequest(id, data) {
    const collection = db.collection('requests')

    return collection.doc(id).update(data)
  }
}