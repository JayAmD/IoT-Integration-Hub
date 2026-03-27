import Message from "../../models/message.model.js";
import {getSecretValue} from "../../services/secretManager.service.js";

const addMessage = async (req, res, next) => {
    try {
        const message = await Message.create({
            deviceId: req.params.deviceId,
            payload: req.body.payload,
            isSend: false
        })


        const apiKey = await getSecretValue("69c6db32f191d4c510afddd0")

        const response = await fetch('https://api.restful-api.dev//collections/products/objects', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
                , 'x-api-key': apiKey
            },
            body: JSON.stringify(
                {
                    "name": "Message",
                    "data": message.payload
                }
            )
        })

        const data = await response.json();
        console.log(data);

        res.status(201).json({success: true, data: data});


    } catch (e) {
        next(e);
    }
}

export default addMessage;