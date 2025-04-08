<script lang="ts">
  import { useQuerySync } from "querysync";
  import { TasksFilters } from "./qs.svelte";

  const filters = useQuerySync(TasksFilters, {
    pagePath: "/tasks/{qs}",
    apiPath: "/api/tasks/{qs}",
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
