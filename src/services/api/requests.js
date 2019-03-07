import firebase, { db } from '../firebase'
import { getCurrentUser } from '../auth'
import Cars from './cars'

export default class Requests {
  static getMyRequests () {
    const collection = db.collection('requests')
    let user = getCurrentUser()

    return new Promise(resolve => {
      let data = []
      collection
        .where('car.ownerId', '==', user.uid)
        .orderBy('created', 'desc').limit(10)
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

  static getMySentRequests () {
    const collection = db.collection('requests')
    let user = getCurrentUser()

    return new Promise(resolve => {
      let data = []
      collection
        .where('requesterId', '==', user.uid)
        .orderBy('created', 'desc').limit(10)
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

  static getById (id) {
    const collection = db.collection('requests')

    return new Promise((resolve, reject) => {
      let data = null
      collection
        .doc(id)
        .get()
        .then(function(querySnapshot) {
          resolve(querySnapshot.data())
        });
    })
  }

  static getByLicencePlate (licencePlate) {
    const collection = db.collection('requests')

    return new Promise((resolve, reject) => {
      let data = []
      collection
        .where('car.licencePlate', '==', licencePlate)
        .get().then(function(querySnapshot) {
          querySnapshot.forEach(function(doc) {
            data.push({
              id: doc.id,
              ...doc.data()
            })
          });

          if (data.length === 1) {
            resolve(data[0])
          } else {
            resolve(null)
          }
        });
    })
  }

  static onRequestUpdated(id, cb) {
    const collection = db.collection('requests')

    collection.doc(id)
      .onSnapshot(function(doc) {
        cb(doc.data())
      });
  }

  static onNew (cb) {
    let user = getCurrentUser()

    db.collection('requests').where('car.ownerId', '==', user.uid)
      .onSnapshot(function(snapshot) {
          snapshot.docChanges().forEach(function(change) {
              if (change.type === 'added') {
                let data = change.doc.data()

                if (data.created > window.startTimestamp) {
                  cb()
                }
              }
          });
      });
  }

  static onNewSent (cb) {
    let user = getCurrentUser()

    db.collection('requests').where('Id', '==', user.uid)
      .onSnapshot(function(snapshot) {
          snapshot.docChanges().forEach(function(change) {
              if (change.type === 'added') {
                let data = change.doc.data()

                if (data.created > window.startTimestamp) {
                  cb()
                }
              }
          });
      });
  }

  static onModified (cb) {
    let user = getCurrentUser()

    db.collection('requests').where('car.ownerId', '==', user.uid)
      .onSnapshot(function(snapshot) {
          snapshot.docChanges().forEach(function(change) {
              if (change.type === 'modified') {
                console.log('modified', change.doc.data())
                cb()
              }
          });
      });
  }

  static onRemoved (cb) {
    let user = getCurrentUser()

    db.collection('requests').where('car.ownerId', '==', user.uid)
      .onSnapshot(function(snapshot) {
          snapshot.docChanges().forEach(function(change) {
              if (change.type === 'removed') {
                console.log('removed', change.doc.data())
                cb()
              }
          });
      });
  }

  static async createRequest(data) {
    let myCar = await Cars.getMyCar()

    if (data.licencePlate === myCar.licencePlate) {
      throw Error('cannot-move-own-car')
    }

    data.created = new Date().valueOf()

    const collection = db.collection('requests')

    return collection.add(data)
  }

  static updateRequest(id, data) {
    const collection = db.collection('requests')

    return collection.doc(id).update(data)
  }
}