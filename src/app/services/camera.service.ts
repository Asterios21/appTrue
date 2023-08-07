import { Injectable } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { finalize } from 'rxjs';
import { FirestoreService } from './firestore.service';



@Injectable({
  providedIn: 'root'
})
export class CameraService {

  constructor(private angularFireStorage:AngularFireStorage,private firestoreService:FirestoreService) { }
  async updateImg(file: any, path: string, nombre: string): Promise<string> {
    // Convertir la imagen capturada a un Blob con tipo "image/png"
    const base64Response = await fetch(`data:image/png;base64,${file.base64String}`);
    const blobFile = await base64Response.blob();
  
    const filePath = path + '/' + nombre;
    const ref = this.angularFireStorage.ref(filePath);
    const task = ref.put(blobFile);
  
    return new Promise<string>((resolve, reject) => {
      task.snapshotChanges().pipe(
        finalize(async () => {
          const downloadUrl = await ref.getDownloadURL().toPromise();
          resolve(downloadUrl);
        })
      ).subscribe();
    });

  }


}
