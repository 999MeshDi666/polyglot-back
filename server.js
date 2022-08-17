import 'dotenv/config' 
import express from 'express'
import cors from 'cors'






import { initializeApp } from "firebase/app";
import {getDatabase} from "firebase/database"
import { ref, onValue, set, orderByChild, query, update } from "firebase/database";

const firebaseConfig = {
    apiKey: "AIzaSyAwjrx46MmvA1m4jNhuNf_NSp3FMdc1fzs",
    authDomain: "polyglot-999666.firebaseapp.com",
    databaseURL: "https://polyglot-999666-default-rtdb.firebaseio.com",
    projectId: "polyglot-999666",
    storageBucket: "polyglot-999666.appspot.com",
    messagingSenderId: "1051194073372",
    appId: "1:1051194073372:web:896ed47e1c48b827219ad9",
    measurementId: "G-CC7DM627RK"
};

const fbaseConfig = initializeApp(firebaseConfig);
const fbaseDB = getDatabase(fbaseConfig)


//express app
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(
    cors({
      origin: 'http://localhost:3000',
      credentials: true,
    })
);




let data;
const getGameplayData = ref(fbaseDB, `polyglot/gameplay/polyglot/eng`)
onValue(getGameplayData, (snapshot) => {
    data = snapshot.val()
    
})




let roomUrl;
const getCurWord = async(req, res)=>{
    roomUrl = req.body.roomUrl
   
    try {
        res.status(200).json(`curWord: ${roomUrl}`)
    } catch (error) {
        res.status(400).json({error: error.message})  
       
    }
}

app.post('/', getCurWord )





app.get('/',(req, res)=>{
    res.json({mssg: roomUrl})
})
var result = {}
app.get(`/:roomUrl/curWord`, async (req, res)=>{
    const url = req.params.roomUrl
    
    onValue(ref(fbaseDB, `polyglot/rooms/${url}/current-word/`), (snapshot)=>{
        console.log(snapshot)
        result['mssg'] = snapshot.val()
    })
    
    for (let [key, value] of Object.entries(result)) {
        console.log(`${key}: ${value}`);
    }
    res.json(result)
    

})

//listen  for requests
app.listen(process.env.PORT, ()=>{
    console.log('listening on port', process.env.PORT)
})



import fetch  from  'node-fetch';
import  { URLSearchParams }  from 'url' ;
import fs  from  'fs';
const speechSynthKey = 'AQVNxIObyRDXCOvSBAbi0VBYtApJYthaoI9sh4iq'



const params = new URLSearchParams();
const text = ' hi my name is '

for(key in result){

}
params.append('text', result['word']);
params.append('voice', result['speaker']);
params.append('emotion', 'neutral');
params.append('lang', result['lang']);
params.append('speed', '1.0');
params.append('format', 'mp3');

fetch('https://tts.api.cloud.yandex.net/speech/v1/tts:synthesize', {
    method: 'post',        
    body: params,
    headers: { 
        // 'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Api-Key ' +  speechSynthKey,
    },
})
.then(res => {
    console.log(res);
    // return res.json();
    const dest = fs.createWriteStream('../../front/polyglot-front/src/static/audio/oct.mp3');
    res.body.pipe(dest);
})
.catch(err => console.error(err));

