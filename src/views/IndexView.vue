<script setup lang="ts">
import { useDailyFetch } from '@/composables/useDailyFetch'
import type { PalinsestoItem, Programma } from '@/models/data.model.ts'
import { onMounted, ref, watch } from 'vue'

const { store } = useDailyFetch()

const now = new Date()
console.log(import.meta.env.VITE_API_KEY)

const programmiInCorso = ref<PalinsestoItem[] | []>([])
const programmi = ref<PalinsestoItem[] | []>([])

const formatTime = (dateStr: string) => {
  const date = new Date(dateStr)
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

const calculateCurrentPrograms = () => {
  programmiInCorso.value = store.palinsesto
    .map((canaleObj) => {
      const programmiAttivi = canaleObj.prog.filter((p: Programma) => {
        const inizio = new Date(p.inizio)
        const fine = new Date(p.fine)
        return now >= inizio && now <= fine
      })
      return {
        canale: canaleObj.canale,
        prog: programmiAttivi,
      }
    })
    .filter((c) => c.prog.length > 0)
}

// watch store.loading to recalculate when loading is done
watch(
  () => store.loading,
  (newVal) => {
    if (!newVal) {
      calculateCurrentPrograms()
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

    const combinedProgrammi = [...programmiAttivi, ...programmiFuturi]

    if (combinedProgrammi.length > 0) {
      groupedPrograms[canaleObj.canale.number] = {
        canale: canaleObj.canale,
        prog: combinedProgrammi,
      }
    }
  })

  programmi.value = Object.values(groupedPrograms)
}

onMounted(() => {
  if (store.palinsesto.length > 0) {
    calculateCurrentPrograms()
    calculatePrograms()
  }
})
</script>

<template>
  <div class="p-4 print:text-sm print:mx-0 print:mt-0">
    <div v-if="store.loading" class="text-center py-8 print:py-4">Caricamento…</div>
    <div v-else-if="store.error" class="text-red-600 print:text-black">{{ store.error }}</div>

    <ul class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 print:grid-cols-3">
      <li
        v-for="(item, index) in programmi"
        :key="item.canale.number"
        class="border border-gray-600 rounded-lg shadow-sm p-4 flex flex-col gap-3"
        :class="[index % 2 === 0 ? 'bg-indigo-900/20' : 'bg-indigo-900']"
        style="page-break-inside: avoid; break-inside: avoid"
      >
        <div class="flex items-center justify-between gap-4">
          <div class="flex items-center gap-3 min-w-0">
            <div
              class="w-12 h-12 flex items-center justify-center rounded-md bg-linear-to-br from-indigo-500 to-blue-400 text-white font-semibold shrink-0"
            >
              {{ item.canale.number }}
            </div>
            <div class="min-w-0">
              <div class="text-sm font-semibold text-gray-900 truncate">{{ item.canale.name }}</div>
            </div>
          </div>
          <div class="text-xs text-gray-400">
            Aggiornato: {{ formatTime(new Date().toISOString()) }}
          </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-1 gap-3">
          <!-- Current program tile -->
          <article
            class="p-3 rounded-lg border border-gray-100 bg-white/60 print:bg-white print:border-black/10 flex flex-col justify-between"
          >
            <div>
              <div class="text-xxs text-gray-500 mb-1">In onda</div>
              <div class="flex items-baseline justify-between">
                <h4 class="text-sm font-semibold text-gray-900 truncate">
                  {{ item.prog[0]?.title ?? '—' }}
                </h4>
                <div class="text-xs font-mono text-gray-600">
                  <span v-if="item.prog[0]">{{ formatTime(item.prog[0].inizio) }}</span>
                  <span v-else>—</span>
                  <span v-if="item.prog[0]"> — {{ formatTime(item.prog[0].fine) }}</span>
                </div>
              </div>
              <p class="text-xs text-gray-600 mt-1 line-clamp-2">
                {{ item.prog[0]?.category || '' }}
              </p>
            </div>
            <div class="mt-3 flex items-center gap-2">
              <span class="text-xs text-green-600 font-medium" v-if="item.prog[0]">LIVE</span>
            </div>
          </article>

          <!-- Next program tile -->
          <article
            class="p-3 rounded-lg border border-gray-100 bg-gray-50/60 print:bg-white print:border-black/10 flex flex-col justify-between"
          >
            <div>
              <div class="text-xxs text-gray-500 mb-1">Prossimo</div>
              <div class="flex items-baseline justify-between">
                <h4 class="text-sm font-semibold text-gray-900 truncate">
                  {{ item.prog[1]?.title ?? '—' }}
                </h4>
                <div class="text-xs font-mono text-gray-600">
                  <span v-if="item.prog[1]">{{ formatTime(item.prog[1].inizio) }}</span>
                  <span v-else>—</span>
                  <span v-if="item.prog[1]"> — {{ formatTime(item.prog[1].fine) }}</span>
                </div>
              </div>
              <p class="text-xs text-gray-600 mt-1 line-clamp-2">
                {{ item.prog[1]?.category || '' }}
              </p>
            </div>
            <div class="mt-3 text-right">
              <span class="text-xs text-gray-500">{{ item.prog[1] ? 'Inizio prossimo' : '' }}</span>
            </div>
          </article>
        </div>
      </li>
    </ul>
  </div>
</template>
