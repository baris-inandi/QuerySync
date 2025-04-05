<script lang="ts">
  import { TabularFilters, useQuerySync } from "querysync";

  class TasksFilters extends TabularFilters {
    title = $state("");
    description = $state("");
    completed = $state(false);
  }

  const tasks = useQuerySync(TasksFilters, {
    path: "/tasks/{qs}",
  });
</script>

<div>
  <input class="input" type="text" bind:value={tasks.filters.title} />
  <input
    class="input"
    type="text"
    bind:value={tasks.filters.fuzzySearchQuery}
  />
</div>
