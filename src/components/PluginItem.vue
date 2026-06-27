<script setup lang="ts">
import type { PluginEntry } from '@/types'
import CopyButton from '@/components/CopyButton.vue'
import InstallButton from '@/components/InstallButton.vue'

defineProps<{ plugin: PluginEntry }>()
</script>

<template>
  <router-link :to="`/plugins/${plugin.id}`" class="vsx-card vsx-card-link">
    <div class="vsx-body">
      <div class="vsx-icon-plain" :style="plugin.iconUrl ? 'color: var(--accent)' : null">
        <span
          v-if="plugin.iconUrl"
          class="vsx-icon-img"
          :style="{ '--icon-url': `url(${plugin.iconUrl})` }"
          role="img"
          :aria-label="plugin.name"
        ></span>
        <template v-else>🧩</template>
      </div>
      <div class="vsx-details">
        <div class="vsx-name">{{ plugin.name }}</div>
        <div class="vsx-author vsx-author-stack">
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
          {{ plugin.author }}
        </div>
        <p class="vsx-desc">{{ plugin.description }}</p>
      </div>
    </div>
    <div class="vsx-footer">
      <div class="vsx-actions">
        <CopyButton :source-url="plugin.sourceUrl" :id="plugin.id" />
        <InstallButton :api-url="plugin.apiUrl" :sha512="plugin.sha512" />
      </div>
    </div>
  </router-link>
</template>
