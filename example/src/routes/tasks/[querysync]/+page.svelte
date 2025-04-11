<script lang="ts">
  import { useQuerySync } from "querysync";
  import type { TasksAPIResponse } from "../../api/tasks/[querysync]/+server";
  import { tasksQs, type TasksFilters } from "./qs.svelte";

  const { filters, response } = useQuerySync<TasksFilters, TasksAPIResponse>(
    tasksQs,
  );
</script>

<div>
  <input
    class="input"
    type="text"
    bind:value={filters.title}
    placeholder="Search tasks..."
  />
</div>

{#await response}
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
