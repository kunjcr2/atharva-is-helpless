export default function ChatMessage({ role, text }) {
    const isUser = role === 'user'
    return (
        <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
            <div
                className={[
                    'max-w-[80%] rounded-2xl px-4 py-2 shadow-sm mb-2',
                    isUser ? 'bg-indigo-600 text-white' : 'bg-white text-slate-900 border border-slate-200'
                ].join(' ')}
            >
                <p className="whitespace-pre-wrap">{text}</p>
            </div>
        </div>
    )
}
