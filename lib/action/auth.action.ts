'use server'

import { cookies } from 'next/headers';
import {db , auth} from '@/Firebase/admin'
import { CollectionReference, DocumentData } from 'firebase-admin/firestore';



const ONE_WEEK = 60 * 60 * 24 * 7;


export async function signUp(params : SignUpParams){
    const {uid , name , email} = params;

    try {
      const userRecord = await db.collection('users').doc(uid).get();


        if(userRecord.exists){
            return{
                success : false,
                message : 'User already exists . Please sign in instead'
            };
        }
        await db.collection('users').doc(uid).set({
            name , email
        });

        return {
            success : true,
            message : 'Account created successfully . please sign in'
        };


    } catch (e : any) {
        console.error('Error creating a user' , e);

        // if(e.code === 'auth/email-already-exists'){
        //     return {
        //         success  : false,
        //         message : 'This email is already  in use'
        //     }
        // }

        return {
            success : false,
            message : 'failed to create an account'
        }
        
    }
}

export async function signIn(params : SignInParams){
    const {email , idToken} = params;

    try{
        const userRecord = await auth.getUserByEmail(email);

        if(!userRecord){
            return {
                success : false,
                message : 'User does not exist. Create an account instead'
            }
        }
        await setSessionCookie(idToken);
    }
    catch(e){
        console.log(e);
        
        return{
            success : false,
            message : 'Failed to log into an account.'
        }
        
    }
}

export async function setSessionCookie(idtoken : string){
    const cookieStore = await cookies();

    const setSessionCookie = await auth.createSessionCookie(idtoken , {
        expiresIn : ONE_WEEK * 1000,
    })

    cookieStore.set('session' , setSessionCookie , {
        maxAge : ONE_WEEK,
        httpOnly : true,
        secure : process.env.NODE_ENV === 'production',
        path : '/',
        sameSite : 'lax'
    })
}

export async function getCurrentuser(): Promise<User | null>{
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('session')?.value;

    if(!sessionCookie) return null;

     try {
    const decodedClaims = await auth.verifySessionCookie(sessionCookie, true);

    
    const userRecord = await db
      .collection("users")
      .doc(decodedClaims.uid)
      .get();
    if (!userRecord.exists) return null;

    return {
      ...userRecord.data(),
      id: userRecord.id,
    } as User;
  } catch (error) {
    console.log(error);

    
    return null;
  }
}

export async function isAuthenticated(){
    const user = await getCurrentuser();
    return !!user;
}
