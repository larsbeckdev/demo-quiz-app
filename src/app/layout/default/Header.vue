<script setup>
import LogoPrimary from "@/components/logo/LogoPrimary.vue";
import LogoSecondary from "@/components/logo/LogoSecondary.vue";
import ThemeToggle from "@/features/theme-toggle/ThemeToggle.vue";
import { NIcon } from "naive-ui";
import { h } from "vue";
import { Github } from "lucide-vue-next";

function renderIcon() {
  return h(NIcon, null, {
    default: () => h(Github),
  });
}
</script>

<template>
  <div class="logo-box flex align-center items-center gap-2">
    <!-- <LogoPrimary class="h-full" /> -->
    <LogoSecondary class="h-full" />
  </div>
  <n-space>
    <n-button tertiary >
      <!-- <template #icon> -->
        <n-icon><Github /></n-icon>
        <p class="hidden sm:block">Github</p>
      <!-- </template> -->
    </n-button>
    <n-button tertiary :render-icon="renderIcon" class="flex center"
      ><p class="hidden sm:block">Github</p>
    </n-button>
    <ThemeToggle />
  </n-space>

  <!-- <div class="flex gap-2"></div> -->
</template>

<style scoped></style>
