import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { initializeApp } from 'firebase/app';
import { addDoc, collection, getDocs, doc, getDoc, getFirestore, query, where, arrayUnion, arrayRemove, updateDoc } from "firebase/firestore";
import { AuthService } from './auth.service';
import { userQuestion } from '../model/userQuestion';

import { set } from 'firebase/database';


const app = initializeApp(environment.firebase);
const db = getFirestore(app);
@Injectable({
  providedIn: 'root'
})

export class FirestoreService {

  constructor(private authService: AuthService ) { }

  async insertUser() {
    let date = new Date();
    let timestamp = date.getTime();
    let user = this.authService.getCurrentUser()?.email!;
    let idQuest = user + '_' + timestamp;

    if (await this.existUser()) {
      addDoc(collection(db, 'users'), {
        nombre_cuenta: user,
        detalle_cuenta: '',
        avatar: '',
        favoritos: [''],
        likes: [''],
        /* preguntas: {
          [idQuest]: {
            id: idQuest,
            titulo: '',
            descripcion: '',
            likes_usuarios: [''],
            reto: ['Pregunta de reto'],
            verdad: ['Pregunta de verdad']
          }
        }, */
        quest: []
      });
    }
  }

  async existUser() {
    const userRef = collection(db, "users")
    let currentUser = this.authService.getCurrentUser()?.email!
    const q = query(userRef, where("nombre_cuenta", "==", currentUser))
    const querySnapshot = await getDocs(q);
    // Si no existe en la collecion return false sino true
    return querySnapshot.empty
  }

  async getQuestions() {

    const qRef = collection(db, "users")
    const querySnapshot = await getDocs(qRef)
    const questionPack: object[] = []
    const userQuestion: userQuestion[] = []
    /*  autor: string,
    descripcion: string,
    likes: string[],
    verdad: string[],
    reto: string[]
    } */
    querySnapshot.forEach((doc) => {

      questionPack.push(doc.data()['quest'])
    })
    questionPack.forEach((question) => {
      let key = Object.keys(question)
      key.forEach(element => {
        let autorC = question[element as keyof typeof question]['id'] as string
        
        let userQuestionData: userQuestion = {
          id: question[element as keyof typeof question]['id'],
          autor: autorC.split('_',1)[0],
          titulo: question[element as keyof typeof question]['titulo'],
          descripcion: question[element as keyof typeof question]['descripcion'],
          likes: question[element as keyof typeof question]['likes_usuarios'],
          verdad: question[element as keyof typeof question]['verdad'],
          reto: question[element as keyof typeof question]['reto']
        }
        userQuestion.push(userQuestionData)
      })
    })
    console.log(userQuestion)
    return Promise.resolve(userQuestion)
  }

  async getFavorites(user: string) {
    const qRef = collection(db, "users")
    const q = query(qRef, where('nombre_cuenta', '==', user))
    const querySnapshot = await getDocs(q)
    let result: Array<string> = []
    querySnapshot.docs.forEach((doc) => {
      result = doc.data()['favoritos']
    })
    return Promise.resolve(result)
  }
  async updateFavorites(user: string, idQuestion: string, addOrDelete: string) {
    const qRef = collection(db, "users")
    const q = query(qRef, where('nombre_cuenta', '==', user))
    const querySnapshot = await getDocs(q)
    if (addOrDelete == 'add') {
      await updateDoc(querySnapshot.docs[0].ref, {
        favoritos: arrayUnion(idQuestion)
      })
    }
    else {
      await updateDoc(querySnapshot.docs[0].ref, {
        favoritos: arrayRemove(idQuestion)
      })
    }
  }
  async getLikes(user: string) {
    const qRef = collection(db, "users")
    const q = query(qRef, where('nombre_cuenta', '==', user))
    const querySnapshot = await getDocs(q)
    let result: Array<string> = []
    querySnapshot.docs.forEach((doc) => {
      result = doc.data()['likes']
    })
    return Promise.resolve(result)
  }

  async updateLikes(user: string, idQuestion: string, likeOrDislike: string) {
    const qRef = collection(db, "users")
    const q = query(qRef, where('nombre_cuenta', '==', user))
    const querySnapshot = await getDocs(q)
    if (likeOrDislike == 'like') {
      await updateDoc(querySnapshot.docs[0].ref, {
        likes: arrayUnion(idQuestion)
      })
    }
    else {
      await updateDoc(querySnapshot.docs[0].ref, {
        likes: arrayRemove(idQuestion)
      })
    }
  }

  async setQuestions(user: string,data:userQuestion) {
    const qRef = collection(db, "users")
    const q = query(qRef, where('nombre_cuenta', '==', user))
    const querySnapshot = await getDocs(q)
    let date = new Date();
    let timestamp = date.getTime();
    let idQuest = user + '_' + timestamp;
    let object = {
      id: idQuest,
      titulo: data.titulo,
      descripcion: data.descripcion,
      likes_usuarios: [''],
      reto: data.reto,
      verdad: data.verdad
    }
    if (!querySnapshot.empty) {
      await updateDoc(querySnapshot.docs[0].ref, {
        quest: arrayUnion(object)
      })
    }
  }
  async updateLikesUsuarios(user: string, idQuestion: string, likeOrDislike: string) {

    /*  const qRef = collection(db, "users")
     const q = query(qRef, where('nombre_cuenta', '==', user))
     const querySnapshot = await getDocs(q)
     let questionRef= querySnapshot.docs[0].id
     const questionSnapshot= await getDocs(collection(db,'users',questionRef))
     
     console.log(questionSnapshot) */

    /* if (likeOrDislike == 'like') {
      await updateDoc(questionRef, {
        likes_usuarios: arrayUnion(user)
      })
    }
    else {
      await updateDoc(questionRef, {
        likes_usuarios: arrayRemove(user)
      })
    } */

  }
}
