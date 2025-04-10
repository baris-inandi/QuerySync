<script lang="ts">
  import { useQuerySync } from "querysync";
  import { TasksFilters } from "./qs.svelte";

  const { filters, response } = useQuerySync(TasksFilters, {
    pagePath: "/tasks/{query}",
    apiPath: "/api/tasks/{query}",
    noFilterString: "all",
  });

  $effect(() => {
    console.log(filters.title);
  });
</script>

<div>
  <input class="input" type="text" bind:value={filters.title} />
  <input class="input" type="text" bind:value={filters.sortBy} />
</div>

{#await response}
  <div>Loading...</div>
{:then data}
  <div>{JSON.stringify(data)}</div>
{/await}
