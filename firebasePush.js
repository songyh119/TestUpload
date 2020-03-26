"use strict";

const express = require('express');
const router = express.Router();
const firebaseAdmin = require("firebase-admin");
const serviceAccount = require("./serviceAccountKey.json");

firebaseAdmin.initializeApp({
    
    credential: firebaseAdmin.credential.cert(serviceAccount),

    databaseURL: "https://boozaapp-1580844321160.firebaseio.com"

});

router.post('/firebasePush/send', async function(req, res, next) {

    try {
        
        let registrationTokens = [...];
        
        let chunkArray = (array, chunkSize) => {
            
            let results = [];

            for(let i in array.length) {
                results.push(array.splice(0, chunkSize));
            }

            return results;
        }
        
        let slicedTokens = chunkArray(registrationTokens, 1000);

        for(let i in slicedTokens) {
            let title = req.body.title;
            let content = req.body.content;
            let msg = {
                data: { title, content },
                notification: { title, body: content },
                topic: "all",
                tokens: slicedTokens[i]
            }
            await firebaseAdmin.messaging().send(msg);
        }
        // let cnt = Math.floor(registrationTokens.length/1000) + (Math.foor(registrationTokens%1000) > 0 ? 1: 0); 
        // let slicedArr = [];
        
            
        // for(let i =0; i < cnt; i++ ) {
        //     slicedArr.push(registrationTokens.splice(0, 1000))
        // }

        // await firebaseAdmin.messaging().subscribeToTopic(registrationTokens, topic)

    } catch (err) {
        return next(err);
    }

    return res.redirect('/#/firebasePush');
});

module.exports = router;
