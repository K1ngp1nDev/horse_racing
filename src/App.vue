<template>
	<main class="container">
		<GeneratePanel />
		<div class="layout">
			<HorseList class="side" />
			<RaceTrack class="center" />
			<ResultsPanel class="side" />
		</div>
	</main>
</template>

<script setup>
import GeneratePanel from './components/GeneratePanel.vue'
import HorseList from './components/HorseList.vue'
import RaceTrack from './components/RaceTrack.vue'
import ResultsPanel from './components/ResultsPanel.vue'
</script>

<style scoped>
.container {
	padding: 2rem;
}
.layout {
	display: grid;
	grid-template-columns: 0.5fr 2fr 0.5fr;
	gap: 1rem;
}
.side {
	overflow-y: auto;
}
.center {
	border: 1px solid #ccc;
}
</style>
