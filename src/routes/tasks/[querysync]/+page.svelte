<script lang="ts">
	import { tasksQs } from './query.svelte';
	import Task from './Task.svelte';
</script>

<div class="flex flex-col gap-2 p-4 pb-6">
	<label class="label">
		<span>Search by title</span>
		<input
			class="input input-sm"
			type="text"
			bind:value={tasksQs.filters.title}
			placeholder="Search title..."
		/>
	</label>
	<label class="label">
		<span>Search by description</span>
		<input
			class="input input-sm"
			type="text"
			bind:value={tasksQs.filters.description}
			placeholder="Search description..."
		/>
	</label>
	<label class="label">
		<span>Completed only?</span>
		<input
			class="checkbox checkbox-sm"
			type="checkbox"
			bind:checked={tasksQs.filters.completedOnly}
		/>
	</label>
</div>

<div class="px-4">
	{#await tasksQs.response.value}
		<div class="loading">Loading...</div>
	{:then data}
		{#if data.tasks && data.tasks.length > 0}
			{#each data.tasks as task}
				<Task {task} />
			{/each}
		{:else}
			<div>No tasks found</div>
		{/if}
	{/await}
</div>
