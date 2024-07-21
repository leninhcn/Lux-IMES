<template>
  <div class="warpper">
    <header>{{ $t('inscription.InVer') }}</header>
    <div class="box">
      <el-form class="form" ref="formRef" :model="form" :rules="rules" size="large" label-width="80">
        <el-form-item label="reelNo" prop="reelNo">
          <el-input v-model="form.reelNo" :placeholder="$t('common.inputTip')" clearable @keyup.enter="verifyReelid" />
        </el-form-item>
        <el-form-item :label="$t('part.IPN')" prop="ipn">
          <el-input v-model="form.ipn" readonly :placeholder="$t('common.autoTip')" clearable />
        </el-form-item>
        <el-form-item :label="$t('inscription.inscription')" prop="inscription">
          <el-input
            ref="inputRef"
            type="textarea"
            :autosize="{ minRows: 4, maxRows: 6 }"
            v-model="form.inscription"
            :placeholder="$t('common.inputTip')"
            clearable />
        </el-form-item>
        <el-form-item>
          <el-button class="form-button" type="primary" icon="Key" :loading="loading" @click="verify(formRef)">{{ $t('btn.verify') }}</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script setup name="tableverification">
import { verification, validate } from '@/api/datacenter/qualitymanagement/tableVerification'
const { proxy } = getCurrentInstance()
// 表单
const formRef = ref()
const form = reactive({
  reelNo: '',
  ipn: '',
  inscription: ''
})

// 表单验证规则
const rules = reactive({
  ipn: [{ required: true, message: proxy.$t('common.inputTip'), trigger: 'blur' }],
  inscription: [{ required: true, message: proxy.$t('common.inputTip'), trigger: 'blur' }]
})

// 验证按钮的 loading 状态
const loading = ref(false)

const inputRef = ref()

// 验证 reelid
const verifyReelid = async () => {
  if (!form.reelNo) return
  const res = await verification({ reelNo: form.reelNo })
  if (res.length === 0) {
    proxy.$modal.msgWarning(proxy.$t('common.noData'))
    inputRef.value.focus()
  } else {
    form.ipn = res[0].IPN
  }
}

// 验证
const verify = async (formEl) => {
  if (!formEl) return
  await formEl.validate(async (valid, fields) => {
    if (!valid) return
    loading.value = true
    try {
      const res = await validate(form)
      if (res === 1) {
        proxy.$modal.msgSuccess(form.reelNo + proxy.$t('inscription.InVer') + proxy.$t('common.operationSuccess'))
        formEl.resetFields()
      } else {
        proxy.$modal.msgError(proxy.$t('inscription.InVer') + proxy.$t('common.operationFail'))
      }
    } finally {
      loading.value = false
    }
  })
}
</script>

<style lang="scss" scoped>
.warpper {
  padding: 20px;
  height: 100%;
  background: #e2e8f0;
  border-radius: 10px;

  header {
    margin-bottom: 10px;
    font-size: 20px;
    font-weight: bold;
    text-align: center;
    padding: 10px 0;
    background: #fff;
    border-radius: 10px;
    box-shadow: rgba(17, 17, 26, 0.05) 0px 1px 0px, rgba(17, 17, 26, 0.1) 0px 0px 8px;
  }

  .box {
    padding: 20px;
    background: #fff;
    border-radius: 10px;
    box-shadow: rgba(17, 17, 26, 0.05) 0px 1px 0px, rgba(17, 17, 26, 0.1) 0px 0px 8px;

    .form {
      margin: 0 50px;
    }

    .form-button {
      margin: 30px 100px;
      width: 100%;
    }
  }
}
</style>
