console.log("Server voor LLM")

import fetch from 'node-fetch'
import express from 'express'
import cors from 'cors'

import {AzureChatOpenAI} from "@langchain/openai"
import {HumanMessage, SystemMessage, AIMessage} from "@langchain/core/messages"

const model = new AzureChatOpenAI({
    temperature: 0.5,
    verbose: false,
    maxTokens: 1500
})

const app = express()
const port = 8000

app.use(cors())
app.use(express.json())


let chefPersonalities = null

async function loadPersonalities() {
    if (!chefPersonalities) {
        const res = await fetch("https://irpear.github.io/Chefs/chefs.json")
        chefPersonalities = await res.json()
    }
}



app.get('/', (req, res) => {
    res.send('Hello world!')
})

app.post('/joke', async (req, res) => {
    await loadPersonalities()

    const rawMessages = req.body.messages
    const selectedChef = req.body.chef || "algemeen"
    const roleDescription = chefPersonalities[selectedChef]?.rol || "Je bent een vriendelijke recept-assistent."

    console.log("Geselecteerde chef:", selectedChef)
    console.log("Rol die gebruikt wordt:", roleDescription)


    res.setHeader("Content-Type", "text/plain")
    res.setHeader("Transfer-Encoding", "chunked")

    if (!rawMessages || !Array.isArray(rawMessages)) {
        return res.status(400).json({ error: "Ongeldige chatgeschiedenis." })
    }

    const messages = [
        new SystemMessage(roleDescription),
        ...rawMessages.map(([role, content]) => {
            if (role === "system") return new SystemMessage(content)
            if (role === "human") return new HumanMessage(content)
            if (role === "assistant") return new AIMessage(content)
            return null
        }).filter(Boolean)
    ]


    try {
        const stream = await model.stream(messages)
        for await (const chunk of stream) {
            await new Promise( (resolve) => setTimeout(resolve, 20))
            res.write(chunk.content)
        }
        res.end()
    } catch (err) {
        console.error("Streaming fout:", err)
        res.status(500).end("Fout bij streamen.")
    }
})


app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`)
})
