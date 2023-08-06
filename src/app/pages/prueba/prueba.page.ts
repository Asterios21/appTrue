import { Component, OnInit } from '@angular/core';
import { FirestoreService } from 'src/app/services/firestore.service';

@Component({
  selector: 'app-prueba',
  templateUrl: './prueba.page.html',
  styleUrls: ['./prueba.page.scss'],
})
export class PruebaPage implements OnInit {

  constructor(private firestoreService: FirestoreService) { }

  ngOnInit() {
    
  }

  prueba() {
    this.firestoreService.getQuestions()
  }
}
