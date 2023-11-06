Bajar del drive, en la carpeta de la ps, los archivos credentials.json, ngrok.yml y secrets.json y guardarlos en la carpeta del proyecto.

Para instalar dependencias:

npm install

En una terminal correr:

node index

Abrir otra terminal y correr:

./ngrok tunnel --label edge=edghts_2Va5ag7EcT67syS1YVSvKbWwEks http://localhost:3000 --config ./ngrok.yml

con --config ./ngrok.yml lo corro con la config que tengo en el archivo que esta en esta misma carpeta.
