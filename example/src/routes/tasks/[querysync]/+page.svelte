<script lang="ts">
  import { useQuerySync } from "querysync";
  import type { TasksAPIResponse } from "../../api/tasks/[querysync]/+server";
  import { TasksFilters, tasksOptions } from "./qs.svelte";

  const { filters, response } = useQuerySync<TasksFilters, TasksAPIResponse>(
    tasksOptions,
  );

  $effect(() => {
    response.then((data) => {
      console.log(data);
    });
  });
</script>

<div>
  <input class="input" type="text" bind:value={filters.title} />
</div>

{#await response}
  <div>Loading...</div>
{:then data}
  <div>{JSON.stringify(data)}</div>
{/await}
