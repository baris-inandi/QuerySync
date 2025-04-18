<script lang="ts">
	import { page } from "$app/state";
	import { onMount } from "svelte";
	import Task from "./Task.svelte";
	import { tasksQs } from "./tasksQs.svelte";

	onMount(tasksQs.onMount(page.params.querysync));
</script>

<form class="flex gap-4 p-4 pb-6">
	<label class="label">
		<span>Search by title</span>
		<input class="input input-sm" type="text" bind:value={tasksQs.filters.title} placeholder="Search title..." />
	</label>
	<label class="label">
		<span>Search by description</span>
		<input class="input input-sm" type="text" bind:value={tasksQs.filters.description} placeholder="Search description..." />
	</label>
	<label class="label">
		<span>Completed only?</span>
		<input class="checkbox checkbox-sm" type="checkbox" bind:checked={tasksQs.filters.completedOnly} />
	</label>
	<button class="btn btn-primary" type="submit" onclick={tasksQs.commit()}>Search</button>
</form>

<div class="px-4">
	{#await tasksQs.response}
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
