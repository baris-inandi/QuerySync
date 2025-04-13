<script lang="ts">
  const { task } = $props();
</script>

<div class="px-4 py-3 border border-gray-200 mb-2 rounded-md">
  <div class="flex gap-4 items-center">
    <input
      class="checkbox pointer-events-none checkbox-sm"
      type="checkbox"
      checked={task.completed}
    />
    <h3 class="font-bold">{task.title}</h3>
    <p class="text-sm text-gray-500">{task.description}</p>
  </div>
</div>
