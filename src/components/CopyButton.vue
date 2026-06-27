<script setup lang="ts">
import { useCopySource } from '@/composables/useCopySource'

defineProps<{ sourceUrl: string; id: string }>()
const { copiedId, copy } = useCopySource()
</script>

<template>
  <button
    class="vsx-btn"
    :class="{ copied: copiedId === id }"
    @click.stop="copy(sourceUrl, id)"
  >
    <svg v-if="copiedId !== id" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>
    <svg v-else width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><polyline points="20 6 9 17 4 12"/></svg>
    {{ copiedId === id ? 'Copied!' : 'Copy' }}
  </button>
</template>
