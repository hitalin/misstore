<script setup lang="ts">
import { PLUGIN_CATEGORY_LABELS, type PluginEntry } from '@/types'
import { useCopySource } from '@/composables/useCopySource'
import { useStore } from '@/composables/useStore'

const props = defineProps<{ plugin: PluginEntry }>()
const { copiedId, copy } = useCopySource()
const { buildInstallUrl } = useStore()

const initial = props.plugin.name[0]?.toUpperCase() ?? '?'

function openMisskeyInstall() {
  const url = buildInstallUrl(props.plugin.apiUrl, props.plugin.sha512)
  if (url) window.open(url, '_blank')
}
</script>

<template>
  <div class="store-card">
    <div class="card-header">
      <div class="card-icon">{{ initial }}</div>
      <div class="card-info">
        <div class="card-name">
          {{ plugin.name }}
          <span class="card-version">v{{ plugin.version }}</span>
        </div>
        <div class="card-author">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
          {{ plugin.author }}
        </div>
      </div>
    </div>
    <p class="card-desc">{{ plugin.description }}</p>
    <div class="card-meta">
      <span class="card-category">{{ PLUGIN_CATEGORY_LABELS[plugin.category] || plugin.category }}</span>
      <span v-for="tag in plugin.tags" :key="tag" class="card-tag">{{ tag }}</span>
    </div>
    <div class="card-footer">
      <button
        class="install-btn"
        :class="{ copied: copiedId === plugin.id }"
        @click="copy(plugin.sourceUrl, plugin.id)"
      >
        <svg v-if="copiedId !== plugin.id" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>
        <svg v-else width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><polyline points="20 6 9 17 4 12"/></svg>
        {{ copiedId === plugin.id ? 'Copied!' : 'Copy' }}
      </button>
      <button
        class="install-btn misskey-install-btn"
        :disabled="!buildInstallUrl(plugin.apiUrl, plugin.sha512)"
        @click="openMisskeyInstall"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
        Install
      </button>
    </div>
  </div>
</template>
