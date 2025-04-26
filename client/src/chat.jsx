import React, { useState, useEffect } from 'react'

function Chat() {
    const [question, setQuestion] = useState('')
    const [response, setResponse] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [selectedChef, setSelectedChef] = useState('algemeen')
    const [chefs, setChefs] = useState({})
    const [messages, setMessages] = useState([])

    useEffect(() => {
        fetch('https://irpear.github.io/Chefs/chefs.json')
            .then(res => res.json())
            .then(data => {
                setChefs(data)
                setMessages([["system", data["algemeen"].rol]])
            })
            .catch(err => console.error("Fout bij laden van chefs.json:", err))
    }, [])

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (isLoading) return
        setIsLoading(true)

        const updatedMessages = [...messages, ["human", question]]
        setMessages(updatedMessages)
        setResponse('')
        try {
            const res = await fetch('http://localhost:8000/joke', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    messages: updatedMessages,
                    chef: selectedChef,
                }),
            })

            console.log(selectedChef)

            const reader = res.body.getReader()
            const decoder = new TextDecoder()
            let fullText = ''

            while (true) {
                const { value, done } = await reader.read()
                if (done) break
                const chunk = decoder.decode(value, { stream: true })
                fullText += chunk
                setResponse(prev => prev + chunk)
            }

            setMessages([...updatedMessages, ["assistant", fullText]])
            setQuestion('')
        } catch (err) {
            setResponse('De chefkok slaapt nog 😢')
            console.error(err)
        } finally {
            setIsLoading(false)
        }
    }


    const handleChefChange = (e) => {
        const selected = e.target.value
        setSelectedChef(selected)

        const updatedMessages = messages.filter(([role]) => role !== "system")

        const newSystemMsg = chefs[selected]?.rol || "Je bent een recepten-expert."
        setMessages([["system", newSystemMsg], ...updatedMessages])
    }




    return (
        <div className="text-white" style={{ padding: '2rem' }}>
            <h2>Stel je vraag aan de ReceptenBot</h2>
            <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <input
                    className="text-black"
                    type="text"
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    placeholder="Typ hier je ingrediënten of verzoek..."
                    style={{ flexGrow: 1, padding: '0.5rem' }}
                    disabled={isLoading}
                />
                <select
                    className="text-black"
                    value={selectedChef}
                    onChange={handleChefChange}
                    disabled={isLoading}
                >
                    {Object.keys(chefs).map((key) => (
                        <option className="text-black" key={key} value={key}>
                            {key.charAt(0).toUpperCase() + key.slice(1)}
                        </option>
                    ))}
                </select>
                <button className="text-white" type="submit" disabled={isLoading}>
                    {isLoading ? 'Even wachten...' : 'Verstuur'}
                </button>
            </form>

            {response && (
                <div style={{ marginTop: '2rem' }}>
                    <strong>Recept:</strong>
                    <p>{response}</p>
                </div>
            )}

            <div style={{ marginTop: '3rem' }}>
                <h3>Gespreksgeschiedenis</h3>
                <div style={{ marginTop: '1rem' }}>
                    {messages
                        .filter(([role]) => role !== "system")
                        .map(([role, content], index) => (
                            <div
                                key={index}
                                style={{
                                    textAlign: role === "human" ? "right" : "left",
                                    background: role === "human" ? "#333" : "#444",
                                    padding: '0.5rem',
                                    marginBottom: '0.5rem',
                                    borderRadius: '8px',
                                }}
                            >
                                <strong>{role === "human" ? "Jij" : "Bot"}:</strong> {content}
                            </div>
                        ))}
                </div>
            </div>
        </div>
    )
}

export default Chat
