<script lang="ts">
  import { useQuerySync } from "querysync";
  import type { TasksAPIResponse } from "../../api/tasks/[querysync]/+server";
  import { tasksQs, type TasksFilters } from "./qs.svelte";

  const { filters, response } = useQuerySync<TasksFilters, TasksAPIResponse>(
    tasksQs,
  );
</script>

<div class="flex flex-col gap-2 p-4 pb-6">
  <label class="label">
    <span>Search by title</span>
    <input
      class="input input-sm"
      type="text"
      bind:value={filters.title}
      placeholder="Search title..."
    />
  </label>
  <label class="label">
    <span>Search by description</span>
    <input
      class="input input-sm"
      type="text"
      bind:value={filters.description}
      placeholder="Search description..."
    />
  </label>
  <label class="label">
    <span>Completed only?</span>
    <input
      class="checkbox checkbox-sm"
      type="checkbox"
      bind:checked={filters.completed}
    />
  </label>
</div>

<div class="px-4">
  {#await response.value}
    <div class="loading">Loading...</div>
  {:then data}
    {#if data.tasks && data.tasks.length > 0}
      <div class="mt-4">
        {#each data.tasks as task}
          <div class="p-4 border border-gray-200 mb-2 rounded-md">
            <h3>{task.title}</h3>
            <p>{task.description}</p>
            <input class="checkbox" type="checkbox" checked={task.completed} />
          </div>
        {/each}
      </div>
    {:else}
      <div>No tasks found</div>
    {/if}
  {/await}
</div>
