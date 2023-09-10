<script setup lang="ts">
import { useChat } from "ai/vue";
const source = ref<string>("");
const { text, copy, copied } = useClipboard({ source });

const { messages, input, handleSubmit } = useChat({
  headers: { "Content-Type": "application/json" },
});
function selectedContent(content: string) {
  source.value = content;
  copy(source.value);
}
</script>

<template>
  <div class="bg-slate-900 max-h-screen w-screen h-screen text-gray-200">
    <div class="m-auto max-w-xl p-4">
      <div
        class="mt-8 justify-center items-center text-center border-b border-neutral-700 pb-3"
      >
        <h1
          class="font-extrabold text-transparent text-4xl bg-clip-text bg-gradient-to-r from-teal-400 to-teal-600"
        >
          Cron AI
        </h1>
        <p className="tracking-wider text-neutral-400">
          Words to cron expression
        </p>
      </div>
      <Transition name="fade">
        <button
          v-if="messages.length > 0"
          class="flex justify-center items-center text-center mx-auto m-2 px-2 py-2 hover:bg-teal-700 bg-teal-600 rounded-lg transition-opacity duration-500 ease-in-out"
          @click="messages = []"
        >
          Clear messages
        </button>
      </Transition>
    </div>
    <div class="flex flex-col w-full max-w-md py-10 mx-auto stretch">
      <span class="text-xl mb-2">I want a cron job that runs:</span>
      <form @submit="handleSubmit">
        <input
          class="w-full space-y-6 max-w-md p-2 border border-black/20 rounded shadow-xl bg-gray-300 text-slate-800"
          v-model="input"
          placeholder="every 2 hours, 3 days, week..."
        />
      </form>
    </div>
    <div class="bg-slate-900">
      <TransitionGroup name="fade">
        <div
          v-for="m in messages"
          key="m.id"
          class="flex max-w-md items-center justify-center mx-auto rounded-md py-4 m-6 relative"
          :class="[
            {
              'bg-blue-950': m.role !== 'user',
              'bg-teal-800': m.role === 'user',
            },
          ]"
        >
          {{ m.role === "user" ? "User: " : " " }}
          <div class="font-bold" @click="selectedContent(m.content)">
            {{ m.content }}
          </div>
          <div
            v-if="m.role !== 'user'"
            class="cursor-pointer absolute top-0 right-0 m-2"
            @click="selectedContent(m.content)"
          >
            <CopyIcon />
            <div
              v-if="copied && source === m.content"
              class="absolute top-0 left-0 bg-teal-700 text-gray-200 p-2 rounded-lg mt-4 transition-all"
            >
              Copied!
            </div>
          </div>
        </div>
      </TransitionGroup>
    </div>
  </div>
</template>

<style>
.fade-enter-from {
  opacity: 0;
  transform: translateY(-60px);
}
.fade-enter-to {
  opacity: 1;
}
.fade-enter-active {
  transition: all 0.5s ease;
}
.fade-leave-from {
  opacity: 1;
}
.fade-leave-to {
  opacity: 0;
  transform: translateY(-60px);
}
.fade-leave-active {
  transition: all 0.5s ease;
}
</style>
