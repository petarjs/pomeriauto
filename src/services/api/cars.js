import firebase, { db } from '../firebase'
import { getCurrentUser } from '../auth'

export default class Cars {
  static async getAll () {
    const collection = db.collection('cars')

    return new Promise(resolve => {
      let data = []
      collection.get().then(function(querySnapshot) {
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

  static getMyCars () {
    const collection = db.collection('cars')

    return new Promise(resolve => {
      let data = []
      collection
        .where('ownerId', '==', getCurrentUser().uid)
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
    const collection = db.collection('cars')

    return new Promise((resolve, reject) => {
      collection
        .doc(id)
        .get()
        .then(function(querySnapshot) {
          resolve(querySnapshot.data())
        });
    })
  }

  static async getMyCar() {
    let cars = await Cars.getMyCars()
    return cars[0]
  }

  static getByLicencePlate (licencePlate) {
    const collection = db.collection('cars')
    return new Promise((resolve, reject) => {
      let data = []
      collection
        .where('licencePlate', '==', licencePlate)
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

  static setImage (id, url) {
    return this.updateMyCar(id, {
      imageUrl: url
    })
  }

  static onMessage(id, cb) {
    const collection = db.collection('cars')

    collection.doc(id)
      .onSnapshot(function(doc) {
          cb(doc)
      });
  }

  static async addMyCar(data) {
    let existingCar = await Cars.getByLicencePlate(data.licencePlate)
    if(existingCar) {
      throw Error('Ne mozete registrovati auto jer vec postoji auto registrovan sa ovom tablicom!')
    }

    data.created = new Date().valueOf()

    const collection = db.collection('cars')

    return collection.add(data)
  }

  static updateMyCar(id, data) {
    const collection = db.collection('cars')

    return collection.doc(id).update(data)
  }

  static deleteMyCar(id) {
    const collection = db.collection('cars')

    return collection.doc(id).delete()
  }
}