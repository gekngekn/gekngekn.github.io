import {Request, Response} from "express";
import express = require('express');
import dogs from "../public/dogs-api.json"

export const dogsRouter = express.Router();

dogsRouter.use(express.json());

dogsRouter.route("/dogs").get(async (req: Request, res: Response) => {
    console.log('Route /dogs')
    res.status(200).send(dogs)
})

dogsRouter.get("/dogs", async (req: Request, res: Response) => {
    console.log("get /dogs"
    )
})