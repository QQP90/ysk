<template>
  <div>
    <div class="wrapper-c" v-show="isReady">
      <!--<div  class="header">-->
      <div v-if="!isNewDoctor" class="header">
        <div class="title"></div>
        <div class="org">修改前</div>
        <div class="new">修改后</div>
      </div>
      <div class="audit-box">
        <div class="item"></div>
        <div class="item" style="padding:30px 0px 10px 0;">
          <div class="title">头像：</div>
          <div class="org" v-if="!isNewDoctor">
            <img
              crossOrigin="anonymous"
              v-if="doctorInfo_Org.headPortrait"
              class="avatar"
              :src="
                doctorInfo_Org.headPortraitCorrect
                  ? doctorInfo_Org.headPortraitCorrect.replace('/#/', '/org/')
                  : doctorInfo_Org.headPortrait.replace('/#/', '/org/')
              "
              title="点击查看大图"
              @click="
                handleView(
                  doctorInfo_Org.headPortraitCorrect
                    ? doctorInfo_Org.headPortraitCorrect.replace('/#/', '/org/')
                    : doctorInfo_Org.headPortrait.replace('/#/', '/org/')
                )
              "
            />
          </div>
          <div
            :class="
              renderNewItemClass(
                doctorInfo_Org.headPortraitCorrect,
                doctorInfo_New.headPortraitCorrect
              )
            "
            @mouseenter="isAvatarIconShow = true"
            @mouseleave="isAvatarIconShow = false"
          >
            <!--                  <img crossOrigin = 'anonymous' v-if="doctorInfo_New.headPortraitCorrect" class="avatar" :src="doctorInfo_New.headPortraitCorrect.replace('/#/','/org/')"  />-->
            <img
              crossOrigin="anonymous"
              v-if="doctorInfo_New.headPortrait"
              class="avatar"
              :src="
                doctorInfo_New.headPortrait
                  ? doctorInfo_New.headPortrait.replace('/#/', '/org/')
                  : doctorInfo_New.headPortraitCorrect.replace('/#/', '/org/')
              "
            />
            <div class="headPortraitCorrect-icon r-row" v-if="isAvatarIconShow">
              <span
                v-if="doctorInfo_New.headPortrait"
                class="icon-chakan"
                title="查看"
                @click="
                  handleView(
                    doctorInfo_New.headPortraitCorrect
                      ? doctorInfo_New.headPortraitCorrect.replace(
                          '/#/',
                          '/org/'
                        )
                      : doctorInfo_New.headPortrait.replace('/#/', '/org/')
                  )
                "
              ></span>
              <Upload
                :action="uploadUrl"
                :show-upload-list="false"
                :format="['jpg', 'jpeg', 'png']"
                :max-size="2048"
                :on-format-error="handleFormatError"
                :on-success="handleUploadSuccess"
              >
                <Icon
                  type="ios-camera"
                  class="ios-camera"
                  title="重新上传"
                  size="30"
                ></Icon>
              </Upload>
              <span
                v-if="doctorInfo_New.headPortraitCorrect"
                class="icon-caijian"
                title="裁剪"
                @click="
                  handleClip(
                    doctorInfo_New.headPortraitCorrect.replace('/#/', '/org/')
                  )
                "
              ></span>
            </div>
          </div>
        </div>
        <div class="item">
          <div class="title">姓名：</div>
          <div class="org" v-if="!isNewDoctor">{{ doctorInfo_Org.name }}</div>
          <Input
            :class="
              renderNewItemClass(doctorInfo_Org.name, doctorInfo_New.name)
            "
            v-model="doctorInfo_New.name"
          />
        </div>
        <div class="item">
          <div class="title">性别：</div>
          <div class="org" v-if="!isNewDoctor">
            {{ renderSex(doctorInfo_Org.sex) }}
          </div>
          <div
            :class="renderNewItemClass(doctorInfo_Org.sex, doctorInfo_New.sex)"
          >
            <Select v-model="doctorInfo_New.sex">
              <Option :value="1" label="男"></Option>
              <Option :value="2" label="女"></Option>
              <Option :value="0" label="未知"></Option>
            </Select>
          </div>
        </div>
        <div class="item">
          <div class="title">所属省/市/区：</div>
          <div class="org" v-if="!isNewDoctor">
            <Cascader
              class="areas old-areas"
              disabled
              :data="allAreas"
              v-model="currentAreaOld"
            ></Cascader>
          </div>
          <div
            :class="
              renderNewItemClass(
                doctorInfo_Org.hospitalName + doctorInfo_Org.labName,
                doctorInfo_New.hospitalName + doctorInfo_New.labName
              )
            "
          >
            <Cascader
              class="areas"
              :data="allAreas"
              v-model="currentArea"
            ></Cascader>
          </div>
        </div>
        <div class="item">
          <div class="title">所属医院-科室：</div>
          <div class="org" v-if="!isNewDoctor">
            {{ doctorInfo_Org.hospitalName }}-{{ doctorInfo_Org.labName }}
          </div>
          <div class="new">
            <div
              class="hos-item"
              :class="
                renderNewItemClass2(
                  doctorInfo_Org.hospitalName,
                  doctorInfo_New.hospitalName
                )
              "
            >
              <span>{{ doctorInfo_New.hospitalName }}</span>
              <span
                class="icon-xuanze"
                title="选择医院"
                @click="handleOpenHospital"
              ></span>
            </div>
            <div class="hos-item hos-line">
              <span>&nbsp;一&nbsp;&nbsp;</span>
            </div>
            <div
              class="hos-item"
              :class="
                renderNewItemClass2(
                  doctorInfo_Org.labName,
                  doctorInfo_New.labName
                )
              "
            >
              <span>{{ doctorInfo_New.labName }}</span>
              <span
                class="icon-xuanze"
                title="选择科室"
                @click="handleOpenDepartments"
              ></span>
            </div>
          </div>
        </div>
        <div class="item">
          <div class="title">临床职称：</div>
          <div class="org" v-if="!isNewDoctor">
            {{ renderClinicPosition(doctorInfo_Org.clinicPosition) }}
          </div>
          <div
            :class="
              renderNewItemClass(
                doctorInfo_Org.clinicPosition,
                doctorInfo_New.clinicPosition
              )
            "
          >
            <Select v-model="doctorInfo_New.clinicPosition">
              <Option
                v-for="item in allClinicPosition"
                :key="item.id"
                :value="item.id"
              >
                {{ item.name }}
              </Option>
            </Select>
          </div>
        </div>
        <div class="item">
          <div class="title">个人简介：</div>
          <div class="org" v-if="!isNewDoctor">
            {{ doctorInfo_Org.introduceCn }}
          </div>
          <Input
            type="textarea"
            :rows="3"
            placeholder="该医生的简要介绍"
            :class="
              renderNewItemClass(
                doctorInfo_Org.introduceCn,
                doctorInfo_New.introduceCn
              )
            "
            v-model="doctorInfo_New.introduceCn"
          />
        </div>
        <div class="item">
          <div class="title">社会任职：</div>
          <div class="org" v-if="!isNewDoctor">
            {{ doctorInfo_Org.socialTitle }}
          </div>
          <Input
            :class="
              renderNewItemClass(
                doctorInfo_Org.socialTitle,
                doctorInfo_New.socialTitle
              )
            "
            v-model="doctorInfo_New.socialTitle"
            type="textarea"
            :rows="2"
            placeholder=""
          />
        </div>
        <div class="item">
          <div class="title">学历：</div>
          <div class="org" v-if="!isNewDoctor">
            {{ renderDigree(doctorInfo_Org.degree) }}
          </div>
          <div
            :class="
              renderNewItemClass(doctorInfo_Org.degree, doctorInfo_New.degree)
            "
          >
            <Select v-model="doctorInfo_New.degree">
              <Option v-for="item in allDigree" :key="item.id" :value="item.id">
                {{ item.name }}
              </Option>
            </Select>
          </div>
        </div>
        <div class="item">
          <div class="title">毕业院校：</div>
          <div class="org" v-if="!isNewDoctor">{{ doctorInfo_Org.school }}</div>
          <Input
            :class="
              renderNewItemClass(doctorInfo_Org.school, doctorInfo_New.school)
            "
            v-model="doctorInfo_New.school"
          />
        </div>
        <div class="item">
          <div class="title">开始工作年份：</div>
          <div class="org" v-if="!isNewDoctor">
            {{ doctorInfo_Org.startedWork }}
          </div>
          <Input
            :class="
              renderNewItemClass(
                doctorInfo_Org.startedWork,
                doctorInfo_New.startedWork
              )
            "
            v-model="doctorInfo_New.startedWork"
          />
        </div>
        <div class="item">
          <div class="title">擅长：</div>
          <div class="org" v-if="!isNewDoctor">{{ doctorInfo_Org.goodat }}</div>
          <Input
            type="textarea"
            :rows="3"
            placeholder=""
            :class="
              renderNewItemClass(doctorInfo_Org.goodat, doctorInfo_New.goodat)
            "
            v-model="doctorInfo_New.goodat"
          />
        </div>
        <div class="item">
          <div class="title">荣誉成就：</div>
          <div class="org" v-if="!isNewDoctor">{{ doctorInfo_Org.honor }}</div>
          <Input
            :class="
              renderNewItemClass(doctorInfo_Org.honor, doctorInfo_New.honor)
            "
            v-model="doctorInfo_New.honor"
            type="textarea"
            :rows="2"
            placeholder=""
          />
        </div>
        <div class="item">
          <div class="title">发表论文：</div>
          <div class="org" v-if="!isNewDoctor">{{ doctorInfo_Org.paper }}</div>
          <Input
            :class="
              renderNewItemClass(doctorInfo_Org.paper, doctorInfo_New.paper)
            "
            v-model="doctorInfo_New.paper"
            type="textarea"
            :rows="3"
            placeholder=""
          />
        </div>
        <div class="item">
          <div class="title">出诊备注：</div>
          <div class="org" v-if="!isNewDoctor">
            {{ doctorInfo_Org.auditRemark }}
          </div>
          <Input
            :class="
              renderNewItemClass(
                doctorInfo_Org.auditRemark,
                doctorInfo_New.auditRemark
              )
            "
            v-model="doctorInfo_New.auditRemark"
            type="textarea"
            :rows="2"
            placeholder=""
          />
        </div>
        <div class="item">
          <div class="title">身份证号：</div>
          <div class="org" v-if="!isNewDoctor">{{ doctorInfo_Org.idCard }}</div>
          <Input
            :class="
              renderNewItemClass(doctorInfo_Org.idCard, doctorInfo_New.idCard)
            "
            v-model="doctorInfo_New.idCard"
            placeholder=""
          />
        </div>
        <div class="item">
          <div class="title">身份证照：</div>
          <div class="org" v-if="!isNewDoctor">
            <div v-if="doctorInfo_Org.idCardPic" class="image-list">
              <div
                class="list-item"
                v-for="item in doctorInfo_Org.idCardPic.split(',')"
                :key="item"
              >
                <img
                  class="image-item"
                  :src="item"
                  title="点击查看大图"
                  @click="handleView(item)"
                />
              </div>
            </div>
            <div v-else>
              -
            </div>
          </div>
          <div
            :class="
              renderNewItemClass(
                doctorInfo_Org.idCardPic,
                doctorInfo_New.idCardPic
              )
            "
          >
            <div class="r-row images-box" v-if="doctorInfo_New">
              <template v-if="doctorInfo_New.idCardPic">
                <div
                  class="image-list "
                  v-for="item in doctorInfo_New.idCardPic.split(',')"
                  :key="item"
                >
                  <div
                    class="list-item"
                    @mouseenter="isIdCardShow = true"
                    @mouseleave="isIdCardShow = false"
                  >
                    <img class="image-item" :src="item" />
                    <div class="image-item-cover r-row" v-if="isIdCardShow">
                      <Icon
                        type="ios-eye-outline"
                        @click.native="handleView(item)"
                      ></Icon>
                      <Icon
                        type="ios-trash-outline"
                        @click.native="handleRemoveIdPic(item)"
                      ></Icon>
                    </div>
                  </div>
                </div>
              </template>
              <div class="image-list" v-if="idCardPicNum < 2">
                <Upload
                  ref="upload"
                  :show-upload-list="false"
                  :format="['jpg', 'jpeg', 'png']"
                  :max-size="2048"
                  :on-format-error="handleFormatError"
                  :on-success="handleIdCardPicUploadSuccess"
                  multiple
                  type="drag"
                  :action="uploadUrl"
                  style="display: inline-block;width:118px;"
                  class="list-item"
                >
                  <div style="width: 118px;height:118px;line-height: 118px;">
                    <Icon type="ios-camera" size="40"></Icon>
                  </div>
                </Upload>
              </div>
            </div>
          </div>
        </div>
        <div class="item">
          <div class="title">执业证书：</div>
          <div class="org" v-if="!isNewDoctor">
            <div v-if="doctorInfo_Org.certificatePic" class="image-list">
              <div
                class="list-item"
                v-for="item in doctorInfo_Org.certificatePic.split(',')"
                :key="item"
              >
                <img
                  class="image-item"
                  :src="item"
                  title="点击查看大图"
                  @click="handleView(item)"
                />
              </div>
            </div>
            <div v-else>
              -
            </div>
          </div>
          <div
            :class="
              renderNewItemClass(
                doctorInfo_Org.certificatePic,
                doctorInfo_New.certificatePic
              )
            "
          >
            <div class="r-row images-box" v-if="doctorInfo_New">
              <template v-if="doctorInfo_New.certificatePic">
                <div
                  class="image-list "
                  v-for="item in doctorInfo_New.certificatePic.split(',')"
                  :key="item"
                >
                  <div
                    class="list-item"
                    @mouseenter="isCertificateIconShow = true"
                    @mouseleave="isCertificateIconShow = false"
                  >
                    <img class="image-item" :src="item" />
                    <div
                      class="image-item-cover r-row"
                      v-if="isCertificateIconShow"
                    >
                      <Icon
                        type="ios-eye-outline"
                        @click.native="handleView(item)"
                      ></Icon>
                      <Icon
                        type="ios-trash-outline"
                        @click.native="handleRemoveCertPic(item)"
                      ></Icon>
                    </div>
                  </div>
                </div>
              </template>
              <div class="image-list">
                <Upload
                  ref="upload"
                  :show-upload-list="false"
                  :format="['jpg', 'jpeg', 'png']"
                  :max-size="2048"
                  :on-format-error="handleFormatError"
                  :on-success="handleCertificatePicUploadSuccess"
                  multiple
                  type="drag"
                  :action="uploadUrl"
                  style="display: inline-block;width:118px;"
                  class="list-item"
                >
                  <div style="width: 118px;height:118px;line-height: 118px;">
                    <Icon type="ios-camera" size="40"></Icon>
                  </div>
                </Upload>
              </div>
            </div>
          </div>
        </div>
        <div class="item">
          <div class="title">执业证书备注：</div>
          <div class="org" v-if="!isNewDoctor">
            {{ doctorInfo_Org.certificatePicRemark }}
          </div>
          <Input
            :class="
              renderNewItemClass(
                doctorInfo_Org.certificatePicRemark,
                doctorInfo_New.certificatePicRemark
              )
            "
            v-model="doctorInfo_New.certificatePicRemark"
            type="textarea"
            :rows="2"
            placeholder=""
          />
        </div>
        <div class="item">
          <div class="title">是否齐全：</div>
          <div class="org" v-if="!isNewDoctor">
            <span v-if="doctorInfo_Org.certificatePicStatus == 1">是</span>
            <span v-else-if="doctorInfo_Org.certificatePicStatus == 3">否</span>
            <span v-else>--</span>
          </div>
          <div
            :class="
              renderNewItemClass(
                doctorInfo_Org.certificatePicStatus,
                doctorInfo_New.certificatePicStatus
              )
            "
          >
            <Select
              placement="top"
              v-model="doctorInfo_New.certificatePicStatus"
            >
              <Option :value="1">是</Option>
              <Option :value="3">否</Option>
            </Select>
          </div>
        </div>
        <div class="item">
          <div class="title">执业证书（公网信息）：</div>
          <div class="org" v-if="!isNewDoctor">
            <div v-if="doctorInfo_Ex.certificatePicPub" class="image-list">
              <div
                class="list-item"
                v-for="item in doctorInfo_Ex.certificatePicPub.split(',')"
                :key="item"
              >
                <img
                  class="image-item"
                  :src="item"
                  title="点击查看大图"
                  @click="handleView(item)"
                />
              </div>
            </div>
            <div v-else>
              -
            </div>
          </div>
          <div
            :class="
              renderNewItemClass(
                doctorInfo_Ex.certificatePicPub,
                doctorInfo_Expand.certificatePicPub
              )
            "
          >
            <div class="r-row images-box" v-if="doctorInfo_Expand">
              <template v-if="doctorInfo_Expand.certificatePicPub">
                <div
                  class="image-list "
                  v-for="item in doctorInfo_Expand.certificatePicPub.split(',')"
                  :key="item"
                >
                  <div
                    class="list-item"
                    @mouseenter="isCertificateIconPubShow = true"
                    @mouseleave="isCertificateIconPubShow = false"
                  >
                    <img class="image-item" :src="item" />
                    <div
                      class="image-item-cover r-row"
                      v-if="isCertificateIconPubShow"
                    >
                      <Icon
                        type="ios-eye-outline"
                        @click.native="handleView(item)"
                      ></Icon>
                      <Icon
                        type="ios-trash-outline"
                        @click.native="handleRemoveCertPic(item, 'pub')"
                      ></Icon>
                    </div>
                  </div>
                </div>
              </template>
              <div class="image-list">
                <Upload
                  ref="upload"
                  :show-upload-list="false"
                  :format="['jpg', 'jpeg', 'png']"
                  :max-size="2048"
                  :on-format-error="handleFormatError"
                  :on-success="handleCertificatePicPubUploadSuccess"
                  multiple
                  type="drag"
                  :action="uploadUrl"
                  style="display: inline-block;width:118px;"
                  class="list-item"
                >
                  <div style="width: 118px;height:118px;line-height: 118px;">
                    <Icon type="ios-camera" size="40"></Icon>
                  </div>
                </Upload>
              </div>
            </div>
          </div>
        </div>
        <div class="item">
          <div class="title">执业证书备注（公网信息）：</div>
          <div class="org" v-if="!isNewDoctor">
            {{ doctorInfo_Ex.certificatePicPubRemark }}
          </div>
          <Input
            :class="
              renderNewItemClass(
                doctorInfo_Ex.certificatePicPubRemark,
                doctorInfo_Expand.certificatePicPubRemark
              )
            "
            v-model="doctorInfo_Expand.certificatePicPubRemark"
            type="textarea"
            :rows="2"
            placeholder=""
          />
        </div>
        <div class="item">
          <div class="title">是否齐全（公网信息）：</div>
          <div class="org" v-if="!isNewDoctor">
            <span v-if="doctorInfo_Ex.certificatePicPubStatus == 1">是</span>
            <span v-else-if="doctorInfo_Ex.certificatePicPubStatus == 3"
              >否</span
            >
            <span v-else>--</span>
          </div>
          <div
            :class="
              renderNewItemClass(
                doctorInfo_Ex.certificatePicPubStatus,
                doctorInfo_Expand.certificatePicPubStatus
              )
            "
          >
            <Select
              placement="top"
              v-model="doctorInfo_Expand.certificatePicPubStatus"
            >
              <Option :value="1">是</Option>
              <Option :value="3">否</Option>
            </Select>
          </div>
        </div>
        <div class="item">
          <div class="title">职称证书：</div>
          <div class="org" v-if="!isNewDoctor">
            <div v-if="doctorInfo_Org.titlePic" class="image-list">
              <div
                class="list-item"
                v-for="item in doctorInfo_Org.titlePic.split(',')"
                :key="item"
              >
                <img
                  class="image-item"
                  :src="item"
                  title="点击查看大图"
                  @click="handleView(item)"
                />
              </div>
            </div>
            <div v-else>
              -
            </div>
          </div>
          <div
            :class="
              renderNewItemClass(
                doctorInfo_Org.titlePic,
                doctorInfo_New.titlePic
              )
            "
          >
            <div>
              <div class="r-row images-box">
                <template v-if="doctorInfo_New.titlePic">
                  <div
                    class="image-list "
                    v-for="item in doctorInfo_New.titlePic.split(',')"
                    :key="item"
                  >
                    <div
                      class="list-item"
                      @mouseenter="isTitleIconShow = true"
                      @mouseleave="isTitleIconShow = false"
                    >
                      <img class="image-item" :src="item" />
                      <div
                        class="image-item-cover r-row"
                        v-if="isTitleIconShow"
                      >
                        <Icon
                          type="ios-eye-outline"
                          @click.native="handleView(item)"
                        ></Icon>
                        <Icon
                          type="ios-trash-outline"
                          @click.native="handleRemoveTitlePic(item)"
                        ></Icon>
                      </div>
                    </div>
                  </div>
                </template>
                <div class="image-list ">
                  <Upload
                    class="list-item"
                    ref="upload"
                    :show-upload-list="false"
                    :format="['jpg', 'jpeg', 'png']"
                    :max-size="2048"
                    :on-format-error="handleFormatError"
                    :on-success="handleTitlePicUploadSuccess"
                    multiple
                    type="drag"
                    :action="uploadUrl"
                    style="display: inline-block;width:118px;"
                  >
                    <div style="width: 118px;height:118px;line-height: 118px;">
                      <Icon type="ios-camera" size="40"></Icon>
                    </div>
                  </Upload>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="item">
          <div class="title">职称证书备注：</div>
          <div class="org" v-if="!isNewDoctor">
            {{ doctorInfo_Org.titlePicRemark }}
          </div>
          <Input
            :class="
              renderNewItemClass(
                doctorInfo_Org.titlePicRemark,
                doctorInfo_New.titlePicRemark
              )
            "
            v-model="doctorInfo_New.titlePicRemark"
            type="textarea"
            :rows="2"
            placeholder=""
          />
        </div>
        <div class="item">
          <div class="title">是否齐全：</div>
          <div class="org" v-if="!isNewDoctor">
            <span v-if="doctorInfo_Org.titlePicStatus == 1">是</span>
            <span v-else-if="doctorInfo_Org.titlePicStatus == 3">否</span>
            <span v-else>--</span>
          </div>
          <div
            :class="
              renderNewItemClass(
                doctorInfo_Org.titlePicStatus,
                doctorInfo_New.titlePicStatus
              )
            "
          >
            <Select placement="top" v-model="doctorInfo_New.titlePicStatus">
              <Option :value="1">是</Option>
              <Option :value="3">否</Option>
            </Select>
          </div>
        </div>
        <div class="item">
          <div class="title">职称证书（公网信息）：</div>
          <div class="org" v-if="!isNewDoctor">
            <div v-if="doctorInfo_Ex.titlePicPub" class="image-list">
              <div
                class="list-item"
                v-for="item in doctorInfo_Ex.titlePicPub.split(',')"
                :key="item"
              >
                <img
                  class="image-item"
                  :src="item"
                  title="点击查看大图"
                  @click="handleView(item)"
                />
              </div>
            </div>
            <div v-else>
              -
            </div>
          </div>
          <div
            :class="
              renderNewItemClass(
                doctorInfo_Ex.titlePicPub,
                doctorInfo_Expand.titlePicPub
              )
            "
          >
            <div class="r-row images-box" v-if="doctorInfo_Expand">
              <template v-if="doctorInfo_Expand.titlePicPub">
                <div
                  class="image-list "
                  v-for="item in doctorInfo_Expand.titlePicPub.split(',')"
                  :key="item"
                >
                  <div
                    class="list-item"
                    @mouseenter="isTitleIconPubShow = true"
                    @mouseleave="isTitleIconPubShow = false"
                  >
                    <img class="image-item" :src="item" />
                    <div
                      class="image-item-cover r-row"
                      v-if="isTitleIconPubShow"
                    >
                      <Icon
                        type="ios-eye-outline"
                        @click.native="handleView(item)"
                      ></Icon>
                      <Icon
                        type="ios-trash-outline"
                        @click.native="handleRemoveTitlePic(item, 'pub')"
                      ></Icon>
                    </div>
                  </div>
                </div>
              </template>
              <div class="image-list">
                <Upload
                  ref="upload"
                  :show-upload-list="false"
                  :format="['jpg', 'jpeg', 'png']"
                  :max-size="2048"
                  :on-format-error="handleFormatError"
                  :on-success="handleTitlePicPubUploadSuccess"
                  multiple
                  type="drag"
                  :action="uploadUrl"
                  style="display: inline-block;width:118px;"
                  class="list-item"
                >
                  <div style="width: 118px;height:118px;line-height: 118px;">
                    <Icon type="ios-camera" size="40"></Icon>
                  </div>
                </Upload>
              </div>
            </div>
          </div>
        </div>
        <div class="item">
          <div class="title">职称证书备注（公网信息）：</div>
          <div class="org" v-if="!isNewDoctor">
            {{ doctorInfo_Ex.titlePicPubRemark }}
          </div>
          <Input
            :class="
              renderNewItemClass(
                doctorInfo_Ex.titlePicPubRemark,
                doctorInfo_Expand.titlePicPubRemark
              )
            "
            v-model="doctorInfo_Expand.titlePicPubRemark"
            type="textarea"
            :rows="2"
            placeholder=""
          />
        </div>
        <div class="item">
          <div class="title">是否齐全（公网信息）：</div>
          <div class="org" v-if="!isNewDoctor">
            <span v-if="doctorInfo_Ex.certificatePicPubStatus == 1">是</span>
            <span v-else-if="doctorInfo_Ex.certificatePicPubStatus == 3"
              >否</span
            >
            <span v-else>--</span>
          </div>
          <div
            :class="
              renderNewItemClass(
                doctorInfo_Ex.titlePicPubStatus,
                doctorInfo_Expand.titlePicPubStatus
              )
            "
          >
            <Select
              placement="top"
              v-model="doctorInfo_Expand.titlePicPubStatus"
            >
              <Option :value="1">是</Option>
              <Option :value="3">否</Option>
            </Select>
          </div>
        </div>
        <div class="item">
          <div class="title">工作证明：</div>
          <div class="org" v-if="!isNewDoctor">
            <div v-if="doctorInfo_Org.workPic" class="image-list">
              <div
                class="list-item"
                v-for="item in doctorInfo_Org.workPic.split(',')"
                :key="item"
              >
                <img
                  class="image-item"
                  :src="item"
                  title="点击查看大图"
                  @click="handleView(item)"
                />
              </div>
            </div>
            <div v-else>
              -
            </div>
          </div>
          <div
            :class="
              renderNewItemClass(doctorInfo_Org.workPic, doctorInfo_New.workPic)
            "
          >
            <div>
              <div class="r-row images-box">
                <template v-if="doctorInfo_New.workPic">
                  <div
                    class="image-list"
                    v-for="item in doctorInfo_New.workPic.split(',')"
                    :key="item"
                  >
                    <div
                      class="list-item"
                      @mouseenter="isWorkIconShow = true"
                      @mouseleave="isWorkIconShow = false"
                    >
                      <img class="image-item" :src="item" />
                      <div class="image-item-cover r-row" v-if="isWorkIconShow">
                        <Icon
                          type="ios-eye-outline"
                          @click.native="handleView(item)"
                        ></Icon>
                        <Icon
                          type="ios-trash-outline"
                          @click.native="handleRemoveWorkPic(item)"
                        ></Icon>
                      </div>
                    </div>
                  </div>
                </template>
                <div class="image-list">
                  <Upload
                    class="list-item"
                    ref="upload"
                    :show-upload-list="false"
                    :format="['jpg', 'jpeg', 'png']"
                    :max-size="2048"
                    :on-format-error="handleFormatError"
                    :on-success="handleWorkPicUploadSuccess"
                    multiple
                    type="drag"
                    :action="uploadUrl"
                    style="display: inline-block;width:118px;"
                  >
                    <div style="width: 118px;height:118px;line-height: 118px;">
                      <Icon type="ios-camera" size="40"></Icon>
                    </div>
                  </Upload>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="other">
          <p>
            <span class="o-label">上次提交审核时间：</span>
            <span class="o-content" v-if="doctorInfo_New">{{
              doctorInfo_New.authenticationTime
                ? doctorInfo_New.authenticationTime
                : "--"
            }}</span>
          </p>
          <p>
            <span class="o-label">上次操作审核人：</span>
            <span class="o-content" v-if="doctorInfo_Org">{{
              doctorInfo_Org.modifyUser ? doctorInfo_Org.modifyUser : "--"
            }}</span>
          </p>
          <p>
            <span class="o-label">上次操作审核时间：</span>
            <span class="o-content" v-if="doctorInfo_Org">{{
              doctorInfo_Org.modifyTime ? doctorInfo_Org.modifyTime : "--"
            }}</span>
          </p>
          <p>
            <span class="o-label">上次审核状态：</span>
            <span class="o-content" v-if="doctorInfo_New">{{
              lastAuditStatus
            }}</span>
          </p>
          <p>
            <span class="o-label">上次操作审核备注：</span>
            <span class="o-content" v-if="doctorInfo_Org">{{
              lastAuditRemark
            }}</span>
          </p>
        </div>
      </div>

      <div class="action-box">
        <Checkbox v-model="notice" v-if="isSdoc">
          通知医生
        </Checkbox>
        <Checkbox v-model="notice">
          通知医生
        </Checkbox>
        <Button
          type="primary"
          class="yes"
          @click="handleSelectDoctor"
          @select="getDoctorData(data)"
          >选择医生</Button
        >
        <Button @click="handleMerge" v-show="isSdoc" type="primary" class="yes"
          >合并</Button
        >
        <Button type="primary" @click="handleYes(1, 1)" class="yes"
          >资质及资料通过</Button
        >
        <Button @click="handleNo(3, 3)" class="no">资质及资料不通过</Button>
        <Divider type="vertical" />
        <Button type="primary" @click="handleYes(1)" class="yes"
          >资料通过</Button
        >
        <Button @click="handleNo(3)" class="no">资料不通过</Button>
      </div>
      <Modal title="请输入审核不通过的原因：" v-model="isShowAuditReason">
        <Input type="textarea" v-model="auditRemark" :rows="5" />
      </Modal>
      <Modal title="查看大图" v-model="isShowBigImage" footer-hide>
        <img :src="currentImage" v-if="isShowBigImage" style="width: 100%" />
      </Modal>
      <Modal
        title="发现疑似同一名医生的资料，请判断并确认是否合并"
        v-model="isShowSimilarDoctors"
        width="80%"
      >
        <div class="similar-list">
          <Table :columns="similarDoctorsColumns" :data="similarDoctors" stripe>
            <template slot-scope="{ row }" slot="avatar">
              <div class="avatar-box">
                <img
                  v-if="row.headPortraitCorrect"
                  :src="row.headPortraitCorrect.replace('/#/', '/org/')"
                  @click="
                    handleView(row.headPortraitCorrect.replace('/#/', '/org/'))
                  "
                />
                <img
                  v-else
                  src="https://image.39.net/daoyi/images/pics/default_ys.gif"
                />
              </div>
            </template>
            <template slot-scope="{ row }" slot="baseinfo">
              <div>
                <div class="name">{{ row.name }}</div>
                <div>性别：{{ renderSex(row.sex) }}</div>
                <div v-if="row.clinicPosition">
                  {{ renderClinicPosition(row.clinicPosition) }}
                </div>
              </div>
            </template>
            <template slot-scope="{ row }" slot="hospitalinfo">
              <div>
                <div v-for="hos in row.doctorLabHospitalList" :key="hos">
                  {{ hos.hospitalName }} - {{ hos.labName }}
                </div>
              </div>
            </template>
            <template slot-scope="{ row }" slot="operation">
              <Button icon="ios-contract" @click="handleCombine(row)"
                >合并到该医生</Button
              >
            </template>
          </Table>
        </div>
        <div slot="footer">
          <Button type="primary" @click="handleNoCombine"
            >不合并，直接审核</Button
          >
        </div>
      </Modal>
      <div id="clip" v-bind:style="hideClip" v-if="isShowClipBox">
        <div class="clip-mask" @click="handleCloseClip"></div>
        <div class="clip-box">
          <div class="clip-header">
            <div class="clip-title">裁剪头像</div>
            <span
              id="clip-close"
              class="icon-guanbi"
              @click="handleCloseClip"
            ></span>
          </div>
          <cropperView
            v-if="doctorInfo_New.headPortraitCorrect"
            @afterClipComplete="handleClipComplete"
            :clipUrl="
              doctorInfo_New.headPortraitCorrect.replace('/#/', '/org/')
            "
          ></cropperView>
        </div>
      </div>
    </div>
    <Spin size="large" fix v-show="!isReady"></Spin>
    <Modal
      title="医院列表"
      width="50%"
      height="80%"
      class="form-box"
      footer-hide
      v-model="isShowauditHospitalModal"
    >
      <audit-hospital @afterConfirm="handleHospital"></audit-hospital>
    </Modal>
    <Modal
      :title="doctorInfo_New.hospitalName + '：科室列表'"
      width="50%"
      height="80%"
      class="form-box"
      footer-hide
      v-model="isShowauditDepartmentModal"
    >
      <audit-department
        v-if="isShowauditDepartmentModal"
        ref="departmentView"
        :departmentData="doctorInfo_New"
        @afterConfirm="handleDepartment"
      ></audit-department>
    </Modal>
    <Modal
      title="选择医生"
      width="50%"
      height="80%"
      class="form-box"
      footer-hide
      v-model="isSelectDoctor"
    >
      <SelectDoctor
        v-if="isSelectDoctor"
        ref="SelectDoctor"
        :SelectDoc="doctor"
        @save="saveSelectDoctorinfo"
      ></SelectDoctor>
    </Modal>
  </div>
</template>
<script>
import config from "@/config";
import apiDoctor from "@/api/apiDoctor";
import ConstData from "@/utils/constData";
import expandInfo from "./expand-info";
import helper from "@/utils/helper";
import AreaData from "@/utils/areaData2";
import cropperView from "../../components/cropper/cropper";
import AuditHospital from "../audit/auditHospital";
import AuditDepartment from "../audit/auditDepartment";
import SelectDoctor from "./selectDoctor";

export default {
  components: {
    expandInfo,
    cropperView,
    AuditHospital,
    AuditDepartment,
    SelectDoctor
  },
  props: {
    doctor: {
      required: true,
      default: 0
    }
  },
  data() {
    return {
      isReady: false, //页面内容是否准备好
      doctorInfo_Org: {}, // 原资料
      doctorInfo_New: {}, // 本次修改资料
      doctorInfo_Ex: {}, //拓展资料-旧
      doctorInfo_Expand: {}, //拓展资料
      isNewDoctor: false, // 是否新注册医生
      isShowSimilarDoctors: false, // 是否显示疑似相似（同一个）医生列表
      similarDoctors: [], // 疑似相似（同一个）医生 ----新注册医生，审核时返回疑似同一个医生的资料，供审核人员判断，并确定是否要合并
      isShowBigImage: false, // 是否显示大图
      isShowClipBox: true, //是否显示裁剪弹窗
      hideClip: { opacity: 0 },
      currentImage: "", // 图片地址
      isShowAuditReason: false, // 是否显示审核不通过原因输入框
      auditRemark: "", // 审核意见
      allDigree: ConstData.arrayDigree, //学历
      allClinicPosition: ConstData.arrayClinicPosition, //临床职称
      isAvatarIconShow: false, //头像按钮(查看大图，重新上传)是否显示
      isCertificateIconShow: false, //职业证书按钮(查看大图，重新上传)是否显示
      isTitleIconShow: false, //职称证书按钮(查看大图，重新上传)是否显示
      isCertificateIconPubShow: false, //公网：职业证书按钮(查看大图，重新上传)是否显示
      isTitleIconPubShow: false, //公网：职称证书按钮(查看大图，重新上传)是否显示
      isWorkIconShow: false, //工作证书按钮(查看大图，重新上传)是否显示
      isIdCardShow: false, //身份证照(查看大图，重新上传)是否显示
      lastAuditRemark: "--", //上次操作审核备注
      lastAuditStatus: "--", //上次审核状态
      isSelectDoctor: false, //选择医生
      // SelectDoctorId: 0, //选择医生ID
      notice: true, //通知医生
      isSdoc: false, //合并
      similarDoctorsColumns: [
        {
          type: "expand",
          width: 30,
          render: (h, params) => {
            return h(expandInfo, {
              props: {
                row: params.row
              }
            });
          }
        },
        {
          title: "ID",
          key: "id",
          width: 80
        },
        {
          title: "头像",
          slot: "avatar",
          width: 120
        },
        {
          title: "基本信息",
          slot: "baseinfo",
          width: 150
        },
        {
          title: "所在医院-科室",
          slot: "hospitalinfo",
          minWidth: 160
        },

        {
          title: "通行证ID",
          key: "memberid",
          width: 100
        },
        {
          title: "来源",
          key: "source",
          width: 100,
          render: (h, params) => {
            let sourceName = "";
            switch (params.row.source) {
              case 0:
                sourceName = "医生库数据";
                break;
              case 1:
                sourceName = "就医助手";
                break;
              case 2:
                sourceName = "通行证";
                break;
              case 3:
                sourceName = "ask";
                break;
              case 4:
                sourceName = "医信中心";
                break;
              default:
                sourceName = "未知";
            }
            return h("div", sourceName);
          }
        },
        {
          title: "最近修改",
          key: "modifyTime",
          align: "center",
          width: 150,
          render: (h, params) => {
            return h("div", [
              h("p", params.row.modifyUser),
              h("p", params.row.modifyTime)
            ]);
          }
        },
        {
          title: "#",
          slot: "operation",
          width: 150
        }
      ],
      allAreas: AreaData.allAreas, //省市区地址
      currentAreaOld: [],
      currentArea: [],
      isShowauditHospitalModal: false, //是否显示医院列表弹窗
      isShowauditDepartmentModal: false //是否显示科室列表弹窗
    };
  },
  computed: {
    uploadUrl() {
      let baseUrl =
        process.env.NODE_ENV === "development"
          ? config.baseUrl.dev
          : config.baseUrl.pro;
      return `${baseUrl}upload/image?collectionId=4`;
    },
    idCardPicNum() {
      let num = 0;
      if (this.doctorInfo_New) {
        if (this.doctorInfo_New.idCardPic) {
          let idCardPic = this.doctorInfo_New.idCardPic.split(",");
          num = idCardPic ? idCardPic.length : num;
        }
      }
      return num;
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.loadAuditInfo();
    });
  },
  watch: {
    "doctor.id"() {
      // 医生ID有变动，则重新加载审核资料
      this.loadAuditInfo();
    }
  },
  methods: {
    loadAuditInfo() {
      if (this.doctor.id > 0) {
        apiDoctor.getAuditInfo(this.doctor.id).then(res => {
          this.isShowClipBox = false;
          this.isReady = true;
          let j = res.data;
          console.log(j.data, 98745);
          if (j.code === 200) {
            this.doctorInfo_Org = j.data.doctorInfo;
            this.doctorInfo_Expand = Object.assign({}, j.data.doctorInfoExpand);
            this.doctorInfo_Ex = Object.assign({}, j.data.doctorInfoExpand);
            //初始化省市区
            this.currentArea = [];
            var areaInfo = j.data.areaInfo;
            if (areaInfo.provinceId) {
              this.currentArea.push(areaInfo.provinceId);
            }
            if (areaInfo.cityId) {
              if (this.currentArea.indexOf(areaInfo.cityId) < 0) {
                this.currentArea.push(areaInfo.cityId);
              }
            }
            this.currentAreaOld = this.currentArea;
            if (j.data.doctorInfoAudit.areaId) {
              if (this.currentArea.indexOf(j.data.doctorInfoAudit.areaId) < 0) {
                this.currentArea.push(j.data.doctorInfoAudit.areaId);
              }
            }
            if (j.data.doctorInfo.areaId) {
              if (this.currentAreaOld.indexOf(j.data.doctorInfo.areaId) < 0) {
                this.currentAreaOld.push(j.data.doctorInfo.areaId);
              }
            }
            // 如果原资料是待审核状态，则说明该医生是新注册
            if (this.doctorInfo_Org.status === 0) {
              this.isNewDoctor = true;
            } else {
              this.isNewDoctor = false;
            }
            this.doctorInfo_New = j.data.doctorInfoAudit;
            this.similarDoctors = j.data.doctorInfoLikeList;
            console.log(
              "doctorInfo_New",
              this.doctorInfo_Org,
              this.doctorInfo_New
            );
            this.lastAuditRemark = j.data.doctorInfoAudit
              ? j.data.doctorInfoAudit.remark
              : "--";
            if (j.data.doctorInfoAudit) {
              this.lastAuditStatus = this.getDataStatusName(
                j.data.doctorInfoAudit.dataStatus
              );
            }
          } else {
            this.$Message.error(j.message);
          }
        });
      }
    },

    // 获取状态描述文本
    getDataStatusName(dataStatus) {
      let name = "";
      switch (dataStatus) {
        case 0:
          name = "待审核";
          break;
        case 1:
          name = "正常";
          break;
        case 2:
          name = "删除";
          break;
        case 3:
          name = "未通过";
          break;
        default:
          name = "未知";
          break;
      }
      return name;
    },

    // 异同项高亮显示
    renderNewItemClass(orgVal, newVal) {
      let c = "new";
      if (orgVal !== newVal) {
        c = c + " diff";
      }
      return c;
    },
    // 异同项高亮显示
    renderNewItemClass2(orgVal, newVal) {
      // let c = 'new';
      let c = "";
      if (orgVal !== newVal) {
        // c = c + ' diff';
        c = "diff";
      }
      return c;
    },

    renderSex(sex) {
      return ConstData.getSexName(sex);
    },
    // 查看大图
    handleView(url) {
      this.currentImage = url;
      this.isShowBigImage = true;
    },
    //打开医院列表弹框
    handleOpenHospital() {
      this.isShowauditHospitalModal = true;
    },
    handleOpenDepartments() {
      let that = this;
      if (that.doctorInfo_New.hospitalId) {
        that.isShowauditDepartmentModal = true;
      } else {
        this.$Modal.confirm({
          title: "提示",
          content: "请先选择医院!",
          onOk() {
            that.handleOpenHospital();
          }
        });
      }
    },
    //医院选择确定后
    handleHospital(e) {
      this.doctorInfo_New.hospitalName = e.name;
      this.doctorInfo_New.hospitalId = e.id;
      this.isShowauditHospitalModal = false;
    },
    //科室选择确定后
    handleDepartment(e) {
      this.doctorInfo_New.labName = e.name;
      this.doctorInfo_New.labId = e.id;
      this.isShowauditDepartmentModal = false;
    },
    /**
     * qStatus：资质状态 ； dStatus：资料状态
     **/
    handleNo(dStatus, qStatus) {
      let that = this;
      that.doctorInfo_New.dataStatus = dStatus;
      if (qStatus) {
        that.doctorInfo_New.qualificationStatus = qStatus;
      }
      this.$Modal.confirm({
        onOk() {
          if (that.auditRemark) {
            that.doAudit(false);
          } else {
            this.$Message.warning("请输入审核不通过的原因");
            return false;
          }
        },
        title: "请输入不通过的原因：",
        render: h => {
          return h("Input", {
            props: {
              type: "textarea",
              rows: 5,
              value: that.auditRemark,
              autofocus: true
            },
            on: {
              input: val => {
                console.log(val);
                that.auditRemark = val;
              }
            }
          });
        }
      });
    },
    /**
     * qStatus：资质状态 ； dStatus：资料状态
     **/
    handleYes(dStatus, qStatus) {
      let that = this;
      that.doctorInfo_New.dataStatus = dStatus;
      if (qStatus) {
        that.doctorInfo_New.qualificationStatus = qStatus;
      }
      if (!that.doctorInfo_New.hospitalId) {
        this.$Modal.confirm({
          title: "提示",
          content: "请先选择医院，再进行后续操作!",
          onOk() {
            that.handleOpenHospital();
          }
        });
      } else if (!that.doctorInfo_New.labId) {
        this.$Modal.confirm({
          title: "提示",
          content: "请先选择科室，再进行后续操作!",
          onOk() {
            that.handleOpenDepartments();
          }
        });
      } else if (this.similarDoctors && this.similarDoctors.length > 0) {
        this.isShowSimilarDoctors = true;
      } else {
        this.$Modal.confirm({
          title: "提示",
          content: "确认审核通过？",
          onOk() {
            that.updateDoctorInfo();
          }
        });
      }
    },
    //更新审核表
    updateDoctorInfo() {
      let that = this;
      if (this.currentArea.length == 2) {
        that.doctorInfo_New.areaId = that.currentArea[1];
      } else if (this.currentArea.length == 3) {
        that.doctorInfo_New.areaId = that.currentArea[2];
      } else {
        that.doctorInfo_New.areaId = [];
      }
      let data = {
        doctorInfoAudit: that.doctorInfo_New,
        doctorInfoExpand: that.doctorInfo_Expand
      };
      apiDoctor.saveAudit(data).then(res => {
        if (res.data.code === 200) {
          that.doAudit(true);
        } else {
          that.$Message.error(res.data.message);
        }
      });
    },

    //审核
    doAudit(isOk, mergeDoctorId) {
      let params = { doctorId: this.doctor.id };
      if (mergeDoctorId) {
        params.mergeDoctorId = mergeDoctorId;
      }
      params.dataStatus = this.doctorInfo_New.dataStatus;

      params.qualificationStatus = this.doctorInfo_New.qualificationStatus;
      params.notice = this.notice;
      if (!isOk) {
        if (this.auditRemark) {
          params.remark = this.auditRemark;
        } else {
          this.$Message.warning("请输入审核不通过的原因");
          return false;
        }
      }
      apiDoctor.audit(params).then(res => {
        let j = res.data;
        if (j.code === 200) {
          this.$Message.success("审核成功");
          this.isShowSimilarDoctors = false;
          this.$emit("afterAuditComplete");
        } else {
          this.$Message.error(j.message);
        }
      });
    },
    handleCombine(docInfo) {
      let that = this;
      this.$Modal.confirm({
        title: "提示",
        content: `确定将新注册医生【${this.doctorInfo_Org.name}】的资料合并到现有医生<strong>【${docInfo.name}】</strong>吗？<br/>(注：合并后，该新注册医生资料将覆盖现有医生资料！)`,
        onOk() {
          that.doAudit(true, docInfo.doctorId);
        }
      });
    },
    handleNoCombine() {
      let that = this;
      this.$Modal.confirm({
        title: "提示",
        content: "确定不合并，直接审核通过？",
        onOk() {
          that.updateDoctorInfo();
          // that.doAudit(true);
        }
      });
    },
    renderClinicPosition(id) {
      return ConstData.getClinicPositionName(id);
    },
    renderSex(sex) {
      return ConstData.getSexName(sex);
    },
    renderDigree(id) {
      return ConstData.getDigreeName(id);
    },
    //上传失败处理
    handleFormatError(file) {
      this.$Notice.warning({
        title: "上传图片格式不正确",
        desc: "文件 " + file.name + " 非允许的图片格式，请上传jpg、png格式图片"
      });
    },
    //头像上传成功处理
    handleUploadSuccess(res, file) {
      if (res.code === 200) {
        if (res.data[0]) {
          this.$set(this.doctorInfo_New, "headPortraitCorrect", res.data[0]);
          this.$set(this.doctorInfo_New, "headPortrait", res.data[0]);
        } else {
          this.$Message.error(`头像上传失败，${res.message}`);
        }
      } else {
        this.$Message.error(`头像上传失败，${res.message}`);
      }
    },
    /**
     * 身份证照上传成功处理
     * */
    handleIdCardPicUploadSuccess(res, file) {
      if (res.code === 200) {
        let imgUrl = res.data[0];
        if (imgUrl) {
          if (this.doctorInfo_New.idCardPic) {
            this.doctorInfo_New.idCardPic = `${this.doctorInfo_New.idCardPic},${imgUrl}`;
          } else {
            this.$set(this.doctorInfo_New, "idCardPic", imgUrl);
          }
        } else {
          this.$Message.error(`图片上传失败；${res.message}`);
        }
        if (this.doctorInfo_New.idCardPic) {
          this.doctorInfo_New.idCardPic = `${this.doctorInfo_New.idCardPic},${imgUrl}`;
        } else {
          this.$set(this.doctorInfo_New, "idCardPic", imgUrl);
        }
      } else {
        this.$Message.error(`图片上传失败；${res.message}`);
      }
    },
    // 执业证书上传成功处理
    handleCertificatePicUploadSuccess(res, file) {
      if (res.code === 200) {
        let imgUrl = res.data[0];
        if (imgUrl) {
          if (this.doctorInfo_New.certificatePic) {
            this.doctorInfo_New.certificatePic = `${this.doctorInfo_New.certificatePic},${imgUrl}`;
          } else {
            this.$set(this.doctorInfo_New, "certificatePic", imgUrl);
          }
        } else {
          this.$Message.error(`图片上传失败；${res.message}`);
        }
      } else {
        this.$Message.error(`图片上传失败；${res.message}`);
      }
    },
    // 执业证书(公网)上传成功处理
    handleCertificatePicPubUploadSuccess(res, file) {
      if (res.code === 200) {
        let imgUrl = res.data[0];
        if (imgUrl) {
          if (this.doctorInfo_Expand.certificatePicPub) {
            this.doctorInfo_Expand.certificatePicPub = `${this.doctorInfo_Expand.certificatePicPub},${imgUrl}`;
          } else {
            this.$set(this.doctorInfo_Expand, "certificatePicPub", imgUrl);
          }
        } else {
          this.$Message.error(`图片上传失败；${res.message}`);
        }
      } else {
        this.$Message.error(`图片上传失败；${res.message}`);
      }
    },
    // 职称证书上传成功处理
    handleTitlePicUploadSuccess(res, file) {
      if (res.code === 200) {
        let imgUrl = res.data[0];
        if(imgUrl){
            if (this.doctorInfo_New.titlePic) {
          this.doctorInfo_New.titlePic = `${this.doctorInfo_New.titlePic},${imgUrl}`;
        } else {
          this.$set(this.doctorInfo_New, "titlePic", imgUrl);
        }
        }else{
            this.$Message.error(`图片上传失败；${res.message}`);
        }
      
      } else {
        this.$Message.error(`图片上传失败；${res.message}`);
      }
    },
    // 职称证书(公网信息)上传成功处理
    handleTitlePicPubUploadSuccess(res, file) {
      if (res.code === 200) {
        let imgUrl = res.data[0];
        if (this.doctorInfo_Expand.titlePicPub) {
          this.doctorInfo_Expand.titlePicPub = `${this.doctorInfo_Expand.titlePicPub},${imgUrl}`;
        } else {
          this.$set(this.doctorInfo_Expand, "titlePicPub", imgUrl);
        }
      } else {
        this.$Message.error(`图片上传失败；${res.message}`);
      }
    },
    // 工作证上传成功处理
    handleWorkPicUploadSuccess(res, file) {
      if (res.code === 200) {
        let imgUrl = res.data[0];
        if(imgUrl){
          if (this.doctorInfo_New.workPic) {
          this.doctorInfo_New.workPic = `${this.doctorInfo_New.workPic},${imgUrl}`;
        } else {
          this.$set(this.doctorInfo_New, "workPic", imgUrl);
        }
        }else{
            this.$Message.error(`图片上传失败；${res.message}`);
        }
        
      } else {
        this.$Message.error(`图片上传失败；${res.message}`);
      }
    },
    // 删除职称照片
    handleRemoveTitlePic(url, type) {
      if (type && type == "pub") {
        this.doctorInfo_Expand.titlePicPub = helper.removeItemFromMultiString(
          this.doctorInfo_Expand.titlePicPub,
          url
        );
      } else {
        this.doctorInfo_New.titlePic = helper.removeItemFromMultiString(
          this.doctorInfo_New.titlePic,
          url
        );
      }
    },
    // 删除执业证书照片
    handleRemoveCertPic(url, type) {
      if (type && type == "pub") {
        this.doctorInfo_Expand.certificatePicPub = helper.removeItemFromMultiString(
          this.doctorInfo_Expand.certificatePicPub,
          url
        );
      } else {
        this.doctorInfo_New.certificatePic = helper.removeItemFromMultiString(
          this.doctorInfo_New.certificatePic,
          url
        );
      }
    },
    /**
     * 删除身份证
     */
    handleRemoveIdPic(url) {
      this.doctorInfo_New.idCardPic = helper.removeItemFromMultiString(
        this.doctorInfo_New.idCardPic,
        url
      );
    },
    // 删除工作证照片
    handleRemoveWorkPic(url) {
      this.doctorInfo_New.workPic = helper.removeItemFromMultiString(
        this.doctorInfo_New.workPic,
        url
      );
    },
    //裁剪处理
    handleClip(imgUrl) {
      var that = this;
      that.isShowClipBox = true;
      that.hideClip.opacity = 1;
    },
    handleCloseClip() {
      this.isShowClipBox = false;
      this.hideClip.opacity = 0;
    },
    //提交裁剪后的图片
    handleClipComplete(data) {
      // this.doctorInfo_New.headPortraitCorrect=data;
      this.doctorInfo_New.headPortrait = data;
      this.handleCloseClip();
    },
    //选择医生
    handleSelectDoctor() {
      this.isSelectDoctor = true;
      setTimeout(() => {
        this.$refs.SelectDoctor.getDataList();
      }, 500);
    },

    // 选中医生后，合并
    handleMerge() {
      if (!this.doctorInfo_New.hospitalId) {
        this.handleOpenHospital();
      } else if (!this.doctorInfo_New.labId) {
        this.handleOpenDepartments();
      } else {
        this.handleCombine(this.doctorInfo_New);
      }
    },

    saveSelectDoctorinfo(data) {
      this.isSelectDoctor = false;
      this.doctorInfo_New = data;
      console.log(data, 897);
      this.isSdoc = true;
      this.isNewDoctor = false;
      let id = this.doctorInfo_New.id;
      this.currentArea = [];
      if (this.doctorInfo_New.areaId) {
        var n = this.doctorInfo_New.areaId.substring(0, 2);
        this.currentArea.push(n, this.doctorInfo_New.areaId);
      }
      apiDoctor.getAuditInfo(id).then(res => {
        if (res.data.code == 200) {
          this.doctorInfo_Expand = { ...res.data.data.doctorInfoExpand };
        } else {
          this.$Message.error(res.data.message);
        }
      });
    }
  }
};
</script>
<style lang="less" scoped>
.audit-box {
  overflow: auto;
  padding-bottom: 60px;
}
.header {
  clear: both;
  display: flex;
  font-weight: bold;
  font-size: 20px;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 9;
  background: #fff;
  .title {
    width: 190px;
    /*width: 160px;*/
    background: #fff;
  }
  .org,
  .new {
    flex: 1;
    text-align: center;
    padding: 10px 30px;
    max-width: 40%;
  }
}
.item {
  line-height: 20px;
  font-size: 14px;
  padding: 10px 0;
  clear: both;
  display: flex;
  .title {
    /*width: 130px;*/
    width: 190px;
    text-align: right;
    font-weight: bold;
  }
  .org,
  .new {
    flex: 1;
    text-align: center;
    padding: 0 30px;
    max-width: 40%;
  }

  .new {
    flex-wrap: wrap;
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: center;

    align-items: center;
    .images-box {
      flex-wrap: wrap;
      justify-content: start;
    }
  }
}
.item:nth-of-type(even) {
  background: #f8f8f9;
}
.item:hover {
  background: #808695;
  color: #fff;
}

.action-box {
  text-align: right;
  border-top: 1px solid #e8eaec;
  padding: 10px 30px 10px 0;
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  background: #fff;
}
.action-box .yes {
  margin-right: 10px;
}
.action-box .no {
  color: rgba(235, 71, 38, 1);
}
.avatar {
  width: 120px;
  /*max-height: 120px;*/
  cursor: pointer;
}
.avatar-box {
  text-align: center;
}
.avatar-box img {
  height: 80px;
  border-radius: 5px;
  cursor: pointer;
}
.image-list {
  overflow: hidden;
  .list-item {
    position: relative;
    float: left;
    width: 120px;
    height: 120px;
    margin: 0 5px 5px 0;
    .image-item {
      width: 100%;
      height: 100%;
      cursor: pointer;
    }
  }
}

.input {
  text-align: center !important;
}
.ivu-input {
  text-align: center !important;
}

.audit-box .headPortraitCorrect-icon {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  color: #fff;
  z-index: 2;
  background: rgba(0, 0, 0, 0.5);
  .icon-chakan {
    font-size: 30px;
    display: inline-block;
    margin-right: 10px;
  }
  .icon-chakan:hover {
    color: #fff !important;
    font-size: 36px !important;
  }
  .icon-caijian {
    font-size: 28px;
    display: inline-block;
  }
  .icon-caijian:hover {
    font-size: 34px;
  }
  .ios-camera:hover {
    font-size: 40px !important;
  }
}

.audit-box .image-item-cover {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
}
.audit-box .image-item-cover i {
  font-size: 24px;
  z-index: 2;
}
.ivu-icon-ios-camera:before {
  color: #e6e6e6;
}
.image-item-cover {
  background: rgba(0, 0, 0, 0.8);
  color: #fff;
  font-weight: bold;
}
.item .org,
.item .new {
  word-wrap: break-word;
}
.areas {
  width: 100%;
  border-radius: 4px;
}
.old-areas .ivu-icon-ios-arrow-down:before {
  content: "" !important;
}
.old-areas .ivu-input[disabled],
fieldset[disabled] .ivu-input {
  background: #fff !important;
}
#clip {
  z-index: 9000;
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}
.clip-mask {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  background: rgba(0, 0, 0, 0.5);
}
.clip-box {
  z-index: 9999;
  background: #fff;
  border-radius: 7px;
}
.clip-header {
  border-bottom: 1px solid #e8eaec;
  padding: 14px 16px;
  line-height: 1;
  position: relative;
}
.clip-title {
  display: inline-block;
  width: 100%;
  height: 20px;
  line-height: 20px;
  font-size: 14px;
  color: #17233d;
  font-weight: bold;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
#clip-close {
  font-size: 24px;
  color: #999;
  position: absolute;
  top: 12px;
  right: 20px;
  cursor: pointer;
}
#clip-close:hover {
  color: #17233d;
}
.hos-item {
  width: 100%;
  /*border:1px solid red;*/
}
.hos-item span:first-child {
  display: inline-block;
  width: 80%;
}
.hos-item span:last-child {
  display: inline-block;
  width: 20%;
}
.hos-line {
  text-align: left;
}
.hos-line span {
  display: inline-block;
  width: 80% !important;
  text-align: center;
}
.hos-item .ivu-select-input {
  text-align: center;
}
.hos-item .icon-xuanze {
  font-size: 20px;
  color: #2d8cf0;
  cursor: pointer;
}
.hos-item .icon-xuanze:hover {
  color: #fff;
  font-size: 23px;
  font-weight: bold;
}
.item:hover .icon-xuanze {
  color: #fff;
}
.other {
  padding: 20px 50px;
  border-top: 1px solid #e8eaec;
}
.other p {
  font-size: 17px;
  display: inline-block;
  margin-left: 50px;
  line-height: 36px;
}
</style>
