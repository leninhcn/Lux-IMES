<template>
	<div class="app-container">
		<el-row>
			<el-col :span="24">
				<el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect">
					<el-sub-menu index="1">
						<template #title>菜单</template>
						<el-menu-item index="1-1">站点配置</el-menu-item>
						<el-menu-item index="1-2">查看日志</el-menu-item>
					</el-sub-menu>
				</el-menu>
			</el-col>
		</el-row>
		<el-row>
			<el-col :span="12">
				<div style="height:150px;border: 1px solid #ccc;padding:10px;margin:0px;" />
			</el-col>
			<el-col :span="12">
				<div style="height:150px;border: 1px solid #ccc;padding:10px;margin:0px;" />
			</el-col>
		</el-row>
		<el-row>
			<el-col :span="12">
				<div style="height:150px;border: 1px solid #ccc;padding:10px;margin:0px;" />
			</el-col>
			<el-col :span="12">
				<div style="height:150px;border: 1px solid #ccc;padding:10px;margin:0px;" />
			</el-col>
		</el-row>
		<el-row>
			<el-col :span="24">
				<div style="height:100px;border: 1px solid #ccc;padding:10px;margin-top:10px;" />
			</el-col>
		</el-row>
	</div>
</template>

<script setup>

</script>