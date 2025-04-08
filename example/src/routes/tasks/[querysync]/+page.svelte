<script lang="ts">
  import { useQuerySync } from "querysync";
  import { TasksFilters } from "./qs.svelte";

  const filters = useQuerySync(TasksFilters, {
    pagePath: "/tasks/{qs}",
    apiPath: "/api/tasks/{qs}",
  });
</script>

<div>
  <input class="input" type="text" bind:value={filters.filters.title} />
  <input class="input" type="text" bind:value={filters.filters.sortBy} />
</div>
