import { useState } from 'react'
import ChatMessage from './components/ChatMessage.jsx'
import ChatInput from './components/ChatInput.jsx'
import { streamChat } from './services/ai.js'

export default function App() {
  const [messages, setMessages] = useState([
    { role: 'model', content: 'Hey! I am a tiny Gemini-powered bot. What shall we build today?' }
  ])
  const [isBusy, setIsBusy] = useState(false)

  async function handleSend(text) {
    const next = [...messages, { role: 'user', content: text }, { role: 'model', content: '' }]
    setMessages(next)
    setIsBusy(true)

    try {
      const botIndex = next.length - 1
      for await (const token of streamChat(next)) {
        next[botIndex].content += token
        // force React to paint streaming tokens
        setMessages([...next])
      }
    } catch (err) {
      console.error(err)
      const nextErr = [...next]
      nextErr[nextErr.length - 1].content = 'Oops, the model call failed. Check your API key and console.'
      setMessages(nextErr)
    } finally {
      setIsBusy(false)
    }
  }

  return (
    <div className="mx-auto max-w-2xl h-screen flex flex-col">
      <header className="p-4 border-b border-slate-200 bg-white">
        <h1 className="text-xl font-semibold">Gemini Chat • React + Vite + Tailwind</h1>
      </header>

      <main className="flex-1 overflow-y-auto p-4 bg-slate-50">
        {messages.map((m, i) => (
          <ChatMessage key={i} role={m.role} text={m.content} />
        ))}
      </main>

      <ChatInput onSend={handleSend} disabled={isBusy} />
    </div>
  )
}
