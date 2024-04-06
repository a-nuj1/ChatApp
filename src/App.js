import React, { useEffect, useRef, useState } from "react";
import {Box, VStack,Button,Container,Input,HStack} from "@chakra-ui/react";
import Message from "./Components/Message";
import {GoogleAuthProvider, signInWithPopup,getAuth, onAuthStateChanged, signOut} from "firebase/auth";
import { app } from "./firebase";

import {getFirestore, addDoc, collection, serverTimestamp, onSnapshot, query, orderBy} from "firebase/firestore"

const auth = getAuth(app);

const db = getFirestore(app);


const loginHandler = ()=>{
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider);
}


const logOutHandler = ()=>{
  signOut(auth);
}

function App() {
  const [user, setUser] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  const divForScroll = useRef(null);

  const submitHandler =async(e)=>{
    e.preventDefault();
  
    try{
      setMessage("");
      await addDoc(collection(db, "Messages"),{
        text: message,
        uid: user.uid,
        uri: user.photoURL,
        createdAt:serverTimestamp()
      });
       
      
      divForScroll.current.scrollIntoView({behavior:"smooth"});
    }
    catch(error){
      alert(error);
    }
  }


  useEffect(()=>{
    const q = query(collection(db, "Messages"),orderBy("createdAt", "asc"));
    const call = onAuthStateChanged(auth, (data)=>{
      setUser(data);
    });

    // onSnapshot(collection(db,"Messages"),()=>{})
    const unsubscribe = onSnapshot(q,(snap)=>{
      setMessages(
        snap.docs.map((item) => {
          const id = item.id;
          return {id, ...item.data() } 

        })
        );
    });


    return ()=>{
      call();
      unsubscribe();
    };

  },[]);

  return (
    <Box bg={"red.50"}>
      { user ? (
          <Container h={"100vh"} bg={"white"}>
            <VStack h={"100vh"} paddingY={4} >
              <Button onClick={logOutHandler} colorScheme="red" w={"full"}>LogOut</Button>

              <VStack h={"full"} w={"full"} overflowY={"auto"} css={{"&::-webkit-scrollbar":{
                display: "none",
              },}}>
                {
                  messages.map((item) =>(
                    <Message 
                    key={item.id}
                    user={item.uid === user.uid ? "me": "other"}
                    text={item.text}
                    uri={item.uri}></Message>
                  ))
                }
                <div ref={divForScroll}></div>
              </VStack>


                <form onSubmit={submitHandler} style={{ width:"100%"}} >
                  <HStack>
                    <Input value={message} onChange={(e)=>setMessage(e.target.value)}
                     placeholder="Enter a message...."/>
                    <Button borderRadius={"50"} colorScheme="green" type="submit">send</Button>
                  </HStack>
                </form>
              

            </VStack>
          </Container>
        ):<VStack h={"100vh"} justifyContent={"center"} bg={"white"}>
          <Button onClick={loginHandler} colorScheme="green">Sign In With Google</Button>
        </VStack>
      }
    </Box>
  );
}

export default App;
