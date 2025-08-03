<script setup>
import { useStore } from 'vuex'
import { computed } from 'vue'

const store = useStore()
const busy = computed(() => store.state.status === 'running')
const hasSchedule = computed(() => store.state.schedule.length === 6)

function generate () {
	store.dispatch('initGame')
	store.dispatch('generateProgram')
}

function start () {
	store.dispatch('startRace')
}
</script>

<template>
	<el-card class="panel">
		<div class="header">
			<h1 class="title">Horse Racing Game Trial Day</h1>
			<div class="panel-buttons">
				<el-button type="primary" @click="generate" :loading="busy">Generate Program</el-button>
				<el-button type="success" @click="start" :loading="busy" :disabled="!hasSchedule">Start Race</el-button>
			</div>
		</div>
	</el-card>
</template>

<style scoped>
.panel {
	padding: 8px 12px;
	margin-bottom: 8px;
}
.header {
	display: flex;
	align-items: center;
	gap: 1rem;
	flex-wrap: wrap;
}
.title {
	margin: 0;
	font-size: 1.5rem;
	flex: none;
}
.panel-buttons {
	display: flex;
	gap: 0.5rem;
	flex: none;
}
</style>
