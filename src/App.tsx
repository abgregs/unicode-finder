import { useState, useEffect } from 'react'
import './App.css'

type Emoji = {
  character: string
  codePoint: string
  name: string
  keywords: string[]
}

type EmojiData = {
  emojis: Emoji[]
}

function App() {
  const [emojiData, setEmojiData] = useState<Emoji[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [copied, setCopied] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Fetch emoji data from the JSON file
    setIsLoading(true)
    fetch('/emoji_data.json')
      .then(response => response.json())
      .then((data: EmojiData) => {
        setEmojiData(data.emojis)
        setIsLoading(false)
      })
      .catch(error => {
        console.error('Error loading emoji data:', error)
        setIsLoading(false)
      })
  }, [])

  const filteredEmojis = emojiData.filter(emoji => {
    const searchLower = searchTerm.toLowerCase()
    return (
      emoji.character.includes(searchTerm) ||
      emoji.name.toLowerCase().includes(searchLower) ||
      emoji.keywords.some(keyword => keyword.toLowerCase().includes(searchLower))
    )
  })

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        setCopied(text)
        setTimeout(() => setCopied(null), 2000)
      })
      .catch(err => console.error('Failed to copy:', err))
  }

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <header className="mb-8 text-center">
          <h1 className="text-4xl font-bold mb-6 text-pink-400">Unicode Finder</h1>
          
          {/* Search Bar */}
          <div className="max-w-xl mx-auto flex justify-center">
            <div className="relative w-full max-w-md">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <svg className="w-5 h-5 text-slate-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                </svg>
              </div>
              <input
                type="search"
                className="block w-full p-4 pl-10 text-sm bg-slate-800 border border-slate-700 rounded-lg focus:ring-pink-500 focus:border-pink-500 focus:outline-none placeholder-slate-400"
                placeholder="Search emojis by name, keyword, or character..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </header>

        {/* Loading State */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="w-12 h-12 border-4 border-slate-600 border-t-pink-500 rounded-full animate-spin mb-4"></div>
            <p className="text-slate-400">Loading emoji data...</p>
          </div>
        )}

        {/* Emoji Grid */}
        {!isLoading && (
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-4">
            {filteredEmojis.map((emoji, index) => (
            <div 
              key={index} 
              className="bg-slate-800 rounded-lg p-4 flex flex-col items-center hover:bg-slate-700 transition-all cursor-pointer border border-slate-700 hover:border-pink-500 hover:shadow-md hover:shadow-pink-500/10 group relative"
              onClick={() => copyToClipboard(emoji.character)}
            >
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <svg className="w-4 h-4 text-pink-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                </svg>
              </div>
              <div className="text-4xl mb-3 hover:scale-110 transition-transform">{emoji.character}</div>
              <div className="text-xs text-slate-300 font-medium truncate w-full text-center mb-1">{emoji.name}</div>
              <div className="text-xs text-slate-400">{emoji.codePoint.split('_')[0]}</div>
              {copied === emoji.character && (
                <div className="mt-2 text-xs bg-pink-500 text-white px-2 py-1 rounded-full animate-pulse">Copied!</div>
              )}
            </div>
          ))}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && filteredEmojis.length === 0 && (
          <div className="text-center py-12">
            <p className="text-slate-400">No emojis found matching your search.</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default App
