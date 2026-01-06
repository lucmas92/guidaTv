import type { PalinsestoItem } from '@/models/data.model'

const API_URL = import.meta.env.VITE_API_URL
const API_KEY = import.meta.env.VITE_API_KEY

export async function fetchDailyData(): Promise<PalinsestoItem[]> {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: {
      epgguidatv: API_KEY,
    },
  })

  if (!res.ok) {
    throw new Error('Errore nel download dei dati')
  }

  const data = await res.json()
  return data.canali[0].canali
}
