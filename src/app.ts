import express, {Request, Response} from 'express';
import * as dotenv from 'dotenv'
import cors from 'cors';
import * as https from "https";
import * as process from "process";
import dogs from "./public/dogs-api.json";
import groups from "./public/groups-api.json";

const app = express();
dotenv.config();

import JsonManipulator from "./JsonManipulator";
import * as Path from "path";
import fs from "fs";

// Configure the APP
app.set('port', process.env.PORT);

//options for cors middleware
const corsOptions: cors.CorsOptions = {
    allowedHeaders: [
        'Origin',
        'X-Requested-With',
        'Content-Type',
        'Accept',
        'X-Access-Token',
    ],
    credentials: true,
    methods: 'GET,HEAD,OPTIONS,PUT,PATCH,POST,DELETE',
    origin: 'http://localhost:5000',
    preflightContinue: false,
};

const options = {
    key: fs.readFileSync('dummy_key.pem'),
    cert: fs.readFileSync('dummy_cert.pem')
}

//use cors middleware
app.use(cors(corsOptions));

//enable pre-flight
app.options('*', cors(corsOptions));


app.use(express.json());

app.use(express.static('public'))
app.use(express.static('files'))

app.use(express.static(__dirname + '/public'));



app.get("/dogs", (req: Request, res: Response) => {
    res.status(200).send(dogs)

    console.log("/dogs called " + req.body)
})

app.get("/groups", (req: Request, res: Response) => {
    res.status(200).send(groups)
})

https.createServer(options, app).listen(process.env.Port, () => {
    console.log(`Server started at http://localhost:${process.env.PORT}`);

    // JsonManipulator.parse();
    // JsonManipulator.parseGroups()
});