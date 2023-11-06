# Dialogflow y Google Sheets

###### Integracion de Dialogflow y Google Sheets para almacenar las respuestas de una encuesta respondida a traves de un chatbot

## Como correr el Servidor Web

Bajar del drive, en la carpeta de la PS, los archivos "credentials.json", "ngrok.yml" y "secrets.json" y guardarlos en la carpeta del proyecto.

Para instalar dependencias:

`$ npm install`

Para correr el servidor web, en una terminal ejecutar:

`$ npm run start`

Luego abrir otra terminal y ejecutar:

`$ ./ngrok tunnel --label edge=edghts_2Va5ag7EcT67syS1YVSvKbWwEks http://localhost:3000 --config ./ngrok.yml`

con "--config ./ngrok.yml" lo corro con la config que tengo en el archivo que esta en esta misma carpeta.

## Como responder la encuesta y visualizar la respuesta

Ingresar a la pagina web donde esta corriendo, en este caso es: https://relieved-lenient-cockatoo.ngrok-free.app/ y responder la encuesta.

Los resultados de la encuesta se pueden ver en: https://docs.google.com/spreadsheets/d/1bnLRBVfI-2tC40e75L-t76Hs-Eqj4rxcnlke9fQNkBw/edit?usp=sharing
