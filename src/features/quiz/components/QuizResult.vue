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

function verdict(pct: number) {
  if (pct >= 90) return "Sehr stark!";
  if (pct >= 70) return "Gut!";
  if (pct >= 50) return "Solide Basis.";
  return "Nochmal üben 🙂";
}

function verdictType(pct: number) {
  if (pct >= 90) return "success";
  if (pct >= 70) return "info";
  if (pct >= 50) return "warning";
  return "error";
}

function choiceText(qId: string, choiceId: string) {
  const q = props.quiz?.questions.find((x) => x.id === qId);
  return q?.choices.find((c) => c.id === choiceId)?.text ?? "—";
}

function texts(qId: string, ids: string[]) {
  if (!ids?.length) return [];
  return ids.map((id) => choiceText(qId, id));
}

function sameSet(a: string[], b: string[]) {
  const aa = [...a].sort();
  const bb = [...b].sort();
  if (aa.length !== bb.length) return false;
  for (let i = 0; i < aa.length; i++) if (aa[i] !== bb[i]) return false;
  return true;
}

function questionStatus(qId: string) {
  const q = props.quiz?.questions.find((x) => x.id === qId);
  if (!q) return "empty";
  const chosen = props.answers[qId] ?? [];
  if (!chosen.length) return "empty";
  return sameSet(chosen, q.correctChoiceIds) ? "correct" : "wrong";
}

function statusLabel(s: "correct" | "wrong" | "empty") {
  if (s === "correct") return "Korrekt";
  if (s === "wrong") return "Falsch";
  return "Nicht beantwortet";
}

function statusType(s: "correct" | "wrong" | "empty") {
  if (s === "correct") return "success";
  if (s === "wrong") return "error";
  return "default";
}

const ringPct = computed(() => Math.max(0, Math.min(100, props.scorePct)));
</script>

<template>
  <n-card>
    <n-space vertical :size="14">
      <!-- Header -->
      <n-space align="center" justify="space-between" style="width: 100%">
        <n-space align="center" :size="14">
          <n-progress type="circle" :percentage="ringPct" :height="72" />

          <div>
            <n-text style="font-size: 34px; font-weight: 800; line-height: 1">
              {{ props.score }} / {{ props.total }}
            </n-text>

            <n-space :size="8" align="center" style="margin-top: 6px">
              <n-tag :type="verdictType(props.scorePct)" size="small" round>
                {{ verdict(props.scorePct) }}
              </n-tag>
              <n-text depth="3" style="font-size: 12px">
                {{ props.scorePct }}% · Richtig: {{ props.score }} · Falsch:
                {{ props.wrong }}
              </n-text>
            </n-space>
          </div>
        </n-space>

        <n-space :size="8">
          <n-button type="primary" @click="$emit('restart')">Nochmal</n-button>
          <n-button secondary @click="$emit('save')"
            >Ergebnis speichern</n-button
          >
        </n-space>
      </n-space>

      <!-- Details -->
      <div v-if="props.quiz">
        <n-collapse accordion>
          <n-collapse-item
            v-for="(q, i) in props.quiz.questions"
            :key="q.id"
            :name="q.id">
            <!-- Custom title -->
            <template #header>
              <n-space
                align="center"
                justify="space-between"
                style="width: 100%">
                <n-space align="center" :size="10" style="min-width: 0">
                  <n-tag
                    size="small"
                    round
                    :type="statusType(questionStatus(q.id) as any)">
                    {{
                      statusLabel(
                        questionStatus(q.id) as "correct" | "wrong" | "empty",
                      )
                    }}
                  </n-tag>

                  <n-text
                    strong
                    style="
                      white-space: nowrap;
                      overflow: hidden;
                      text-overflow: ellipsis;
                      max-width: 560px;
                    ">
                    {{ i + 1 }}. {{ q.question }}
                  </n-text>
                </n-space>

                <n-text depth="3" style="font-size: 12px">
                  Antworten: {{ (props.answers[q.id] ?? []).length || 0 }}
                </n-text>
              </n-space>
            </template>

            <n-space vertical :size="12">
              <n-grid :x-gap="12" :y-gap="12" cols="1 s:2" responsive="screen">
                <!-- Your answer -->
                <n-grid-item>
                  <n-card size="small" embedded>
                    <n-space vertical :size="8">
                      <n-text depth="3" style="font-size: 12px"
                        >Deine Antwort</n-text
                      >

                      <n-space wrap :size="6">
                        <template v-if="(props.answers[q.id] ?? []).length">
                          <n-tag
                            v-for="t in texts(q.id, props.answers[q.id] ?? [])"
                            :key="t"
                            size="small"
                            round
                            type="default">
                            {{ t }}
                          </n-tag>
                        </template>

                        <n-text v-else depth="3">—</n-text>
                      </n-space>
                    </n-space>
                  </n-card>
                </n-grid-item>

                <!-- Correct -->
                <n-grid-item>
                  <n-card size="small" embedded>
                    <n-space vertical :size="8">
                      <n-text depth="3" style="font-size: 12px">Richtig</n-text>

                      <n-space wrap :size="6">
                        <n-tag
                          v-for="t in texts(q.id, q.correctChoiceIds)"
                          :key="t"
                          size="small"
                          round
                          type="success">
                          {{ t }}
                        </n-tag>
                      </n-space>
                    </n-space>
                  </n-card>
                </n-grid-item>
              </n-grid>

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
