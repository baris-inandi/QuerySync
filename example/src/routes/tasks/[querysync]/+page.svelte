<script lang="ts">
  import { useQuerySync } from "querysync";
  import type { TasksAPIResponse } from "../../api/tasks/[querysync]/+server";
  import { TasksFilters } from "./qs.svelte";

  const { filters, response } = useQuerySync<TasksFilters, TasksAPIResponse>({
    filters: TasksFilters,
    pagePath: "/tasks/{query}",
    apiPath: "/api/tasks/{query}",
  });

  $effect(() => {
    console.log(response);
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
