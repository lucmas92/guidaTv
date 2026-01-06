import { onMounted } from 'vue'
import { useDataStore } from '@/stores/data.store'

export function useDailyFetch() {
  const store = useDataStore()

  onMounted(async () => {
    await store.loadDailyData()
  })

  return {
    store,
  }
}
