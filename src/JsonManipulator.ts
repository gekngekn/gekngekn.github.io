import * as fs from 'fs-extra';
import * as path from 'path';
import {stat} from 'fs/promises';

import dogs from "./public/dogs.json"
import newDogs from "./public/dogs-api.json"
import images from "./public/dogimages.json"
import groups from "./public/groups.json"

class Dog {
    constructor(id, name, desc, life, maleWeight, femaleWeight, hypoallergenic, groupId, imgUrl) {
        this.id = id;
        this.name = name;
        this.desc = desc;
        this.life = life;
        this.maleWeight = maleWeight;
        this.femaleWeight = femaleWeight;
        this.hypoallergenic = hypoallergenic;
        this.groupId = groupId;
        this.imgUrl = imgUrl;
    }

    id: string
    name: string
    desc: string
    life: Life
    maleWeight: Life
    femaleWeight: Life
    hypoallergenic: boolean
    groupId: string
    imgUrl: string
}

class Life {
    constructor(max, min) {
        this.max = max;
        this.min = min;
    }

    max: number
    min: number
}

class Group {

    constructor(id, name, relations) {
        this.id = id
        this.name = name
        this.relations = relations
    }

    id: string
    name: string
    relations: Array<string>
}

class JsonManipulator {

    parseGroups() {
        let groupsData = groups
        let newData: Group[] = []

        groupsData.data.map(data => {
            let item = new Group(
                data.id,
                data.attributes.name,
                data.relationships.breeds.data
            )
            newData.push(item)
        })


        const jsonPath = "./src/public/groups-api.json"
        fs.writeFile(jsonPath, JSON.stringify(newData, null, 2), function (err) {
            if (err) {
                console.log('An error has occurred ', err);
                return;
            }
            console.log('Data written successfully to disk');
        })

    }

    async parse() {
        let dogsData = dogs
        let newData: Dog[] = []

        dogsData.data.map(data => {
            let item = new Dog(
                data.id,
                data.attributes.name,
                data.attributes.description,
                new Life(data.attributes.life.max, data.attributes.life.min),
                new Life(data.attributes.male_weight.max, data.attributes.male_weight.min),
                new Life(data.attributes.female_weight.max, data.attributes.female_weight.min),
                data.attributes.hypoallergenic,
                data.relationships.group.data.id,
                ""
            )
            newData.push(item)
        })


        for (const d of newData) {
            const fileName = `${d.id}.jpg`
            const imagePath = path.join("./src/public/images/", fileName)

            try {
                const fileExists = await fs.pathExists(imagePath)

                if (fileExists) {
                    d.imgUrl = "http://localhost:5000/images/" + fileName
                } else {
                    d.imgUrl = "http://localhost:5000/images/placeholder_dog.png"
                }
            } catch (error) {
                console.error('Error checking image file:', error);
                d.imgUrl = "ERROR"
            }
        }

        const jsonPath = "./src/public/dogs-api.json"
        fs.writeFile(jsonPath, JSON.stringify(newData, null, 2), function (err) {
            if (err) {
                console.log('An error has occurred ', err);
                return;
            }
            console.log('Data written successfully to disk');
        })

    }

}

export default new JsonManipulator();

function or() {
    throw new Error("Function not implemented.");
}