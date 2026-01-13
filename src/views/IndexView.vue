<script setup lang="ts">
import { useDailyFetch } from '@/composables/useDailyFetch'
import type { PalinsestoItem, Programma } from '@/models/data.model.ts'
import { onMounted, ref, watch } from 'vue'
import ChannelProgram from '@/components/ChannelProgram.vue'

const { store } = useDailyFetch()

const now = new Date()

const isDark = ref(false)
const showNextProgram = ref(false)
const programmi = ref<PalinsestoItem[] | []>([])

// watch store.loading to recalculate when loading is done
watch(
  () => store.loading,
  (newVal) => {
    if (!newVal) {
      calculatePrograms()
    }
  },
)

// funzione che raggruppa per canale i programmi correnti con quelli successivi
const calculatePrograms = () => {
  const groupedPrograms: {
    [key: string]: { canale: PalinsestoItem['canale']; prog: Programma[] }
  } = {}

  store.palinsesto.forEach((canaleObj) => {
    const programmiAttivi = canaleObj.prog.filter((p: Programma) => {
      const inizio = new Date(p.inizio)
      const fine = new Date(p.fine)
      return now >= inizio && now <= fine
    })

    const programmiFuturi = canaleObj.prog.filter((p: Programma) => {
      const inizio = new Date(p.inizio)
      return inizio > now
    })
    let combinedProgrammi = []
    // const combinedProgrammi = [...programmiAttivi, ...programmiFuturi]
    if (showNextProgram.value) {
      combinedProgrammi = [...programmiAttivi, ...programmiFuturi.slice(0, 1)]
    } else {
      combinedProgrammi = [...programmiAttivi]
    }

    if (combinedProgrammi.length > 0) {
      groupedPrograms[canaleObj.canale.number] = {
        canale: canaleObj.canale,
        prog: combinedProgrammi,
      }
    }
  })

  programmi.value = Object.values(groupedPrograms)
}

const toggleNextProgram = () => {
  showNextProgram.value = !showNextProgram.value
  calculatePrograms()
}

const toggleDarkMode = () => {
  document.documentElement.classList.toggle('dark')
  isDark.value = document.documentElement.classList.contains('dark')
  // Salva preferenza in localStorage
  localStorage.setItem('darkMode', isDark.value.toString())
}

onMounted(() => {
  const darkMode = localStorage.getItem('darkMode')
  if (darkMode === 'true') {
    document.documentElement.classList.add('dark')
    isDark.value = true
  }
  if (store.palinsesto.length > 0) {
    calculatePrograms()
  }
})
</script>

<template>
  <div class="px-4 print:text-sm print:mx-0 print:mt-0">
    <header
      v-if="!store.loading"
      class="flex gap-2 border-b py-4 mb-8 border-slate-200 dark:border-slate-800"
    >
      <button
        v-if="!store.loading"
        class="flex-1 self-start sm:self-auto bg-slate-800 dark:bg-slate-700 hover:bg-slate-700 dark:hover:bg-slate-600 text-white px-4 py-2.5 rounded-xl font-medium transition-all flex items-center gap-2 text-sm sm:text-base shadow-lg"
        :class="
          !showNextProgram ? 'bg-indigo-400 hover:bg-indigo-500' : 'bg-red-600 hover:bg-red-700'
        "
        @click="toggleNextProgram"
      >
        {{ showNextProgram ? 'Nascondi' : 'Mostra' }} prossimo programma per canale
      </button>
      <button
        v-if="!store.loading"
        @click="toggleDarkMode"
        class="self-start sm:self-auto bg-slate-800 dark:bg-slate-700 hover:bg-slate-700 dark:hover:bg-slate-600 text-white px-3 py-2.5 rounded-full font-medium transition-all flex items-center gap-2 text-sm sm:text-base shadow-lg"
      >
        <svg
          class="w-5 h-5 hidden dark:block"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
          />
        </svg>
        <svg class="w-5 h-5 dark:hidden" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
          />
        </svg>
      </button>
    </header>
    <div
      v-if="store.loading"
      class="h-screen text-center py-8 print:py-4 text-black dark:text-white"
    >
      Caricamento…
    </div>
    <div v-else-if="store.error" class="text-red-600 print:text-black">{{ store.error }}</div>

    <ul v-if="!store.loading" class="grid gap-4 sm:grid-cols-1 lg:grid-cols-2">
      <li
        v-for="item in programmi"
        :key="item.canale.number"
        style="page-break-inside: avoid; break-inside: avoid"
      >
        <ChannelProgram :channel="item" :show-next-program="showNextProgram" />
      </li>
    </ul>
  </div>
</template>
