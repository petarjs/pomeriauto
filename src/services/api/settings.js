import firebase, { db } from '../firebase'
import { getCurrentUser } from '../auth'

export default class Settings {
  static getMySettings () {
    const collection = db.collection('settings')

    return new Promise(async resolve => {
      let doc = await collection.doc(getCurrentUser().uid).get()
      resolve(doc.data())
    })
  }

  static async getByUserId (id) {
    const collection = db.collection('settings')

    let doc = await collection.doc(id).get()
    return doc.data()
  }

  static saveMySettings(data) {
    const collection = db.collection('settings')

    return collection.doc(getCurrentUser().uid).set(data, { merge: true })
  }

}