export interface Canale {
  name: string
  logo: string
  number: number
  live?: string
  mondo?: string
}
export interface Trailer {
  id: string
}
export interface Programma {
  title: string
  description: string
  durata: number | string
  genre: string
  category: string
  image: string

  actor: string | null
  director: string | null

  inizio: string
  fine: string

  rating?: string
  year?: string | number
  pr?: string

  episode_number?: number | string
  series_number?: number | string

  tiEp?: string
  trEp?: string

  trailer?: Trailer
  bk?: string
}
export interface PalinsestoItem {
  canale: Canale
  prog: Programma[]
}
