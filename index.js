const express = require('express');
const { WebhookClient } = require("dialogflow-fulfillment");
const {google} = require("googleapis");

const app = express();

app.get('/', function (req, res) {
  res.send('<script src="https://www.gstatic.com/dialogflow-console/fast/messenger/bootstrap.js?v=1"></script><df-messenger intent="WELCOME" chat-title="Pruebas" agent-id="0d1be57d-e009-4424-8a7f-496d4eceb7c3" language-code="es"></df-messenger>');
});

app.post('/webhook',express.json() ,function (req, res) {

    const agent = new WebhookClient({ request: req, response: res });
    
    // function welcome(agent) {
    //     agent.add(`Welcome to my agent!`);
    // };
    
    // function fallback(agent) {
    //     agent.add(`I didn't understand`);
    //     agent.add(`I'm sorry, can you try again?`);
    // };

    function encuestaTest(agent){

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

        console.log(agent.parameters);

        const tema = agent.parameters.tema;
        const respuesta = agent.parameters.respuesta;
        const anio = agent.parameters.anio;
        const email = agent.parameters.email;
        const nombre = agent.parameters.nombre;
        const propuesta = agent.parameters.propuesta;

        googleSheets.spreadsheets.values.append({
            auth,
            spreadsheetId,
            range: "encuesta",
            valueInputOption: "USER_ENTERED",
            resource: {
                values: [
                    [nombre, tema, respuesta, anio, email, propuesta]
                ]
            }
        });
        
        agent.end("");
    };

    function encuestaGidas(agent){

        const auth = new google.auth.GoogleAuth({
            keyFile: "credentials.json",
            scopes: "https://www.googleapis.com/auth/spreadsheets"
        });
        const client = auth.getClient();
        const googleSheets = google.sheets({
            version: "v4",
            auth: client
        });
        const spreadsheetId = "1bnLRBVfI-2tC40e75L-t76Hs-Eqj4rxcnlke9fQNkBw";

        console.log(agent.parameters);

        const nombre = agent.parameters.nombre;
        const apellido = agent.parameters.apellido;
        const area = agent.parameters.area.join(",\n\n");
        const areaSugerencia = agent.parameters.areaSugerencia;
        const disciplina = agent.parameters.disciplina.join(",\n\n");
        const disciplinaSugerencia = agent.parameters.disciplinaSugerencia;
        const proyecto = agent.parameters.proyecto.join(",\n\n");
        const proyectoSugerencia = agent.parameters.proyectoSugerencia;
        const actividad = agent.parameters.actividad.join(",\n\n");
        const actividadSugerencia = agent.parameters.actividadSugerencia;
        const email = agent.parameters.email;
        const celular = agent.parameters.celular;
        const anio = agent.parameters.anio;
        const motivacion = agent.parameters.motivacion.join(",\n\n");
        const comoConociste = agent.parameters.comoConociste.join(",\n\n");

        googleSheets.spreadsheets.values.append({
            auth,
            spreadsheetId,
            range: "encuesta",
            valueInputOption: "USER_ENTERED",
            resource: {
                values: [
                    [nombre, apellido, area, areaSugerencia, disciplina, disciplinaSugerencia, proyecto, proyectoSugerencia, actividad, actividadSugerencia, email, celular, anio, motivacion, comoConociste]
                ]
            }
        });

        agent.end("");
    };
    
    let intentMap = new Map();
    // intentMap.set('Default Welcome Intent', welcome);
    // intentMap.set('Default Fallback Intent', fallback);
    intentMap.set('encuestaTest', encuestaTest);
    intentMap.set('encuestaGidas', encuestaGidas);
    agent.handleRequest(intentMap);
    });

app.listen(3000, ()=>{
    console.log("Ejecutando webhook en puerto 3000");
});
