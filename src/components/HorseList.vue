<script setup>
import { useStore } from 'vuex'
import { computed } from 'vue'

const store = useStore()

const horses = computed(() => store.state.horses)

</script>

<template>
	<el-table :data="horses" height="100%" size="small" stripe>
		<el-table-column prop="id" label="#" width="48"/>
		<el-table-column prop="name" label="Name" />
		<el-table-column prop="condition" label="Cond." width="80"/>
	</el-table>
</template>

<style scoped>
</style>
