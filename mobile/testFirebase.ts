
import { auth, db, storage } from './firebase';
import { signInAnonymously } from 'firebase/auth';
import { collection, addDoc, getDocs } from 'firebase/firestore';
import { ref, uploadBytes } from 'firebase/storage';

export async function testFirebaseConnection() {
  console.log('🔥 Testing Firebase connection for Mobile...');
  
  try {
    // Test Authentication
    console.log('Testing Auth...');
    const userCredential = await signInAnonymously(auth);
    console.log('✅ Auth connected! User ID:', userCredential.user.uid);
    
    // Test Firestore
    console.log('Testing Firestore...');
    const testCollection = collection(db, 'test');
    const docRef = await addDoc(testCollection, {
      message: 'Hello from mobile!',
      timestamp: new Date(),
      platform: 'mobile'
    });
    console.log('✅ Firestore connected! Document ID:', docRef.id);
    
    // Read back the document
    const snapshot = await getDocs(testCollection);
    console.log('✅ Firestore read successful! Documents:', snapshot.size);
    
    // Test Storage
    console.log('Testing Storage...');
    const storageRef = ref(storage, 'test/mobile-test.txt');
    const testData = new Uint8Array([72, 101, 108, 108, 111]); // "Hello" in bytes
    await uploadBytes(storageRef, testData);
    console.log('✅ Storage connected! File uploaded successfully');
    
    console.log('🎉 All Firebase services working on Mobile!');
    return true;
    
  } catch (error) {
    console.error('❌ Firebase connection failed:', error);
    return false;
  }
}
