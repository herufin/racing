"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Trash2, Flag, Plus } from "lucide-react"

interface Racer {
  id: number
  name: string
  position: number
  speed: number
  color: string
}

const carColors = [
  "text-red-500",
  "text-blue-500",
  "text-green-500",
  "text-yellow-500",
  "text-purple-500",
  "text-pink-500",
  "text-orange-500",
  "text-cyan-500",
]

const carEmojis = ["🏎️", "🚗", "🚙", "🚕", "🚐", "🏁"]

export default function Component() {
  const [names, setNames] = useState<string[]>([])
  const [newName, setNewName] = useState("")
  const [racers, setRacers] = useState<Racer[]>([])
  const [isRacing, setIsRacing] = useState(false)
  const [winner, setWinner] = useState<string | null>(null)
  const [raceFinished, setRaceFinished] = useState(false)
  const [singleName, setSingleName] = useState("")

  const addBulkNames = () => {
    if (!newName.trim()) return

    // Split by newlines or commas, clean up whitespace
    const nameList = newName
      .split(/[\n,]+/)
      .map((name) => name.trim())
      .filter((name) => name.length > 0)
      .filter((name) => !names.includes(name)) // Remove duplicates

    if (nameList.length > 0) {
      setNames([...names, ...nameList])
      setNewName("")
    }
  }

  const addSingleName = () => {
    if (singleName.trim() && !names.includes(singleName.trim())) {
      setNames([...names, singleName.trim()])
      setSingleName("")
    }
  }

  const clearInput = () => {
    setNewName("")
  }

  const clearAllNames = () => {
    setNames([])
    setNewName("")
    setSingleName("")
  }

  const removeName = (nameToRemove: string) => {
    setNames(names.filter((name) => name !== nameToRemove))
  }

  const removeWinner = () => {
    if (winner) {
      setNames(names.filter((name) => name !== winner))
      resetRace()
    }
  }

  const startRace = () => {
    if (names.length < 2) return

    const initialRacers = names.map((name, index) => ({
      id: index,
      name,
      position: 0,
      speed: Math.random() * 3 + 1, // Random speed between 1-4
      color: carColors[index % carColors.length],
    }))

    setRacers(initialRacers)
    setIsRacing(true)
    setWinner(null)
    setRaceFinished(false)
  }

  const resetRace = () => {
    setIsRacing(false)
    setRacers([])
    setWinner(null)
    setRaceFinished(false)
  }

  useEffect(() => {
    if (!isRacing || raceFinished) return

    const interval = setInterval(() => {
      setRacers((prevRacers) => {
        const updatedRacers = prevRacers.map((racer) => ({
          ...racer,
          position: racer.position + racer.speed,
        }))

        // Check for winner (position >= 90 means reached finish line)
        const finishedRacer = updatedRacers.find((racer) => racer.position >= 90)
        if (finishedRacer && !raceFinished) {
          setWinner(finishedRacer.name)
          setIsRacing(false)
          setRaceFinished(true)
        }

        return updatedRacers
      })
    }, 100)

    return () => clearInterval(interval)
  }, [isRacing, raceFinished])

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-200 to-green-200 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <Card className="text-center bg-white/90 backdrop-blur">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-gray-800 flex items-center justify-center gap-2">
              <Flag className="text-red-500" />🏁 Balapan Pengacak Nama 🏁
              <Flag className="text-red-500" />
            </CardTitle>
          </CardHeader>
        </Card>

        {/* Input Section */}
        <Card className="bg-white/90 backdrop-blur">
          <CardHeader>
            <CardTitle className="text-xl text-gray-800">Tambah Peserta Balapan</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              {/* Bulk Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  📝 Masukkan semua nama sekaligus (pisahkan dengan enter atau koma):
                </label>
                <textarea
                  placeholder="Contoh:&#10;Andi&#10;Budi&#10;Citra&#10;&#10;Atau: Andi, Budi, Citra, Dina"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full h-32 p-3 border border-gray-300 rounded-md resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <div className="flex gap-2 mt-2">
                  <Button onClick={addBulkNames} className="bg-green-500 hover:bg-green-600 flex-1">
                    <Plus className="w-4 h-4 mr-2" />
                    Tambah Semua Nama
                  </Button>
                  <Button onClick={clearInput} variant="outline">
                    Bersihkan
                  </Button>
                </div>
              </div>

              {/* Single Input Alternative */}
              <div className="border-t pt-3">
                <label className="block text-sm font-medium text-gray-700 mb-2">Atau tambah satu per satu:</label>
                <div className="flex gap-2">
                  <Input
                    placeholder="Masukkan satu nama..."
                    value={singleName}
                    onChange={(e) => setSingleName(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && addSingleName()}
                    className="flex-1"
                  />
                  <Button onClick={addSingleName} className="bg-blue-500 hover:bg-blue-600">
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Display Names */}
            {names.length > 0 && (
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700">Peserta Balapan ({names.length}):</span>
                  <Button onClick={clearAllNames} variant="outline" size="sm" className="text-red-600">
                    Hapus Semua
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto p-2 bg-gray-50 rounded-md">
                  {names.map((name, index) => (
                    <Badge key={name} variant="secondary" className="text-sm py-1 px-3">
                      {carEmojis[index % carEmojis.length]} {name}
                      <button onClick={() => removeName(name)} className="ml-2 text-red-500 hover:text-red-700">
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Race Track */}
        {names.length > 0 && (
          <Card className="bg-white/90 backdrop-blur overflow-hidden">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="text-xl text-gray-800">🏁 Lintasan Balapan</CardTitle>
                <div className="space-x-2">
                  <Button
                    onClick={startRace}
                    disabled={isRacing || names.length < 2}
                    className="bg-red-500 hover:bg-red-600"
                  >
                    {isRacing ? "Balapan Berlangsung..." : "🚦 Mulai Balapan!"}
                  </Button>
                  <Button onClick={resetRace} variant="outline" disabled={!raceFinished && !isRacing}>
                    Reset
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Race Track */}
                <div className="relative bg-gray-800 rounded-lg p-4 min-h-[300px]">
                  {/* Track Lines */}
                  <div className="absolute inset-0 flex flex-col justify-around p-4">
                    {names.map((_, index) => (
                      <div key={index} className="h-1 bg-white/30 rounded"></div>
                    ))}
                  </div>

                  {/* Finish Line */}
                  <div className="absolute right-4 top-0 bottom-0 w-2 bg-gradient-to-b from-red-500 via-white to-red-500 rounded"></div>
                  <div className="absolute right-6 top-2 text-white font-bold text-sm">FINISH</div>

                  {/* Cars */}
                  {racers.map((racer, index) => (
                    <div
                      key={racer.id}
                      className="absolute transition-all duration-100 ease-linear"
                      style={{
                        left: `${Math.min(racer.position, 85)}%`,
                        top: `${20 + index * (260 / names.length)}px`,
                        transform: "translateY(-50%)",
                      }}
                    >
                      <div className="flex items-center gap-2">
                        <span className={`text-2xl ${racer.color}`}>{carEmojis[index % carEmojis.length]}</span>
                        <span className="text-white text-sm font-semibold bg-black/50 px-2 py-1 rounded">
                          {racer.name}
                        </span>
                      </div>
                    </div>
                  ))}

                  {/* Start Line */}
                  <div className="absolute left-4 top-0 bottom-0 w-2 bg-gradient-to-b from-green-500 via-white to-green-500 rounded"></div>
                  <div className="absolute left-6 top-2 text-white font-bold text-sm">START</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Winner Announcement */}
        {winner && (
          <Card className="bg-gradient-to-r from-yellow-400 to-orange-400 border-4 border-yellow-500">
            <CardContent className="text-center py-8">
              <div className="text-6xl mb-4">🏆</div>
              <h2 className="text-3xl font-bold text-white mb-2">PEMENANG!</h2>
              <p className="text-2xl font-semibold text-white">🎉 {winner} 🎉</p>
              <div className="mt-4 text-lg text-white/90">Selamat! Kamu adalah juara balapan kali ini! 🥇</div>
              <div className="mt-6 space-x-3">
                <Button
                  onClick={resetRace}
                  variant="outline"
                  className="bg-white/20 text-white border-white/30 hover:bg-white/30"
                >
                  🔄 Balapan Lagi
                </Button>
                <Button onClick={removeWinner} className="bg-red-500 hover:bg-red-600 text-white">
                  🗑️ Hapus Pemenang
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Instructions */}
        <Card className="bg-white/90 backdrop-blur">
          <CardContent className="pt-6">
            <div className="text-center text-gray-600 space-y-2">
              <p className="font-semibold">📝 Cara Bermain:</p>
              <p className="text-sm">1. Tambahkan minimal 2 nama peserta</p>
              <p className="text-sm">2. Klik "Mulai Balapan" untuk memulai</p>
              <p className="text-sm">3. Lihat mobil-mobil berlomba menuju garis finish!</p>
              <p className="text-sm">4. Nama yang mobilnya sampai duluan adalah pemenangnya! 🏁</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
