<script lang="ts">
  import { useQuerySync } from "querysync";
  import type { TasksAPIResponse } from "../../api/tasks/[querysync]/+server";
  import { tasksQs, type TasksFilters } from "./qs.svelte";

  const { filters, response } = useQuerySync<TasksFilters, TasksAPIResponse>(
    tasksQs,
  );

  $effect(() => {
    response.then((data) => {
      console.log("API Response:", data);
      console.log("Tasks array:", data?.tasks);
      console.log("Tasks length:", data?.tasks?.length);
    });
  });
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
  <div>Loading...</div>
{:then data}
  <div class="debug">
    <pre>Raw response: {JSON.stringify(data, null, 2)}</pre>
  </div>
  {#if data.tasks && data.tasks.length > 0}
    <div class="tasks-list">
      {#each data.tasks as task}
        <div class="task-item">
          <h3>{task.title}</h3>
          <p>{task.description}</p>
          <span class="status">{task.completed ? "Completed" : "Pending"}</span>
        </div>
      {/each}
    </div>
  {:else}
    <div>No tasks found</div>
  {/if}
{/await}

<style>
  .tasks-list {
    margin-top: 1rem;
  }
  .task-item {
    padding: 1rem;
    border: 1px solid #eee;
    margin-bottom: 0.5rem;
    border-radius: 4px;
  }
  .status {
    display: inline-block;
    padding: 0.25rem 0.5rem;
    border-radius: 4px;
    background: #f0f0f0;
    font-size: 0.875rem;
  }
  .debug {
    margin: 1rem 0;
    padding: 1rem;
    background: #f5f5f5;
    border-radius: 4px;
  }
  .debug pre {
    margin: 0;
    white-space: pre-wrap;
  }
</style>
