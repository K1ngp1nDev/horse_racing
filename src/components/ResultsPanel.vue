<template>
	<section>
		<h2>Results</h2>
		
		<el-empty v-if="allEmpty" description="No results yet"/>
		
		<div v-if="activeRound && liveResults.length" class="round live">
			<h3>{{ activeRound.name }} <small>(live)</small></h3>
			<el-table :data="liveResults" size="small" style="margin-bottom:8px;">
				<el-table-column type="index" label="Pos." width="60"/>
				<el-table-column prop="horse.name" label="Horse"/>
				<el-table-column prop="time" label="Time (s)" width="100"/>
			</el-table>
		</div>
		
		<el-collapse v-if="completedResults.length">
			<el-collapse-item
				v-for="row in completedResults"
				:key="row.round"
				:title="row.round"
			>
				<el-table :data="row.results" size="small">
					<el-table-column type="index" label="Pos." width="60"/>
					<el-table-column prop="horse.name" label="Horse"/>
					<el-table-column prop="time" label="Time (s)" width="100"/>
				</el-table>
			</el-collapse-item>
		</el-collapse>
	</section>
</template>

<script setup>
import { useStore } from 'vuex'
import { computed } from 'vue'

const store = useStore()
const rows = computed(() => store.state.results)
const liveResults = computed(() => store.state.liveRoundResults)
const activeRound = computed(() => store.getters.activeRound)

const completedResults = rows
const allEmpty = computed(() => {
	return completedResults.value.length === 0 && liveResults.value.length === 0
})
</script>

<style scoped>
.round {
	margin-bottom: 1rem;
}
.live h3 {
	color: #409eff;
}
</style>
