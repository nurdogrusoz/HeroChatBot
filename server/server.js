import express  from "express";
import * as dotenv from 'dotenv';
import cors from "cors";
import OpenAI from "openai";

dotenv.config();


const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

const app = express();
app.use(cors());
app.use(express.json());

// app.get('/', async (req, res) => {
//     res.status(200).send({ message: 'Hello from HeroChat', 
// })
   
// });

app.post('/', async (req,res) => {
    try{
        const prompt = req.body.prompt;
        const iron_man_starter = "pretend that you are tony stark from iron man, respond to the message as tony stark: "
        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [{ role: 'user', content: iron_man_starter + prompt }],
            temperature: 1,
            max_tokens: 256,
            top_p: 1,
            frequency_penalty: 0.5,
            presence_penalty: 0,
        });
        res.status(200).send({
            bot: response.choices[0].message.content
        })
    }
    catch(error) {
        console.log(error);
        res.status(500).send({error});
    }
})

app.listen(5001, () => console.log('Server is running on port http://locathost:5001'));