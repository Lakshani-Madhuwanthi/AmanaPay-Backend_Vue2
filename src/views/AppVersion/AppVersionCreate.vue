<template>
  <section>
    <div class="card-header p-3">
      <div class="columns" style="width: 100%">
        <div class="column">
          <b-breadcrumb
              align="is-left"
          >
            <b-breadcrumb-item tag='router-link' to="/appVersions">App Version</b-breadcrumb-item>
            <b-breadcrumb-item tag='router-link' to="" active >Create</b-breadcrumb-item>
          </b-breadcrumb>
        </div>
        <div class="column">
        </div>
      </div>
    </div>

    <div class="card-content" style="overflow: auto; height: 70vh">
      <section>
        <app-version-input
            v-model="versionData.version.value"
            :type="versionData.version.class"
            :message="versionData.version.message"
            @on-blur="versionData.version.blur()"
            header="Version"></app-version-input>

        <b-field horizontal>
          <div class="block"></div>
        </b-field>

        <b-field
            horizontal
            :type="versionData.platforms.class"
            :message="versionData.platforms.message">
          <template slot="label">Platforms <span class="has-text-danger">*</span></template>
          <b-field>
            <b-checkbox-button v-model="versionData.platforms.value"
                               @input="versionData.platforms.blur()"
                               native-value="ANDROID"
                               type="is-success">
              <b-icon icon="android"></b-icon>
              <span>Android</span>
            </b-checkbox-button>

            <b-checkbox-button v-model="versionData.platforms.value"
                               @input="versionData.platforms.blur()"
                               native-value="IOS"
                               type="is-info">
              <b-icon icon="apple-ios"></b-icon>
              <span>IOS</span>
            </b-checkbox-button>

            <b-checkbox-button v-model="versionData.platforms.value"
                               @input="versionData.platforms.blur()"
                               native-value="HUAWEI"
                               type="is-danger">
              <b-icon icon="check"></b-icon>
              <span>Huawei</span>
            </b-checkbox-button>
          </b-field>
        </b-field>

        <b-field horizontal>
          <div class="block"></div>
        </b-field>

        <b-field
            horizontal>
          <template slot="label">Force Update <span class="has-text-danger">*</span></template>
          <b-switch v-model="versionData.force_update.value"
                    :true-value="1"
                    :false-value="0">
            <span style="font-weight: bold" :class="versionData.force_update.value === 1 ? 'has-text-danger' : 'has-text-success'">{{ versionData.force_update.value === 1 ? 'Yes' : 'No' }}</span>
          </b-switch>
        </b-field>

      </section>
    </div>

    <footer class="card-footer">
      <div class="columns" style="width: 100%">
        <div class="column">
          <p class="column has-text-danger is-italic">Fields marked with <big>*</big> are mandatory</p>
        </div>
        <div class="column">
          <div class="buttons is-pulled-right" style="margin: 5px">
            <b-button @click="validateAndSubmit()" :loading="false" type="is-success">Save</b-button>
            <b-button @click="navigateTo('AppVersion')"  type="is-danger">Cancel</b-button>
          </div>
        </div>
      </div>
    </footer>
  </section>
</template>

<script>
import NetworkManager from "@/network"
import { FieldValidator } from "@/helpers/validators/fieldValidator"
import AppVersionInput from "@/views/AppVersion/Components/AppVersionInput";

export default {
  name: "CreateAppVersion",
  components: {AppVersionInput},
  data() {
    return {
      countryList: [],

      imageHeight: 200,
      imageWidth : 300,
      marginError: 15,
      image: null,
      placeholder_image: require('@/assets/image-placeholder.png'),

      versionId: 0,
      platforms: {
        android: false,
        ios: false,
        huawei: false
      },

      versionData: {
        version: new FieldValidator(
            /^\d+.\d+.\d+\+\d+$/
        ),
        platforms: new FieldValidator(
            /^[\w,]+$/,
            'Please select at least one platform',
            [],
            true
        ),
        force_update: new FieldValidator(
            /^\d$/,
            '',
            0,
            true
        )
      },

      checkBoxVal: false
    }
  },

  watch: {
    platforms: {
      handler(){
        this.versionData.platforms.value = ''
        this.versionData.platforms.value += this.platforms.ios ? 'IOS,' : ''
        this.versionData.platforms.value += this.platforms.android ? 'ANDROID,' : ''
        this.versionData.platforms.value += this.platforms.huawei ? 'HUAWEI,' : ''
      },
      deep: true
    }
  },

  methods: {

    validate: function (){
      const self = this
      let isValid = true

      Object.keys(self.versionData).forEach(function(key) {
        console.log(self.versionData[key].validate())
         if(!self.versionData[key].validate()) isValid = false
      })

      if(self.versionData.platforms.value.length === 0){
        isValid = false
        self.versionData.platforms.invalidate()
      }

      return isValid
    },

    validateAndSubmit: function (){
      const self = this

      if(self.validate()){
        const data = {
          appVersion : self.versionData.version.value,
          platforms : self.versionData.platforms.value,
          forceUpdate : self.versionData.force_update.value
        }

        self.showFullScreenLoader()

        NetworkManager.apiRequest('api/appVersion/create', data, function (e){
          if(e.statusCode === 200){
            const params = {
              type: 'is-success',
              message: 'AppVersion sent for approval'
            }
            self.$buefy.toast.open(params)
            self.navigateTo('AppVersion')
          }
          else {
            const params = {
              type: 'is-warning',
              message: 'AppVersion save failed!.'
            }
            self.$buefy.toast.open(params)
          }

          self.hideFullScreenLoader()
        })
      }
    }
  },

  mounted() {
    this.versionData.force_update.value = 0
    this.versionData.platforms.value = []
  }
}
</script>

<style scoped>
  .product-image-input {
    display: inline-block;
    position: relative;
    width: 100%;
    height: auto;
    overflow: hidden;
    border: 1px solid #dbdbdb;
    border-radius: 4px;
    cursor: pointer;
    margin-right: 0.5rem;
    margin-bottom: 0.35rem;
  }

  label.product-image-preview {
    background-size: cover;
    background-position: center;
    top: 0;
    left: 0;
    cursor: pointer;
    display: block;
    width: 100%;
  }

  .product-image-edit-or-delete-bg {
    display: none;
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    background-color: #f9f9f97d;
    align-items: center;
    justify-content: center;
  }

  .product-image-input:hover .product-image-edit-or-delete-bg {
    display: flex;
  }

  .product-image-edit-or-delete {
    display: flex;
    flex-direction: row;
  }

  .form-preview .label {
    color: #bd9ea5;
  }

  img#image-to-be-cropped {
    max-height: calc(100vh - 150px);
  }
</style>
