import { useState, useEffect, useRef, useMemo, useCallback } from 'react'
import './index.css'
import { Input } from './components/ui/input'
import { Clipboard, ClipboardCheck, Search, X } from 'lucide-react'
import { Button } from './components/ui/button'
import { cn } from './lib/utils'
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle
} from './components/ui/card'
import { Toaster } from './components/ui/sonner'
import { toast } from 'sonner'
import { useDebounceCallback } from 'usehooks-ts'

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
  const [searchTerm, setSearchTerm] = useState<string>('')
  const [isLoading, setIsLoading] = useState(true)
  const [copiedEmoji, setCopiedEmoji] = useState<string | null>(null)

  const debouncedSearchTerm = useDebounceCallback(setSearchTerm, 500, {
    maxWait: 1200
  })

  const searchInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    // Fetch emoji data from the JSON file
    setIsLoading(true)
    fetch('/emoji_data.json')
      .then((response) => response.json())
      .then((data: EmojiData) => {
        setEmojiData(data.emojis)
        setIsLoading(false)
      })
      .catch((error) => {
        console.error('Error loading emoji data:', error)
        setIsLoading(false)
      })
  }, [])

  const filteredEmojis = useMemo(
    () =>
      emojiData.filter((emoji) => {
        const searchLower = searchTerm.toLowerCase()
        return (
          emoji.character.includes(searchTerm) ||
          emoji.name.toLowerCase().includes(searchLower) ||
          emoji.keywords.some((keyword) =>
            keyword.toLowerCase().includes(searchLower)
          )
        )
      }),
    [searchTerm, emojiData]
  )

  const copyToClipboard = useCallback((text: string) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        setCopiedEmoji(text)
        toast('Emoji ' + text + ' has been copied!', {
          duration: 2000
        })
      })
      .catch((err) => console.error('Failed to copy:', err))
  }, [])

  return (
    <div className='flex min-h-screen flex-col'>
      <Toaster position='bottom-center' />
      <main className='container mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8'>
        {/* Header */}
        <header className='mb-12 flex flex-col items-center'>
          <h1 className='mb-8 text-4xl font-bold'>Unicode Emoji Finder</h1>

          {/* Search Bar */}
          <div className='relative w-full max-w-md'>
            <div className='pointer-events-none absolute inset-y-0 left-3 z-10 flex items-center'>
              <Search className='text-foreground/80 size-5' />
            </div>
            <Input
              ref={searchInputRef}
              type='search'
              className='h-12 rounded-full pr-12 pl-12'
              placeholder='Emoji search'
              defaultValue={searchTerm}
              onChange={(e) => debouncedSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <div className='absolute inset-y-0 right-3 z-10 flex items-center'>
                <Button
                  variant='ghost'
                  className={cn(
                    'size-7 cursor-pointer rounded-full border-0 shadow-none ring-2 ring-transparent ring-offset-0 outline-none',
                    'hover:text-foreground hover:bg-transparent hover:ring-transparent',
                    'focus:ring-transparent focus:ring-offset-0',
                    'focus-visible:ring-offset-0'
                  )}
                  onClick={() => {
                    setSearchTerm('')
                    searchInputRef.current?.focus()
                    if (searchInputRef.current)
                      searchInputRef.current.value = ''
                  }}
                  aria-label='Clear search'
                >
                  <X className='size-5' />
                </Button>
              </div>
            )}
          </div>
        </header>

        {/* Loading State */}
        {isLoading && (
          <div className='flex flex-col items-center justify-center py-12'>
            <div className='border-muted border-t-accent mb-4 h-12 w-12 animate-spin rounded-full border-4'></div>
            <p className='text-muted-foreground'>Loading emoji data...</p>
          </div>
        )}

        {/* Emoji Grid */}
        {!isLoading && (
          <div className='grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8'>
            {filteredEmojis.map((emoji, index) => (
              <Card key={index} className='bg-card border-none p-0 shadow-none'>
                <CardContent className='p-0'>
                  <Button
                    aria-label={`Copy ${emoji.character} to clipboard`}
                    onClick={() => copyToClipboard(emoji.character)}
                    className={cn(
                      'group ring-border bg-card hover:ring-accent/80 hover:bg-secondary-foreground/50 relative flex h-auto w-full cursor-pointer flex-col items-center rounded-md border-none p-4 shadow-none ring-2 ring-offset-0 transition-all outline-none',
                      'focus:ring-accent/80 focus:ring-2 focus:ring-offset-0',
                      'focus-visible:ring-ring/80 focus-visible:ring-2 focus-visible:ring-offset-0'
                    )}
                  >
                    <div className='absolute top-2 right-2 opacity-0 transition-opacity group-hover:opacity-100 group-focus:opacity-100'>
                      {copiedEmoji === emoji.character ? (
                        <ClipboardCheck className='text-accent/80 size-5' />
                      ) : (
                        <Clipboard className='text-accent/80 size-5' />
                      )}
                    </div>
                    <div
                      className='ease-2 mb-3 text-4xl transition-transform group-hover:scale-110'
                      style={{ willChange: 'transform' }}
                    >
                      {emoji.character}
                    </div>
                    <CardTitle className='text-foreground/80 mb-1 w-full truncate text-center text-xs font-medium'>
                      {emoji.name}
                    </CardTitle>
                    <CardDescription className='text-muted-foreground text-xs'>
                      {emoji.codePoint.split('_')[0]}
                    </CardDescription>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && filteredEmojis.length === 0 && (
          <div className='text-center'>
            <p className='text-muted-foreground'>
              No emojis found matching your search.
            </p>
          </div>
        )}
      </main>
      <footer className='text-muted-foreground mx-auto mt-auto py-12'>
        <div className='max-w-xl px-4 text-center text-sm sm:px-6 lg:px-8'>
          This website shows native browser images for unicode emojis based on
          publicly available data from{' '}
          <Button
            className='hover:text-accent/80 text-accent/80 -m-1 p-1'
            variant='link'
            asChild
          >
            <a
              href='https://unicode.org/emoji/charts/full-emoji-list.html'
              target='_blank'
              rel='noopener noreferrer'
            >
              Unicode.org
            </a>
          </Button>
        </div>
      </footer>
    </div>
  )
}

export default App
