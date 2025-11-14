import { useState } from 'react'

export default function ChatInput({ onSend, disabled }) {
    const [value, setValue] = useState('')

    const submit = (e) => {
        e.preventDefault()
        const trimmed = value.trim()
        if (!trimmed) return
        onSend(trimmed)
        setValue('')
    }

    return (
        <form onSubmit={submit} className="flex gap-2 p-3 border-t border-slate-200 bg-white">
            <input
                className="flex-1 rounded-xl border border-slate-300 px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Ask me anything…"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                disabled={disabled}
            />
            <button
                className="rounded-xl px-4 py-2 bg-indigo-600 text-white disabled:opacity-50"
                disabled={disabled}
            >
                Send
            </button>
        </form>
    )
}
