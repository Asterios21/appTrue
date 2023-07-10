import { Injectable } from '@angular/core';
import { initializeApp } from 'firebase/app';

import { getDatabase, onValue, ref, set } from 'firebase/database';
import { environment } from 'src/environments/environment';
import { AuthService } from './auth.service';


@Injectable({
  providedIn: 'root'
})
export class RealDatabaseService {
  database = getDatabase(initializeApp(environment.firebase));
  email?: string;
  uid?: string;
  constructor(private authService: AuthService) {
  }
  regUser() {

    this.uid = this.authService.getCurrentUser()?.uid!;
    this.email = this.authService.getCurrentUser()?.email!;
    let qUid = ref(this.database, this.uid);
    let flag =false;
    console.log(onValue(qUid, (snapshot) => {if(snapshot.exists()){console.log('existe')}}))
    if(flag){
      set(ref(this.database, this.uid), {
        account_details: '',
        account_name: this.email,
        avatar: '',
        favorites: '',
        likes: '',
        question: {
          TorD: {
            dare: [],
            truth: []
          },
          description: '',
          id: '',
          question_likes: ''
        }
      })
    }
    else{
      console.log('no entramos')
    }
    

    /* else{
      console.log('ya existe');
    } */

  }
}
