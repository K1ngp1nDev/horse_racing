<script setup>
import { useStore } from 'vuex'
import { computed, reactive, watch, onUnmounted } from 'vue'
import HorseIcon from './HorseIcon.vue'
import RoundSummary from "@/components/RoundSummary.vue";

const store = useStore()
const activeRound = computed(() => store.getters.activeRound)
const running = computed(() => store.state.status === 'running')
const times = computed(() => store.state.runningTimes)

const progress = reactive({})
let rafId = null
let startTs = null

watch([activeRound, running], ([rnd, run]) => {
	if (rnd) {
		rnd.horses.forEach(h => progress[h.id] = 0)
	}
	if (run) {
		startTs = performance.now()
		tick()
	} else {
		cancelFrame()
		if (rnd) rnd.horses.forEach(h => progress[h.id] = 0)
	}
})

function tick() {
	const now = performance.now()
	const elapsed = now - startTs
	const rnd = activeRound.value
	if (!rnd) return
	
	let allDone = true
	rnd.horses.forEach(h => {
		const dur = (times.value[h.id] || 0) * 1000
		if (dur > 0) {
			const p = Math.min(elapsed / dur, 1)
			progress[h.id] = p
			if (p < 1) allDone = false
		} else {
			progress[h.id] = 0
			allDone = false
		}
	})
	
	if (!allDone && running.value) {
		rafId = requestAnimationFrame(tick)
	}
}

function cancelFrame() {
	if (rafId != null) {
		cancelAnimationFrame(rafId)
		rafId = null
	}
}

onUnmounted(cancelFrame)

const clampedLeft = id => {
	const p = progress[id] ?? 0
	const pct = Math.min(98, Math.max(2, p * 100))
	return `${pct.toFixed(2)}%`
}
</script>

<template>
	<div v-if="activeRound" class="track-container">
		<div class="track">
			<div v-for="horse in activeRound.horses" :key="horse.id" class="lane">
				<div class="horse-wrapper">
					<HorseIcon
						class="horse"
						:style="{ color: horse.color, left: clampedLeft(horse.id) }"
					/>
				</div>
			</div>
		</div>
		
		<RoundSummary/>
	</div>
	
	<p v-else class="empty">Press «Generate Program»</p>
</template>

<style scoped>
.track-container {
	position: relative;
	padding: 8px;
}
.track {
	position: relative;
	height: 320px;
	border-left: 4px solid #67c23a;
	border-right: 4px solid #f56c6c;
}
.lane {
	position: relative;
	height: calc(100% / 10);
	border-bottom: 1px dashed #dcdfe6;
}
.horse-wrapper {
	position: relative;
	width: 100%;
	height: 100%;
}
.horse {
	position: absolute;
	top: 50%;
	transform: translate(-50%, -50%);
	width: 32px; height: 32px;
	transition: left 0.1s linear;
}
footer {
	text-align: center;
	margin: 12px 0;
	font-weight: 600;
}
.empty {
	text-align: center;
	color: #909399;
}
</style>
