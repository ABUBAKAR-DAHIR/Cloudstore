"use client"
import { useTheme } from 'next-themes'
import { Button } from './ui/button'
import { Moon, Sun } from 'lucide-react'

function Themer() {
    const {theme, setTheme} = useTheme()
  return (
    <Button variant="outline" onClick={() => setTheme((prev) => prev === "light" ? "dark" : "light")} className='cursor-pointer'>
        {
            theme === "light" ? <Moon /> : <Sun />
        }
    </Button>
  )
}

export default Themer