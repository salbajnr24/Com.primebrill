
import { auth, db, storage } from '../firebase';
import { signInAnonymously } from 'firebase/auth';
import { collection, addDoc, getDocs } from 'firebase/firestore';
import { ref, uploadBytes } from 'firebase/storage';

export async function testFirebaseConnection() {
  console.log('🔥 Testing Firebase connection for Web...');
  
  try {
    // Test Authentication
    console.log('Testing Auth...');
    const userCredential = await signInAnonymously(auth);
    console.log('✅ Auth connected! User ID:', userCredential.user.uid);
    
    // Test Firestore
    console.log('Testing Firestore...');
    const testCollection = collection(db, 'test');
    const docRef = await addDoc(testCollection, {
      message: 'Hello from web!',
      timestamp: new Date(),
      platform: 'web'
    });
    console.log('✅ Firestore connected! Document ID:', docRef.id);
    
    // Read back the document
    const snapshot = await getDocs(testCollection);
    console.log('✅ Firestore read successful! Documents:', snapshot.size);
    
    // Test Storage
    console.log('Testing Storage...');
    const storageRef = ref(storage, 'test/web-test.txt');
    const testBlob = new Blob(['Hello from web storage!'], { type: 'text/plain' });
    await uploadBytes(storageRef, testBlob);
    console.log('✅ Storage connected! File uploaded successfully');
    
    console.log('🎉 All Firebase services working on Web!');
    return true;
    
  } catch (error) {
    console.error('❌ Firebase connection failed:', error);
    return false;
  }
}
