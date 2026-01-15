<template>
  <article
    class="bg-slate-50 dark:bg-slate-900 rounded-xl sm:rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 transition-all overflow-hidden shadow-sm hover:shadow-md"
  >
    <div class="flex flex-col sm:flex-row sm:items-stretch">
      <!-- Sidebar Canale (Mobile: orizzontale, Desktop: verticale) -->
      <div
        class="bg-linear-to-br from-violet-600 to-purple-600 dark:from-violet-700 dark:to-purple-700 sm:w-20 lg:w-24 shrink-0 flex flex-row sm:flex-col items-center justify-center gap-2 sm:gap-3 p-4 sm:p-5"
      >
        <span class="text-3xl sm:text-4xl lg:text-5xl font-black text-white">
          {{ channel.canale.number }}
        </span>
        <span class="text-xs sm:text-sm font-semibold text-white/95 leading-tight">{{
          channel.canale.name
        }}</span>
      </div>

      <!-- Contenuto Programma -->
      <div class="flex-1 p-4 sm:p-6 lg:p-8">
        <!-- Programma Corrente -->
        <div class="flex flex-col lg:flex-row lg:items-start gap-4 lg:gap-6">
          <div class="flex-1">
            <!-- Badge e Orario -->
            <div class="flex flex-wrap items-center gap-2 sm:gap-3 mb-3">
              <span
                class="inline-flex items-center gap-1.5 text-xs font-bold text-neon-green dark:text-neon-green bg-neon-green/10 dark:bg-neon-green/20 px-2.5 py-1 rounded-lg border border-neon-green/30"
              >
                <span
                  class="w-2 h-2 bg-neon-green rounded-full animate-pulse shadow-lg shadow-neon-green/50"
                ></span>
                IN ONDA
              </span>
              <span
                class="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-mono bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-lg"
              >
                {{ formatTime(current.inizio) }} - {{ formatTime(current.fine) }}
              </span>
            </div>

            <!-- Titolo Programma -->
            <h3
              class="text-lg sm:text-xl lg:text-2xl font-bold text-slate-900 dark:text-white mb-2 sm:mb-3 leading-tight"
            >
              {{ current.title }}
            </h3>

            <!-- Categoria -->
            <div class="flex items-center gap-2">
              <span
                class="text-xs sm:text-sm text-slate-600 dark:text-slate-400 bg-slate-200 dark:bg-slate-800 px-3 py-1 rounded-full font-medium"
              >
                {{ current.genre }}
              </span>
            </div>
          </div>

          <!-- Progress Circle (visibile solo su desktop) -->
          <div class="hidden lg:flex shrink-0 relative w-16 h-16 xl:w-20 xl:h-20">
            <svg class="transform -rotate-90 w-full h-full">
              <circle
                cx="40"
                cy="40"
                r="34"
                stroke="currentColor"
                stroke-width="5"
                fill="none"
                class="text-slate-200 dark:text-slate-800"
              />
              <circle
                cx="40"
                cy="40"
                r="34"
                stroke="currentColor"
                stroke-width="5"
                fill="none"
                class="text-violet-600 dark:text-violet-500"
                stroke-dasharray="213.6"
                stroke-dashoffset="138.84"
                stroke-linecap="round"
              />
            </svg>
            <span
              class="absolute inset-0 flex items-center justify-center text-sm font-bold text-slate-900 dark:text-white"
            >
              {{ percentComplete }}
            </span>
          </div>
        </div>

        <!-- Progress Bar (visibile solo su mobile/tablet) -->
        <div class="lg:hidden mt-4">
          <div
            class="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-2"
          >
            <span class="font-medium">{{ percentComplete }}% completato</span>
            <span>{{ timeRemaining }} rimanenti</span>
          </div>
          <div class="h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
            <div
              class="h-full bg-linear-to-r from-violet-600 to-purple-600 dark:from-violet-500 dark:to-purple-500 rounded-full transition-all duration-300"
              :style="{ width: percentComplete + '%' }"
            ></div>
          </div>
        </div>

        <transition
          enter-active-class="transition-all duration-300 ease-in-out"
          enter-from-class="opacity-0 scale-95 -translate-y-2"
          enter-to-class="opacity-100 scale-100 translate-y-0"
          leave-active-class="transition-all duration-200 ease-in-out"
          leave-from-class="opacity-100 scale-100 translate-y-0"
          leave-to-class="opacity-0 scale-95 -translate-y-2"
        >
          <div class="pb-4 pt-3" v-if="next">
            <div
              class="bg-slate-100 dark:bg-slate-800/50 rounded-xl p-4 border border-slate-200 dark:border-slate-700/50"
            >
              <h4 class="text-slate-900 dark:text-white font-bold mb-2 text-base sm:text-lg">
                {{ next.title }}
              </h4>

              <div
                class="flex flex-wrap items-center gap-2 text-sm text-slate-600 dark:text-slate-400"
              >
                <span class="font-mono bg-slate-200 dark:bg-slate-700 px-2.5 py-1 rounded"
                  >{{ formatTime(next.inizio) }} - {{ formatTime(next.fine) }}</span
                >
                <span class="hidden sm:inline">•</span>
                <span class="bg-slate-200 dark:bg-slate-700 px-2.5 py-1 rounded">
                  {{ next.genre }}
                </span>
              </div>
            </div>
          </div>
        </transition>
      </div>
    </div>
  </article>
</template>
<script setup lang="ts">
import type { PalinsestoItem } from '@/models/data.model.ts'
import { computed } from 'vue'

const formatTime = (dateStr: string) => {
  const date = new Date(dateStr)
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

const props = defineProps<{
  channel: PalinsestoItem
  showNextProgram: boolean
}>()

const percentComplete = computed(() => {
  const now = new Date()
  const start = new Date(current.value.inizio)
  const end = new Date(current.value.fine)
  const total = end.getTime() - start.getTime()
  const elapsed = now.getTime() - start.getTime()
  return Math.round(Math.min(Math.max((elapsed / total) * 100, 0), 100))
})

const timeRemaining = computed(() => {
  const now = new Date()
  const end = new Date(current.value.fine)
  const diffMs = end.getTime() - now.getTime()
  const diffMins = Math.max(Math.floor(diffMs / 60000), 0)
  const hours = Math.floor(diffMins / 60)
  const minutes = diffMins % 60

  // ritorno una stringa formattata per esempio "1h 15m"
  return `${hours}h ${minutes}m `
})

const current = computed(() => {
  return props.channel.prog[0]!
})

const next = computed(() => {
  return props.channel.prog[1] || null
})

</script>
