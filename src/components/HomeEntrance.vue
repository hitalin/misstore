<script setup lang="ts">
import { computed } from 'vue'
import { useStore } from '@/composables/useStore'
import PluginItem from '@/components/PluginItem.vue'
import ThemeItem from '@/components/ThemeItem.vue'
import WidgetItem from '@/components/WidgetItem.vue'

const { plugins, themes, widgets, loaded, activeTab } = useStore()

const RECENT_COUNT = 3

function pickRecent<T extends { createdAt: string }>(items: T[]): T[] {
  return [...items]
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .slice(0, RECENT_COUNT)
}

const recentPlugins = computed(() => pickRecent(plugins.value))
const recentThemes = computed(() => pickRecent(themes.value))
const recentWidgets = computed(() => pickRecent(widgets.value))

function go(tab: 'plugins' | 'themes' | 'widgets') {
  activeTab.value = tab
}
</script>

<template>
  <section class="home-hero">
    <h1 class="home-hero-title">
      mis<span>store</span>
    </h1>
    <p class="home-hero-lead">
      Misskey / NoteDeck 向けのプラグイン・テーマ・ウィジェットストア。
    </p>
    <p class="home-hero-sub">
      AiScript プラグイン、Misskey 互換テーマ、NoteDeck ウィジェットテンプレートを
      ブラウザから検索・プレビュー・ワンクリックでインストール。
    </p>
  </section>

  <section class="home-cards">
    <button class="home-card" type="button" @click="go('plugins')">
      <div class="home-card-icon" aria-hidden="true">🧩</div>
      <div class="home-card-title">Plugins</div>
      <div class="home-card-count">
        <template v-if="loaded">{{ plugins.length }} items</template>
        <template v-else><span class="home-card-count-skel"></span></template>
      </div>
      <p class="home-card-desc">タイムラインや投稿を拡張する AiScript プラグイン。</p>
      <span class="home-card-cta">Browse →</span>
    </button>
    <button class="home-card" type="button" @click="go('themes')">
      <div class="home-card-icon" aria-hidden="true">🎨</div>
      <div class="home-card-title">Themes</div>
      <div class="home-card-count">
        <template v-if="loaded">{{ themes.length }} items</template>
        <template v-else><span class="home-card-count-skel"></span></template>
      </div>
      <p class="home-card-desc">配色を丸ごと入れ替える Misskey 互換テーマ。</p>
      <span class="home-card-cta">Browse →</span>
    </button>
    <button class="home-card" type="button" @click="go('widgets')">
      <div class="home-card-icon" aria-hidden="true" style="color: var(--accent)">
        <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/></svg>
      </div>
      <div class="home-card-title">Widgets</div>
      <div class="home-card-count">
        <template v-if="loaded">{{ widgets.length }} items</template>
        <template v-else><span class="home-card-count-skel"></span></template>
      </div>
      <p class="home-card-desc">NoteDeck のカラムに追加できるウィジェット。</p>
      <span class="home-card-cta">Browse →</span>
    </button>
  </section>

  <template v-if="loaded">
    <section v-if="recentPlugins.length" class="home-section">
      <header class="home-section-head">
        <h2 class="home-section-title">New in Plugins</h2>
        <button class="home-section-more" type="button" @click="go('plugins')">See all →</button>
      </header>
      <div class="store-grid">
        <PluginItem v-for="p in recentPlugins" :key="p.id" :plugin="p" />
      </div>
    </section>

    <section v-if="recentThemes.length" class="home-section">
      <header class="home-section-head">
        <h2 class="home-section-title">New in Themes</h2>
        <button class="home-section-more" type="button" @click="go('themes')">See all →</button>
      </header>
      <div class="store-grid">
        <ThemeItem v-for="t in recentThemes" :key="t.id" :theme="t" />
      </div>
    </section>

    <section v-if="recentWidgets.length" class="home-section">
      <header class="home-section-head">
        <h2 class="home-section-title">New in Widgets</h2>
        <button class="home-section-more" type="button" @click="go('widgets')">See all →</button>
      </header>
      <div class="store-grid">
        <WidgetItem v-for="w in recentWidgets" :key="w.id" :widget="w" />
      </div>
    </section>
  </template>
</template>

<style scoped>
.home-hero {
  max-width: var(--content-width);
  margin: 0 auto;
  padding: 40px 24px 16px;
  text-align: center;
}

.home-hero-title {
  font-family: var(--font-display);
  font-size: 44px;
  font-weight: 800;
  letter-spacing: -0.02em;
  line-height: 1.05;
  color: var(--text);
}

.home-hero-title span {
  color: var(--accent);
}

.home-hero-lead {
  margin-top: 14px;
  font-size: 15px;
  color: var(--text-sub);
}

.home-hero-sub {
  margin-top: 6px;
  font-size: 13px;
  color: var(--text-muted);
}

.home-cards {
  max-width: var(--content-width);
  margin: 0 auto;
  padding: 20px 24px 8px;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}

.home-card {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 6px;
  padding: 18px 18px 16px;
  border-radius: var(--radius-sm);
  border: 1px solid var(--border);
  background: var(--surface);
  color: var(--text);
  cursor: pointer;
  text-align: left;
  font-family: var(--font-body);
  transition: background var(--duration-base) var(--ease-decel),
              border-color var(--duration-base) var(--ease-decel),
              box-shadow var(--duration-base) var(--ease-decel),
              transform var(--duration-base) var(--ease-decel);
}

.home-card:hover {
  background: var(--surface-hover);
  border-color: var(--border-hover);
  box-shadow: var(--shadow-md);
  transform: translateY(-1px);
}

.home-card-icon {
  font-size: 26px;
  line-height: 1;
}

.home-card-title {
  font-size: 16px;
  font-weight: 700;
  letter-spacing: -0.01em;
}

.home-card-count {
  font-size: 12px;
  color: var(--text-muted);
  min-height: 16px;
}

.home-card-count-skel {
  display: inline-block;
  width: 56px;
  height: 10px;
  border-radius: var(--radius-xs);
  background: var(--surface-active);
}

.home-card-desc {
  font-size: 12px;
  color: var(--text-sub);
  line-height: 1.5;
  flex: 1;
}

.home-card-cta {
  font-size: 12px;
  font-weight: 600;
  color: var(--accent);
  margin-top: 2px;
}

.home-section {
  max-width: var(--content-width);
  margin: 0 auto;
  padding: 16px 24px 8px;
}

.home-section-head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  margin-bottom: 10px;
}

.home-section-title {
  font-size: 14px;
  font-weight: 700;
  color: var(--text);
  letter-spacing: 0.01em;
}

.home-section-more {
  font-size: 12px;
  font-weight: 600;
  color: var(--text-muted);
  background: transparent;
  border: 0;
  cursor: pointer;
  padding: 4px 6px;
  border-radius: var(--radius-xs);
  transition: color var(--duration-base), background var(--duration-base);
}

.home-section-more:hover {
  color: var(--accent);
  background: var(--surface-hover);
}

@media (max-width: 800px) {
  .home-hero { padding: 28px 16px 8px; }
  .home-hero-title { font-size: 34px; }
  .home-cards { padding: 14px 16px 4px; grid-template-columns: 1fr; gap: 10px; }
  .home-section { padding: 12px 16px 4px; }
}
</style>
