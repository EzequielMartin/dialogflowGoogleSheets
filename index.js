const express = require('express');
const {WebhookClient} = require("dialogflow-fulfillment");
const {google} = require("googleapis");
const secrets = require("./secrets.json")

//Defino el puerto en el que va a correr el servidor web y creo la aplicacion
const port = 3000;
const app = express();

//Defino una ruta para las requests HTTP GET, con la que muestro el chatbot en una pagina web
//Usando esta ruta voy a poder acceder al chatbot, esta va a ser, por ej: https://dominioejemplo.com/
//Donde dominionejemplo.com va a ser el nombre de mi dominio.
app.get('/', function (req, res) {
    res.send(`<script src="https://www.gstatic.com/dialogflow-console/fast/messenger/bootstrap.js?v=1"></script><df-messenger intent="WELCOME" chat-title="Pruebas" agent-id="${secrets.agentId}" language-code="es"></df-messenger><h1>Encuesta GIDAS</h1>`);
});


//Defino una ruta para las requests HTTP POST, con la que ejecuto funciones asociadas a los Intents
//Esta ruta es la que debo definir en la ventana de Fullfilments de Dialogflow, ya que Dialogflow envia una request HTTP POST
//Entonces la URL que voy a definir va a ser, por ej: https://dominioejemplo.com/webhook
//Donde dominionejemplo.com va a ser el nombre de mi dominio.
app.post('/webhook',express.json() ,function (req, res) {

    const agent = new WebhookClient({ request: req, response: res });
    
    //Estas funciones vienen definidas a modo de ejemplo, las comento ya que no las voy a usar

    // function welcome(agent) {
    //     agent.add(`Welcome to my agent!`);
    // };
    
    // function fallback(agent) {
    //     agent.add(`I didn't understand`);
    //     agent.add(`I'm sorry, can you try again?`);
    // };

    //Esta funcion es la que fui armando mientras aprendia, no es la que estoy usando actualmente 
    function encuestaTest(agent){

        const auth = new google.auth.GoogleAuth({
            keyFile: "credentials.json",
            scopes: "https://www.googleapis.com/auth/spreadsheets"
        });
        const client = auth.getClient();
        const googleSheets = google.sheets({
            version: "v4",
            auth: client
        });
        const spreadsheetId = secrets.spreadSheetEncuestaTest;

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

    //Funcion con la que asocio la encuesta, respondida a traves del chatbot, con google sheets
    function encuestaGidas(agent){

        //Defino 
        const auth = new google.auth.GoogleAuth({
            keyFile: "credentials.json",
            scopes: "https://www.googleapis.com/auth/spreadsheets"
        });
        const client = auth.getClient();
        const googleSheets = google.sheets({
            version: "v4",
            auth: client
        });
        const spreadsheetId = secrets.spreadSheetEncuestaGidas;

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

//Defino en que puerto va a estar escuchando el servidor web y hago un retorno en la consola para confirmar que esta funcionando
app.listen(port, ()=>{
    console.log(`Ejecutando servidor web en puerto ${port}`);
});
