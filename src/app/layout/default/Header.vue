<script setup>
import LogoPrimary from "@/components/logo/LogoPrimary.vue";
import LogoSecondary from "@/components/logo/LogoSecondary.vue";
import ThemeToggle from "@/features/theme-toggle/ThemeToggle.vue";
</script>

<template>
  <div class="logo-box flex align-center items-center gap-2">
    <!-- <LogoPrimary class="h-full" /> -->
    <LogoSecondary class="h-full" />
  </div>
  <div class="flex gap-2">
    <ThemeToggle />
  </div>
</template>

<style scoped></style>
