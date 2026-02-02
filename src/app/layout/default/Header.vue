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
  <div class="flex gap-2">
    <n-button tertiary :render-icon="renderIcon" class="flex center"><p class="hidden sm:block">
      Github
    </p> </n-button>
    <ThemeToggle />
  </div>
</template>

<style scoped></style>
