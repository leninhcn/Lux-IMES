<template>
  <div class="processBox">
    <div>
      <svg-icon name="github" />
      <!-- <el-icon color="#67C23A"><Promotion /></el-icon> -->
      <span style="color: #1220e6; font-size: 14px" :model="dataList"> NPI单号：{{ NPINO }} 项目描述:{{ dataList.option1 }}</span>
    </div>
    <div class="timelineProcessBox">
      <el-timeline class="timeline">
        <el-timeline-item
          class="lineitem"
          :class="activity.done ? 'active' : 'inactive'"
          v-for="(activity, index) in activities"
          :key="activity.seq"
          :timestamp="activity.time"
          :color="getColor(activity.status)"
          :icon="getIcon(activity.status)">
          <span style="display: flex; flex-direction: column">
            <span style="color: hsl(229, 30%, 47%); margin: 10px 0; font-size: 12px">
              {{ activity.step }}
            </span>
            <span style="color: #8c8c8c; font-size: 12px">
              {{ activity.status }}
            </span>
            <!-- <span style="color: #8c8c8c; font-size: 12px"> 处理人: {{ activity.emp }} </span> -->
          </span>
        </el-timeline-item>
      </el-timeline>
    </div>
    <div class="collapsediv">
      <el-collapse class="collapse">
        <el-collapse-item title="启动" name="1">
          <div>
            <el-form ref="formRef" :model="dataList" label-width="100px">
              <el-row :gutter="20">
                <el-col :lg="12">
                  <el-form-item label="NPINO" prop="npiNo">
                    <el-input v-model="dataList.npiNo" :readonly="true" />
                  </el-form-item>
                </el-col>
                <el-col :lg="12">
                  <el-form-item label="项目描述" prop="option1">
                    <el-input v-model="dataList.option1" :readonly="true" />
                  </el-form-item>
                </el-col>
                <el-col :lg="12">
                  <el-form-item label="公司名称" prop="companyName">
                    <el-input v-model="dataList.companyName" :readonly="true" />
                  </el-form-item>
                </el-col>

                <el-col :lg="12">
                  <el-form-item label="客户名称" prop="customerName">
                    <el-input v-model="dataList.customerName" :readonly="true" />
                  </el-form-item>
                </el-col>

                <el-col :lg="12">
                  <el-form-item label="料号" prop="ipn">
                    <el-input v-model="dataList.ipn" :readonly="true" />
                  </el-form-item>
                </el-col>

                <el-col :lg="12">
                  <el-form-item label="客户料号" prop="apn">
                    <el-input v-model="dataList.apn" :readonly="true" />
                  </el-form-item>
                </el-col>
                <el-col :lg="12">
                  <el-form-item label="项目试制阶段" prop="projectTrialStage">
                    <el-input v-model="dataList.projectTrialStage" :readonly="true" />
                  </el-form-item>
                </el-col>
                <el-col :lg="12">
                  <el-form-item label="产品类型" prop="productType">
                    <el-input v-model="dataList.productType" :readonly="true" />
                  </el-form-item>
                </el-col>
                <el-col :lg="12">
                  <el-form-item label="产品线" prop="productLine">
                    <el-input v-model="dataList.productLine" :readonly="true" />
                  </el-form-item>
                </el-col>
                <el-col :lg="12">
                  <el-form-item label="研发项目经理" prop="rdManager">
                    <el-input v-model="dataList.rdManager" :readonly="true" />
                  </el-form-item>
                </el-col>
                <el-col :lg="12">
                  <el-form-item label="NPI工程师" prop="npiEngineer">
                    <el-input v-model="dataList.npiEngineer" :readonly="true" />
                  </el-form-item>
                </el-col>

                <el-col :lg="12">
                  <el-form-item label="产品版本" prop="productVersion">
                    <el-input v-model="dataList.productVersion" :readonly="true" />
                  </el-form-item>
                </el-col>

                <el-col :lg="24">
                  <el-form-item label="备注" prop="projectRemark">
                    <el-input type="textarea" v-model="dataList.projectRemark" :readonly="true" />
                  </el-form-item>
                </el-col>
                <el-col :lg="12">
                  <el-form-item label="创建人" prop="projectRemark">
                    <el-input v-model="dataList.createEmpno" :readonly="true" />
                  </el-form-item>
                </el-col>
                <el-col :lg="12">
                  <el-form-item label="创建时间" prop="projectRemark">
                    <el-input v-model="dataList.createTime" :readonly="true" />
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
          </div>
        </el-collapse-item>
        <el-collapse-item title="研发试制准备" name="2" v-if="rditems.status">
          <el-table ref="table" highlight-current-row border :data="rditems.subItems" style="width: 100%">
            <el-table-column prop="dictsort" label="序号" width="50"> </el-table-column>
            <el-table-column prop="name" label="自检项目" width="350"> </el-table-column>
            <el-table-column label="自检结果" width="220">
              <template #default="{ row }">
                <el-radio-group v-model="row.result" :disabled="rditems.commit">
                  <el-radio label="是">是</el-radio>
                  <el-radio label="否">否</el-radio>
                  <el-radio label="不涉及">不涉及</el-radio>
                </el-radio-group>
              </template>
            </el-table-column>
            <el-table-column label="自检备注">
              <template #default="{ row }">
                <el-input v-model="row.remarks" :readonly="rditems.commit" @change="handleScoreChange(row)"> </el-input>
              </template>
            </el-table-column>
          </el-table>
          <el-col :lg="24">
            <!-- <input type="file" ref="fileInput" multiple @change="handleFileChange" /> -->
            <UploadFile
              ref="uploadRef"
              :before-upload="true"
              :fileType="fileType"
              :fileSize="fileSize"
              :drag="false"
              :data="uploadData"
              :autoUpload="false" />
          </el-col>
          <div v-if="rdfileList.length > 0">
            <el-row>
              <el-col :span="3">
                <span class="file-title" style="font-size: 13px; color: #00264d">已上传的文件列表：</span>
              </el-col>
              <el-col :span="21">
                <li class="file-list" v-for="(file, index) in rdfileList" :key="index">
                  <a style="color: #1220e6" :href="file" target="_blank" download>{{ file.substring(file.lastIndexOf('/') + 1) }}</a>
                </li>
              </el-col>
            </el-row>
          </div>
          <el-col :lg="24">
            <el-form-item label="意见" prop="advice">
              <el-input type="textarea" v-model="rditems.advice" :readonly="rditems.commit" placeholder="请输入意见" />
            </el-form-item>
          </el-col>
          <el-col :lg="24">
            <el-row>
              <el-col :span="8">处理人:{{ rditems.update_empno }}</el-col>
              <el-col :span="8">处理时间:{{ rditems.update_time }}</el-col>
            </el-row>
          </el-col>
          <div class="button-container">
            <el-col :lg="24">
              <el-button type="success" v-hasPermi="['business:npiprojet:rditem']" icon="Finished" :disabled="rditems.commit" @click="submitRdItem"
                >提交</el-button
              >
            </el-col>
          </div>
        </el-collapse-item>
        <el-collapse-item title="工厂试制准备PE" name="3" v-if="peitems.status">
          <el-table highlight-current-row border :data="peitems.subItems" style="width: 100%">
            <el-table-column prop="dictsort" label="序号" width="50"> </el-table-column>
            <el-table-column prop="name" label="自检项目" width="300"> </el-table-column>
            <el-table-column label="自检结果" width="220">
              <template #default="{ row }">
                <el-radio-group v-model="row.result" :disabled="peitems.commit">
                  <el-radio label="是">是</el-radio>
                  <el-radio label="否">否</el-radio>
                  <el-radio label="不涉及">不涉及</el-radio>
                </el-radio-group>
              </template>
            </el-table-column>
            <el-table-column label="自检备注">
              <template #default="{ row }">
                <el-input v-model="row.remarks" :readonly="peitems.commit" @change="handleScoreChange(row)"> </el-input>
              </template>
            </el-table-column>
          </el-table>
          <el-col :lg="24">
            <!-- <input type="file" ref="fileInput" multiple @change="handleFileChange" /> -->
            <UploadFile
              ref="uploadRef"
              :before-upload="true"
              :fileType="fileType"
              :fileSize="fileSize"
              :drag="false"
              :data="uploadData"
              :autoUpload="false" />
          </el-col>
          <div v-if="pefileList.length > 0">
            <el-row>
              <el-col :span="3">
                <span class="file-title" style="font-size: 13px; color: #00264d">已上传的文件列表：</span>
              </el-col>
              <el-col :span="21">
                <li class="file-list" v-for="(file, index) in pefileList" :key="index">
                  <a style="color: #1220e6" :href="file" target="_blank" download>{{ file.substring(file.lastIndexOf('/') + 1) }}</a>
                </li>
              </el-col>
            </el-row>
          </div>
          <el-col :lg="12">
            <el-form-item label="意见" prop="advice">
              <el-input type="textarea" v-model="peitems.advice" :readonly="peitems.commit" placeholder="请输入意见" />
            </el-form-item>
          </el-col>
          <el-col :lg="24">
            <el-row>
              <el-col :span="8">处理人:{{ peitems.update_empno }}</el-col>
              <el-col :span="8">处理时间:{{ peitems.update_time }}</el-col>
            </el-row>
          </el-col>
          <div class="button-container">
            <el-col>
              <el-button
                type="success"
                v-hasPermi="['business:npiprojet:peitem']"
                icon="Finished"
                :disabled="peitems.commit"
                @click="submitPeUpload"
                >提交</el-button
              >
            </el-col>
          </div>
        </el-collapse-item>
        <el-collapse-item title="工厂试制准备TE" name="4" v-if="factoryitems.status">
          <el-table highlight-current-row border :data="factoryitems.subItems" style="width: 100%">
            <el-table-column prop="dictsort" label="序号" width="50"> </el-table-column>
            <el-table-column prop="name" label="自检项目" width="300"> </el-table-column>
            <el-table-column label="自检结果" width="220">
              <template #default="{ row }">
                <el-radio-group v-model="row.result" :disabled="factoryitems.commit">
                  <el-radio label="是">是</el-radio>
                  <el-radio label="否">否</el-radio>
                  <el-radio label="不涉及">不涉及</el-radio>
                </el-radio-group>
              </template>
            </el-table-column>
            <el-table-column label="自检备注">
              <template #default="{ row }">
                <el-input v-model="row.remarks" :readonly="factoryitems.commit" @change="handleScoreChange(row)"> </el-input>
              </template>
            </el-table-column>
          </el-table>
          <el-col :lg="24">
            <!-- <input type="file" ref="fileInput" multiple @change="handleFileChange" /> -->
            <UploadFile
              ref="uploadRef"
              :before-upload="true"
              :fileType="fileType"
              :fileSize="fileSize"
              :drag="false"
              :data="uploadData"
              :autoUpload="false" />
          </el-col>
          <div v-if="factoryfileList.length > 0">
            <el-row>
              <el-col :span="3">
                <span class="file-title" style="font-size: 13px; color: #00264d">已上传的文件列表：</span>
              </el-col>
              <el-col :span="21">
                <li class="file-list" v-for="(file, index) in factoryfileList" :key="index">
                  <a style="color: #1220e6" :href="file" target="_blank" download>{{ file.substring(file.lastIndexOf('/') + 1) }}</a>
                </li>
              </el-col>
            </el-row>
          </div>
          <el-col :lg="12">
            <el-form-item label="意见" prop="advice">
              <el-input type="textarea" v-model="factoryitems.advice" :readonly="factoryitems.commit" placeholder="请输入意见" />
            </el-form-item>
          </el-col>
          <el-col :lg="24">
            <el-row>
              <el-col :span="8">处理人:{{ factoryitems.update_empno }}</el-col>
              <el-col :span="8">处理时间:{{ factoryitems.update_time }}</el-col>
            </el-row>
          </el-col>
          <div class="button-container">
            <el-col>
              <el-button
                type="success"
                v-hasPermi="['business:npiprojet:teitem']"
                icon="Finished"
                :disabled="factoryitems.commit"
                @click="submitFactoryUpload"
                >提交</el-button
              >
            </el-col>
          </div>
        </el-collapse-item>

        <el-collapse-item title="工厂试制准备QE" name="5" v-if="qeitems.status">
          <el-table highlight-current-row border :data="qeitems.subItems" style="width: 100%">
            <el-table-column prop="dictsort" label="序号" width="50"> </el-table-column>
            <el-table-column prop="name" label="自检项目" width="300"> </el-table-column>
            <el-table-column label="自检结果" width="220">
              <template #default="{ row }">
                <el-radio-group v-model="row.result" :disabled="qeitems.commit">
                  <el-radio label="是">是</el-radio>
                  <el-radio label="否">否</el-radio>
                  <el-radio label="不涉及">不涉及</el-radio>
                </el-radio-group>
              </template>
            </el-table-column>
            <el-table-column label="自检备注">
              <template #default="{ row }">
                <el-input v-model="row.remarks" :readonly="qeitems.commit" @change="handleScoreChange(row)"> </el-input>
              </template>
            </el-table-column>
          </el-table>
          <el-col :lg="24">
            <!-- <input type="file" ref="fileInput" multiple @change="handleFileChange" /> -->
            <UploadFile
              ref="uploadRef"
              :before-upload="true"
              :fileType="fileType"
              :fileSize="fileSize"
              :drag="false"
              :data="uploadData"
              :autoUpload="false" />
          </el-col>
          <div v-if="qefileList.length > 0">
            <el-row>
              <el-col :span="3">
                <span class="file-title" style="font-size: 13px; color: #00264d">已上传的文件列表：</span>
              </el-col>
              <el-col :span="21">
                <li class="file-list" v-for="(file, index) in qefileList" :key="index">
                  <a style="color: #1220e6" :href="file" target="_blank" download>{{ file.substring(file.lastIndexOf('/') + 1) }}</a>
                </li>
              </el-col>
            </el-row>
          </div>
          <el-col :lg="12">
            <el-form-item label="意见" prop="advice">
              <el-input type="textarea" v-model="qeitems.advice" :readonly="qeitems.commit" placeholder="请输入意见" />
            </el-form-item>
          </el-col>
          <el-col :lg="24">
            <el-row>
              <el-col :span="8">处理人:{{ qeitems.update_empno }}</el-col>
              <el-col :span="8">处理时间:{{ qeitems.update_time }}</el-col>
            </el-row>
          </el-col>
          <div class="button-container">
            <el-col>
              <el-button
                type="success"
                v-hasPermi="['business:npiprojet:qeitem']"
                icon="Finished"
                :disabled="qeitems.commit"
                @click="submitQeUpload"
                >提交</el-button
              >
            </el-col>
          </div>
        </el-collapse-item>
        <el-collapse-item title="工厂试制准备IE" name="6" v-if="ieitems.status">
          <el-table highlight-current-row border :data="ieitems.subItems" style="width: 100%">
            <el-table-column prop="dictsort" label="序号" width="50"> </el-table-column>
            <el-table-column prop="name" label="自检项目" width="300"> </el-table-column>
            <el-table-column label="自检结果" width="220">
              <template #default="{ row }">
                <el-radio-group v-model="row.result" :disabled="ieitems.commit">
                  <el-radio label="是">是</el-radio>
                  <el-radio label="否">否</el-radio>
                  <el-radio label="不涉及">不涉及</el-radio>
                </el-radio-group>
              </template>
            </el-table-column>
            <el-table-column label="自检备注">
              <template #default="{ row }">
                <el-input v-model="row.remarks" :readonly="ieitems.commit" @change="handleScoreChange(row)"> </el-input>
              </template>
            </el-table-column>
          </el-table>
          <el-col :lg="24">
            <!-- <input type="file" ref="fileInput" multiple @change="handleFileChange" /> -->
            <UploadFile
              ref="uploadRef"
              :before-upload="true"
              :fileType="fileType"
              :fileSize="fileSize"
              :drag="false"
              :data="uploadData"
              :autoUpload="false" />
          </el-col>
          <div v-if="iefileList.length > 0">
            <el-row>
              <el-col :span="3">
                <span class="file-title" style="font-size: 13px; color: #00264d">已上传的文件列表：</span>
              </el-col>
              <el-col :span="21">
                <li class="file-list" v-for="(file, index) in iefileList" :key="index">
                  <a style="color: #1220e6" :href="file" target="_blank" download>{{ file.substring(file.lastIndexOf('/') + 1) }}</a>
                </li>
              </el-col>
            </el-row>
          </div>
          <el-col :lg="12">
            <el-form-item label="意见" prop="advice">
              <el-input type="textarea" v-model="ieitems.advice" :readonly="ieitems.commit" placeholder="请输入意见" />
            </el-form-item>
          </el-col>
          <el-col :lg="24">
            <el-row>
              <el-col :span="8">处理人:{{ ieitems.update_empno }}</el-col>
              <el-col :span="8">处理时间:{{ ieitems.update_time }}</el-col>
            </el-row>
          </el-col>
          <div class="button-container">
            <el-col>
              <el-button
                type="success"
                v-hasPermi="['business:npiprojet:ieitem']"
                icon="Finished"
                :disabled="ieitems.commit"
                @click="submitIeUpload"
                >提交</el-button
              >
            </el-col>
          </div>
        </el-collapse-item>
        <el-collapse-item title="工厂试制准备ME" name="7" v-if="meitems.status">
          <el-table highlight-current-row border :data="meitems.subItems" style="width: 100%">
            <el-table-column prop="dictsort" label="序号" width="50"> </el-table-column>
            <el-table-column prop="name" label="自检项目" width="300"> </el-table-column>
            <el-table-column label="自检结果" width="220">
              <template #default="{ row }">
                <el-radio-group v-model="row.result" :disabled="meitems.commit">
                  <el-radio label="是">是</el-radio>
                  <el-radio label="否">否</el-radio>
                  <el-radio label="不涉及">不涉及</el-radio>
                </el-radio-group>
              </template>
            </el-table-column>
            <el-table-column label="自检备注">
              <template #default="{ row }">
                <el-input v-model="row.remarks" :readonly="meitems.commit" @change="handleScoreChange(row)"> </el-input>
              </template>
            </el-table-column>
          </el-table>
          <el-col :lg="24">
            <!-- <input type="file" ref="fileInput" multiple @change="handleFileChange" /> -->
            <UploadFile
              ref="uploadRef"
              :before-upload="handleBeforeUpload"
              :on-exceed="handleExceed"
              :fileType="fileType"
              :fileSize="fileSize"
              :drag="false"
              :data="uploadData"
              :autoUpload="false" />
          </el-col>
          <div v-if="mefileList.length > 0" class="centered-container">
            <el-row>
              <el-col :span="3">
                <span style="font-size: 13px; color: #00264d">已上传的文件列表：</span>
              </el-col>
              <el-col :span="21">
                <li v-for="(file, index) in mefileList" :key="index">
                  <a style="color: #1220e6" :href="file" target="_blank" download>{{ file.substring(file.lastIndexOf('/') + 1) }}</a>
                </li>
              </el-col>
            </el-row>
          </div>
          <el-col :lg="12">
            <el-form-item label="意见" prop="advice">
              <el-input type="textarea" v-model="meitems.advice" :readonly="meitems.commit" placeholder="请输入意见" />
            </el-form-item>
          </el-col>
          <el-col :lg="24">
            <el-row>
              <el-col :span="8">处理人:{{ meitems.update_empno }}</el-col>
              <el-col :span="8">处理时间:{{ meitems.update_time }}</el-col>
            </el-row>
          </el-col>
          <div class="button-container">
            <el-col>
              <el-button
                type="success"
                v-hasPermi="['business:npiprojet:meitem']"
                icon="Finished"
                :disabled="meitems.commit"
                @click="submitMeUpload"
                >提交</el-button
              >
            </el-col>
          </div>
        </el-collapse-item>
        <el-collapse-item title="试制准备完成" name="8" v-if="completeitems.status">
          <!-- <el-table highlight-current-row border :data="meitems.subItems" style="width: 100%">
            <el-table-column prop="dictsort" label="序号" width="50"> </el-table-column>
            <el-table-column prop="name" label="自检项目" width="300"> </el-table-column>
            <el-table-column label="自检结果" width="220">
              <template #default="{ row }">
                <el-radio-group v-model="row.result" :disabled="meitems.commit">
                  <el-radio label="是">是</el-radio>
                  <el-radio label="否">否</el-radio>
                  <el-radio label="不涉及">不涉及</el-radio>
                </el-radio-group>
              </template>
            </el-table-column>
            <el-table-column label="自检备注">
              <template #default="{ row }">
                <el-input v-model="row.remarks" :readonly="meitems.commit" @change="handleScoreChange(row)"> </el-input>
              </template>
            </el-table-column>
          </el-table> -->
          <el-col :lg="24">
            <!-- <input type="file" ref="fileInput" multiple @change="handleFileChange" /> -->
            <UploadFile
              ref="uploadRef"
              :on-change="uploadChange"
              :before-upload="handleBeforeUpload"
              :on-exceed="handleExceed"
              :on-error="handleUploadError"
              :fileType="fileType"
              :fileSize="fileSize"
              :file-list="fileList"
              :drag="false"
              :data="uploadData"
              :autoUpload="false"
              @upload-success="handleUploadSuccess" />
          </el-col>

          <div v-if="completefileList.length > 0">
            <el-row>
              <el-col :span="3">
                <span class="file-title" style="font-size: 13px; color: #00264d">已上传的文件列表：</span>
              </el-col>
              <el-col :span="21">
                <li class="file-list" v-for="(file, index) in completefileList" :key="index">
                  <a style="color: #1220e6" :href="file" target="_blank" download>{{ file.substring(file.lastIndexOf('/') + 1) }}</a>
                </li>
              </el-col>
            </el-row>
          </div>

          <el-col :lg="12">
            <el-form-item label="意见" prop="advice">
              <el-input type="textarea" v-model="completeitems.advice" :readonly="completeitems.commit" placeholder="请输入意见" />
            </el-form-item>
          </el-col>
          <el-col :lg="24">
            <el-row>
              <el-col :span="8">处理人:{{ completeitems.update_empno }}</el-col>
              <el-col :span="8">处理时间:{{ completeitems.update_time }}</el-col>
            </el-row>
          </el-col>
          <div class="button-container">
            <el-col>
              <el-button
                type="success"
                v-hasPermi="['business:npiprojet:completeitem']"
                icon="Finished"
                :disabled="completeitems.commit"
                @click="submitCPleteUpload"
                >提交</el-button
              >
            </el-col>
          </div>
        </el-collapse-item>
        <el-collapse-item title="试制任务令/PO释放" name="9" v-if="orderinfo.status">
          <div>
            <el-table :data="orderinfo.orders" style="width: 100%" border :default-sort="{ prop: 'seq', order: 'ascending' }">
              <el-table-column label="序号" width="50" fixed>
                <template #default="{ row, $index }">
                  {{ $index + 1 }}
                </template>
              </el-table-column>
              <el-table-column prop="ipn" label="编码" width="180">
                <template #default="scope"> <el-input v-model="scope.row.ipn" :readonly="orderinfo.commit"></el-input> </template>
              </el-table-column>
              <el-table-column prop="plan_qty" label="计划试制数量" width="120">
                <template #default="scope"> <el-input v-model="scope.row.plan_qty" :readonly="orderinfo.commit"></el-input> </template>
              </el-table-column>
              <el-table-column prop="lot" label="试制批次" width="200">
                <template #default="scope"> <el-input v-model="scope.row.lot" :readonly="orderinfo.commit"></el-input> </template>
              </el-table-column>
              <el-table-column prop="work_order" label="试制任务令" width="200">
                <template #default="scope"> <el-input v-model="scope.row.work_order" :readonly="orderinfo.commit"></el-input> </template>
              </el-table-column>
              <el-table-column prop="po" label="PO" width="150">
                <template #default="scope"> <el-input v-model="scope.row.po" :readonly="orderinfo.commit"></el-input> </template>
              </el-table-column>
              <el-table-column prop="actual_qty" label="实际试制数量" width="150">
                <template #default="scope"> <el-input v-model="scope.row.actual_qty" :readonly="orderinfo.commit"></el-input> </template>
              </el-table-column>
              <el-table-column label="操作" width="100">
                <template #default="scope">
                  <el-button type="danger" icon="delete" :disabled="orderinfo.commit" @click="deleteRow(scope.$index)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
            <el-button type="primary" :icon="Edit" :disabled="orderinfo.commit" @click="addRow">添加行</el-button>
          </div>
          <el-col :lg="12">
            <el-form-item label="意见" prop="advice">
              <el-input type="textarea" v-model="orderinfo.advice" :readonly="orderinfo.commit" placeholder="请输入意见" />
            </el-form-item>
          </el-col>
          <el-col :lg="24">
            <el-row>
              <el-col :span="8">处理人:{{ orderinfo.update_empno }}</el-col>
              <el-col :span="8">处理时间:{{ orderinfo.update_time }}</el-col>
            </el-row>
          </el-col>
          <div class="button-container">
            <el-col>
              <el-button
                type="success"
                v-hasPermi="['business:npiprojet:orderitem']"
                icon="Finished"
                :disabled="orderinfo.commit"
                @click="submitOrderInfo"
                >提交</el-button
              >
            </el-col>
          </div>
        </el-collapse-item>
        <el-collapse-item title="上传试制报告" name="10" v-if="reportinfo.status">
          <div>
            <el-table :data="reportinfo.orders" style="width: 100%" border :default-sort="{ prop: 'seq', order: 'ascending' }">
              <el-table-column label="序号" width="50" fixed>
                <template #default="{ row, $index }">
                  {{ $index + 1 }}
                </template>
              </el-table-column>
              <el-table-column prop="ipn" label="编码" width="180"> </el-table-column>
              <el-table-column prop="plan_qty" label="计划试制数量" width="120"> </el-table-column>
              <el-table-column prop="lot" label="试制批次" width="200"> </el-table-column>
              <el-table-column prop="work_order" label="试制任务令" width="200"> </el-table-column>
              <el-table-column prop="po" label="PO" width="150"> </el-table-column>
              <el-table-column prop="actual_qty" label="实际试制数量" width="150"> </el-table-column>
              <!-- <el-table-column label="操作" width="100">
                <template #default="scope">
                  <el-button type="danger" icon="delete" :disabled="orderinfo.commit" @click="deleteRow(scope.$index)">删除</el-button>
                </template>
              </el-table-column> -->
            </el-table>
            <!-- <el-button type="primary" :icon="Edit" :disabled="orderinfo.commit" @click="addRow">添加行</el-button> -->
          </div>
          <el-col :lg="24">
            <!-- <input type="file" ref="fileInput" multiple @change="handleFileChange" /> -->
            <UploadFile
              ref="uploadRef"
              :on-change="uploadChange"
              :before-upload="handleBeforeUpload"
              :on-exceed="handleExceed"
              :on-error="handleUploadError"
              :fileType="fileType"
              :fileSize="fileSize"
              :file-list="fileList"
              :drag="false"
              :data="uploadData"
              :autoUpload="false"
              @upload-success="handleUploadSuccess"
              @change="change" />
          </el-col>

          <div v-if="reportfileList.length > 0">
            <el-row>
              <el-col :span="3">
                <el-icon><Document /></el-icon>
                <span class="file-title" style="font-size: 13px; color: #00264d">已上传的文件列表：</span>
              </el-col>
              <el-col :span="21">
                <li class="file-list" v-for="(file, index) in reportfileList" :key="index">
                  <a style="color: #1220e6" :href="file" target="_blank" download>{{ file.substring(file.lastIndexOf('/') + 1) }}</a>
                </li>
              </el-col>
            </el-row>
          </div>
          <el-col :lg="12">
            <el-form-item label="意见" prop="advice">
              <el-input type="textarea" v-model="reportinfo.advice" :readonly="reportinfo.commit" placeholder="请输入意见" />
            </el-form-item>
          </el-col>
          <el-col :lg="24">
            <el-row>
              <el-col :span="8">处理人:{{ reportinfo.update_empno }}</el-col>
              <el-col :span="8">处理时间:{{ reportinfo.update_time }}</el-col>
            </el-row>
          </el-col>
          <div class="button-container">
            <el-col>
              <el-button
                type="success"
                v-hasPermi="['business:npiprojet:reportitem']"
                icon="Finished"
                :disabled="reportinfo.commit"
                @click="submitReportInfo"
                >提交</el-button
              >
            </el-col>
          </div>
        </el-collapse-item>
        <el-collapse-item title="审批日志" name="11">
          <div>
            <el-table :data="approvallog" highlight-current-row border style="width: 100%">
              <el-table-column label="序号" width="50" fixed align="center">
                <template #default="{ row, $index }">
                  {{ $index + 1 }}
                </template>
              </el-table-column>
              <el-table-column prop="STEP" label="节点" align="center"> </el-table-column>
              <el-table-column prop="STATUS" label="状态" align="center" :class-name="getClassName(approvallog.STATUS)"> </el-table-column>
              <el-table-column prop="UPDATE_EMPNO" label="操作人" align="center"> </el-table-column>
              <el-table-column prop="UPDATE_TIME" label="操作时间" align="center"> </el-table-column>
              <el-table-column prop="ADVICE" label="意见" align="center"> </el-table-column>
            </el-table>
          </div>
        </el-collapse-item>
      </el-collapse>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { Delete, Edit, Search, Share, Upload, Check } from '@element-plus/icons-vue'
import {
  GetStepById,
  GetStepInfoById,
  listNpiProjet,
  addRdItem,
  delNpiProjet,
  updateNpiProjet,
  getNpiProjet,
  clearNpiProjet,
  GetOrderInfoById,
  addOrderInfo,
  GetApprovalLogById
} from '@/api/business/npiprojet.js'
import { ElMessage } from 'element-plus'

import UploadFile from './UploadFile.vue'
const { proxy } = getCurrentInstance()

const route = useRoute()

const state = reactive({
  form: {
    storeType: 1
  },
  rules: {
    accessUrl: [
      {
        required: true,
        message: '上传文件不能为空',
        trigger: 'blur'
      }
    ],
    storeType: [
      {
        required: true,
        message: '存储类型不能为空',
        trigger: 'blur'
      }
    ],
    fileName: [
      {
        required: true,
        message: '文件名不能为空',
        trigger: 'blur'
      }
    ]
  },
  queryParams: {
    pageNum: 1,
    pageSize: 20,
    storeType: 1, // 存储类型 1、本地 2、阿里云
    fileId: undefined
  }
})
const selectedFile = ref(null)
const NPIID = route.query.ID
const NPINO = route.query.NPINO
const dataList = ref([])

const { queryParams, form, rules } = toRefs(state)
const uploadData = ref()
const fileList = ref([])

const showItem = ref(true)
const activities = ref([])
const rditems = ref([])
const factoryitems = ref([])
const peitems = ref([])
const qeitems = ref([])
const ieitems = ref([])
const meitems = ref([])

const completeitems = ref([])
const orderinfo = ref([])
const reportinfo = ref([])
const approvallog = ref([])

let factoryfileList = ref([])
let rdfileList = ref([])
let pefileList = ref([])
let qefileList = ref([])
let iefileList = ref([])
let mefileList = ref([])
let completefileList = ref([])
let reportfileList = ref([])

const UploadSuccess = ref(null)
const mockResponse = {
  code: 222200,
  msg: 'Upload successful'
}
const activities1 = ref([
  {
    seq: '1',
    step: '启动',
    time: '2018-04-12 20:46',
    status: '已完成',
    done: true,
    color: 'bule',
    advice: '',
    emp: '1111',
    url: ''
  },
  {
    seq: '2',
    step: '研发试制准备',
    status: '已完成',
    done: true,
    time: '2018-04-03 20:46',
    color: 'bule',
    advice: '',
    emp: '',
    url: ''
  },
  {
    seq: '3',
    step: '工厂试制准备',
    status: '进行中',
    done: false,
    time: '',
    color: '#50f637',
    advice: '',
    emp: '',
    url: ''
  },
  {
    seq: '4',
    step: '终审',
    done: false,
    status: '未开始',
    time: '',
    color: '',
    advice: '',
    emp: '',
    url: ''
  },
  {
    content: '已发布',
    people: '未开始',
    done: false,
    time: '',
    advice: '',
    emp: '',
    url: ''
  }
])
const tableData = {
  advice: 'Level 1 Item 1',
  status: true,
  commit: true,
  subItems: [
    {
      dictsort: '1',
      name: '装箱清单是否归档或确认',
      remarks: '222222222222',
      result: '是'
    },
    {
      dictsort: '2',
      name: '产品软件是否已归档?',
      remarks: '3333333',
      result: '不涉及'
    }
  ]
}
const tableData1 = {
  remark: 'Level 1 Item 2',
  status: true, //页签是否显示 v-if？
  commit: false, //按钮不可用disabled？
  subItems: [
    {
      id: '1',
      name: '厂商的烧录器是否已到位',
      score: '',
      result: '是'
    },
    {
      id: '2',
      name: '测试环境、含测试仪器是否已到位，并已完成验收',
      score: '',
      result: '不涉及'
    },
    {
      id: '3',
      name: '钢网、DIP载具等工具、治具是否已到位',
      score: '',
      result: '不涉及'
    },
    {
      id: '4',
      name: '钢网、DIP载具等工具、治具是否已到位',
      score: '',
      result: '不涉及'
    },
    {
      id: '5',
      name: '钢网、DIP载具等工具、治具是否已到位',
      score: '',
      result: '不涉及'
    },
    {
      id: '6',
      name: '钢网、DIP载具等工具、治具是否已到位',
      score: '',
      result: '不涉及'
    },
    {
      id: '7',
      name: '钢网、DIP载具等工具、治具是否已到位',
      score: '',
      result: '不涉及'
    },
    {
      id: '8',
      name: '钢网、DIP载具等工具、治具是否已到位',
      score: '',
      result: '不涉及'
    }
  ]
}
const tableData2 = ref([
  {
    serialNumber: 1,
    code: 'A001',
    quantity: 10,
    batch: '20230101'
  }
  // ... 你可以添加更多的行数据
])
// ...更多数据

function getClassName(row) {
  console.log(row)
  if (row === '已完成') {
    return 'status-success'
  } else if (row === '进行中') {
    return 'status-warning'
  } else if (row === '未开始') {
    return 'status-danger'
  }
}

const handleScoreChange = (row) => {
  // 处理分数变更的逻辑
  // console.log(row.name + '分数变更为:', row.remarks)
}

function getList() {
  getNpiProjet(NPIID).then((res) => {
    //console.log(res.data)
    dataList.value = res.data
  })
}
function GetStep() {
  GetStepById(NPIID).then((res) => {
    activities.value = res.data
    if (res.data[3].url.endsWith(';')) {
      factoryfileList.value = res.data[3].url.slice(0, -1).split(';') // TE文档
      // console.log(factoryfileList)
    }
    if (res.data[1].url.endsWith(';')) {
      rdfileList.value = res.data[1].url.slice(0, -1).split(';') // rd项目文档
    }
    if (res.data[2].url.endsWith(';')) {
      pefileList.value = res.data[2].url.slice(0, -1).split(';') // pe项目文档
    }
    if (res.data[4].url.endsWith(';')) {
      qefileList.value = res.data[4].url.slice(0, -1).split(';') // qe项目文档
    }
    if (res.data[5].url.endsWith(';')) {
      iefileList.value = res.data[5].url.slice(0, -1).split(';') // ie项目文档
    }
    if (res.data[6].url.endsWith(';')) {
      mefileList.value = res.data[6].url.slice(0, -1).split(';') // me项目文档
    }
    if (res.data[7].url.endsWith(';')) {
      completefileList.value = res.data[7].url.slice(0, -1).split(';') // 试制准备完成
    }
    if (res.data[9].url.endsWith(';')) {
      reportfileList.value = res.data[9].url.slice(0, -1).split(';') // 试制准备完成
    }
    //console.log(factoryfileList)
    //console.log(res.data)
  })
}
function GetStepInfo() {
  GetStepInfoById(NPIID, '研发试制准备').then((res) => {
    rditems.value = res.data
    rditems.value.step = '研发试制准备'

    //console.log(rditems)
    // console.log(activities1)
  })
}

function GetApprovalLog() {
  GetApprovalLogById(NPIID).then((res) => {
    approvallog.value = res
    // console.log(approvallog.value)
    // console.log(activities1)
  })
}
function GetFactoryInfo() {
  GetStepInfoById(NPIID, '工厂试制准备TE').then((res) => {
    factoryitems.value = res.data
    factoryitems.value.step = '工厂试制准备TE'
    // console.log(factoryitems)
    // console.log(activities1)
  })
}
function GetFeInfo() {
  GetStepInfoById(NPIID, '工厂试制准备PE').then((res) => {
    peitems.value = res.data
    peitems.value.step = '工厂试制准备PE'
    // console.log(factoryitems)
    // console.log(activities1)
  })
}
function GetQeInfo() {
  GetStepInfoById(NPIID, '工厂试制准备QE').then((res) => {
    qeitems.value = res.data
    qeitems.value.step = '工厂试制准备QE'
    // console.log(factoryitems)
    // console.log(activities1)
  })
}
function GetIeInfo() {
  GetStepInfoById(NPIID, '工厂试制准备IE').then((res) => {
    ieitems.value = res.data
    ieitems.value.step = '工厂试制准备IE'
    // console.log(factoryitems)
    // console.log(activities1)
  })
}
function GetMeInfo() {
  GetStepInfoById(NPIID, '工厂试制准备ME').then((res) => {
    meitems.value = res.data
    meitems.value.step = '工厂试制准备ME'
    // console.log(factoryitems)
    // console.log(activities1)
  })
}
function GetcompleteInfo() {
  GetStepInfoById(NPIID, '试制准备完成').then((res) => {
    completeitems.value = res.data
    completeitems.value.step = '试制准备完成'
    // console.log(factoryitems)
    // console.log(activities1)
  })
}

function GetOrderInfo() {
  GetOrderInfoById(NPIID, '试制任务令PO释放').then((res) => {
    orderinfo.value = res.data
    orderinfo.value.step = '试制任务令PO释放'
    // console.log(res.data)

    //console.log(orderinfo.value)
    // console.log(activities1)
  })
}

function GetReportInfo() {
  GetOrderInfoById(NPIID, '上传试制报告').then((res) => {
    reportinfo.value = res.data
    reportinfo.value.step = '上传试制报告'

    //console.log(reportinfo.value)
    // console.log(activities1)
  })
}
function addRow() {
  const newRow = {
    ipn: '',
    plan_qty: '',
    lot: '',
    work_order: '', // 添加一个唯一的 id 属性用于序号显示
    po: '',
    actual_qty: '',
    seq: ''
  }
  orderinfo.value.orders.push(newRow)
}
function deleteRow(index, rows) {
  //const index = orderinfo.value.orders.findIndex((row) => row.id === id)
  if (index !== -1) {
    orderinfo.value.orders.splice(index, 1) // 删除找到的行
  }
}
async function submitRdItem() {
  rditems.value.id = NPIID
  // console.log(rditems)
  for (const item of rditems.value.subItems) {
    if (!item.result) {
      ElMessage.error('请输入序号' + item.dictsort + ':' + item.name + ',检查结果！')
      return
    }
  }
  uploadData.value = {
    fileDir: 'NPI//' + NPINO,
    fileName: '',
    storeType: '1',
    fileNameType: '1',
    id: NPIID,
    npino: NPINO,
    step: '研发试制准备'
  }

  await proxy.$refs.uploadRef.submitUpload()
  setTimeout(async () => {
    await addRdItem(rditems.value).then((res) => {
      ElMessage.success('提交成功！')
      getList()
      GetStep()
      GetStepInfo()
      GetFactoryInfo()
      GetFeInfo()
      GetQeInfo()
      GetIeInfo()
      GetMeInfo()
      GetcompleteInfo()
      GetApprovalLog()
    })
  }, 2000)
}
//te
async function submitFactoryUpload() {
  factoryitems.value.id = NPIID

  for (const item of factoryitems.value.subItems) {
    if (!item.result) {
      ElMessage.error('请输入序号' + item.dictsort + ':' + item.name + ',检查结果！')
      return
    }
  }

  uploadData.value = {
    fileDir: 'NPI//' + NPINO,
    fileName: '',
    storeType: '1',
    fileNameType: '1',
    id: NPIID,
    npino: NPINO,
    step: '工厂试制准备TE'
  }

  await proxy.$refs.uploadRef.submitUpload()
  setTimeout(async () => {
    await addRdItem(factoryitems.value).then((res) => {
      ElMessage.success('提交成功！')
      getList()
      GetStep()
      GetStepInfo()
      GetFactoryInfo()
      GetFeInfo()
      GetQeInfo()
      GetIeInfo()
      GetMeInfo()
      GetcompleteInfo()
      GetApprovalLog()
    })
  }, 2000)
}
//pe
async function submitPeUpload() {
  peitems.value.id = NPIID

  for (const item of peitems.value.subItems) {
    if (!item.result) {
      ElMessage.error('请输入序号' + item.dictsort + ':' + item.name + ',检查结果！')
      return
    }
  }

  uploadData.value = {
    fileDir: 'NPI//' + NPINO,
    fileName: '',
    storeType: '1',
    fileNameType: '1',
    id: NPIID,
    npino: NPINO,
    step: '工厂试制准备PE'
  }

  await proxy.$refs.uploadRef.submitUpload()
  setTimeout(async () => {
    await addRdItem(peitems.value).then((res) => {
      ElMessage.success('提交成功！')
      getList()
      GetStep()
      GetStepInfo()
      GetFactoryInfo()
      GetFeInfo()
      GetQeInfo()
      GetIeInfo()
      GetMeInfo()
      GetcompleteInfo()
      GetApprovalLog()
    })
  }, 2000)
}
//QE
async function submitQeUpload() {
  qeitems.value.id = NPIID

  for (const item of qeitems.value.subItems) {
    if (!item.result) {
      ElMessage.error('请输入序号' + item.dictsort + ':' + item.name + ',检查结果！')
      return
    }
  }

  uploadData.value = {
    fileDir: 'NPI//' + NPINO,
    fileName: '',
    storeType: '1',
    fileNameType: '1',
    id: NPIID,
    npino: NPINO,
    step: '工厂试制准备QE'
  }

  await proxy.$refs.uploadRef.submitUpload()
  setTimeout(async () => {
    await addRdItem(qeitems.value).then((res) => {
      ElMessage.success('提交成功！')
      getList()
      GetStep()
      GetStepInfo()
      GetFactoryInfo()
      GetFeInfo()
      GetQeInfo()
      GetIeInfo()
      GetMeInfo()
      GetcompleteInfo()
      GetApprovalLog()
    })
  }, 2000)
}
//IE
async function submitIeUpload() {
  ieitems.value.id = NPIID

  for (const item of ieitems.value.subItems) {
    if (!item.result) {
      ElMessage.error('请输入序号' + item.dictsort + ':' + item.name + ',检查结果！')
      return
    }
  }

  uploadData.value = {
    fileDir: 'NPI//' + NPINO,
    fileName: '',
    storeType: '1',
    fileNameType: '1',
    id: NPIID,
    npino: NPINO,
    step: '工厂试制准备IE'
  }

  await proxy.$refs.uploadRef.submitUpload()
  setTimeout(async () => {
    await addRdItem(ieitems.value).then((res) => {
      ElMessage.success('提交成功！')
      getList()
      GetStep()
      GetStepInfo()
      GetFactoryInfo()
      GetFeInfo()
      GetQeInfo()
      GetIeInfo()
      GetMeInfo()
      GetcompleteInfo()
      GetApprovalLog()
    })
  }, 2000)
}
//ME
async function submitMeUpload() {
  meitems.value.id = NPIID

  for (const item of meitems.value.subItems) {
    if (!item.result) {
      ElMessage.error('请输入序号' + item.dictsort + ':' + item.name + ',检查结果！')
      return
    }
  }

  uploadData.value = {
    fileDir: 'NPI//' + NPINO,
    fileName: '',
    storeType: '1',
    fileNameType: '1',
    id: NPIID,
    npino: NPINO,
    step: '工厂试制准备ME'
  }

  await proxy.$refs.uploadRef.submitUpload()
  setTimeout(async () => {
    await addRdItem(meitems.value).then((res) => {
      ElMessage.success('提交成功！')
      getList()
      GetStep()
      GetStepInfo()
      GetFactoryInfo()
      GetFeInfo()
      GetQeInfo()
      GetIeInfo()
      GetMeInfo()
      GetcompleteInfo()
      GetApprovalLog()
    })
  }, 2000)
}

//试制准备完成
async function submitCPleteUpload() {
  completeitems.value.id = NPIID

  // for (const item of completeitems.value.subItems) {
  //   if (!item.result) {
  //     ElMessage.error('请输入序号' + item.dictsort + ':' + item.name + ',检查结果！')
  //     return
  //   }
  // }
  uploadData.value = {
    fileDir: 'NPI//' + NPINO,
    fileName: '',
    storeType: '1',
    fileNameType: '1',
    id: NPIID,
    npino: NPINO,
    step: '试制准备完成'
  }

  await proxy.$refs.uploadRef.submitUpload()
  setTimeout(async () => {
    await addRdItem(completeitems.value).then((res) => {
      ElMessage.success('提交成功！')
      getList()
      GetStep()
      GetStepInfo()
      GetFactoryInfo()
      GetFeInfo()
      GetQeInfo()
      GetIeInfo()
      GetMeInfo()
      GetcompleteInfo()
      GetOrderInfo()
      GetReportInfo()
      GetApprovalLog()
    })
  }, 2000)
}

//释放po
function submitOrderInfo() {
  orderinfo.value.id = NPIID
  //console.log(orderinfo.value)
  addOrderInfo(orderinfo.value).then((res) => {
    ElMessage.success('提交成功！')
    getList()
    GetStep()
    GetStepInfo()
    GetFactoryInfo()
    GetFeInfo()
    GetQeInfo()
    GetIeInfo()
    GetMeInfo()
    GetcompleteInfo()
    GetOrderInfo()
    GetReportInfo()
    GetApprovalLog()
  })
}
//试制准备完成
async function submitReportInfo() {
  reportinfo.value.id = NPIID
  reportinfo.value.step = '上传试制报告'
  //console.log(hasFileUploaded.value)

  // for (const item of completeitems.value.subItems) {
  //   if (!item.result) {
  //     ElMessage.error('请输入序号' + item.dictsort + ':' + item.name + ',检查结果！')
  //     return
  //   }
  // }

  uploadData.value = {
    fileDir: 'NPI//' + NPINO,
    fileName: '',
    storeType: '1',
    fileNameType: '1',
    id: NPIID,
    npino: NPINO,
    step: '上传试制报告'
  }

  await proxy.$refs.uploadRef.submitUpload()
  setTimeout(async () => {
    await addOrderInfo(reportinfo.value).then((res) => {
      ElMessage.success('提交成功！')
      getList()
      GetStep()
      GetStepInfo()
      GetFactoryInfo()
      GetFeInfo()
      GetQeInfo()
      GetIeInfo()
      GetMeInfo()
      GetcompleteInfo()
      GetOrderInfo()
      GetReportInfo()
      GetApprovalLog()
    })
  }, 2000)
}
// 上传成功方法
// function handleUploadSuccess(response) {
//   //console.log('response:', response)
//   //UploadSuccess.value = response.code
//   console.log('UploadSuccess:', response.code)
//   if (response.code == 200) {
//     // 在这里执行你需要的操作
//     // 上传成功时的处理逻辑
//     //console.log('文件上传成功:', res)
//     addRdItem(completeitems.value).then((res) => {
//       ElMessage.success('提交成功！')
//       getList()
//       GetStep()
//       GetStepInfo()
//       GetFactoryInfo()
//       GetFeInfo()
//       GetQeInfo()
//       GetIeInfo()
//       GetMeInfo()
//       GetcompleteInfo()
//     })
//   }
// }

// function submitFactoryUpload() {
//   proxy.$refs['formRef'].validate((valid) => {
//     if (valid) {
//       factoryitems.value.id = NPIID
//       // console.log(rditems)
//       for (const item of factoryitems.value.subItems) {
//         if (!item.result) {
//           ElMessage.error('请输入序号' + item.dictsort + ':' + item.name + ',检查结果！')
//           return
//         }
//       }
//       addRdItem(factoryitems.value).then((res) => {
//        // ElMessage.success('提交成功！')
//       })
//       var result = new Promise((resolve) => {
//         uploadData.value = {
//           fileDir: 'NPI//' + NPINO,
//           fileName: '',
//           storeType: '1',
//           fileNameType: '1',
//           id: NPIID,
//           npino: NPINO,
//           step: '工厂试制准备'
//         }
//         resolve(true)
//       })
//       //使用异步解决第一次上次获取不到表单的值
//       result.then(() => {
//         proxy.$refs.uploadRef.submitUpload()
//         getList()
//         GetStep()
//         GetStepInfo()
//         GetFactoryInfo()
//         console.log('sxxxx')
//       })
//     }
//   })
// }
// 使用普通函数而不是计算属性，因为 <script setup> 中不需要显式返回任何东西
function getColor(status) {
  switch (status) {
    case '未开始':
      return 'gainsboro'
    case '已完成':
      return 'green'
    case '进行中':
      return 'red'
    // return '#50f637'
  }
}
function getIcon(status) {
  switch (status) {
    case '未开始':
      return 'User'
    case '已完成':
      return 'SuccessFilled'
    case '进行中':
      return 'Clock'
    default:
      return 'black'
  }
}
onMounted(() => {
  getList() // 页面加载时执行 fetchData 函数
  GetStep()
  GetStepInfo()
  GetFactoryInfo()
  GetFeInfo()
  GetQeInfo()
  GetIeInfo()
  GetMeInfo()
  GetcompleteInfo()
  GetOrderInfo()
  GetReportInfo()
  GetApprovalLog()
})
</script>

<style lang="scss" scoped>
.processBox {
  //background-color: #ffffff;
  height: 100px;

  .title {
    font-size: 16px;
    font-weight: 100;
    padding-left: 32px;
    padding-top: 1px;
    height: 1px;
  }
  .timelineProcessBox {
    .timeline {
      display: flex;
      width: 100%;
      margin: 5px auto;
      .lineitem {
        transform: translateX(10%);
        width: 25%;
      }
    }
  }
  .collapsediv {
    padding-top: 80px;
    color: rgb(144, 127, 255);
    .collapse {
      color: aquamarine;
      .el-collapse-item__header {
        background-color: #f0f0f0;
        border: 1px solid #e4e7ed;
      }
    }
  }
  .button-container {
    text-align: center;
  }

  .status-success {
    background-color: green;
  }

  .status-warning {
    background-color: orange;
  }

  .status-danger {
    background-color: red;
  }
}

/* 调整图标大小 */
:deep(.el-timeline-item__icon) {
  font-size: 15px; /* 修改为你想要的大小 */
}
/* 这里可以指定特定时间轴项的颜色 */

:deep(.el-timeline-item__tail) {
  border-left: none;
  border-top: 2px solid #dde4ea;
  width: 100%;
  position: absolute;
  top: 6px;
}
:deep(.el-timeline-item__wrapper) {
  padding-left: 0;
  position: absolute;
  top: 5px;
  transform: translateX(-50%);
  text-align: center;
}
:deep(.el-timeline-item__timestamp) {
  font-size: 12px;
}
:deep(.el-timeline-item__node--normal) {
  width: 15px;
  height: 15px;
}
.active {
  :deep(.el-timeline-item__node) {
    background-color: #1ef562;
  }
  :deep(.el-timeline-item__tail) {
    border-color: dodgerblue;
  }
}
// 有active样式的下一个li
.active + li {
  :deep(.el-timeline-item__node) {
    background-color: rgb(41, 235, 38);
  }
}
// :deep(.el-collapse-item__header) {
//   font-size: 14px;
//   color: #3c16f6;
//   // margin: 10px 0px 20px 0px;
//   border-bottom: 1px solid #e3e2e7;
// }

:deep(.collapse-title) {
  flex: 0 1 40%; //居中
  order: 1;
  border: none;
}

:deep(.el-collapse-item__header) {
  color: #3c16f6;
  // margin: 10px 0px 20px 0px;
  border-bottom: 1px solid #e3e2e7;
}

//激活方向
:deep(.el-collapse-item__arrow.is-active) {
  transform: rotate(-90deg);
}
//  默认方向
:deep(.el-collapse-item__arrow, .el-tabs__nav) {
  transform: rotate(90deg);
}
</style>
