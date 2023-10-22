<template>
  <section>
    <div class="card-header p-3">
      <div class="columns" style="width: 100%">
        <div class="column">
          <b-breadcrumb
              align="is-left"
          >
            <b-breadcrumb-item tag='router-link' to="/banks" >Banks</b-breadcrumb-item>
            <b-breadcrumb-item tag='router-link' to="" active >Edit Bank</b-breadcrumb-item>
          </b-breadcrumb>
        </div>
        <div class="column">
        </div>
      </div>
    </div>

    <div class="card-content" style="overflow: auto; height: 70vh">
      <section>

        <b-field
            horizontal
            :type="bankData.bank_code.class"
            :message="bankData.bank_code.message">
          <template slot="label">Bank Code <span class="has-text-danger">*</span></template>
          <b-input @blur="bankData.bank_code.blur()" v-model="bankData.bank_code.value" maxlength="100" expanded readonly></b-input>
        </b-field>

        <b-field
            horizontal
            :type="bankData.bank_name.class"
            :message="bankData.bank_name.message">
          <template slot="label">Name <span class="has-text-danger">*</span></template>
          <b-input @blur="bankData.bank_name.blur()" v-model="bankData.bank_name.value" maxlength="100" expanded></b-input>
        </b-field>

        <b-field horizontal>
          <div class="block"></div>
        </b-field>

        <b-field horizontal
                 :type="bankData.logo.class"
                 :message="bankData.logo.message" >
          <template slot="label">Image <span class="has-text-danger">*</span></template>
          <div>
            <label>(Uploading image size should be less than {{ imageValidations.maxSize }}KB)</label>
            <image-upload-component
                :type="bankData.logo.class"
                v-model="bankData.logo.value"
                :index="0"
                :image-height="imageHeight"
                :image-width="imageWidth"
                :image-validations="imageValidations"
                :placeholder_image="placeholder_image"
                @on-upload="onImageUpload"
            ></image-upload-component>
          </div>
        </b-field>

        <b-field horizontal>
          <div class="block"></div>
        </b-field>

        <b-field
            horizontal
            message=" ">
          <template slot="label">Status <span class="has-text-danger">*</span></template>
          <div class="block">
            <b-radio v-model="bankData.disabled.value"

                     name="status"
                     native-value="0">
              Active
            </b-radio>
            <b-radio v-model="bankData.disabled.value"
                     name="status"
                     native-value="1"
                     type="is-danger">
              Not Active
            </b-radio>

          </div>
        </b-field>

      </section>

      <canvas ref="bankImageCanvas" style="display: none"></canvas>
    </div>

    <footer class="card-footer">
      <div class="columns" style="width: 100%">
        <div class="column">
          <p class="column has-text-danger is-italic">Fields marked with <big>*</big> are mandatory</p>
        </div>
        <div class="column">
          <div class="buttons is-pulled-right" style="margin: 5px">
            <b-button @click="validateAndSubmit()" :loading="false" type="is-success">Save</b-button>
            <b-button @click="navigateTo('Bank')"  type="is-danger">Cancel</b-button>
          </div>
        </div>
      </div>
    </footer>
  </section>
</template>

<script>
import NetworkManager from "@/network"
import { FieldValidator } from "@/helpers/validators/fieldValidator"
import {appSettings} from "@/appSettings"
import imageUploadComponent, {ImageValidator} from "@/components/ImageUploadComponent"

export default {
  name: "EditBank",
  components: {imageUploadComponent},
  data() {
    return {
      countryList: [],

      imageHeight: 200,
      imageWidth : 300,
      marginError: 15,
      image: null,
      imageValidations: new ImageValidator(0,0,0,0,100),
      placeholder_image: require('@/assets/image-placeholder.png'),

      bankId: 0,

      bankData: {
        bank_name: new FieldValidator(
            /^([a-zA-Z\s&.]){3,}$/,
            "Name can only have alphanumeric characters with &. and should be at least 3 characters long"
        ),
        bank_code: new FieldValidator(
            /^\w{3,}$/,
            "Bank Code can only have alphanumeric characters with '_' and should be at least 3 characters long"
        ),
        logo: new FieldValidator(
            /[\w/\\]*/,
            "Please upload an image"
        ),
        disabled: new FieldValidator()
      },

      checkBoxVal: false
    }
  },

  methods: {

    onImageUpload: function (data){
      this.bankData.logo.blur()
      if(!data.valid){
        this.bankData.logo.invalidate('Uploaded image is invalid')
      }
    },

    loadImage: function (path){
      return appSettings.$api_url + "/" + path+ "?" + new Date().getTime()
    },

    getForEdit: function (){
      const self = this

      const data = {
        id : self.$route.params.id
      }

      self.showFullScreenLoader()

      NetworkManager.apiRequest('api/dutyfree/DFBank/get-for-edit', data, function (e){
        if(e.statusCode === 200){
          const bank = e.data.bank
          self.bankId = bank.id
          self.bankData.bank_name.value = bank.bank_name
          self.bankData.bank_code.value = bank.bank_code
          self.bankData.logo.value = ''
          self.bankData.disabled.value = bank.disabled

          self.placeholder_image = self.loadImage(bank.logo)
        }

        self.hideFullScreenLoader()
      })
    },

    validate: function (){
      const self = this
      let isValid = true

      Object.keys(self.bankData).forEach(function(key) {
        console.log(self.bankData[key].validate())
         if(!self.bankData[key].validate()) isValid = false
      })

      return isValid
    },

    validateAndSubmit: function (){
      const self = this

      if(self.validate()){
        const data = {
          id: self.bankId,
          bank_name : self.bankData.bank_name.value,
          bank_code : self.bankData.bank_code.value,
          logo : self.bankData.logo.value,
          disabled : self.bankData.disabled.value
        }

        self.showFullScreenLoader()

        NetworkManager.apiRequest('api/dutyfree/DFBank/edit', data, function (e){
          if(e.statusCode === 200){
            const params = {
              type: 'is-success',
              message: 'Bank sent for approval'
            }
            self.$buefy.toast.open(params)
            self.navigateTo('Bank')
          }
          else {
            const params = {
              type: 'is-warning',
              message: 'Bank save failed!.'
            }
            self.$buefy.toast.open(params)
          }

          self.hideFullScreenLoader()
        })
      }
    }
  },

  mounted() {
    this.getForEdit()
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
