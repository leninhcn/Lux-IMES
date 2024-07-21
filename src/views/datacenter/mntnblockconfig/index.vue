<template>
  <div class="app-container">
    <!--类型查询显示-->
    <el-form :model="queryParamsType" ref="queryFormType" :inline="true" v-show="showSearch" label-width="120px">
        <el-form-item :label="$t('mntnblockconfig.configTypeName')" prop="configTypeName">
          <el-input v-model="queryParamsType.configTypeName" placeholder="请输入类型名称" clearable @keyup.enter="handleQueryType" />
        </el-form-item>
        <el-form-item :label="$t('general.enabled')" prop="enabled">
          <el-select v-model="queryParamsType.enabled" placeholder="状态" clearable style="width: 100px">
            <el-option v-for="dict in selectstatusOptions" :key="dict.dictValue" :label="dict.dictLabel" :value="dict.dictValue" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="search" @click="handleQueryType">{{ $t('btn.search') }}</el-button>
          <el-button icon="refresh" @click="resetQueryType">{{ $t('btn.reset') }}</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="search" @click="handleSqlQueryType">ProSql</el-button>
        </el-form-item>
      </el-form>
      <el-row :gutter="10" >
        <el-col :span="1.5">
          <el-button type="primary" plain icon="plus" @click="handleAddType" v-hasPermi="['datacenter:mntnblockconfig:add']">{{ $t('btn.add') }}</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button type="success" plain icon="edit" :disabled="singleType" @click="handleUpdateType" v-hasPermi="['datacenter:mntnblockconfig:update']">
            {{ $t('btn.edit') }}
          </el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button type="danger" plain icon="delete" title="停用" :disabled="multipleType" @click="handleDeleteType" v-hasPermi="['datacenter:mntnblockconfig:remove']">
            {{ $t('btn.delete') }}
          </el-button>
        </el-col>
        <right-toolbar v-model:showSearch="showSearch" @queryTable="getListType"></right-toolbar>
      </el-row>
      <el-table ref="singleTableRef" highlight-current-row v-loading="loadingType" :data="typeList"  border="true" @current-change="handleSelectionChangeType" height="200px">
        <el-table-column type="index" width="50" />
        <el-table-column label="类型Id" align="center" prop="configTypeId" sortable v-if="false"/>
        <el-table-column :label="$t('mntnblockconfig.configTypeName')" align="center" prop="configTypeName"  />
        <el-table-column :label="$t('mntnblockconfig.configTypeDesc')" align="center" prop="configTypeDesc" />
        <el-table-column :label="$t('mntnblockconfig.neederEmpno')" align="center" prop="neederEmpno" />
        <el-table-column :label="$t('general.enabled')" align="center" prop="enabled"/>
        <el-table-column :label="$t('general.updateEmpno')" align="center" prop="updateEmpno" sortable />
        <el-table-column :label="$t('general.updateTime')" align="center" prop="updateTime" width="180" sortable>
          <template #default="scope">
            <span>{{ parseTime(scope.row.updateTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('general.createEmpno')" align="center" prop="createEmpno" sortable />
        <el-table-column :label="$t('general.createTime')" align="center" prop="createTime" width="180" sortable>
          <template #default="scope">
            <span>{{ parseTime(scope.row.createTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column fixed='right' :label="$t('general.Operational')" align="center" class-name="small-padding fixed-width">
          <template #default="scope">
            <el-button  text size="small"  icon="edit" @click="handleUpdateType(scope.row)" v-hasPermi="['datacenter:mntnblockconfig:update']">
              {{ $t('btn.edit') }}
            </el-button>
            <el-button  text size="small" icon="delete"  @click="handleDeleteType(scope.row)" v-hasPermi="['datacenter:mntnblockconfig:remove']">
              {{ $t('btn.delete') }}
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <!--显示分页-->
      <!--<pagination v-show="total > 0" :total="total" v-model:page="queryParamsType.pageNum" v-model:limit="queryParamsType.pageSize" @pagination="getListType" />-->
      <!--Tabs标签页-->
      <el-tabs  v-model="activeTab" @tab-click="handleTabClick">
      <el-tab-pane label="BaseConfig" name="baseConfig"></el-tab-pane>
      <el-tab-pane label="AdvancedConfig" name="advancedConfig" v-if="showsql"></el-tab-pane>
      </el-tabs>
        <!--显示配置-->
        <div v-if="activeTab==='baseConfig'">
      <el-form :model="queryParamsValue" ref="queryForm" :inline="true" v-show="showSearch" label-width="100px">
        <el-form-item :label="$t('mntnblockconfig.configName')" prop="configName">
          <el-input v-model="queryParamsValue.configName" placeholder="请输入配置名称" clearable @keyup.enter="handleQueryValue" />
        </el-form-item>
        <el-form-item :label="$t('general.enabled')" prop="enabled">
          <el-select v-model="queryParamsValue.enabled" placeholder="状态" clearable style="width: 100px">
            <el-option v-for="dict in selectstatusOptions" :key="dict.dictValue" :label="dict.dictLabel" :value="dict.dictValue" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="search" @click="handleQueryValue">{{ $t('btn.search') }}</el-button>
          <el-button icon="refresh" @click="resetQueryValue">{{ $t('btn.reset') }}</el-button>
        </el-form-item>
      </el-form>
      <el-row :gutter="10" >
        <el-col :span="1.5">
          <el-button type="primary" plain icon="plus" :disabled="singleType" @click="handleAddValue" v-hasPermi="['datacenter:mntnreason:add']">{{ $t('btn.add') }}</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button type="success" plain icon="edit" :disabled="single" @click="handleUpdateValue" v-hasPermi="['datacenter:mntnreason:update']">
            {{ $t('btn.edit') }}
          </el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button type="danger" plain icon="delete" title="停用" :disabled="multiple" @click="handleDeleteValue" v-hasPermi="['datacenter:mntnreason:remove']">
            {{ $t('btn.delete') }}
          </el-button>
        </el-col>
        <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
      </el-row>
     <!--配置显示table-->
      <el-table v-loading="loadingValue" :data="valueList" @selection-change="handleSelectionChange" >
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="类型Id" align="center" prop="configTypeId" sortable v-if="false" />
        <el-table-column label="配置Id" align="center" prop="configId" sortable v-if="false" />
        <el-table-column :label="$t('mntnblockconfig.configName')" align="center" prop="configName"  />
        <el-table-column :label="$t('mntnblockconfig.configDesc')" align="center" prop="configDesc" />
        <el-table-column :label="$t('mntnblockconfig.configValue')" align="center" prop="configValue" />
        <el-table-column :label="$t('mntnblockconfig.routeName')" align="center" prop="routeName" />
        <el-table-column :label="$t('mntnblockconfig.line')" align="center" prop="line" />
        <el-table-column :label="$t('mntnblockconfig.stationType')" align="center" prop="stationType" />
        <el-table-column :label="$t('mntnblockconfig.stationName')" align="center" prop="stationName" />
        <el-table-column label="clientId" align="center" prop="clientId" v-if="false"/>
        <el-table-column :label="$t('general.enabled')" align="center" prop="enabled"/>
        <el-table-column :label="$t('general.updateEmpno')" align="center" prop="updateEmpno" sortable />
        <el-table-column :label="$t('general.updateTime')" align="center" prop="updateTime" width="180" sortable>
          <template #default="scope">
            <span>{{ parseTime(scope.row.updateTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('general.createEmpno')" align="center" prop="createEmpno" sortable />
        <el-table-column :label="$t('general.createTime')" align="center" prop="createTime" width="180" sortable>
          <template #default="scope">
            <span>{{ parseTime(scope.row.createTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('general.Operational')" width="150" align="center" class-name="small-padding fixed-width">
          <template #default="scope">
            <el-button  text size="small"  icon="edit" @click="handleUpdateValue(scope.row)" v-hasPermi="['datacenter:mntnblockconfig:update']">
              {{ $t('btn.edit') }}
            </el-button>
            <el-button  text size="small" icon="delete"  @click="handleDeleteValue(scope.row)" v-hasPermi="['datacenter:mntnblockconfig:remove']">
              {{ $t('btn.delete') }}
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!----显示sql---->
    <div v-if="activeTab==='advancedConfig'">
      <el-form :model="queryParamsSql" ref="queryFormSql" :inline="true" v-show="showSearch" label-width="100px">
        <el-form-item :label="$t('mntnblockconfig.configName')" prop="configName">
          <el-input v-model="queryParamsSql.configName" placeholder="请输入配置名称" clearable @keyup.enter="handleQuerySql" />
        </el-form-item>
        <el-form-item :label="$t('general.enabled')" prop="enabled">
          <el-select v-model="queryParamsSql.enabled" placeholder="状态" clearable style="width: 100px">
            <el-option v-for="dict in selectstatusOptions" :key="dict.dictValue" :label="dict.dictLabel" :value="dict.dictValue" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="search" @click="handleQuerySql">{{ $t('btn.search') }}</el-button>
          <el-button icon="refresh" @click="resetQuerySql">{{ $t('btn.reset') }}</el-button>
        </el-form-item>
      </el-form>
      <el-row :gutter="10" >
        <el-col :span="1.5">
          <el-button type="primary" plain icon="plus" :disabled="singleType" @click="handleAddSql" v-hasPermi="['datacenter:mntnreason:add']">{{ $t('btn.add') }}</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button type="success" plain icon="edit" :disabled="singleSql" @click="handleUpdateSql" v-hasPermi="['datacenter:mntnreason:update']">
            {{ $t('btn.edit') }}
          </el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button type="danger" plain icon="delete" title="停用" :disabled="multipleSql" @click="handleDeleteSql" v-hasPermi="['datacenter:mntnreason:remove']">
            {{ $t('btn.delete') }}
          </el-button>
        </el-col>
        <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
      </el-row>
     <!--sql显示table-->
      <el-table v-loading="loadingSql" :data="SqlList" @selection-change="handleSelectionChangeSql" width="10" >
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="类型Id" align="center" prop="configTypeId" sortable v-if="false" />
        <el-table-column label="配置Id" align="center" prop="configId" sortable v-if="false" />
        <el-table-column :label="$t('mntnblockconfig.configName')" align="center" prop="configName"  />
        <el-table-column :label="$t('mntnblockconfig.configSeq')" align="center"  prop="configSeq" />
        <el-table-column :label="$t('mntnblockconfig.configDesc')" align="center" prop="configDesc" />
        <el-table-column :label="$t('mntnblockconfig.stationType')" align="center" prop="stationType" />
        <el-table-column :label="$t('mntnblockconfig.checkType')" align="center" prop="checkType" />
        <el-table-column :label="$t('mntnblockconfig.configType')" align="center" prop="configType" />
        <el-table-column :label="$t('mntnblockconfig.configProsql')" align="center" width="200" >
        <template #default="{ row }">
          <div class="ellipsis-text" :title="row.configProsql">{{ row.configProsql }}</div>
        </template>
        </el-table-column>
        <el-table-column :label="$t('general.enabled')" align="center" prop="enabled" width="40"/>
        <el-table-column prop="two" label="Two" align="center" width="40"/>
        <el-table-column prop="tsn" label="Tsn" align="center"/>
        <el-table-column prop="tline" label="Tline" align="center"/>
        <el-table-column prop="tstationType" label="TstationType" align="center"/>
        <el-table-column prop="tstationName" label="TstationName" align="center"/>
        <el-table-column prop="trouteName" label="TrouteName" align="center"/>
        <el-table-column prop="csn" label="Csn" align="center"/>
        <el-table-column prop="cwo" label="Cwo" align="center"/>
        <el-table-column prop="tempno" label="Tempno" align="center" />
        <el-table-column prop="enabled" label="Enabled" align="center" />
        <el-table-column prop="tcartonNo" label="TcartonNo" align="center" />
        <el-table-column prop="tpalletNo" label="TpalletNo" align="center" />
        <el-table-column prop="tkpsn" label="Tkpsn" align="center" />
        <el-table-column prop="tPARAM1" label="TPARAM1" align="center" />
        <el-table-column prop="tPARAM2" label="TPARAM2" align="center" />
        <el-table-column prop="tPARAM3" label="TPARAM3" align="center" />
        <el-table-column :label="$t('general.updateEmpno')" align="center" prop="updateEmpno" sortable />
        <el-table-column :label="$t('general.updateTime')" align="center" prop="updateTime" width="180" sortable>
          <template #default="scope">
            <span>{{ parseTime(scope.row.updateTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('general.createEmpno')" align="center" prop="createEmpno" sortable />
        <el-table-column :label="$t('general.createTime')" align="center" prop="createTime" width="180" sortable>
          <template #default="scope">
            <span>{{ parseTime(scope.row.createTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column fixed='right' width="150" :label="$t('general.Operational')" align="center" class-name="small-padding fixed-width">
          <template #default="scope">
            <el-button  text size="small"  icon="edit" @click="handleUpdateSql(scope.row)" v-hasPermi="['datacenter:mntnblockconfig:update']">
              {{ $t('btn.edit') }}
            </el-button>
            <el-button  text size="small" icon="delete"  @click="handleDeleteSql(scope.row)" v-hasPermi="['datacenter:mntnblockconfig:remove']">
              {{ $t('btn.delete') }}
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
        <!-- 类型添加或修改内容对话框 -->
        <el-dialog :title="title" v-model="openType" width="800px" append-to-body>
        <el-form ref="formRefType" :model="formType" :rules="rules" label-width="120px">
          <el-form-item :label="$t('mntnblockconfig.configTypeName')" prop="configTypeName">
            <el-input v-model="formType.configTypeName" placeholder="请输入" />
          </el-form-item>
          <el-form-item :label="$t('mntnblockconfig.neederEmpno')" prop="neederEmpno">
            <el-input v-model="formType.neederEmpno" placeholder="请输入" />
          </el-form-item>
          <el-form-item :label="$t('mntnblockconfig.configTypeDesc')" prop="configTypeDesc">
            <el-input type="textarea" v-model="formType.configTypeDesc" placeholder="请输入" />
          </el-form-item>
          <el-form-item :label="$t('general.YorN')" prop="enabled">
            <el-select v-model="formType.enabled"  placeholder="请选择">
                  <el-option
                    v-for="item in options.EnableOptions" 
                    :key="item.dictValue" 
                    :label="item.dictLabel" 
                    :value="item.dictValue"></el-option>
                </el-select>
          </el-form-item>
        </el-form>
        <template #footer>
          <el-button text @click="cancel">{{ $t('btn.cancel') }}</el-button>
          <el-button type="primary" @click="submitFormType">{{ $t('btn.submit') }}</el-button>
        </template>
      </el-dialog>
       <!-- 配置添加或修改内容对话框 -->
       <el-dialog :title="title" v-model="openValue" width="500px" append-to-body>
        <el-form ref="formRefValue" :model="formValue" :rules="rules" label-width="80px">
          <el-form-item label="类型ID" prop="configTypeId" v-if="false">
          <el-input v-model="formValue.configTypeId" placeholder="请输入ConfigTypeId" />
              </el-form-item>
              <el-form-item label="配置ID" prop="configId" v-if="false">
                <el-input v-model="formValue.configId" placeholder="请输入ConfigId" />
              </el-form-item> 
              <el-form-item :label="$t('mntnblockconfig.configName')" prop="configName">
                <el-input v-model="formValue.configName" placeholder="请输入ConfigName" />
              </el-form-item>
              <el-form-item :label="$t('mntnblockconfig.configDesc')" prop="configDesc">
                <el-input type="textarea" v-model="formValue.configDesc" placeholder="请输入ConfigDesc"/>
              </el-form-item>
              <el-form-item :label="$t('mntnblockconfig.configValue')" prop="configValue">
                <el-input type="textarea" v-model="formValue.configValue" placeholder="请输入ConfigValue"/>
              </el-form-item>
              <el-form-item :label="$t('mntnblockconfig.routeName')" prop="routeName">
                <el-select
                  v-model="formValue.routeName"
                  filterable
                  remote
                  reserve-keyword
                  clearable
                  placeholder="请输入开始字符"
                  :remote-method="remoteMethodroute"
                  :loading="loading"
                  >
                    <el-option
                      v-for="item in optionstroute"
                      :key="item.routeName"
                      :label="`途程名称：${item.routeName}，途程描述：${item.routeDesc}`"
                      :value="item.routeName"
                    />
                </el-select>
              </el-form-item>
              <el-form-item :label="$t('mntnblockconfig.line')" prop="line">
                <el-select
                  v-model="formValue.line"
                  filterable
                  remote
                  reserve-keyword
                  clearable
                  placeholder="请输入开始字符"
                  :remote-method="remoteMethodLine"
                  :loading="loadingline"
                  >
                    <el-option
                      v-for="item in optionstLine"
                      :key="item.line"
                      :label="`线体名称：${item.line}，线体描述：${item.lineDesc}`"
                      :value="item.line"
                    />
                </el-select>
              </el-form-item>
              <el-form-item :label="$t('mntnblockconfig.stationType')" prop="stationType">
                <el-select
                  v-model="formValue.stationType"
                  filterable
                  remote
                  reserve-keyword
                  clearable
                  placeholder="请输入开始字符"
                  :remote-method="remoteMethodStationType"
                  :loading="loadingstationtype"
                  >
                    <el-option
                      v-for="item in optionststationtype"
                      :key="item.stationType"
                      :label="`站点类型名称：${item.stationType}，站点类型描述：${item.stationTypeDesc}`"
                      :value="item.stationType"
                    />
                </el-select>
              </el-form-item>
              <el-form-item :label="$t('mntnblockconfig.stationName')" prop="stationName">
                <el-select
                  v-model="formValue.stationName"
                  filterable
                  remote
                  reserve-keyword
                  clearable
                  placeholder="请输入开始字符"
                  :remote-method="remoteMethodStation"
                  :loading="loadingstation"
                  >
                    <el-option
                      v-for="item in optionststation"
                      :key="item.stationName"
                      :label="`工作站名称：${item.stationName}，类型：${item.stationType}，线体：${item.line}，区段：${item.stage}`"
                      :value="item.stationName"
                    />
                </el-select>
              </el-form-item>              
              <el-form-item :label="$t('general.YorN')" prop="enabled">
                <el-select v-model="formValue.enabled"  placeholder="请选择">
                  <el-option
                    v-for="item in options.EnableOptions" 
                    :key="item.dictValue" 
                    :label="item.dictLabel" 
                    :value="item.dictValue"></el-option>
                </el-select>
              </el-form-item>
        </el-form>
        <template #footer>
          <el-button text @click="cancel">{{ $t('btn.cancel') }}</el-button>
          <el-button type="primary" @click="submitFormValue">{{ $t('btn.submit') }}</el-button>
        </template>
      </el-dialog>
      <!-- SQL添加或修改内容对话框 -->
      <el-dialog :title="title" v-model="openSql" width="800px" append-to-body>
        <el-form ref="formRefSql" :model="formSql" :rules="rules" label-width="100px">
          <el-form-item label="类型ID" prop="configTypeId" v-if="false">
          <el-input v-model="formSql.configTypeId" placeholder="请输入ConfigTypeId" />
              </el-form-item>
              <el-form-item label="配置ID" prop="configId" v-if="false">
                <el-input v-model="formSql.configId" placeholder="请输入ConfigId" />
              </el-form-item> 
              <el-form-item :label="$t('mntnblockconfig.configSeq')" prop="ConfigSeq" >
                <el-input v-model.number="formSql.configSeq" placeholder="请输入" />
              </el-form-item> 
              <el-form-item :label="$t('mntnblockconfig.configName')" prop="configName">
                <el-input v-model="formSql.configName" placeholder="请输入ConfigName" />
              </el-form-item>
              <el-form-item :label="$t('mntnblockconfig.configDesc')" prop="configDesc">
                <el-input type="textarea" v-model="formSql.configDesc" placeholder="请输入ConfigDesc"/>
              </el-form-item>
              <el-form-item :label="$t('mntnblockconfig.checkType')" prop="checkType">
                <el-select v-model="formSql.checkType"  placeholder="请选择">
                  <el-option
                    v-for="item in checktypeoptions" 
                    :key="item.dictValue" 
                    :label="item.dictLabel" 
                    :value="item.dictValue"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item :label="$t('mntnblockconfig.configType')" prop="configType">
                <el-select v-model="formSql.configType"  placeholder="请选择">
                  <el-option
                    v-for="item in configtypeoptions" 
                    :key="item.dictValue" 
                    :label="item.dictLabel" 
                    :value="item.dictValue"></el-option>
                </el-select>
              </el-form-item>
              <el-row>
                <el-col :span="8">
              <el-form-item prop="two" label="Two" align="center">
                <el-select v-model="formSql.two"  placeholder="请选择">
                  <el-option
                    v-for="item in statusOptions" 
                    :key="item.dictValue" 
                    :label="item.dictLabel" 
                    :value="item.dictValue"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item prop="tsn" label="Tsn" align="center">
                <el-select v-model="formSql.tsn"  placeholder="请选择">
                  <el-option
                    v-for="item in statusOptions" 
                    :key="item.dictValue" 
                    :label="item.dictLabel" 
                    :value="item.dictValue"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            <el-col :span="8">
              <el-form-item prop="tline" label="Tline" align="center">
                 <el-select v-model="formSql.tline"  placeholder="请选择">
                  <el-option
                    v-for="item in statusOptions" 
                    :key="item.dictValue" 
                    :label="item.dictLabel" 
                    :value="item.dictValue"></el-option>
                </el-select>
              </el-form-item>
              </el-col>
              <el-col :span="8">
              <el-form-item prop="tstationType" label="TstationType" align="center">
                <el-select v-model="formSql.tstationType"  placeholder="请选择">
                  <el-option
                    v-for="item in statusOptions" 
                    :key="item.dictValue" 
                    :label="item.dictLabel" 
                    :value="item.dictValue"></el-option>
                </el-select>
               </el-form-item>
              </el-col>
              <el-col :span="8">
              <el-form-item prop="tstationName" label="TstationName" align="center">
          <el-select v-model="formSql.tstationName"  placeholder="请选择">
                  <el-option
                    v-for="item in statusOptions" 
                    :key="item.dictValue" 
                    :label="item.dictLabel" 
                    :value="item.dictValue"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
              <el-col :span="8">
        <el-form-item prop="trouteName" label="TrouteName" align="center">
          <el-select v-model="formSql.trouteName"  placeholder="请选择">
                  <el-option
                    v-for="item in statusOptions" 
                    :key="item.dictValue" 
                    :label="item.dictLabel" 
                    :value="item.dictValue"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
              <el-col :span="8">
        <el-form-item prop="csn" label="Csn" align="center">
          <el-select v-model="formSql.csn"  placeholder="请选择">
                  <el-option
                    v-for="item in statusOptions" 
                    :key="item.dictValue" 
                    :label="item.dictLabel" 
                    :value="item.dictValue"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
              <el-col :span="8">
        <el-form-item prop="cwo" label="Cwo" align="center">
          <el-select v-model="formSql.cwo"  placeholder="请选择">
                  <el-option
                    v-for="item in statusOptions" 
                    :key="item.dictValue" 
                    :label="item.dictLabel" 
                    :value="item.dictValue"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
              <el-col :span="8">
        <el-form-item prop="tempno" label="Tempno" align="center" >
          <el-select v-model="formSql.tempno"  placeholder="请选择">
                  <el-option
                    v-for="item in statusOptions" 
                    :key="item.dictValue" 
                    :label="item.dictLabel" 
                    :value="item.dictValue"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
              <el-col :span="8">
        <el-form-item prop="tcartonNo" label="TcartonNo" align="center" >
          <el-select v-model="formSql.tcartonNo"  placeholder="请选择">
                  <el-option
                    v-for="item in statusOptions" 
                    :key="item.dictValue" 
                    :label="item.dictLabel" 
                    :value="item.dictValue"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
              <el-col :span="8">
        <el-form-item prop="tpalletNo" label="TpalletNo" align="center" >
          <el-select v-model="formSql.tpalletNo"  placeholder="请选择">
                  <el-option
                    v-for="item in statusOptions" 
                    :key="item.dictValue" 
                    :label="item.dictLabel" 
                    :value="item.dictValue"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
              <el-col :span="8">
        <el-form-item prop="tkpsn" label="Tkpsn" align="center" >
          <el-select v-model="formSql.tkpsn"  placeholder="请选择">
                  <el-option
                    v-for="item in statusOptions" 
                    :key="item.dictValue" 
                    :label="item.dictLabel" 
                    :value="item.dictValue"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
              <el-col :span="8">
        <el-form-item prop="tparaM1" label="TPARAM1" align="center" >
          <el-select v-model="formSql.tparaM1"  placeholder="请选择">
                  <el-option
                    v-for="item in statusOptions" 
                    :key="item.dictValue" 
                    :label="item.dictLabel" 
                    :value="item.dictValue"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
              <el-col :span="8">
        <el-form-item prop="tparaM2" label="TPARAM2" align="center" >
          <el-select v-model="formSql.tparaM2"  placeholder="请选择">
                  <el-option
                    v-for="item in statusOptions" 
                    :key="item.dictValue" 
                    :label="item.dictLabel" 
                    :value="item.dictValue"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
              <el-col :span="8">
        <el-form-item prop="tparaM3" label="TPARAM3" align="center" > 
          <el-select v-model="formSql.tparaM3"  placeholder="请选择">
                  <el-option
                    v-for="item in statusOptions" 
                    :key="item.dictValue" 
                    :label="item.dictLabel" 
                    :value="item.dictValue"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
              </el-row>
              <el-form-item :label="$t('mntnblockconfig.stationType')" prop="stationType">
                <el-select
                  v-model="formSql.stationType"
                  filterable
                  remote
                  reserve-keyword
                  clearable
                  placeholder="请输入开始字符"
                  :remote-method="remoteMethodStationType"
                  :loading="loadingstationtype"
                  >
                    <el-option
                      v-for="item in optionststationtype"
                      :key="item.stationType"
                      :label="`站点类型名称：${item.stationType}，站点类型描述：${item.stationTypeDesc}`"
                      :value="item.stationType"
                    />
                </el-select>
              </el-form-item>       
              <el-form-item :label="$t('general.YorN')" prop="enabled">
                <el-select v-model="formSql.enabled"  placeholder="请选择">
                  <el-option
                    v-for="item in options.EnableOptions" 
                    :key="item.dictValue" 
                    :label="item.dictLabel" 
                    :value="item.dictValue"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item :label="$t('mntnblockconfig.configProsql')" prop="configProsql">
                <el-input type="textarea" v-model="formSql.configProsql" placeholder="请输入configProsql"/>
              </el-form-item>
        </el-form>
        <template #footer>
          <el-button text @click="cancel">{{ $t('btn.cancel') }}</el-button>
          <el-button type="primary" @click="submitFormSql">{{ $t('btn.submit') }}</el-button>
        </template>
      </el-dialog>
  </div>
  </template>
  <script setup name="mntnblockconfig" >
  import { linelistget,routelistget,stationtypelistget,stationlistget } from '@/api/mescommon/mesget'
  import { typelistPost,sqltypelistPost, valuelistPost,sqllistPost,typegetPost,valuegetPost ,sqlgetPost,typeaddPost,valueaddPost,sqladdPost,typeupdatePost,valueupdatePost,sqlupdatePost,typedelPost,valuedelPost,sqldelPost } from '@/api/datacenter/mntnblockconfig'
  import { getData } from '@/api/system/dict/data';
  const { proxy } = getCurrentInstance()
  // 弹出层标题
  const title = ref('')
  //取消按钮
  function cancel() {
    openType.value = false
    openValue.value=false
    resetType()
    resetValue()
  }
  //--Tab分页--
  //Tab分页
  const activeTab=ref('baseConfig');
  function handleTabClick(tab){
    console.log(tab.name);
  }
  //--状态--
  // 状态数据字典
  const statusOptions = ref([])
  const selectstatusOptions = ref([])
  const checktypeoptions=ref([])
  const configtypeoptions=ref([])
  proxy.getDicts('status').then((response) => {
    statusOptions.value = response.data
    console.log(statusOptions.value)
  })
  proxy.getDicts('selectstatus').then((response) => {
    selectstatusOptions.value = response.data
  })
  proxy.getDicts('configtype').then((response) => {
    configtypeoptions.value = response.data
  })
  proxy.getDicts('checktype').then((response) => {
    checktypeoptions.value = response.data
  })
  //--查询功能--
  const loadingType = ref(true)
  // 总条数
  const total = ref(0)
  // 类型 定义表单数据
  const typeList = ref([])
  // 显示搜索条件
  const showSearch = ref(true)
  // 类型 定义查询参数
  let queryParamsType = reactive({
    pageNum: 1,
    pageSize: 10,
    configTypeName: undefined,
    enabled: 'Y'
  })
  /** 类型搜索按钮操作 */
  function handleQueryType() {
    queryParamsType.pageNum = 1
    getListType()
  }
  /** 类型搜索按钮操作 */
  function handleSqlQueryType() {
    queryParamsType.pageNum = 1
    getListSqlType()
  }
  /** 类型查询列表 */
  function getListType() {
    loadingType.value = true
    typelistPost(queryParamsType).then((response) => {
      typeList.value = response.data
      total.value = response.data.totalNum
      loadingType.value = false
    })
  }
  /** sql查询列表 */
  function getListSqlType() {
    loadingType.value = true
    sqltypelistPost(queryParamsType).then((response) => {
      typeList.value = response.data
      total.value = response.data.totalNum
      loadingType.value = false
    })
  }
  //重置操作
  /** 类型重置按钮操作 */
  function resetQueryType() {
    proxy.resetForm('queryFormType')
    handleQueryType()
  }
  //新增修改
  const formRefType=ref(null)
  // 类型是否显示弹出层
  const openType = ref(false)
  // 类型表单校验
  const stateType = reactive({
    formType: {},
    formValue: {},
    formSql: {},
    rules: {
      configTypeName: [{ required: true, message: '类型不能为空', trigger: 'blur' }],
      configName: [{ required: true, message: '配置名称不能为空', trigger: 'blur' }],
      enabled: [{ required: true, message: '请选择一个选项', trigger: 'change' }],
    },
    options: {
      // StationType 选项列表 格式 eg:{ dictLabel: '标签', dictValue: '0'}
      stationTypeOptions: [{dictLabel: '标签', dictValue: '0'},{dictLabel: '1标签', dictValue: '0'},{dictLabel: '2标签', dictValue: '0'}],
      EnableOptions: [{dictLabel: 'Y', dictValue: 'Y'},{dictLabel: 'N', dictValue: 'N'}],
      routeNameOptions:[{dictLabel: '2024建立站点1', dictValue: '站点1'},{dictLabel: '2024建立站点2', dictValue: '站点2'}]
    }
  })
  const { formType,formValue, formSql,rules,options } = toRefs(stateType)
  // 类型新增表单重置
  function resetType() {
    formType.value = {
      configTypeId: null,
      configTypeName: null,
      configTypeDesc: null,
      neederEmpno: null,
      enabled: null,
      updateTime: null,
      createEmpno: null,
      createTime: null,
      updateEmpno: null,
    }
    proxy.resetForm('formRefType')
  }
  /** 类型新增按钮操作 */
  function handleAddType() {
    resetType()
    openType.value = true
    title.value = proxy.$t('mntnblockconfig.AddData')
  }
  /** 类型提交按钮 */
  function submitFormType() {
    proxy.$refs['formRefType'].validate((valid) => {
      if (valid) {
        if (formType.value.configTypeId != undefined) {
          typeupdatePost(formType.value).then((response) => {
            proxy.$modal.msgSuccess(proxy.$t('mntnblockconfig.UpdateOK'))
            openType.value = false
            getListType()
          })
        } else {
          typeaddPost(formType.value).then((response) => {       
            proxy.$modal.msgSuccess(proxy.$t('mntnblockconfig.AddOK'))
            openType.value = false
            getListType()         
          })
        }
      }
    })
  }
  //类型修改
  const singleType = ref(true)
  const multipleType = ref(true)
  //const multipleTableRef = ref<InstanceType<typeof ElTable>>()
    const singleTableRef  = ref()
  // 修改单选框选中数据
  function handleSelectionChangeType(selection) {
   // multipleTableRef.value.clearSelection()
    console.log('123')
    //ids.value = selection.map((item) => item.configTypeId)
    if(selection)
    {
      ids.value = selection.configTypeId
    
    singleType.value = false
    multipleType.value = false
    showsql.value=false
    queryParamsValue.configTypeId=ids.value
    console.log(queryParamsValue.configTypeId)
    getListValue()
  
    if(selection.configTypeName==='PROCESS_BLOCK_PROSQL')
    {
      showsql.value=true
     queryParamsSql.configTypeId=ids.value
    console.log(selection.configTypeName)
    getListSql()
    }
    activeTab.value='baseConfig'
   } 
  }
  //定义修改ID
  const ids = ref([])
  /** 类型修改按钮操作 */
  function handleUpdateType(row) {
    resetType()
    const postId = {id:row.configTypeId || ids.value}
    typegetPost(postId).then((response) => {
      formType.value = response.data
      openType.value = true
      title.value = proxy.$t('mntnblockconfig.UpdateData')
    })
  }
  /** 类型删除按钮操作 */
  function handleDeleteType(row) {
    const dpostIds = row.configTypeId || ids.value
    console.log(dpostIds)
    proxy
      .$confirm('是否确认停用"' + row.configName + '"的数据项?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
      .then(function () {
        return typedelPost(dpostIds)
      })
      .then(() => {
        getListType()
        proxy.$modal.msgSuccess('停用成功')
      })
  }
  
  
  //--配置--
  const loadingValue = ref(false)
  // 类型 定义表单数据
  const valueList = ref([])
  // 配置 定义查询参数
  let queryParamsValue = reactive({
    configTypeId:undefined,
    configName: undefined,
    enabled: 'Y'
  })
  /** 配置搜索按钮操作 */
  function handleQueryValue() {
    getListValue()
  }
  /** 配置查询列表 */
  function getListValue() {
    loadingValue.value = true
    valuelistPost(queryParamsValue).then((response) => {
      valueList.value = response.data
      loadingValue.value = false
    })
  }
  /** 配置重置按钮操作 */
  function resetQueryValue() {
    proxy.resetForm('queryFormValue')
    handleQueryValue()
  }
  const single = ref(true)
  const multiple = ref(true)
  const idsvalue =ref([])
  // 配置修改多选框选中数据
  function handleSelectionChange(selection) {
    idsvalue.value = selection.map((item) => item.configId)
    single.value = selection.length != 1
    multiple.value = !selection.length
  }
  //--新增修改--
  const formRefValue = ref(null)
  // 配置是否显示弹出层
  const openValue = ref(false)
  
  /** 配置新增按钮操作 */
  function handleAddValue() {
    resetValue()
    openValue.value = true
    title.value = proxy.$t('mntnblockconfig.AddData')
  }
  // 配置表单重置
  function resetValue() {
    formValue.value = {
      configTypeId: null,
      configId: null,
      configName: null,
      configDesc: null,
      configValue: null,
      enabled: null,
      routeName: null,
      line: null,
      stationType: null,
      stationName: null,
      clientId: null,
      updateEmpno: null,
      updateTime: null,
      createEmpno: null,
      createTime: null,
    }
    proxy.resetForm('formRefValue')
  }
  /** 配置修改按钮操作 */
  function handleUpdateValue(row) {
    resetValue()
    const postId = {id:row.configId || idsvalue.value[0]}
    valuegetPost(postId).then((response) => {
      formValue.value = response.data
      openValue.value = true
      title.value = proxy.$t('mntnblockconfig.UpdateData')
    })
  }
  /** 配置提交按钮 */
  function submitFormValue() {
    proxy.$refs['formRefValue'].validate((valid) => {
      if (valid) {
        if (formValue.value.configId != undefined) {     
          valueupdatePost(formValue.value).then((response) => {
            proxy.$modal.msgSuccess('修改成功')
            openValue.value = false
            getListValue()
          })
        } else {
          formValue.value.configTypeId=queryParamsValue.configTypeId
          valueaddPost(formValue.value).then((response) => {       
            proxy.$modal.msgSuccess('新增成功')
            openValue.value = false
            getListValue()         
          })
        }
      }
    })
  }
  /** 配置删除按钮操作 */
  function handleDeleteValue(row) {
    const dpostIds = row.configId || idsvalue.value
    proxy
      .$confirm('是否确认停用"' + row.configName + '"的数据项?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
      .then(function () {
        return valuedelPost(dpostIds)
      })
      .then(() => {
        getListValue()
        proxy.$modal.msgSuccess('停用成功')
      })
  }
  //--Sql--
  const showsql=ref(false)
  const loadingSql = ref(false)
  // SQL定义表单数据
  const SqlList = ref([])
  const singleSql = ref(true)
  const multipleSql = ref(true)
  const idssql =ref([])
  // SQL修改多选框选中数据
  function handleSelectionChangeSql(selection) {
    idssql.value = selection.map((item) => item.configId)
    singleSql.value = selection.length != 1
    multipleSql.value = !selection.length
  }
  //查询
  // SQL 定义查询参数
  let queryParamsSql = reactive({
    configTypeId:undefined,
    configName: undefined,
    enabled: 'Y'
  })
  /** 搜索按钮操作 */
  function handleQuerySql() {
    getListSql()
  }
  /** 查询列表 */
  function getListSql() {
    loadingSql.value = true
    sqllistPost(queryParamsSql).then((response) => {
      SqlList.value = response.data
      loadingSql.value = false
    })
  }
  //SQL新增修改
  //--新增修改--
  const formRefSql = ref(null)
  // SQL是否显示弹出层
  const openSql = ref(false)
  /** SQL新增按钮操作 */
  function handleAddSql() {
    resetSql()
    openSql.value = true
    title.value = proxy.$t('mntnblockconfig.AddData')
  }
  // Sql表单重置
  function resetSql() {
    formSql.value = {
      configTypeId: null,
      configId: null,
      createTime: null,
      configName: null,
      configSeq: null,
      configDesc: null,
      stationType: null,
      checkType: null,
      configType: null,
      configProsql: null,
      two: null,
      tsn: null,
      tline: null,
      tstationType: null,
      tstationName: null,
      trouteName: null,
      csn: null,
      cwo: null,
      tempno: null,
      enabled: null,
      tcartonNo: null,
      tpalletNo: null,
      tkpsn: null,
      tPARAM1: null,
      tPARAM2: null,
      tPARAM3: null,
      updateEmpno: null,
      updateTime: null,
      createEmpno: null,
    }
    proxy.resetForm('formRefSql')
  }
  /** Sql配置修改按钮操作 */
  function handleUpdateSql(row) {
    resetSql()
    const postId = {id:row.configId || idssql.value[0]}
    sqlgetPost(postId).then((response) => {
      formSql.value = response.data
      openSql.value = true
      title.value = proxy.$t('mntnblockconfig.UpdateData')
    })
  }
  /** 提交按钮 */
  function submitFormSql() {
    proxy.$refs['formRefSql'].validate((valid) => {
      if (valid) {
        if (formSql.value.configId != undefined) {     
          sqlupdatePost(formSql.value).then((response) => {
            proxy.$modal.msgSuccess('修改成功')
            openSql.value = false
            getListSql()
          })
        } else {
          formSql.value.configTypeId=queryParamsValue.configTypeId
          sqladdPost(formSql.value).then((response) => {       
            proxy.$modal.msgSuccess('新增成功')
            openSql.value = false
            getListSql()         
          })
        }
      }
    })
  }
  /** 删除按钮操作 */
  function handleDeleteSql(row) {
    const dpostIds = row.configId || idssql.value
    proxy
      .$confirm('是否确认停用"' + row.configName + '"的数据项?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
      .then(function () {
        return sqldelPost(dpostIds)
      })
      .then(() => {
        getListSql()
        proxy.$modal.msgSuccess('停用成功')
      })
  }
  
  //--下拉框选项--
  const loading = ref(false)
  const loadingline = ref(false)
  const loadingstationtype = ref(false)
  const loadingstation = ref(false)
  const optionstroute = ref([])
  const optionstLine = ref([])
  const optionststation = ref([])
  const optionststationtype = ref([])
  //  const list = ref(null)
  const remoteMethodroute = (query) => {
    loading.value = true
    routelistget({parm:query}).then((res)=>{
      console.log(res.data)
      optionstroute.value=res.data
         loading.value=false
        })
    /* if (query) {
      loading.value = true
      // setTimeout(() => {
      //   loading.value = false
      //   optionst.value = list.value.filter((item) => {
      //     return item.label.toLowerCase().includes(query.toLowerCase())
      //   })
      // }, 200)
      routelistPost({parm:query}).then((res)=>{
         optionst.value=res.data
       })
    } else {
      options.value = []
    } */
  }
  const remoteMethodLine = (query) => {
    loadingline.value = true
    linelistget({parm:query}).then((res)=>{
    console.log(res.data)
    optionstLine.value=res.data
       loadingline.value=false
      })
  }
  const remoteMethodStationType = (query) => {
    loadingstationtype.value = true
    stationtypelistget({parm:query}).then((res)=>{
  console.log(res.data)
  optionststationtype.value=res.data
  loadingstationtype.value=false
    })
  }
  const remoteMethodStation = (query) => {
    loadingstation.value = true
    stationlistget({parm:query}).then((res)=>{
  console.log(res.data)
  optionststation.value=res.data
  loadingstation.value=false
    })
  }
  
  
    
  //页面加载就执行
  handleQueryType()
  </script>
  <style>
  .ellipsis-text{
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    display: block;
    width: 100%;
  }</style>