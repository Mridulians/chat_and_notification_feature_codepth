import {Box , Container , VStack , Button, Input, HStack}  from "@chakra-ui/react"
import './App.css';
import { useEffect, useRef, useState } from "react";
import Message from "./Components/Message";
import {onAuthStateChanged ,  getAuth,  GoogleAuthProvider , signInWithPopup , signOut} from "firebase/auth"
import {app} from './firebase'
import {getFirestore , addDoc, collection, serverTimestamp , onSnapshot , query , orderBy} from "firebase/firestore"

const auth = getAuth(app);
const db = getFirestore(app);

const loginHandler = () =>{
  const provider = new GoogleAuthProvider();

  signInWithPopup(auth , provider)
}

const logoutHandler = () =>{
  signOut(auth);
}



function App() {
  // const q = query(collection(db , "Messages"),orderBy("createdAt" , "asc"))

 const [user, setUser] = useState(false)
 const[message , setMessage] = useState("")
 const [messages , setMessages] = useState([]);

 const divForScroll = useRef(null)


 const submitHandler = async(e) =>{
  e.preventDefault();

  try {
    setMessage("")
    await addDoc(collection(db , "Messages"),{
  text:message,
  uid: user.uid,
  uri: user.photoURL,
  createdAt: serverTimestamp()
    })
      setMessage("")
      divForScroll.current.scrollIntoView({behavior:"smooth"})
  }
   catch (error) {
    alert(error)
  }
}








useEffect(() =>{
  const q = query(collection(db , "Messages"),orderBy("createdAt" , "asc"))
  const unsubscribe = onAuthStateChanged(auth , (data) =>{
     setUser(data)
  })

   const unsubscribeForMessage =  onSnapshot(q , (snap)=>{
    // console.log(snap)
    setMessages(snap.docs.map((item)=>{
      const id = item.id;
      return { id , ...item.data()};
    }))
  })


  return () =>{
    unsubscribe();
    unsubscribeForMessage();
  }
} , []);





  return (
    <Box bg={"hotpink"}> 

      {user ? (<Container bg={"white"} h={"100vh"}>
        
        <VStack h={"full"} paddingY={"4"}>
          <Button onClick={logoutHandler} w={"full"} colorScheme={"red"}>
            Logout
          </Button>

      <VStack border={"2px solid black"}  h={"full"} w={"full"} overflowY={"auto"} css={{"&::-webkit-scrollbar":{
        display:"none"
      }}}>
       {
        messages.map(item =>(
          <Message
          key={item.id}
           user={item.uid===user.uid? "me":"other"} 
           text={item.text}
            uri = {item.uri} />
        ))
       }
        
        <div ref={divForScroll}></div>
      </VStack>
       
      
      <form onSubmit={submitHandler} style={{width:"100%"}}>

        <HStack>
        <Input value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Enter a Message" border={"2px solid black"}/>
        <Button colorScheme={"purple"} type="submit">
             send
        </Button>
        </HStack>
      </form>


        </VStack>
      </Container>) :
      
       <VStack bg={"greenyellow"} h={"100vh"} justifyContent={"center"}>
        <h1 style={{fontWeight:"700" , fontSize:"2rem"}}>Welcome Friend🙋‍♂️</h1>
         <Button onClick={loginHandler} colorScheme={"linkedin"}> Sign in with Google</Button>
        </VStack>}
    </Box>
  );
}

export default App;
