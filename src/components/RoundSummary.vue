<script setup>
import { computed } from 'vue'
import { useStore } from 'vuex'
import HorseIcon from './HorseIcon.vue'

const HorseIconSmall = HorseIcon

const store = useStore()
const schedule = computed(() => store.state.schedule)
const results = computed(() => store.state.results)
const liveResults = computed(() => store.state.liveRoundResults)
const currentRoundIdx = computed(() => store.state.currentRound)

const top3From = arr => {
	if (!arr) return []
	return arr
		.slice()
		.sort((a, b) => a.time - b.time)
		.slice(0, 3)
}

const finishedTop3 = computed(() => {
	return schedule.value.map(r => {
		const finished = results.value.find(rr => rr.round === r.name)
		if (!finished) return []
		return top3From(finished.results)
	})
})

const liveTop3 = computed(() => {
	return top3From(liveResults.value)
})

const isActive = idx => {
	return currentRoundIdx.value === idx && store.state.status === 'running'
}

const allDone = computed(() => {
	return schedule.value.length === 6 && results.value.length === 6
})

const overallLeaders = computed(() => {
	if (!allDone.value) return []
	
	const scoreMap = {}
	results.value.forEach(r => {
		const sorted = r.results.slice().sort((a, b) => a.time - b.time)
		sorted.slice(0, 3).forEach((entry, idx) => {
			const pts = 3 - idx
			const id = entry.horse.id
			if (!scoreMap[id]) {
				scoreMap[id] = { horse: entry.horse, points: 0 }
			}
			scoreMap[id].points += pts
		})
	})
	
	return Object.values(scoreMap)
		.sort((a, b) => b.points - a.points)
		.slice(0, 3)
})
</script>

<template>
	<div class="summary-wrapper">
		<div class="round-grid">
			<div
				v-for="(round, idx) in schedule"
				:key="round.name"
				class="round-cell"
			>
				<div class="round-title">{{ round.name }}</div>
				
				<div class="top3-wrapper">
					<template v-if="isActive(idx) && liveTop3.length">
						<div class="mini-leaders">
							<div
								v-for="(entry, subIdx) in liveTop3"
								:key="entry.horse.id"
								class="mini-cell"
							>
								<div class="badge-wrapper">
									<el-badge :value="subIdx + 1" class="mini-badge" />
									<HorseIconSmall
										class="icon"
										:style="{ color: entry.horse.color }"
									/>
								</div>
								<div class="text">
									<div class="name">{{ entry.horse.name }}</div>
									<div class="time">{{ entry.time }}s</div>
								</div>
							</div>
						</div>
					</template>
					
					<template v-else-if="finishedTop3[idx] && finishedTop3[idx].length">
						<div class="mini-leaders">
							<div
								v-for="(entry, subIdx) in finishedTop3[idx]"
								:key="entry.horse.id"
								class="mini-cell"
							>
								<div class="badge-wrapper">
									<el-badge :value="subIdx + 1" class="mini-badge" />
									<HorseIconSmall
										class="icon"
										:style="{ color: entry.horse.color }"
									/>
								</div>
								<div class="text">
									<div class="name">{{ entry.horse.name }}</div>
									<div class="time">{{ entry.time }}s</div>
								</div>
							</div>
						</div>
					</template>
					
					<template v-else>
						<div class="placeholder">
							<div class="dash">—</div>
							<div class="sub">pending</div>
						</div>
					</template>
				</div>
			</div>
		</div>
		
		<div v-if="allDone" class="overall-top3">
			<el-card shadow="hover" class="overall-card">
				<div class="overall-header">
					<span class="trophy">🏆</span>
					<span class="label">Overall Top 3</span>
				</div>
				<div class="leaders">
					<div
						v-for="(entry, idx) in overallLeaders"
						:key="entry.horse.id"
						class="leader-item"
					>
						<div class="rank-badge">
							<el-badge :value="idx + 1" />
						</div>
						<HorseIconSmall
							class="leader-icon"
							:style="{ color: entry.horse.color }"
						/>
						<div class="desc">
							<div class="name">{{ entry.horse.name }}</div>
							<div class="points">{{ entry.points }} pts</div>
						</div>
					</div>
				</div>
			</el-card>
		</div>
	</div>
</template>

<style scoped>
.summary-wrapper {
	margin-top: 16px;
}
.round-grid {
	display: grid;
	grid-template-columns: repeat(3, 1fr);
	gap: 6px;
	margin-bottom: 16px;
}
.round-cell {
	background: #f5f7fa;
	border-radius: 8px;
	padding: 8px 12px;
	font-size: 0.75rem;
	display: flex;
	flex-direction: column;
	min-height: 60px;
	position: relative;
}
.round-title {
	font-weight: 600;
	margin-bottom: 4px;
}
.top3-wrapper {
	flex: 1;
	display: flex;
	align-items: center;
	justify-content: center;
}
.mini-leaders {
	display: flex;
	gap: 6px;
}
.mini-cell {
	background: #fff;
	border-radius: 6px;
	display: flex;
	align-items: center;
	gap: 6px;
	width: 85px;
	box-shadow: 0 1px 3px rgba(0,0,0,0.08);
}
.badge-wrapper {
	position: relative;
	display: flex;
	align-items: center;
}
.mini-badge {
	position: absolute;
	top: -6px;
	right: -6px;
}
.icon {
	width: 24px;
	height: 24px;
}
.text {
	display: flex;
	flex-direction: column;
}
.name {
	font-weight: 600;
}
.time {
	font-size: 0.65rem;
	color: #555;
}
.placeholder {
	flex: 1;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	color: #999;
}
.dash {
	font-size: 1.5rem;
	line-height: 1;
}
.sub {
	font-size: 0.55rem;
	margin-top: 4px;
	text-transform: uppercase;
	letter-spacing: 1px;
}
.overall-top3 {
	margin-top: 8px;
}
.overall-card {
	max-width: 720px;
	margin: 0 auto;
	padding: 12px 16px;
}
.overall-header {
	display: flex;
	align-items: center;
	gap: 6px;
	font-weight: 700;
	margin-bottom: 8px;
}
.trophy {
	font-size: 1.4rem;
}
.label {
	font-size: 1.1rem;
}
.leaders {
	display: flex;
	justify-content: center;
	gap: 32px;
}
.leader-item {
	display: flex;
	flex-direction: column;
	align-items: center;
	position: relative;
	background: #fff;
	padding: 8px;
	border-radius: 10px;
	min-width: 120px;
	box-shadow: 0 4px 12px rgba(0,0,0,0.08);
}
.rank-badge {
	position: absolute;
	top: -6px;
	right: -6px;
}
.leader-icon {
	width: 50px;
	height: 50px;
	margin-bottom: 4px;
}
.desc {
	text-align: center;
}
.points {
	font-size: 0.75rem;
	color: #444;
}
</style>
