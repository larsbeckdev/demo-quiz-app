<script setup lang="ts">
import { computed } from "vue";
import type { Quiz } from "../types/quiz.types";

const props = defineProps<{
  score: number;
  wrong: number;
  scorePct: number;
  total: number;
  quiz: Quiz | null;
  answers: Record<string, string[]>;
}>();

defineEmits<{ (e: "restart"): void; (e: "save"): void }>();

type FilterMode = "all" | "wrong" | "open";
const filter = defineModel<FilterMode>("filter", { default: "all" }); // optional, funktioniert auch ohne parent

function verdict(pct: number) {
  if (pct >= 90) return "Sehr stark!";
  if (pct >= 70) return "Gut!";
  if (pct >= 50) return "Solide Basis.";
  return "Nochmal üben 🙂";
}

function choiceText(qId: string, choiceId: string) {
  const q = props.quiz?.questions.find((x) => x.id === qId);
  return q?.choices.find((c) => c.id === choiceId)?.text ?? "—";
}

function joinTexts(qId: string, ids: string[]) {
  if (!ids?.length) return "—";
  return ids.map((id) => choiceText(qId, id)).join(", ");
}

function sameSet(a: string[], b: string[]) {
  const aa = [...(a ?? [])].sort();
  const bb = [...(b ?? [])].sort();
  if (aa.length !== bb.length) return false;
  for (let i = 0; i < aa.length; i++) if (aa[i] !== bb[i]) return false;
  return true;
}

function qStatus(qId: string) {
  const q = props.quiz?.questions.find((x) => x.id === qId);
  if (!q) return "open" as const;

  const chosen = props.answers[qId] ?? [];
  if (chosen.length === 0) return "open" as const;

  return sameSet(chosen, q.correctChoiceIds)
    ? ("correct" as const)
    : ("wrong" as const);
}

const answeredCount = computed(() => {
  if (!props.quiz) return 0;
  return props.quiz.questions.filter(
    (q) => (props.answers[q.id]?.length ?? 0) > 0,
  ).length;
});

const openCount = computed(() =>
  Math.max(0, props.total - answeredCount.value),
);

const filteredQuestions = computed(() => {
  if (!props.quiz) return [];
  const qs = props.quiz.questions;

  if (filter.value === "wrong")
    return qs.filter((q) => qStatus(q.id) === "wrong");
  if (filter.value === "open")
    return qs.filter((q) => qStatus(q.id) === "open");
  return qs;
});
</script>

<template>
  <n-card title="Ergebnis">
    <n-space vertical :size="14">
      <!-- Header / Summary -->
      <n-card size="small" :bordered="true">
        <n-space align="center" justify="space-between" wrap>
          <n-space vertical :size="2">
            <n-text style="font-size: 34px; font-weight: 800; line-height: 1.1">
              {{ props.score }} / {{ props.total }}
            </n-text>
            <n-space :size="8" align="center">
              <n-tag type="info" size="small">{{ props.scorePct }}%</n-tag>
              <n-text depth="3">{{ verdict(props.scorePct) }}</n-text>
            </n-space>
          </n-space>

          <n-space :size="8" align="center">
            <n-tag type="success" size="small"
              >Richtig: {{ props.score }}</n-tag
            >
            <n-tag type="error" size="small">Falsch: {{ props.wrong }}</n-tag>
            <n-tag type="warning" size="small">Offen: {{ openCount }}</n-tag>
          </n-space>
        </n-space>

        <n-space :size="8" style="margin-top: 12px" wrap>
          <n-button type="primary" @click="$emit('restart')">Nochmal</n-button>
          <n-button secondary @click="$emit('save')"
            >Ergebnis speichern</n-button
          >
        </n-space>
      </n-card>

      <!-- Filter (optional, aber nice) -->
      <n-space v-if="props.quiz" align="center" justify="space-between" wrap>
        <n-text depth="3" style="font-size: 12px">
          Details: {{ filteredQuestions.length }} /
          {{ props.quiz.questions.length }}
        </n-text>

        <n-radio-group v-model:value="filter" size="small">
          <n-radio-button value="all">Alle</n-radio-button>
          <n-radio-button value="wrong">Nur falsch</n-radio-button>
          <n-radio-button value="open">Nur offen</n-radio-button>
        </n-radio-group>
      </n-space>

      <!-- Details -->
      <div v-if="props.quiz">
        <n-collapse accordion>
          <n-collapse-item
            v-for="(q, i) in filteredQuestions"
            :key="q.id"
            :name="q.id">
            <!-- prettier title -->
            <template #header>
              <n-space
                align="center"
                justify="space-between"
                style="width: 100%">
                <n-space align="center" :size="10">
                  <n-text depth="3" style="font-size: 12px; min-width: 28px">
                    #{{ i + 1 }}
                  </n-text>
                  <n-text style="font-weight: 650">
                    {{ q.question }}
                  </n-text>
                </n-space>

                <n-space :size="8" align="center">
                  <n-tag
                    v-if="qStatus(q.id) === 'correct'"
                    type="success"
                    size="small">
                    Richtig
                  </n-tag>
                  <n-tag
                    v-else-if="qStatus(q.id) === 'wrong'"
                    type="error"
                    size="small">
                    Falsch
                  </n-tag>
                  <n-tag v-else type="warning" size="small">Offen</n-tag>
                </n-space>
              </n-space>
            </template>

            <n-space vertical :size="12">
              <!-- Your answer -->
              <n-card size="small" :bordered="true" class="mini-card">
                <n-space vertical :size="6">
                  <n-text depth="3" style="font-size: 12px"
                    >Deine Antwort</n-text
                  >

                  <n-space
                    v-if="(props.answers[q.id]?.length ?? 0) > 0"
                    wrap
                    :size="6">
                    <n-tag
                      v-for="id in props.answers[q.id] ?? []"
                      :key="id"
                      :type="
                        q.correctChoiceIds.includes(id) ? 'success' : 'error'
                      "
                      size="small">
                      {{ choiceText(q.id, id) }}
                    </n-tag>
                  </n-space>

                  <n-text v-else depth="3">—</n-text>
                </n-space>
              </n-card>

              <!-- Correct -->
              <n-card size="small" :bordered="true" class="mini-card">
                <n-space vertical :size="6">
                  <n-text depth="3" style="font-size: 12px">Richtig</n-text>

                  <n-space wrap :size="6">
                    <n-tag
                      v-for="id in q.correctChoiceIds"
                      :key="id"
                      type="success"
                      size="small">
                      {{ choiceText(q.id, id) }}
                    </n-tag>
                  </n-space>
                </n-space>
              </n-card>

              <n-alert
                v-if="q.explanation"
                type="info"
                :bordered="true"
                :show-icon="false">
                {{ q.explanation }}
              </n-alert>
            </n-space>
          </n-collapse-item>
        </n-collapse>
      </div>
    </n-space>
  </n-card>
</template>

<style scoped>
.mini-card :deep(.n-card__content) {
  padding: 12px;
}
</style>
