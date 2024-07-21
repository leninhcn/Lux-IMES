<template>
  <div class="app-container">
    <div class="card-box">
      <LuxForm ref="formRef" :model="form" inline label-width="110px" :data-report-info="JSON.stringify({
        menu: 'warehousemanagement:warehousing',
        form: 'warehousing',
        update: false,
        submit: false
      })">
        <table class="table-storage-in">
          <tbody>
            <tr>
              <td>
                <!-- 类型 -->
                <el-form-item :label="$t('warehousing.cmbtype[1]')" prop="cmbtype">
                  <el-select v-model="form.cmbtype" :placeholder="$t('warehousing.cmbtype[2]')" :disabled="!!ipn"
                    @change="changeCmbType" style="width: 100%">
                    <el-option v-for="dict in cmbTypeOptions" :key="dict.dictValue" :label="dict.dictLabel"
                      :value="dict.dictValue" />
                  </el-select>
                </el-form-item>
              </td>

              <td>
                <!-- 料号 - 入库 -->
                <el-form-item v-if="showIpn" :label="$t('warehousing.ipn[1]')" prop="ipn">
                  <template #label>
                    <el-icon v-show="ipnLoading" class="is-loading" style="margin-right: 4px;">
                      <Loading />
                    </el-icon>
                    <span>{{ $t('warehousing.ipn[1]') }}</span>
                  </template>
                  <el-input ref="inputIpnRef" v-model.trim="form.ipn" :placeholder="$t('warehousing.ipn[2]')"
                    :disabled="!!ipn" clearable @keyup.enter="confirmIpn" style="width: 100%" />
                </el-form-item>

                <!-- HOLD/UNHOLD -->
                <el-form-item v-else-if="showMark" :label="$t('warehousing.mark[1]')" prop="mark">
                  <el-input ref="inputMarkRef" v-model.trim="form.mark" :placeholder="$t('warehousing.mark[2]')"
                    :disabled="!!mark" clearable @keyup.enter="confirmMark" style="width: 100%" />
                </el-form-item>

                <el-form-item v-else label=" "></el-form-item>
              </td>

              <td>
                <!-- 数据 -->
                <el-form-item :label="$t('warehousing.inputdata[1]')" prop="inputdata">
                  <template #label>
                    <el-icon v-show="submitLoading" class="is-loading" style="margin-right: 4px;">
                      <Loading />
                    </el-icon>
                    <span>{{ $t('warehousing.inputdata[1]') }}</span>
                  </template>

                  <el-input ref="inputDataRef" v-model.trim="form.inputdata"
                    :placeholder="$t('warehousing.inputdata[2]')" :disabled="!enableData" clearable
                    @keyup.enter="confirmData" style="width: 100%" />
                </el-form-item>
              </td>

              <td>
                <el-form-item>
                  <template #label>
                    <el-button style="width: calc(100% - 12px);" @click="reset">{{ $t('btn.reset') }}</el-button>
                  </template>
                </el-form-item>
              </td>
            </tr>

            <tr>
              <td>
                <!-- 库位 -->
                <el-form-item :label="$t('warehousing.warehousecode[1]')" prop="warehousecode">
                  <el-select v-model="form.warehousecode" :placeholder="$t('warehousing.warehousecode[2]')" filterable
                    @change="changeWarehouse" style="width: 100%">
                    <el-option v-for="item in warehouseOptions" :key="item.warehouseCode" :label="item.warehouseCode"
                      :value="item.warehouseCode" />
                  </el-select>
                </el-form-item>
              </td>

              <td>
                <!-- 储位 - 入库/出库 -->
                <el-form-item v-if="showLocation" :label="$t('warehousing.locationcode[1]')" prop="locationcode">
                  <template #label>
                    <el-icon v-show="locationLoading" class="is-loading" style="margin-right: 4px;">
                      <Loading />
                    </el-icon>
                    <span>{{ $t('warehousing.locationcode[1]') }}</span>
                  </template>

                  <el-input ref="inputLocationRef" v-model.trim="form.locationcode"
                    :placeholder="$t('warehousing.locationcode[2]')" :disabled="showIpn && !ipn || !!locationcode"
                    clearable @keyup.enter="confirmLocation" style="width: 100%" />
                </el-form-item>
                <el-form-item v-else label=" "></el-form-item>
              </td>

              <td>
                <el-form-item>
                  <template #label>
                    <el-button v-show="showLocation" style="width: calc(100% - 12px);" @click="resetLocation">
                      <span>{{ $t('warehousing.ResetLocationCode') }}</span>
                    </el-button>
                  </template>
                </el-form-item>
              </td>

              <td>
                <el-form-item label=" "></el-form-item>
              </td>
            </tr>

            <tr>
              <td>
                <!-- 方式 -->
                <el-form-item :label="cmbTypeText(form.cmbtype) + $t('warehousing.inputtype[1]')" prop="inputtype">
                  <el-select v-model="form.inputtype" :placeholder="$t('warehousing.inputtype[2]')"
                    @change="changeInputType" style="width: 100%">
                    <el-option v-for="dict in inputTypeOptions" :key="dict.dictValue" :label="dict.dictLabel"
                      :value="dict.dictValue" />
                  </el-select>
                </el-form-item>
              </td>

              <td>
                <!-- 数量 - 入库 & WO -->
                <el-form-item v-if="showQty" :label="$t('warehousing.qty[1]')" prop="qty">
                  <el-input ref="inputQtyRef" v-model.number.trim="form.qty" :placeholder="$t('warehousing.qty[2]')"
                    :disabled="showIpn && !ipn || showLocation && !locationcode || !!qty" @keyup.enter="confirmQty"
                    style="width: 100%" />
                </el-form-item>
                <el-form-item v-else label=" ">
                </el-form-item>
              </td>

              <td>
                <el-form-item>
                  <template #label>
                    <el-button style="width: calc(100% - 12px);" @click="clearData">
                      <span>{{ $t('warehousing.ClearData') }}</span>
                    </el-button>
                  </template>

                  <div v-show="form.cmbtype == 0" style="padding: 0 0.5em;">
                    <span>{{ $t('warehousing.InCount') }}</span>
                    <span style="padding-left: 0.5em;font-weight: bold;font-size: 120%;">{{ snTotal }}</span>
                  </div>
                </el-form-item>
              </td>

              <td>
                <el-form-item label=" "></el-form-item>
              </td>
            </tr>
          </tbody>
        </table>
      </LuxForm>
    </div>

    <el-tabs type="border-card">
      <el-tab-pane :label="$t('warehousing.InData')">
        <el-table ref="tableRef" :data="tableList" :height="tableHeight" border stripe show-overflow-tooltip>
          <el-table-column type="index" align="center" width="50" />
          <el-table-column :label="$t('warehousing.table.worK_ORDER')" align="center" prop="worK_ORDER" />
          <el-table-column :label="$t('warehousing.table.parT_NO')" align="center" prop="parT_NO" />
          <el-table-column :label="$t('warehousing.table.palleT_NO')" align="center" prop="palleT_NO" />
          <el-table-column :label="$t('warehousing.table.cartoN_NO')" align="center" prop="cartoN_NO" />
          <el-table-column :label="$t('warehousing.table.seriaL_NUMBER')" align="center" prop="seriaL_NUMBER" />
          <el-table-column :label="$t('warehousing.table.customeR_SN')" align="center" prop="customeR_SN" />
          <el-table-column :label="$t('warehousing.table.qty')" align="center" prop="qty" />
          <el-table-column :label="$t('warehousing.table.fixeD_QTY')" align="center" prop="fixeD_QTY" />
          <el-table-column :label="$t('warehousing.table.sN_UNIT')" align="center" prop="sN_UNIT" />
        </el-table>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup name="warehousing">
import { checkPart, getWarehouse, checkWarehouse } from '@/api/mescommon/mesget'
import { actionWarehousing } from '@/api/business/warehouseMnt/warehousing'
const { proxy } = getCurrentInstance()

const cmbTypeOptions = ref([])
proxy.getDicts('warehousing_type').then((response) => {
  cmbTypeOptions.value = response.data
  form.value.cmbtype = cmbTypeOptions.value[0].dictValue
})
const cmbTypeText = computed(() => {
  return (v) => {
    return cmbTypeOptions.value.find(e => e.dictValue == v)?.dictLabel || v
  }
})

const inputTypeOptions = ref([])
proxy.getDicts('warehousing_inputtype').then((response) => {
  inputTypeOptions.value = response.data
  form.value.inputtype = inputTypeOptions.value[0].dictValue
})

const warehouseOptions = ref([])
getWarehouse().then(res => {
  warehouseOptions.value = res.data
  form.value.warehousecode = warehouseOptions.value[0].warehouseCode
})

const showIpn = computed(() => {
  return form.value.cmbtype == 0
})
const showMark = computed(() => {
  return form.value.cmbtype == 3 || form.value.cmbtype == 4
})
const showLocation = computed(() => {
  return form.value.cmbtype == 0 || form.value.cmbtype == 1
})
const showQty = computed(() => {
  return form.value.cmbtype == 0 && form.value.inputtype == 3
})
const enableData = computed(() => {
  return (showIpn.value ? ipn.value : true)
    && (showMark.value ? mark.value : true)
    && (showLocation.value ? locationcode.value : true)
    && (showQty.value ? qty.value : true)
})

const snTotal = computed(() => {
  return tableList.value.reduce((total, item) => {
    return total + item.qty
  }, 0)
})

const state = reactive({
  form: {
    cmbtype: null,
    ipn: null,
    mark: null,
    warehousecode: null,
    locationcode: null,
    inputtype: null,
    qty: null,
    inputdata: null,
    stationname: 'ALL'
  }
})
const { form } = toRefs(state)

const cmbtype = ref(null)
const ipn = ref(null)
const mark = ref(null)
const warehousecode = ref(null)
const locationcode = ref(null)
const inputtype = ref(null)
const qty = ref(null)
const inputdata = ref(null)

const inputIpnRef = ref(null)
const inputMarkRef = ref(null)
const inputLocationRef = ref(null)
const inputQtyRef = ref(null)
const inputDataRef = ref(null)

function changeCmbType() {
  nextTick(() => {
    reset()
  })
}

const ipnLoading = ref(false)
function confirmIpn() {
  if (!form.value.ipn) return

  ipnLoading.value = true
  checkPart({ parm: form.value.ipn }).then(res => {
    ipnLoading.value = false
    proxy.$modal.msgSuccess(res.msg)
    ipn.value = form.value.ipn
    resetLocation()
  }).catch(() => {
    ipnLoading.value = false
  })
}

function confirmMark() {
  if (!form.value.mark) return

  mark.value = form.value.mark
  resetData()
}

function changeWarehouse() {
  resetLocation()
}

const locationLoading = ref(false)
function confirmLocation() {
  if (!form.value.locationcode) return

  locationLoading.value = true
  checkWarehouse({
    warehouseCode: form.value.warehousecode,
    locationCode: form.value.locationcode
  }).then(res => {
    locationLoading.value = false
    proxy.$modal.msgSuccess(res.msg)
    locationcode.value = form.value.locationcode

    if (inputQtyRef.value) {
      resetQty()
    } else {
      resetData()
    }
  }).catch(() => {
    locationLoading.value = false
  })
}

function changeInputType() {
  nextTick(() => {
    if (inputQtyRef.value) resetQty()
  })
}

function confirmQty() {
  if (!form.value.qty) return

  qty.value = form.value.qty
  resetData()
}

const submitLoading = ref(false)
const tableList = ref([])
function confirmData() {
  if (!form.value.inputdata) return
  form.value.stationname = 'ALL'

  submitLoading.value = true
  actionWarehousing(form.value).then(res => {
    submitLoading.value = false
    const text = cmbTypeText.value(form.value.cmbtype)
    proxy.$modal.msgSuccess(text + proxy.$t('warehousing.success'))
    resetData()
    tableList.value.push(...(res.data || []))
  }).catch(() => {
    submitLoading.value = false
  })
}

function reset() {
  form.value.ipn = null
  form.value.mark = null
  form.value.locationcode = null
  form.value.qty = null
  form.value.inputdata = null

  ipn.value = null
  mark.value = null
  locationcode.value = null
  qty.value = null
  inputdata.value = null

  if (inputIpnRef.value) {
    inputIpnRef.value.focus()
  } else if (inputMarkRef.value) {
    inputMarkRef.value.focus()
  } else if (inputLocationRef.value) {
    inputLocationRef.value.focus()
  } else {
    inputDataRef.value.focus()
  }
}

function clearData() {
  reset()
  tableList.value = []
}

function resetLocation() {
  form.value.locationcode = null
  locationcode.value = null
  inputLocationRef.value.focus()
}
function resetQty() {
  form.value.qty = null
  qty.value = null
  inputQtyRef.value.focus()
}
function resetData() {
  form.value.inputdata = null
  inputdata.value = null
  inputDataRef.value.focus()
}

function resetForm() {
  form.value = {
    cmbtype: null,
    ipn: null,
    mark: null,
    warehousecode: null,
    locationcode: null,
    inputtype: null,
    qty: null,
    inputdata: null,
    stationname: 'ALL'
  }
  proxy.resetLuxForm('formRef')
}

const tableHeight = ref(null)
const tableRef = ref(null)
function resizeTable() {
  if (!tableRef.value) return

  let height = window.innerHeight - tableRef.value.$el.getBoundingClientRect().top - 55
  height = Math.floor(height) - 1
  height = Math.max(height, 100)
  tableHeight.value = height + 'px'
}

let appMain
onMounted(() => {
  // 监听页面容器尺寸变化
  let arr = document.getElementsByClassName('app-main')
  appMain = arr[0]
  if (appMain) {
    appMain._ro = new ResizeObserver((entries, observer) => {
      for (const entry of entries) {
        resizeTable()
      }
    })

    appMain._ro.observe(appMain);
  }
})
onBeforeUnmount(() => {
  // 取消监听页面容器尺寸变化
  if (appMain && appMain._ro) appMain._ro.disconnect();
})
</script>

<style lang="scss">
$borderColor: #9ea3a5;
$bgLabel: #f7f8f9;

.table-storage-in {
  .el-form-item {
    width: 100%;
    height: 100%;
    margin-bottom: 0;
    display: flex;
    align-items: center;

    &.form-readonly {
      background: $bgLabel;

      .el-input__inner,
      .el-textarea__inner {
        background: $bgLabel;
      }
    }
  }

  .el-form-item__label {
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    border-right: 1px solid $borderColor;
    font-weight: bold;
  }

  .el-form-item__content {
    width: calc(100% - 110px);
    padding: 8px 4px;
    min-height: 50px;

    >div {
      width: 100%;
    }

    .el-form-item__error {
      left: 15px;
      top: calc(100% - 10px);
    }
  }

  .el-input.is-disabled .el-input__wrapper {
    background: #e8f0f7;
  }

  .el-input__inner,
  .el-textarea__inner {
    border: none;
    border-radius: 0;
  }

  .el-input__inner[type='number'] {
    padding-right: 5px;
  }

  .el-input-group__append {
    background: var(--current-color);
    color: #fff;
  }
}
</style>
<style lang="scss" scoped>
$borderColor: #9ea3a5;
$lineHeight: 24px;

.card-box {
  margin-bottom: 10px;
  padding: 10px;
  background-color: #bbe2f1;
  box-shadow: var(--el-box-shadow-light);
}

.table-storage-in {
  width: 100%;
  box-sizing: border-box;
  border: 1px solid $borderColor;
  border-collapse: separate;
  border-spacing: 0;

  tr {
    width: 100%;
  }

  td {
    width: 25%;
    height: 40px;
    padding: 0;
    position: relative;
    border-right: 1px solid $borderColor;
    border-bottom: 1px solid $borderColor;
  }

  td:first-child {
    border-left: 1px solid $borderColor;
  }

  tr:first-child td {
    border-top: 1px solid $borderColor;
  }

  .tag-item {
    margin-right: 5px;
    margin-bottom: 5px;
    background: #d9ecff33;
    border-color: #b3d8ff;
    color: #606266;

    &.tag-used {
      filter: brightness(1.2) contrast(0.8) grayscale(0.5);
    }
  }

  .info-content {
    width: calc(100% - 30px);
    padding: 4px 15px;
    line-height: $lineHeight;
  }

  .info-list {
    padding: 2px 0;

    >div {
      padding: 0 15px;

      +div {
        border-top: 1px solid $borderColor;
      }
    }
  }
}
</style>