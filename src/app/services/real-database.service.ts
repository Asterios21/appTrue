import { Injectable } from '@angular/core';
import { initializeApp } from 'firebase/app';

import { getDatabase, onValue, push, ref, set } from 'firebase/database';
import { environment } from 'src/environments/environment';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class RealDatabaseService {
  database = getDatabase(initializeApp(environment.firebase));
  //regUser()
  email?: string;
  uid?: string;

  constructor(private authService: AuthService) {
  }
  //Register the user in the database
  regUser() {
    this.uid = this.authService.getCurrentUser()?.uid!;
    this.email = this.authService.getCurrentUser()?.email!;
    let qUid = ref(this.database, this.uid);
    let userListRef=ref(this.database,'users');
    let newUserRef= push(userListRef);
    onValue(qUid, (snapshot) => {
      if (snapshot.val() == null) {
        set(newUserRef, {
          account_details: '',
          account_name: this.email,
          avatar: '',
          favorites: '',
          likes: '',
          question: {
            'id': {
              TorD: {
                dare: ['',''],
                truth: ['','']
              },
              description: '',
              question_likes: ''
            }
          }
        })
      }
    })
  }
  //Show the user questions pack
  showUserQP() {
    onValue(ref(this.database),(snapshot)=>{console.log(snapshot.val());})
  }
}
