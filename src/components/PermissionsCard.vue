<script setup lang="ts">
defineProps<{ title: string; items: string[]; emptyText: string }>()
</script>

<template>
  <aside class="detail-sidebar">
    <h3 class="detail-more-info-title">{{ title }}</h3>
    <div v-if="items.length" class="detail-tags">
      <span v-for="item in items" :key="item" class="detail-tag">{{ item }}</span>
    </div>
    <p v-else class="detail-permissions-empty">{{ emptyText }}</p>
  </aside>
</template>
