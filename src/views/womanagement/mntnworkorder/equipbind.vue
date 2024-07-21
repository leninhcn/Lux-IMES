<template>
  <el-dialog :title="$t('mntnworkorder.equip.EquipmentBind')" :model-value="open" width="460px" append-to-body
    :close-on-click-modal="false" @close="close">
    <el-form ref="formRef" :model="formData" :rules="rules" label-width="80px">
      <el-form-item :label="$t('mntnworkorder.equip.workOrder[1]')" prop="workOrder">
        <el-input :model-value="formData.workOrder" :placeholder="$t('mntnworkorder.equip.workOrder[2]')" readonly />
      </el-form-item>
      <el-form-item :label="$t('mntnworkorder.equip.equipmentCode[1]')" prop="equipmentCode">
        <el-input v-model.trim="formData.equipmentCode" :placeholder="$t('mntnworkorder.equip.equipmentCode[2]')" />
      </el-form-item>
      <el-form-item :label="$t('mntnworkorder.equip.companyName[1]')" prop="companyName">
        <el-input v-model.trim="formData.companyName" :placeholder="$t('mntnworkorder.equip.companyName[2]')" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button text @click="close">{{ $t('btn.cancel') }}</el-button>
      <el-button type="primary" :loading="submitLoading" @click="submitForm">{{ $t('btn.submit') }}</el-button>
    </template>
  </el-dialog>
</template>

<script setup name="woequipbind">
import { updateEquipment } from '@/api/womanagement/mntnworkorder'
const { proxy } = getCurrentInstance()

const emit = defineEmits(['close', 'update:open', 'success'])
const props = defineProps({
  open: {
    type: Boolean,
    default: false
  },
  form: {
    type: Object,
    default: {}
  }
})
const state = reactive({
  formData: {}
})
const { formData } = toRefs(state)
const rules = computed(() => {
  return {
    workOrder: [{ required: true, message: proxy.$t('mntnworkorder.equip.workOrder[3]'), trigger: 'blur' }],
    equipmentCode: [{ required: true, message: proxy.$t('mntnworkorder.equip.equipmentCode[3]'), trigger: 'blur' }],
    companyName: [{ required: true, message: proxy.$t('mntnworkorder.equip.companyName[3]'), trigger: 'blur' }],
  }
})
watch(
  () => props.open,
  (nVal, oVal) => {
    if (nVal) {
      resetForm()
      const { workOrder, equipmentCode, companyName } = props.form
      formData.value = {
        workOrder: workOrder || null,
        equipmentCode: equipmentCode || null,
        companyName: companyName || null
      }
    }
  }
)

function close() {
  emit('update:open', false)
  emit('close')
}

function resetForm() {
  formData.value = {
    workOrder: null,
    equipmentCode: null,
    companyName: null
  }
  proxy.resetForm('formRef')
}

const submitLoading = ref(false)
const formRef = ref(null)
function submitForm() {
  formRef.value.validate((valid) => {
    if (valid) {
      submitLoading.value = true
      updateEquipment(formData.value).then((response) => {
        submitLoading.value = false
        proxy.$modal.msgSuccess(proxy.$t('mntnworkorder.equip.BindOK'))
        emit('success')
        close()
      }).catch(() => {
        submitLoading.value = false
      })
    }
  })
}
</script>