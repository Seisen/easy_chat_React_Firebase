import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';
import {useAuthState} from "react-firebase-hooks/auth";
import {useCollection} from "react-firebase-hooks/firestore";
import './App.css';
import React, { useRef, useState } from 'react';
import 'firebase/analytics';


firebase.initializeApp({
  apiKey: "AIzaSyBixbA06DMNkIyFDc9XfzAYqNoGFhWkE6c",
  authDomain: "easychat-8acbc.firebaseapp.com",
  projectId: "easychat-8acbc",
  storageBucket: "easychat-8acbc.appspot.com",
  messagingSenderId: "1034600916388",
  appId: "1:1034600916388:web:46645a85fdc30857ac4d31"
})
const auth = firebase.auth();
const firestore = firebase.firestore();


function App() {
  const [user] = useAuthState(auth);
  return (
    <div className="App">
      <header className="App-header">

        <section>
          {user ? <ChatRoom /> : <SignIn />}
        </section>
      </header>
    </div>
  );
}
function SignIn(){
  const signInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider);
  }
  return(
      <button onClick={signInWithGoogle}>Sign in with Google</button>
  )
}

function SignOut(){
    return auth.currentUser && (
        <button onClick={() => auth.signOut()}> Sign Out</button>
    )
}

function  ChatRoom(){
  const messageRef = firestore.collection('messages');
  const query = messageRef.orderBy('createdAt').limit(25);
  const [messages] = useCollection(query, {idField: 'id'});

  const [formValue, setFormValue] = useState('');

  const dummy = useRef();

  const sendMessage = async (e) => {
      e.preventDefault();

      const {uid,photoURL} = auth.currentUser;
      await messageRef.add({
        text: formValue,
          createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            uid,
          photoURL
      });
      setFormValue('');
      dummy.current.scrollIntoView({behavior :'smooth'});
  }

   return(
       <>
           <main>
               {messages && messages.map(msg => <ChatMessage key={msg.id} message={msg}/>)}
               <div ref={dummy}></div>
           </main>

           <form onSubmit={sendMessage}>
                <input value={formValue} onChange={(e) =>setFormValue(e.target.value)}/>
                <button type='submit' ></button>
           </form>
       </>
   )
}

function ChatMessage(props){
    const { text, uid, photoURL} = props.message;

    const messageClass = uid === auth.currentUser.uid ? 'sent' : 'received';

    return (
        <div className={'message ${mesageClass}'}>
            <img src ={photoURL}/>
            <p>{text}</p>
        </div>
    )
}
export default App;
