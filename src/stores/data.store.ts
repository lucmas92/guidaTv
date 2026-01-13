import { defineStore } from 'pinia'
import type { PalinsestoItem, Programma } from '@/models/data.model'
import { fetchDailyData } from '@/api/dataService'

interface DataState {
  palinsesto: PalinsestoItem[]
  programmi: Programma[]
  lastFetch: string | null
  loading: boolean
  error: string | null
}

export const useDataStore = defineStore('data', {
  state: (): DataState => ({
    palinsesto: [],
    programmi: [],
    lastFetch: null,
    loading: false,
    error: null,
  }),

  getters: {
    programmiByCanale: (state) => {
      return (canaleName: string): Programma[] => {
        return state.palinsesto
          .filter((item) => item.canale.name === canaleName)
          .flatMap((item) => (Array.isArray(item.prog) ? item.prog : [item.prog]))
      }
    },
  },

  actions: {
    async loadDailyData(force = false) {
      const today = new Date().toLocaleString()

      if (!force && this.lastFetch === today) {
        return
      }

      this.loading = true
      this.error = null

      try {
        const data = await fetchDailyData()

        // data è PalinsestoItem[]
        this.palinsesto = data
        this.programmi = this.normalizeProgrammi(data)
        this.lastFetch = today
      } catch (err) {
        this.error = (err as Error).message
      } finally {
        setTimeout(() => {
          this.loading = false
        }, 200)
      }
    },

    normalizeProgrammi(data: PalinsestoItem[]): Programma[] {
      return data.flatMap((item) => (Array.isArray(item.prog) ? item.prog : [item.prog]))
    },

    clear() {
      this.palinsesto = []
      this.programmi = []
      this.lastFetch = null
    },
  },
})
