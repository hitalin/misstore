<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { STYLE_TARGET_LABELS } from '@/types'
import { useCopySource } from '@/composables/useCopySource'
import { formatDate } from '@/utils/format'
import { useStore } from '@/composables/useStore'
import StoreHeader from '@/components/StoreHeader.vue'
import CodeBlock from '@/components/CodeBlock.vue'
import IntegrityCard from '@/components/IntegrityCard.vue'

const route = useRoute()
const { loaded, findStyle, misskeyHost } = useStore()
const { copiedId, copy } = useCopySource()

const style = findStyle(route.params.id as string)

// Misskey Web のカスタム CSS 設定ページ (設定 > カスタムCSS) への直リンク
const settingsUrl = computed(() => {
  if (style.value?.target !== 'misskey') return null
  const host = misskeyHost.value.trim()
  if (!host) return null
  const cleanHost = host.replace(/^https?:\/\//, '').replace(/\/$/, '')
  return `https://${cleanHost}/settings/custom-css`
})

function openSettings() {
  if (settingsUrl.value) window.open(settingsUrl.value, '_blank')
}
</script>

<template>
  <StoreHeader />

  <main class="detail-body">
    <div v-if="!loaded" class="store-loading">Loading...</div>
    <div v-else-if="!style" class="store-empty">
      <p class="empty-text">Style not found</p>
      <router-link to="/" class="detail-back">Back to Store</router-link>
    </div>
    <template v-else>
      <div class="detail-breadcrumb">
        <router-link to="/" class="detail-back">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><polyline points="15 18 9 12 15 6"/></svg>
          Store
        </router-link>
        <span class="breadcrumb-sep">/</span>
        <span>{{ style.name }}</span>
      </div>

      <div class="detail-layout">
        <div class="detail-main">
          <div class="detail-hero">
            <div class="detail-icon" style="color: var(--accent)">
              <span
                v-if="style.iconUrl"
                class="detail-icon-img"
                :style="{ '--icon-url': `url(${style.iconUrl})` }"
                role="img"
                :aria-label="style.name"
              ></span>
              <svg v-else width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9.06 11.9 8.07-8.06a2.85 2.85 0 1 1 4.03 4.03l-8.06 8.08"/><path d="M7.07 14.94c-1.66 0-3 1.35-3 3.02 0 1.33-2.5 1.52-2 2.02 1.08 1.1 2.49 2.02 4 2.02 2.2 0 4-1.8 4-4.04a3.01 3.01 0 0 0-3-3.02z"/></svg>
            </div>
            <div class="detail-hero-info">
              <h1 class="detail-title">{{ style.name }}</h1>
              <div class="detail-meta-row">
                <span class="detail-version">v{{ style.version }}</span>
                <span class="detail-category">{{ STYLE_TARGET_LABELS[style.target] || style.target }}</span>
              </div>
              <p class="detail-description">{{ style.description }}</p>
              <div class="detail-actions">
                <button
                  class="vsx-btn"
                  :class="{ copied: copiedId === style.id }"
                  @click="copy(style.sourceUrl, style.id)"
                >
                  <svg v-if="copiedId !== style.id" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>
                  <svg v-else width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><polyline points="20 6 9 17 4 12"/></svg>
                  {{ copiedId === style.id ? 'Copied!' : 'Copy CSS' }}
                </button>
                <div v-if="style.target === 'misskey'" class="detail-install-group">
                  <input
                    v-model="misskeyHost"
                    type="text"
                    class="detail-host-input"
                    placeholder="example.com"
                  />
                  <button
                    class="vsx-btn vsx-btn-primary"
                    :disabled="!settingsUrl"
                    @click="openSettings"
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                    Open CSS Settings
                  </button>
                </div>
              </div>
            </div>
          </div>

          <section class="detail-section">
            <CodeBlock
              :source="style.sourceUrl"
              lang="css"
              :filename="`${style.id}.css`"
            />
          </section>
        </div>

        <div class="detail-side">
          <aside class="detail-sidebar">
            <dl class="detail-info-list">
              <div class="detail-info-item">
                <dt>Author</dt>
                <dd>
                  <a v-if="style.authorUrl" :href="style.authorUrl" target="_blank" rel="noopener" class="detail-link">{{ style.author }}</a>
                  <span v-else>{{ style.author }}</span>
                </dd>
              </div>
              <div v-if="style.license" class="detail-info-item">
                <dt>License</dt>
                <dd>{{ style.license }}</dd>
              </div>
              <div v-if="style.repository" class="detail-info-item">
                <dt>Repository</dt>
                <dd><a :href="style.repository" target="_blank" rel="noopener" class="detail-link">Source Code</a></dd>
              </div>
              <div class="detail-info-item">
                <dt>Target</dt>
                <dd>{{ STYLE_TARGET_LABELS[style.target] || style.target }}</dd>
              </div>
              <div v-if="style.tags.length" class="detail-info-item">
                <dt>Tags</dt>
                <dd class="detail-tags">
                  <span v-for="tag in style.tags" :key="tag" class="detail-tag">{{ tag }}</span>
                </dd>
              </div>
            </dl>

            <div class="detail-more-info">
              <h3 class="detail-more-info-title">More Info</h3>
              <div class="detail-more-info-row">
                <span>Released</span>
                <span>{{ formatDate(style.createdAt) }}</span>
              </div>
              <div class="detail-more-info-row">
                <span>Last Updated</span>
                <span>{{ formatDate(style.updatedAt) }}</span>
              </div>
              <div class="detail-more-info-row">
                <span>Version</span>
                <span>v{{ style.version }}</span>
              </div>
              <div class="detail-more-info-row">
                <span>Identifier</span>
                <span>{{ style.id }}</span>
              </div>
            </div>
          </aside>

          <IntegrityCard :sha512="style.sha512" />
        </div>
      </div>
    </template>
  </main>
</template>
