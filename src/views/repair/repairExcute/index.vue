<template>
	<div class="app-container">
		<el-row>
			<el-col :span="20">
				<el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect">
					<el-sub-menu index="1">
						<template #title>菜单</template>
						<el-menu-item @click="stationConfig" index="1-1">站点配置</el-menu-item>
					</el-sub-menu>
				</el-menu>
			</el-col>
			<el-col :span="4">
				<el-text
					style="font-family:Arial, Helvetica, sans-serif;font-size:x-large;font-weight: 800;color: blue;">维修执行</el-text>
			</el-col>
		</el-row>
		<div style=" height: 50px; border: 1px solid #ccc;  background-color:RGB(255,255,192); padding: 10px; margin: 0px">
			<el-row :gutter="10">
				<el-col :span="2">
					<el-button type="info" @click="btnRepair">维修</el-button>
				</el-col>

				<el-col :span="2">
					<el-button type="info" @click="btnRemove">移除</el-button>
				</el-col>

				<el-col :span="2">
					<el-button type="info">替换</el-button>
				</el-col>

				<el-col :span="4">
					<el-button type="info" @click="btnErrPrfLC">防错料LC</el-button>
				</el-col>

				<el-col :span="2">
					<el-button type="success" @click="btnFinished">完成</el-button>
				</el-col>

				<el-col :span="2">
					<el-button type="danger" @click="btnScrap">报废</el-button>
				</el-col>
			</el-row>
		</div>
		<div
			style=" height: 50px; border: 1px solid #ccc;  background-color:RGB(185,198,191);  padding: 10px; margin-top: 20px">
			<el-form :model="executform" :rules="rules" ref="executeRef" label-width="40px">
				<el-row :gutter="20">
					<el-col :span="6">
						<el-form-item label="序号">
							<el-input v-model="executform.sn" placeholder="" clearable />
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label-width="auto" label="维修人员">
							<el-input v-model="executform.empno" placeholder="" clearable />
						</el-form-item>
					</el-col>

					<el-col :span="6">
						<el-input v-model="executform.empname" placeholder="" disabled />
					</el-col>
				</el-row>
			</el-form>

		</div>
		<div
			style=" height: 160px; border: 1px solid #ccc;  background-color:RGB(210,215,217); padding: 10px; margin-top: 20px">
			<el-form label-width="40px">
				<el-row :gutter="10">
					<el-col :span="6">
						<el-form-item label="工单">
							<el-input v-model="executform.wo" placeholder="" disabled />
						</el-form-item>
					</el-col>
					<el-col :span="6">
						<el-form-item label="不良线体" label-width="auto">
							<el-input v-model="executform.defectline" placeholder="" disabled />
						</el-form-item>
					</el-col>
				</el-row>
				<el-row :gutter="10">
					<el-col :span="6">
						<el-form-item label="料号">
							<el-input v-model="executform.ipn" placeholder="" disabled />
						</el-form-item>
					</el-col>
					<el-col :span="6">
						<el-form-item label="不良站点" label-width="auto">
							<el-input v-model="executform.defectprocess" placeholder="" disabled />
						</el-form-item>
					</el-col>
				</el-row>

				<el-row :gutter="10">
					<el-col :span="6">
						<el-form-item label="进维修时间" label-width="auto">
							<el-input v-model="executform.repairtime" placeholder="" disabled />
						</el-form-item>
					</el-col>
					<el-col :span="6">
						<el-form-item label="不良机台" label-width="auto">
							<el-input v-model="executform.defectterminal" placeholder="" disabled />
						</el-form-item>
					</el-col>
				</el-row>

			</el-form>
		</div>

		<div style=" height: 200px; border: 1px solid #ccc; padding: 10px; margin-top: 20px">
			<el-row :gutter="10">
				<el-col :span="10">
					<el-table :data="executform.defectinfo" border height="180px" style="width: 100%">
						<el-table-column prop="defectCode" label="不良代码" width="100" />
						<el-table-column prop="defectDesc1" label="不良描述1" width="200" />
						<el-table-column prop="defectDesc2" label="不良描述2" width="200" />
						<el-table-column prop="location" label="不良位置" width="100" />
					</el-table>
				</el-col>
				<el-col :span="14">
					<el-table :data="executform.defectreason" border height="180px" style="width: 100%">
						<el-table-column prop="reasonCode" label="原因编码" width="100" />
						<el-table-column prop="reasonDesc1" label="原因描述1" width="200" />
						<el-table-column prop="reasonDesc2" label="原因描述2" width="200" />
						<el-table-column prop="location" label="维修脚位" width="100" />
						<el-table-column prop="item" label="条目" width="150" />
						<el-table-column prop="vendorCode" label="供应商编码" width="100" />
						<el-table-column prop="repairMethod" label="维修方式" width="100" />
						<el-table-column prop="suggestScrap" label="建议报废" width="150" />
						<el-table-column prop="loadPicture" label="加载图片" width="150" />
						<el-table-column prop="reasonId" label="reasonId" width="100" />
						<el-table-column prop="remark" label="备注" width="300" />
					</el-table>
				</el-col>
			</el-row>
		</div>

		<div :style="msgstyle[0]">
			<el-text :style="msgstyle[1]">Message</el-text>
		</div>

		<!-- 添加站点设置对话框 -->
		<el-dialog title="站点设置" v-model="open1" width="800px" append-to-body>
			<el-form :model="stationsetupform" :rules="rules" ref="stationsetupRef" label-width="80px">
				<el-row>
					<el-col :lg="24">
						<div style="height: 50px; border: 1px solid #ccc; padding: 10px; margin: 0px">
							<el-row>
								<el-col :lg="8">
									<el-text>请选择工厂:</el-text>
								</el-col>
								<el-col :lg="8">
									<el-select v-model="stationsetupform.factory" placeholder="" clearable>
										<el-option v-for="item in stationsetupform.factoryOptions" :key="item.id"
											:label="item.name" :value="item.value"> </el-option>
									</el-select>
								</el-col>

								<el-col :lg="8">
									<el-text>{{ stationsetupform.factory }}</el-text>
								</el-col>
							</el-row>
						</div>
					</el-col>
				</el-row>

				<el-row>
					<el-col :lg="12">
						<div style="height: 300px; border: 1px solid #ccc; padding: 10px; margin-top: 20px">
							<el-tree :indent="20" class="tree-line" :data="stationOptions" :highlight-current="true"
								:expand-on-click-node="false" ref="stationTreeRef" @node-click="handleNodeClick" />
						</div>
					</el-col>

					<el-col :lg="12">
						<div style="height: 300px; border: 1px solid #ccc; padding: 10px; margin-top: 20px">
							<el-row>
								<el-col :lg="24">
									<el-form-item label="Line" prop="Line">
										<el-input v-model="stationsetupform.Line" disabled placeholder="" />
									</el-form-item>
								</el-col>

								<el-col :lg="24">
									<el-form-item label="Stage" prop="Stage">
										<el-input v-model="stationsetupform.Stage" disabled placeholder="" />
									</el-form-item>
								</el-col>

								<el-col :lg="24">
									<el-form-item label="StationType" prop="StationType">
										<el-input v-model="stationsetupform.StationType" disabled placeholder="" />
									</el-form-item>
								</el-col>

								<el-col :lg="24">
									<el-form-item label="Terminal" prop="Station">
										<el-input v-model="stationsetupform.Station" disabled placeholder="" />
									</el-form-item>
								</el-col>
							</el-row>
						</div>
					</el-col>
				</el-row>
			</el-form>
			<template #footer>
				<el-button text @click="cancel('open1')">{{ $t('btn.cancel') }}</el-button>
				<el-button type="primary" @click="submitForm('open1')">{{ $t('btn.submit') }}</el-button>
			</template>
		</el-dialog>




		<!-- 添加维修对话框 -->
		<el-dialog title="维修" v-model="open2" width="1000px" append-to-body>
			<el-form :model="repairform" :rules="rules" ref="repairRef" label-width="80px">
				<div style="height: 250px; border: 1px solid #ccc; padding: 10px; margin: 0px">
					<el-row>
						<el-col :lg="8">
							<el-form-item label="序号" prop="sn" label-width="auto">
								<el-input v-model="repairform.sn" disabled placeholder="" />
							</el-form-item>
						</el-col>
						<el-col :lg="8">
							<el-form-item label="不良站点" prop="defectprocess">
								<el-input v-model="repairform.defectprocess" disabled placeholder="" />
							</el-form-item>
						</el-col>
						<el-col :lg="8">
							<el-form-item label="不良机台" prop="defectterminal">
								<el-input v-model="repairform.defectterminal" disabled placeholder="" />
							</el-form-item>
						</el-col>
					</el-row>
					<el-row>
						<el-col :lg="6">
							<el-form-item label="不良代码" prop="defectcode" label-width="auto">
								<el-input v-model="repairform.defectcode" disabled placeholder="" />
							</el-form-item>
						</el-col>
						<el-col :lg="6">
							<el-form-item label="不良描述1" prop="defectdesc1">
								<el-input v-model="repairform.defectdesc1" disabled placeholder="" />
							</el-form-item>
						</el-col>
						<el-col :lg="6">
							<el-form-item label="不良描述2" prop="defectdesc2">
								<el-input v-model="repairform.defectdesc1" disabled placeholder="" />
							</el-form-item>
						</el-col>
						<el-col :lg="6">
							<el-form-item label="备注" prop="remark">
								<el-input v-model="repairform.remark" type="textarea" placeholder="" clearable />
							</el-form-item>
						</el-col>
					</el-row>

					<el-row>
						<el-col :lg="6">
							<el-form-item label="原因类型" prop="reasontype" label-width="auto">
								<el-select v-model="repairform.reasontype" placeholder="" clearable>
									<el-option v-for="item in repairform.reasontypeOptions" :key="item.id"
										:label="item.name" :value="item.value" />
								</el-select>
							</el-form-item>
						</el-col>
					</el-row>
					<el-row :gutter="10">
						<el-col :lg="4">
							<el-form-item label="不良原因" prop="reason" label-width="auto">
								<el-input v-model="repairform.reason" placeholder="" clearable />
							</el-form-item>
						</el-col>
						<el-col :lg="2">
							<el-button>&uml;</el-button>
						</el-col>
						<el-col :lg="6">
							<el-form-item label="原因描述1" prop="reasondesc1" label-width="auto">
								<el-input v-model="repairform.reasondesc1" placeholder="" clearable />
							</el-form-item>
						</el-col>
						<el-col :lg="6">
							<el-form-item label="原因描述2" prop="reasondesc2" label-width="auto">
								<el-input v-model="repairform.reasondesc2" placeholder="" clearable />
							</el-form-item>
						</el-col>

						<el-col :lg="6">
							<el-form-item label="不良症状" prop="symptom">
								<el-input v-model="repairform.symptom" type="textarea" placeholder="" clearable />
							</el-form-item>
						</el-col>
					</el-row>
				</div>

				<div style="height: 250px; border: 1px solid #ccc; padding: 10px; margin-top: 20px">
					<el-row :gutter="10">
						<el-col :lg="6">
							<el-form-item label="验证行为" prop="actionvalidate" label-width="auto">
								<el-select v-model="repairform.actionvalidate" placeholder="" clearable>
									<el-option v-for="item in repairform.actionvalidateOptions" :key="item.id"
										:label="item.name" :value="item.value" />
								</el-select>
							</el-form-item>
						</el-col>

						<el-col :lg="6">
							<el-form-item label="脚位" prop="location" label-width="auto">
								<el-select v-model="repairform.location" placeholder="" clearable>
									<el-option v-for="item in repairform.locationOptions" :key="item.id" :label="item.name"
										:value="item.value" />
								</el-select>
							</el-form-item>
						</el-col>

						<el-col :lg="6">
							<el-form-item label="维修动作" prop="repairaction" label-width="auto">
								<el-input v-model="repairform.repairaction" placeholder="" clearable />
							</el-form-item>
						</el-col>
					</el-row>
					<el-row :gutter="10">
						<el-col :lg="6">
							<el-form-item label="OldCSN" prop="oldcsn" label-width="auto">
								<el-input v-model="repairform.oldcsn" placeholder="" clearable />
							</el-form-item>
						</el-col>

						<el-col :lg="6">
							<el-form-item label="OldCPN" prop="oldcpn" label-width="auto">
								<el-input v-model="repairform.oldcpn" placeholder="" clearable />
							</el-form-item>
						</el-col>

						<el-col :lg="6">
							<el-form-item label="OldDateCode" prop="olddatecode" label-width="auto">
								<el-input v-model="repairform.olddatecode" placeholder="" clearable />
							</el-form-item>
						</el-col>

						<el-col :lg="6">
							<el-form-item label="OldLotCode" prop="oldlotcode" label-width="auto">
								<el-input v-model="repairform.oldlotcode" placeholder="" clearable />
							</el-form-item>
						</el-col>

					</el-row>

					<el-row :gutter="10">
						<el-col :lg="6">
							<el-form-item label="OldVendor" prop="oldvendor" label-width="auto">
								<el-input v-model="repairform.oldvendor" placeholder="" clearable />
							</el-form-item>
						</el-col>
						<el-col :lg="6">
							<el-form-item label="OldReelId" prop="oldreelid" label-width="auto">
								<el-input v-model="repairform.oldreelid" placeholder="" clearable />
							</el-form-item>
						</el-col>

						<el-col :lg="6">
							<el-button>添加条目</el-button>
						</el-col>
					</el-row>

					<el-row :gutter="10">
						<el-col :lg="6">
							<el-form-item label="NewCSN" prop="newcsn" label-width="auto">
								<el-input v-model="repairform.newcsn" placeholder="" clearable />
							</el-form-item>
						</el-col>

						<el-col :lg="6">
							<el-form-item label="NewCPN" prop="newcpn" label-width="auto">
								<el-input v-model="repairform.newcpn" placeholder="" clearable />
							</el-form-item>
						</el-col>

						<el-col :lg="6">
							<el-form-item label="NewDateCode" prop="newdatecode" label-width="auto">
								<el-input v-model="repairform.newdatecode" placeholder="" clearable />
							</el-form-item>
						</el-col>

						<el-col :lg="6">
							<el-form-item label="NewLotCode" prop="newlotcode" label-width="auto">
								<el-input v-model="repairform.newlotcode" placeholder="" clearable />
							</el-form-item>
						</el-col>

					</el-row>

					<el-row :gutter="10">
						<el-col :lg="6">
							<el-form-item label="NewVendor" prop="newvendor" label-width="auto">
								<el-input v-model="repairform.newvendor" placeholder="" clearable />
							</el-form-item>
						</el-col>
						<el-col :lg="6">
							<el-form-item label="NewReelId" prop="newreelid" label-width="auto">
								<el-input v-model="repairform.newreelid" placeholder="" clearable />
							</el-form-item>
						</el-col>

					</el-row>
				</div>

				<div style="height: 250px; border: 1px solid #ccc; padding: 0px; margin-top: 20px">
					<el-row :gutter="10">
						<el-col :lg="24">
							<el-table :data="repairform.repairdata" border height="250px" style="width: 100%">
								<el-table-column label="移除">
									<template #default="scope">
										<el-button size="small" type="danger"
											@click="handleRemove(scope.$index, scope.row)">
											Remove
										</el-button>
									</template>
								</el-table-column>
								<el-table-column prop="action" label="Action" width="100" />
								<el-table-column prop="location" label="维修脚位" width="100" />
								<el-table-column prop="oldcsn" label="OldCSN" width="120" />
								<el-table-column prop="oldcpn" label="OldCPN" width="120" />
								<el-table-column prop="olddatecode" label="OldDateCode" width="120" />
								<el-table-column prop="oldlotcode" label="OldLotCode" width="120" />
								<el-table-column prop="oldvendor" label="OldVendor" width="100" />
								<el-table-column prop="oldreelid" label="OldReelId" width="120" />

								<el-table-column prop="newcsn" label="NewCSN" width="120" />
								<el-table-column prop="newcpn" label="NewCPN" width="120" />
								<el-table-column prop="newdatecode" label="NewDateCode" width="120" />
								<el-table-column prop="newlotcode" label="NewLotCode" width="120" />
								<el-table-column prop="newvendor" label="NewVendor" width="120" />
								<el-table-column prop="newreelid" label="NewReelId" width="120" />
								<el-table-column prop="remark" label="备注" width="300" />
							</el-table>
						</el-col>
					</el-row>
				</div>
			</el-form>
			<template #footer>
				<el-button text @click="cancel('open2')">{{ $t('btn.cancel') }}</el-button>
				<el-button type="primary" @click="submitForm('open2')">{{ $t('btn.submit') }}</el-button>
			</template>
		</el-dialog>

		<!-- 更换Keyparts元件对话框 -->
		<el-dialog title="更换Keyparts" v-model="open3" width="1100px" append-to-body>
			<el-form :model="keypartsform" :rules="rules" ref="keypartsRef" label-width="80px">
				<div style="height: 60px; border: 1px solid #ccc; padding: 10px; margin: 0px">
					<el-row :gutter="10">
						<el-col :lg="8">
							<el-form-item label="Serial Number:" prop="sn" label-width="auto">
								<el-input v-model="keypartsform.sn" placeholder="" disabled />
							</el-form-item>
						</el-col>
					</el-row>
				</div>
				<div style="height: 150px; border: 1px solid #ccc; padding: 0px; margin-top: 20px">
					<el-row>
						<el-col :lg="24">
							<el-table :data="keypartsform.lvkpdata" border height="150px" style="width: 100%">
								<el-table-column prop="itempart" label="ItemPart" width="100" />
								<el-table-column prop="itemsn" label="ItemSN" width="150" />
								<el-table-column prop="itemgroup" label="ItemGroup" width="150" />
								<el-table-column prop="itemcsn" label="ItemCSN" width="150" />
								<el-table-column prop="wo" label="WO" width="120" />
								<el-table-column prop="stationtype" label="StationType" width="110" />
								<el-table-column prop="parttype" label="PartType" width="100" />
							</el-table>
						</el-col>
					</el-row>
				</div>

				<div style="height: 280px; border: 1px solid #ccc; padding-top: 5px; margin-top: 20px">
					<el-row :gutter="10">
						<el-col :lg="12">
							<div style="height: 50px; border: 1px solid #ccc; padding: 5px; margin: 10px">
								<el-row>
									<el-col :lg="14">
										<el-form-item label="New KPSN:" prop="newkpsn" label-width="auto">
											<el-input v-model="keypartsform.newkpsn" placeholder="" clearable />
										</el-form-item>
									</el-col>
									<el-col :lg="10">
										<el-form-item label="New RID:" prop="newrid" label-width="auto">
											<el-input v-model="keypartsform.newrid" placeholder="" clearable />
										</el-form-item>
									</el-col>
								</el-row>
							</div>
							<div style="height: 100px; border: 1px solid #ccc; padding: 0px; margin: 10px">
								<el-row>
									<el-col :lg="24">
										<el-table :data="keypartsform.newkpinfo" border height="100px" style="width: 100%">
											<el-table-column prop="parttype" label="PartType" width="100" />
											<el-table-column prop="inputvalue" label="InputValue" width="150" />
											<el-table-column prop="rid" label="RID" width="150" />
											<el-table-column prop="lot" label="L/C" width="80" />
											<el-table-column prop="datecode" label="D/C" width="80" />
											<el-table-column prop="vendor" label="Vendor" width="150" />
										</el-table>
									</el-col>
								</el-row>
							</div>
							<div style="height: 80px; border: 1px solid #ccc; padding: 5px; margin: 10px">
								<el-row>
									<el-col :lg="24">
										<el-form-item label="备注:" prop="remark" label-width="auto">
											<el-input v-model="keypartsform.remark" type="textarea" placeholder=""
												clearable />
										</el-form-item>
									</el-col>
								</el-row>
							</div>
						</el-col>
						<el-col :lg="12">
							<div style="height: 50px; border: 1px solid #ccc; padding: 5px; margin: 10px">
								<el-row :gutter="10">
									<el-col :lg="12">
										<el-form-item label="Broken?" prop="isbroken" label-width="auto">
											<el-radio-group v-model="keypartsform.oldkpstatus">
												<el-radio v-for="item in keypartsform.oldkpstatusOptions"
													:label="item.value" size="large">
													{{ item.label }}
												</el-radio>
											</el-radio-group>
										</el-form-item>
									</el-col>
									<el-col :lg="12">
										<el-form-item label="Defect Code" prop="defectcode" label-width="auto">
											<el-input v-model="keypartsform.defectcode" placeholder="" clearable />
										</el-form-item>
									</el-col>
								</el-row>
							</div>
							<div style="height: 190px; border: 1px solid #ccc; padding: 0px; margin: 10px">
								<el-row>
									<el-col :lg="24">
										<el-table :data="keypartsform.oldkpinfo" border height="190px" style="width: 100%">
											<el-table-column prop="id" label="ID" width="50" />
											<el-table-column prop="defectcode" label="DefectCode" width="150" />
											<el-table-column prop="description" label="Description" width="500" />
										</el-table>
									</el-col>
								</el-row>
							</div>
						</el-col>
					</el-row>
				</div>

			</el-form>
			<template #footer>
				<el-button text @click="cancel('open3')">{{ $t('btn.cancel') }}</el-button>
				<el-button type="primary" @click="submitForm('open3')">{{ $t('btn.submit') }}</el-button>
			</template>
		</el-dialog>

		<!--防错料LC对话框 -->
		<el-dialog title="防错料LC" v-model="open4" width="1100px" append-to-body>
			<el-form :model="errprfmaterialform" :rules="rules" ref="errprfmaterialRef" label-width="80px">
				<div style="height: 250px; border: 1px solid #ccc; padding-top: 5px; margin: 0px">
					<el-row :gutter="10">
						<el-col :lg="6">
							<el-form-item label="Panel No" prop="panelno" label-width="auto">
								<el-input v-model="errprfmaterialform.panelno" placeholder="" disabled />
							</el-form-item>
						</el-col>

						<el-col :lg="6">
							<el-form-item label="SN数量" prop="sncount" label-width="auto">
								<el-input v-model="errprfmaterialform.sncount" placeholder="" disabled />
							</el-form-item>
						</el-col>

						<el-col :lg="6">
							<el-form-item label="Station" prop="station" label-width="auto">
								<el-select v-model="errprfmaterialform.station" placeholder="">
									<el-option v-for="item in errprfmaterialform.stationOptions" :key="item.id"
										:label="item.name" :value="item.value" />
								</el-select>
							</el-form-item>
						</el-col>

						<el-col :lg="6">
							<el-form-item label="备注" prop="remark" label-width="auto">
								<el-input v-model="errprfmaterialform.remark" type="textarea" placeholder="" />
							</el-form-item>
						</el-col>
					</el-row>

					<el-row :gutter="10">
						<el-col :lg="6">
							<el-form-item label="序号" prop="sn" label-width="auto">
								<el-input v-model="errprfmaterialform.sn" placeholder="" disabled />
							</el-form-item>
						</el-col>
						<el-col :lg="6">
							<el-form-item label="不良站点" prop="defectprocess" label-width="auto">
								<el-input v-model="errprfmaterialform.defectprocess" placeholder="" disabled />
							</el-form-item>
						</el-col>

						<el-col :lg="6">

						</el-col>

						<el-col :lg="6">
							<el-form-item label="不良症状" prop="defectsymptom" label-width="auto">
								<el-input v-model="errprfmaterialform.defectsymptom" type="textarea" placeholder="" />
							</el-form-item>
						</el-col>
					</el-row>

					<el-row :gutter="10">
						<el-col :lg="6">
							<el-form-item label="不良代码" prop="defectcode" label-width="auto">
								<el-input v-model="errprfmaterialform.defectcode" placeholder="" disabled />
							</el-form-item>
						</el-col>
						<el-col :lg="6">
							<el-form-item label="不良描述1" prop="defectdesc1" label-width="auto">
								<el-input v-model="errprfmaterialform.defectdesc1" placeholder="" disabled />
							</el-form-item>
						</el-col>
						<el-col :lg="6">
							<el-form-item label="不良描述2" prop="defectdesc2" label-width="auto">
								<el-input v-model="errprfmaterialform.defectdesc2" placeholder="" disabled />
							</el-form-item>
						</el-col>

						<el-col :lg="6">
							<el-form-item label="原因类型" prop="reasontype" label-width="auto">
								<el-select v-model="errprfmaterialform.reasontype" placeholder="" clearable>
									<el-option v-for="item in errprfmaterialform.reasontypeOptions" :key="item.id"
										:label="item.name" :value="item.value" />
								</el-select>
							</el-form-item>
						</el-col>
					</el-row>

					<el-row :gutter="10">
						<el-col :lg="6">
							<el-form-item label="不良原因" prop="reason" label-width="auto">
								<el-input v-model="errprfmaterialform.reason" placeholder="" clearable />
							</el-form-item>
						</el-col>
						<el-col :lg="2">
							<el-button>&uml;</el-button>
						</el-col>

						<el-col :lg="6">
							<el-form-item label="原因描述1" prop="reasondesc1" label-width="auto">
								<el-input v-model="errprfmaterialform.reasondesc1" placeholder="" clearable />
							</el-form-item>
						</el-col>

						<el-col :lg="6">
							<el-form-item label="原因描述2" prop="reasondesc2" label-width="auto">
								<el-input v-model="errprfmaterialform.reasondesc2" placeholder="" clearable />
							</el-form-item>
						</el-col>
					</el-row>

				</div>
				<div style="height: 380px; border: 1px solid #ccc; padding: 0px; margin-top: 20px">
					<div style="height: 150px; border: 1px solid #ccc; padding: 5px; margin: 10px">
						<el-row :gutter="10">
							<el-col :lg="6">
								<el-form-item label="Old PartNo" prop="oldpartno" label-width="auto">
									<el-input v-model="errprfmaterialform.oldpartno" placeholder="" clearable />
								</el-form-item>
							</el-col>

						</el-row>

						<el-row :gutter="10">
							<el-col :lg="6">
								<el-form-item label="New PartNo" prop="newpartno" label-width="auto">
									<el-input v-model="errprfmaterialform.newpartno" placeholder="" clearable />
								</el-form-item>
							</el-col>

						</el-row>

						<el-row :gutter="10">
							<el-col :lg="6">
								<el-form-item label="New ReelNo" prop="newreelno" label-width="auto">
									<el-input v-model="errprfmaterialform.newreelno" placeholder="" clearable />
								</el-form-item>
							</el-col>

							<el-col :lg="6">
								<el-form-item label="New DateCode" prop="newdatecode" label-width="auto">
									<el-input v-model="errprfmaterialform.newdatecode" placeholder="" clearable />
								</el-form-item>
							</el-col>

							<el-col :lg="6">
								<el-form-item label="New LotCode" prop="newlotcode" label-width="auto">
									<el-input v-model="errprfmaterialform.newlotcode" placeholder="" clearable />
								</el-form-item>
							</el-col>

							<el-col :lg="6">
								<el-button>Add&nbsp;Item</el-button>
							</el-col>
						</el-row>
					</div>
					<div style="height: 200px; border: 1px solid #ccc; padding: 0px; margin: 10px">
						<el-row>
							<el-col :lg="24">
								<el-table :data="errprfmaterialform.errprfinfo" border height="190px" style="width: 100%">
									<el-table-column label="移除">
										<template #default="scope">
											<el-button size="small" type="danger"
												@click="handleRemove(scope.$index, scope.row)">
												Remove
											</el-button>
										</template>
									</el-table-column>
									<el-table-column prop="oldpartno" label="Old PartNo" width="150" />
									<el-table-column prop="newpartno" label="newpartno" width="150" />
									<el-table-column prop="newreelno" label="New ReelNo" width="150" />
									<el-table-column prop="newdatecode" label="New DateCode" width="150" />
									<el-table-column prop="newlotcode" label="New LotCode" width="150" />
								</el-table>
							</el-col>
						</el-row>
					</div>
				</div>
			</el-form>
			<template #footer>
				<el-button text @click="cancel('open4')">{{ $t('btn.cancel') }}</el-button>
				<el-button type="primary" @click="submitForm('open4')">{{ $t('btn.submit') }}</el-button>
			</template>
		</el-dialog>

		<!--回流站点设置对话框 -->
		<el-dialog title="回流站点设置" v-model="open5" width="500px" append-to-body>
			<el-form :model="reflowprocessform" :rules="rules" ref="reflowprocessRef" label-width="80px">
				<div style="height: 50px; border: 1px solid #ccc; padding: 6px; margin: 0px">
					<el-row>
						<el-col :lg="24">
							<el-form-item label="回流站点" prop="reflowstation" label-width="auto">
								<el-select v-model="reflowprocessform.reflowstation" placeholder="" clearable>
									<el-option v-for="item in reflowprocessform.reflowstationOptions" :key="item.id"
										:label="item.name" :value="item.value" />
								</el-select>
							</el-form-item>
						</el-col>
					</el-row>
				</div>
			</el-form>
			<template #footer>
				<el-button text @click="cancel('open5')">{{ $t('btn.cancel') }}</el-button>
				<el-button type="primary" @click="submitForm('open5')">{{ $t('btn.submit') }}</el-button>
			</template>
		</el-dialog>

		<!--报废对话框 -->
		<el-dialog title="报废" v-model="open6" width="500px" append-to-body>
			<el-form :model="scrapform" :rules="rules" ref="scrapRef" label-width="80px">
				<div style="height: 50px; border: 1px solid #ccc; padding: 5px; margin: 0px">
					<el-row>
						<el-col :lg="24">
							<el-form-item label="Serial Number" prop="sn" label-width="auto">
								<el-input v-model="scrapform.sn" placeholder="" disabled />
							</el-form-item>
						</el-col>
					</el-row>
				</div>
				<div style="height: 140px; border: 1px solid #ccc; padding: 5px; margin-top: 5px">
					<el-row>
						<el-col :lg="20">
							<el-form-item label="Memo" prop="memo" label-width="auto">
								<el-input v-model="scrapform.memo" type="textarea" placeholder="" clearable />
							</el-form-item>
						</el-col>
					</el-row>
					<el-row>
						<el-col :lg="20">
							<el-form-item label="Treatment" prop="treatment" label-width="auto">
								<el-radio-group v-model="scrapform.treatment">
									<el-radio v-for="item in scrapform.treatmentOptions" :label="item.value" size="large">
										{{ item.label }}
									</el-radio>
								</el-radio-group>
							</el-form-item>
						</el-col>


					</el-row>
				</div>

			</el-form>

			<template #footer>
				<el-button text @click="cancel('open6')">{{ $t('btn.cancel') }}</el-button>
				<el-button type="primary" @click="submitForm('open6')">{{ $t('btn.submit') }}</el-button>
			</template>

		</el-dialog>

	</div>
</template>
<script setup>
const { proxy } = getCurrentInstance()
const open1 = ref(false)
const open2 = ref(false)
const open3 = ref(false)
const open4 = ref(false)
const open5 = ref(false)
const open6 = ref(false)
const executform = ref({
	sn: ''
	, empno: ''
	, empname: ''
	, wo: ''
	, defectline: ''
	, ipn: ''
	, defectprocess: ''
	, repairtime: ''
	, defectterminal: ''
	, remark: ''
})

const stationsetupform = ref({
	factory: ''
	, factoryOptions: [{ id: 1, name: 'LKKS', value: 'LKKS' }]
	, Line: ''
	, Stage: ''
	, StationType: ''
	, Station: ''
})



const repairform = ref({
	sn: ''
	, defectprocess: ''
	, defectterminal: ''
	, defectcode: ''
	, defectdesc1: ''
	, defectdesc2: ''
	, reasontype: ''
	, reasontypeOptions: [{ id: 1, name: '材料问题', value: 'materialissue' }
		, { id: 2, name: '组装问题', value: 'assemblyissue' }
		, { id: 3, name: 'SMT制程问题', value: 'SMTProcessissue' }
		, { id: 4, name: '设备问题', value: 'equipmentissue' }
		, { id: 5, name: '软件问题', value: 'softwareissue' }
		, { id: 6, name: '设计问题', value: 'designissue' }
		, { id: 7, name: '接触问题', value: 'contactissue' }
		, { id: 8, name: 'NTF', value: 'NTF' }
		, { id: 9, name: '其他', value: 'others' }
	]
	, reason: ''
	, reasondesc1: ''
	, reasondesc2: ''

	, actionvalidate: ''
	, actionvalidateOptions: [{ id: 1, name: '仅重新测试', value: 'justretest' }
		, { id: 2, name: '交叉验证', value: 'crossvalidation' }
		, { id: 3, name: '重新焊接', value: 'rewelding' }
		, { id: 4, name: '报废', value: 'scrap' }
		, { id: 5, name: 'SMT物料更换', value: 'componentreplacement' }
		, { id: 6, name: 'KEYPARTSN替换', value: 'keypartreplacement' }
	]
	, location: ''
	, locationOptions: []
	, repairaction: ''
	, oldcsn: ''
	, oldcpn: ''
	, olddatecode: ''
	, oldlotcode: ''
	, oldvendor: ''
	, oldreelid: ''

	, newcsn: ''
	, newcpn: ''
	, newdatecode: ''
	, newlotcode: ''
	, newvendor: ''
	, newreelid: ''

	, repairdata: []
	, newdatecode: ''
	, newlotcode: ''
})

const keypartsform = ref({
	sn: ''
	, lvkpdata: []
	, newkpsn: ''
	, newrid: ''
	, newkpinfo: []
	, oldkpstatus: ''
	, oldkpstatusOptions: [{ label: 'Yes', value: 'yes' }
		, { label: 'No', value: 'no' }]
	, defectcode: ''
	, remark: ''
	, oldkpinfo: []
})

const errprfmaterialform = ref({
	panelno: ''
	, sncount: 0
	, station: ''
	, stationOptions: []
	, sn: ''
	, defectprocess: ''
	, remark: ''
	, defectcode: ''
	, defectdesc1: ''
	, defectdesc2: ''
	, reasontype: ''
	, reasontypeOptions: [{ id: 1, name: '材料问题', value: 'materialissue' }
		, { id: 2, name: '组装问题', value: 'assemblyissue' }
		, { id: 3, name: 'SMT制程问题', value: 'SMTProcessissue' }
		, { id: 4, name: '设备问题', value: 'equipmentissue' }
		, { id: 5, name: '软件问题', value: 'softwareissue' }
		, { id: 6, name: '设计问题', value: 'designissue' }
		, { id: 7, name: '接触问题', value: 'contactissue' }
		, { id: 8, name: 'NTF', value: 'NTF' }
		, { id: 9, name: '其他', value: 'others' }
	]
	, defectsymptom: ''
	, reason: ''
	, reasondesc1: ''
	, reasondesc2: ''
	, oldpartno: ''
	, newpartno: ''
	, newreelno: ''
	, newlotcode: ''
	, errprfinfo: []
})

const reflowprocessform = ref({
	reflowstation: ''
	, reflowstationOptions: []
})

const scrapform = ref({
	sn: ''
	, memo: ''
	, treatment: ''
	, treatmentOptions: [{ value: 'scrap', label: '报废' }
		, { value: 'returnmaterial', label: '退料' }]
})

const msgstyle = ref([
	'height: 100px; background-color:RGB(210,215,217); text-align: center; border: 1px solid #ccc; padding: 10px; margin-top: 10px; ',
	'font-family:Arial, Helvetica, sans-serif;font-size:xx-large;font-weight: 800;color: blue;'
])


function stationConfig() {
	console.log('Call stationConfig:')
	open1.value = true
}


/** 对话框取消按钮操作 */
function cancel(btn) {
	// console.log('cancel')
	// console.log(btn)
	if (btn == 'open1') {

		stationsetupform.factory = ''
		proxy.resetForm('stationsetupRef')
		proxy.$refs['stationTreeRef']
		open1.value = false
		return
	}
	if (btn == 'open2') {
		open2.value = false
	}
	if (btn == 'open3') {
		open3.value = false
	}
	if (btn == 'open4') {
		open4.value = false
	}
	if (btn == 'open5') {
		open5.value = false
	}
	if (btn == 'open6') {
		open6.value = false
	}
}



const handleRemove = (index, row) => {
	console.log(index, row)
}

function btnRepair() {
	open2.value = true
}

function btnRemove() {
	open3.value = true
}

function btnErrPrfLC() {
	open4.value = true
}

function btnFinished() {
	open5.value = true
}

function btnScrap() {
	open6.value = true
}

const stationOptions = [
	{
		label: 'BU22KVM001',
		children: [
			{
				label: 'repair',
				children: [
					{
						label: 'Repair',
						children: [
							{ label: 'LKKS_BU22KVM001_Repair' },
							{ label: 'LKKS_BU22KVM001_Repair-in' },
							{ label: 'LKKS_BU22KVM001_Repair-out' }]
					},
					{
						label: 'SPI Repair',
						children: [{ label: 'LKKS_BU22KVM001_1_SPI-Repair' }]
					}
				]
			}
		]
	},
	{
		label: 'BU22KVM002',
		children: [
			{
				label: 'repair',
				children: [
					{
						label: 'Repair',
						children: [{ label: 'LKKS_BU22KVM002_Repair' }, { label: 'LKKS_BU22KVM002_Repair-in' }, { label: 'LKKS_BU22KVM002_Repair-out' }]
					}
				]
			}
		]
	}
]

const init = ref(formatTreeData(stationOptions, null))






function formatTreeData(data, parent) {
	if (Array.isArray(data)) {

		data.forEach(element => {
			formatTreeData(element, data)
		})
	}
	else {
		data.parent = parent
	}

	if (data.children) {
		data.children.forEach(element => {
			formatTreeData(element, data)
		})
	}
}

// 从叶子节点递归到根找到这样的一个路径把节点标签值存放在数组里面
function findAllPaths(data, path) {
	if (data.label) {
		path.push(data.label)
	}
	if (data.parent) {
		findAllPaths(data.parent, path)
	}

}


const handleNodeClick = (data) => {
	// console.log('Call handleNodeClick:')
	// console.log('label:')
	// console.log(data.label)
	// console.log('data:')
	// console.log(data)
	var currentPath = []
	findAllPaths(data, currentPath)
	// console.log('currentPath:')
	// console.log(currentPath)
	// 如果是叶子节点的话要给右边的控件赋值
	if (!data.children) {
		stationsetupform.value.Station = currentPath[0]
		stationsetupform.value.StationType = currentPath[1]
		stationsetupform.value.Stage = currentPath[2]
		stationsetupform.value.Line = currentPath[3]
		//设置到LocalStorage
		proxy.$cache.local.setJSON('StationConfiguration', {
			Line: currentPath[3]
			, Stage: currentPath[2]
			, StationType: currentPath[1]
			, Station: currentPath[0]
		})
		//设置excuteform.station
		executform.value.station = currentPath[0]
	}
}


</script>
<style scoped>
/* .el-row {
	margin-top: 20px;
} */
</style>