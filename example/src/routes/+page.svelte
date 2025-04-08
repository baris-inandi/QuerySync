<script lang="ts">
  import { useQuerySync } from "querysync";
  import { TasksFilters } from "./tasks/[querysync]/qs.svelte";

  const tasks = useQuerySync(TasksFilters);

  $effect(() => {
    console.log(tasks.filters.title);
  });
</script>

<div>
  <input class="input" type="text" bind:value={tasks.filters.title} />
  <input class="input" type="text" bind:value={tasks.filters.sortBy} />
</div>
