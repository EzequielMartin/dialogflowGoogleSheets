const express = require('express')
const app = express()
const { WebhookClient } = require("dialogflow-fulfillment")
const {google} = require("googleapis");

app.get('/', function (req, res) {
  res.send('Webhook Online, Ya se puede usar desde Dialogflow')
})

app.post('/webhook',express.json() ,function (req, res) {

    const agent = new WebhookClient({ request: req, response: res });
    console.log('Dialogflow Request headers: ' + JSON.stringify(req.headers));
    console.log('Dialogflow Request body: ' + JSON.stringify(req.body));
    
    function welcome(agent) {
        agent.add(`Welcome to my agent!`);
    }
    
    function fallback(agent) {
        agent.add(`I didn't understand`);
        agent.add(`I'm sorry, can you try again?`);
    }

    const auth = new google.auth.GoogleAuth({
        
        keyFile: "credentials.json",
        scopes: "https://www.googleapis.com/auth/spreadsheets"

    });

    //Create client instance for auth
    const client = auth.getClient();

    //Create Instance of Google Sheets API
    const googleSheets = google.sheets({
        
        version: "v4",
        auth: client
    });

    const spreadsheetId = "1ewlyWHWESZdumyPc_Hiiq6VJNzkZNHqqpYOX--fkd5w";

    function encuesta(agent){
        const tema = agent.parameters.tema;
        const respuesta = agent.parameters.respuesta;
        const anio = agent.parameters.anio;
        const email = agent.parameters.email;

        googleSheets.spreadsheets.values.append({
            auth,
            spreadsheetId,
            range: "encuesta",
            valueInputOption: "USER_ENTERED",
            resource: {
                values: [
                    [tema, respuesta, anio, email]
                ]
            }
        })
        
    }
    
    let intentMap = new Map();
    intentMap.set('Default Welcome Intent', welcome);
    intentMap.set('Default Fallback Intent', fallback);
    intentMap.set('encuesta', encuesta);
    agent.handleRequest(intentMap);
    })

app.listen(3000, ()=>{
    console.log("Ejecutando webhook en puerto 3000");
})
