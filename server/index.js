import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import bodyParser from 'body-parser';
import express from 'express';
import morgan from 'morgan';
import http from 'http';
import { Server } from 'socket.io';
import { Configuration, OpenAIApi } from 'openai';

dotenv.config();

const app = express();
app.use(cors());
//app.use(helmet());
//app.use(helmet.crossOriginResourcePolicy({ policy: 'cross-origin' }));
//app.use(morgan('common'));
app.use(bodyParser.json({ limit: '30mb', extended: true }));
app.use(bodyParser.urlencoded({ limit: '30mb', extended: true }));

const httpServer = http.createServer(app);

const io = new Server(httpServer, { cors: { origin: '*' } });

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);
const port = process.env.PORT || 9000;

io.on('connection', (socket) => {
  //console.log(socket.id);

  let messageToClient = '';

  socket.on('message_sent', (data) => {
    // console.log(data);
    /*  io.emit('message_arrives', {
                        message: 'response from the server',
                        author: 'Solomon',
                      }); */
    const askAi = async () => {
      try {
        const response = await openai.createCompletion({
          model: 'text-davinci-003',
          prompt: data.message,
          temperature: 0.5,
          max_tokens: 2048,
          top_p: 1,
          frequency_penalty: 0.5,
          presence_penalty: 0,
        });

        // console.log('response data: ', response.data.choices[0].text);

        messageToClient = response.data.choices[0].text;

        // socket.broadcast.emit('message_arrives', messageToClient);
        io.emit('message_arrives', {
          message: messageToClient,
          author: 'Solomon',
        });
        // socket.to(socketId).emit('message_arrives', messageToClient);
      } catch (err) {
        console.log(err);
      }
    };
    askAi();
  });
});

httpServer.listen(port, () => {
  console.log(`Server on port http://localhost:${port} `);
});
