<script setup lang="ts">
import { useChat } from "ai/vue";

const { messages, input, handleSubmit } = useChat({
  headers: { "Content-Type": "application/json" },
});
</script>

<template>
  <div class="bg-slate-900 max-h-screen w-screen h-screen text-gray-200">
    <div class="m-auto max-w-xl p-4">
      <div
        class="mt-8 justify-center items-center text-center border-b border-neutral-800 pb-3"
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
      <div
        v-for="m in messages"
        key="m.id"
        class="flex max-w-md items-center justify-center mx-auto rounded-md py-4 m-6"
        :class="[
          {
            'bg-blue-950': m.role !== 'user',
            'bg-teal-800': m.role === 'user',
          },
        ]"
      >
        {{ m.role === "user" ? "Cron expression: " : " " }}
        <span class="ml-2 font-bold">
          {{ m.content }}
        </span>
      </div>
    </div>
  </div>
</template>
