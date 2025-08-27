import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  signInWithRedirect,
  getRedirectResult,
  onAuthStateChanged,
  updateProfile,
  sendPasswordResetEmail,
  sendEmailVerification
} from "firebase/auth";
import { 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc,
  serverTimestamp 
} from "firebase/firestore";
import { auth, googleProvider, db } from "../config.js";

/**
 * Create user profile in Firestore
 */
export async function createUserProfile(user, additionalData = {}) {
  if (!user) return null;
  
  try {
    const userRef = doc(db, "users", user.uid);
    const userSnap = await getDoc(userRef);
    
    if (!userSnap.exists()) {
      const { displayName, email, photoURL } = user;
      const createdAt = serverTimestamp();
      
      const userData = {
        email,
        firstName: additionalData.firstName || displayName?.split(' ')[0] || '',
        lastName: additionalData.lastName || displayName?.split(' ').slice(1).join(' ') || '',
        photoURL: photoURL || null,
        isAdmin: false,
        createdAt,
        lastLoginAt: serverTimestamp(),
        ...additionalData
      };
      
      await setDoc(userRef, userData);
      
      // Return the created user data
      return {
        id: user.uid,
        ...userData,
        createdAt: new Date(),
        lastLoginAt: new Date()
      };
    } else {
      // Update last login time
      await updateDoc(userRef, {
        lastLoginAt: serverTimestamp()
      });
      
      return {
        id: user.uid,
        ...userSnap.data(),
        createdAt: userSnap.data().createdAt?.toDate?.() || userSnap.data().createdAt,
        lastLoginAt: new Date()
      };
    }
  } catch (error) {
    console.error("Error creating user profile:", error);
    throw new Error(`Failed to create user profile: ${error.message}`);
  }
}

/**
 * Get user profile from Firestore
 */
export async function getUserProfile(userId) {
  try {
    const userRef = doc(db, "users", userId);
    const userSnap = await getDoc(userRef);
    
    if (userSnap.exists()) {
      return {
        id: userId,
        ...userSnap.data(),
        createdAt: userSnap.data().createdAt?.toDate?.() || userSnap.data().createdAt,
        lastLoginAt: userSnap.data().lastLoginAt?.toDate?.() || userSnap.data().lastLoginAt
      };
    }
    
    return null;
  } catch (error) {
    console.error("Error fetching user profile:", error);
    throw new Error(`Failed to fetch user profile: ${error.message}`);
  }
}

/**
 * Register new user with email and password
 */
export async function registerWithEmail(email, password, firstName, lastName) {
  try {
    const { user } = await createUserWithEmailAndPassword(auth, email, password);
    
    // Update display name
    await updateProfile(user, {
      displayName: `${firstName} ${lastName}`.trim()
    });
    
    // Create user profile in Firestore
    const userProfile = await createUserProfile(user, {
      firstName,
      lastName
    });
    
    // Send email verification
    await sendEmailVerification(user);
    
    return userProfile;
  } catch (error) {
    console.error("Error registering user:", error);
    
    // Handle specific Firebase auth errors
    let errorMessage = error.message;
    
    switch (error.code) {
      case 'auth/email-already-in-use':
        errorMessage = 'An account with this email already exists.';
        break;
      case 'auth/weak-password':
        errorMessage = 'Password should be at least 6 characters.';
        break;
      case 'auth/invalid-email':
        errorMessage = 'Please enter a valid email address.';
        break;
      default:
        errorMessage = 'Failed to create account. Please try again.';
    }
    
    throw new Error(errorMessage);
  }
}

/**
 * Sign in with email and password
 */
export async function signInWithEmail(email, password) {
  try {
    const { user } = await signInWithEmailAndPassword(auth, email, password);
    
    // Get or create user profile
    const userProfile = await createUserProfile(user);
    
    return userProfile;
  } catch (error) {
    console.error("Error signing in:", error);
    
    // Handle specific Firebase auth errors
    let errorMessage = error.message;
    
    switch (error.code) {
      case 'auth/user-not-found':
        errorMessage = 'No account found with this email address.';
        break;
      case 'auth/wrong-password':
        errorMessage = 'Incorrect password. Please try again.';
        break;
      case 'auth/invalid-email':
        errorMessage = 'Please enter a valid email address.';
        break;
      case 'auth/too-many-requests':
        errorMessage = 'Too many failed attempts. Please try again later.';
        break;
      default:
        errorMessage = 'Failed to sign in. Please check your credentials.';
    }
    
    throw new Error(errorMessage);
  }
}

/**
 * Sign in with Google redirect
 */
export async function signInWithGoogle() {
  try {
    await signInWithRedirect(auth, googleProvider);
  } catch (error) {
    console.error("Error initiating Google sign in:", error);
    throw new Error('Failed to initiate Google sign in. Please try again.');
  }
}

/**
 * Handle Google redirect result
 */
export async function handleGoogleRedirect() {
  try {
    const result = await getRedirectResult(auth);
    
    if (result?.user) {
      // Create or update user profile
      const userProfile = await createUserProfile(result.user);
      return userProfile;
    }
    
    return null;
  } catch (error) {
    console.error("Error handling Google redirect:", error);
    
    let errorMessage = error.message;
    
    switch (error.code) {
      case 'auth/account-exists-with-different-credential':
        errorMessage = 'An account already exists with the same email address but different sign-in credentials.';
        break;
      case 'auth/cancelled-popup-request':
        errorMessage = 'Sign in was cancelled.';
        break;
      default:
        errorMessage = 'Failed to complete Google sign in. Please try again.';
    }
    
    throw new Error(errorMessage);
  }
}

/**
 * Sign out current user
 */
export async function signOutUser() {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Error signing out:", error);
    throw new Error('Failed to sign out. Please try again.');
  }
}

/**
 * Send password reset email
 */
export async function resetPassword(email) {
  try {
    await sendPasswordResetEmail(auth, email);
  } catch (error) {
    console.error("Error sending password reset email:", error);
    
    let errorMessage = error.message;
    
    switch (error.code) {
      case 'auth/user-not-found':
        errorMessage = 'No account found with this email address.';
        break;
      case 'auth/invalid-email':
        errorMessage = 'Please enter a valid email address.';
        break;
      default:
        errorMessage = 'Failed to send password reset email. Please try again.';
    }
    
    throw new Error(errorMessage);
  }
}

/**
 * Update user profile
 */
export async function updateUserProfile(userId, updateData) {
  try {
    const userRef = doc(db, "users", userId);
    await updateDoc(userRef, {
      ...updateData,
      updatedAt: serverTimestamp()
    });
    
    return await getUserProfile(userId);
  } catch (error) {
    console.error("Error updating user profile:", error);
    throw new Error(`Failed to update profile: ${error.message}`);
  }
}

/**
 * Set up auth state listener
 */
export function onAuthStateChange(callback) {
  return onAuthStateChanged(auth, async (user) => {
    if (user) {
      try {
        const userProfile = await getUserProfile(user.uid);
        callback(userProfile);
      } catch (error) {
        console.error("Error getting user profile:", error);
        callback(null);
      }
    } else {
      callback(null);
    }
  });
}

/**
 * Check if user is admin
 */
export async function checkAdminStatus(userId) {
  try {
    const userProfile = await getUserProfile(userId);
    return userProfile?.isAdmin === true;
  } catch (error) {
    console.error("Error checking admin status:", error);
    return false;
  }
}

/**
 * Promote user to admin (super admin function)
 */
export async function promoteToAdmin(userId) {
  try {
    const userRef = doc(db, "users", userId);
    await updateDoc(userRef, {
      isAdmin: true,
      promotedAt: serverTimestamp()
    });
    
    return await getUserProfile(userId);
  } catch (error) {
    console.error("Error promoting user to admin:", error);
    throw new Error(`Failed to promote user to admin: ${error.message}`);
  }
}
