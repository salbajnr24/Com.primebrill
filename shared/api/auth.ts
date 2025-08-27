import { auth, db } from "@/lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { User as FirebaseUser } from "firebase/auth";
import { User } from "@shared/schema";

export async function createUserProfile(firebaseUser: FirebaseUser, additionalData: Partial<User> = {}): Promise<User> {
  if (!firebaseUser) throw new Error("No user provided");

  const userRef = doc(db, "users", firebaseUser.uid);
  const userSnap = await getDoc(userRef);

  if (!userSnap.exists()) {
    const { displayName, email } = firebaseUser;
    const createdAt = new Date();

    const userData: Omit<User, "id"> = {
      email: email!,
      firstName: displayName?.split(" ")[0] || "",
      lastName: displayName?.split(" ").slice(1).join(" ") || "",
      isAdmin: false,
      createdAt,
      password: "", // Not stored for OAuth users
      ...additionalData,
    };

    try {
      await setDoc(userRef, userData);
    } catch (error) {
      console.error("Error creating user profile:", error);
      throw new Error("Failed to create user profile");
    }
  }

  const userData = await getDoc(userRef);
  return { id: firebaseUser.uid, ...userData.data() } as User;
}

export async function getUserProfile(userId: string): Promise<User | null> {
  try {
    const userRef = doc(db, "users", userId);
    const userSnap = await getDoc(userRef);
    
    if (userSnap.exists()) {
      return { id: userId, ...userSnap.data() } as User;
    }
    return null;
  } catch (error) {
    console.error("Error fetching user profile:", error);
    throw new Error("Failed to fetch user profile");
  }
}
