<template>
  <section>
    <div class="card-header p-3">
      <div class="columns" style="width: 100%">
        <div class="column">
          <b-breadcrumb
              align="is-left"
          >
            <b-breadcrumb-item tag='router-link' to="/advertisements" >Advertisement</b-breadcrumb-item>
            <b-breadcrumb-item tag='router-link' to="" active >Create</b-breadcrumb-item>
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
            :type="advertisementData.title.class"
            :message="advertisementData.title.message">
          <template slot="label">Name <span class="has-text-danger">*</span></template>
          <b-input @blur="advertisementData.title.blur()" v-model="advertisementData.title.value" maxlength="100" expanded></b-input>
        </b-field>

        <b-field horizontal >
          <template slot="label">Countries <span class="has-text-danger">*</span></template>
          <b-field
              :type="advertisementData.countries.class"
              :message="advertisementData.countries.message">
            <b-select v-model="selectedCountry" placeholder="Currency">
              <option value="" disabled selected>Select Country</option>
              <option v-for="country in countryListRef" :key="country.id" :value="country" >{{country.name}}</option>
            </b-select>
            <p class="control">
              <b-button type="is-primary" label="Add" @click="addCountryTag()" />
            </p>
          </b-field>
          <div>
            <b-tooltip  v-for="item in countryTags" :key="item.id" :label="item.name" style="margin-left: 5px; margin-bottom: 5px">
              <b-tag :type="item.code === 'ALL' ? 'is-danger' : 'is-info'"
                     size="is-medium"
                     closable
                     aria-close-label="Close tag"
                     @close="deleteCountryTag(item)">
                {{item.code}}
              </b-tag>
            </b-tooltip>
          </div>
        </b-field>

        <b-field
            horizontal
            :type="advertisementData.valid_from.class"
            :message="advertisementData.valid_from.message">
          <template slot="label">Valid From <span class="has-text-danger">*</span></template>
          <b-datepicker
              v-model="advertisementData.valid_from.value"
              @input="onFromDateChange()"
              :show-week-number="false"
              locale="en-CA"
              placeholder="Click to select..."
              icon="calendar-today"
              trap-focus>
          </b-datepicker>
        </b-field>

        <b-field
            horizontal
            :type="advertisementData.valid_to.class"
            :message="advertisementData.valid_to.message">
          <template slot="label">Valid To <span class="has-text-danger">*</span></template>
          <b-datepicker
              v-model="advertisementData.valid_to.value"
              :min-date="advertisementData.valid_from.value"
              :show-week-number="false"
              locale="en-CA"
              placeholder="Click to select..."
              icon="calendar-today"
              trap-focus>
          </b-datepicker>
        </b-field>

        <b-field horizontal
                 :type="advertisementData.images.class"
                 :message="advertisementData.images.message" >
          <template slot="label">Images <span class="has-text-danger">*</span></template>
          <div class="">
            <div class="columns is-align-content-space-evenly is-flex-wrap-wrap" >
              <div class="column" v-for="(img, index) in images" :key="img.id">
                <image-upload-component
                    v-model="img.value"
                    :index="index"
                    :image-height="imageHeight"
                    :image-width="imageWidth"
                    :image-validations="imageValidations"
                    :placeholder_image="placeholder_image"
                    @on-upload="onImageUpload"
                ></image-upload-component>
                <br>
                <b-field
                    :type="img.link.class"
                    :message="img.link.message"
                    label="Advertisement Link"
                    label-position="on-border"
                >
<!--                  <template slot="label">Name <span class="has-text-danger">*</span></template>-->
                  <b-input @blur="img.link.blur()" placeholder="Advertisement link" v-model="img.link.value" maxlength="512" expanded></b-input>
                </b-field>
              </div>
              <div class="column" style="text-align: center; height: 200px; width: 200px">
              </div>
            </div>
          </div>
        </b-field>

        <b-field
            horizontal
            message=" ">
          <template slot="label">Status <span class="has-text-danger">*</span></template>
          <div class="block">
            <b-radio v-model="advertisementData.disabled.value"

                     name="status"
                     native-value="0">
              Active
            </b-radio>
            <b-radio v-model="advertisementData.disabled.value"
                     name="status"
                     native-value="1"
                     type="is-danger">
              Not Active
            </b-radio>

          </div>
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
            <b-button @click="$router.go(-1)"  type="is-danger">Cancel</b-button>
          </div>
        </div>
      </div>
    </footer>
  </section>
</template>

<script>
import NetworkManager from "@/network"
import { FieldValidator } from "@/helpers/validators/fieldValidator"
import ImageUploadComponent, {ImageValidator} from "@/components/ImageUploadComponent"
import {ImageData} from "@/views/Advertisement/Support"

export default {
  name: "CreateAdvertisement",
  components: {ImageUploadComponent},
  data() {
    return {
      countryList: [
        {
          code: 'ALL',
          name: 'All Countries'
        }
      ],
      selectedCountry: '',
      countryTags: [],

      imageHeight: 200,
      imageWidth : 300,
      imageValidations: new ImageValidator(0,0,0,0,0),

      placeholder_image: require('@/assets/image-placeholder.png'),

      images: [new ImageData(), new ImageData(), new ImageData(), new ImageData(), new ImageData()],

      advertisementData: {
        title: new FieldValidator(/^\w+[\w\s]+$/),
        countries: new FieldValidator(undefined, 'Please select at least one country'),
        valid_from: new FieldValidator(undefined, undefined, new Date(), true),
        valid_to: new FieldValidator(undefined, undefined, new Date(), true),
        images: new FieldValidator(undefined, "Please select at least one image", undefined, true),
        disabled: new FieldValidator()
      },

      checkBoxVal: false
    }
  },

  computed: {
    countryListRef(){
      const self = this

      let list = []

      self.countryList.forEach(function (item){
        if(!self.countryTags.includes(item)){
          list.push(item)
        }
      })

      return list
    }
  },

  watch: {
  },

  methods: {

    onImageUpload: function (data){
      const self = this
      self.advertisementData.images.blur()

      console.log(data)
    },

    addCountryTag: function (){
      const self = this

      self.advertisementData.countries.blur()

      if(self.selectedCountry !== ''){
        self.countryTags.push(self.selectedCountry)
      }

      self.selectedCountry = ''
      self.advertisementData.countries.value = ''

      self.countryTags.forEach(function (item, index){
        self.advertisementData.countries.value += (index === 0 ? '' : '|') + item.code
      })
    },

    deleteCountryTag: function (item){
      const self = this

      let index = self.countryTags.indexOf(item)
      self.countryTags.splice(index, 1)

      self.advertisementData.countries.value = ''

      self.countryTags.forEach(function (item, index){
        self.advertisementData.countries.value += (index === 0 ? '' : '|') + item.code
      })
    },

    onFromDateChange: function (){
      const self = this

      if(self.advertisementData.valid_to.value.getTime() < self.advertisementData.valid_from.value.getTime()){
        self.advertisementData.valid_to.value = self.advertisementData.valid_from.value
      }
    },

    initialData: function (){
      const self = this
      NetworkManager.apiRequest('api/advertisement/initial-create-data', {}, function (e){
        if(e.statusCode === 200){
          e.data.countries.forEach(function (item){
            self.countryList.push(item)
          })
        }
      })
    },

    validate: function (){
      const self = this
      let isValid = true

      Object.keys(self.advertisementData).forEach(function(key) {
        console.log(self.advertisementData[key].validate())
         if(!self.advertisementData[key].validate()) isValid = false
      })

      let emptyCount = 0
      self.images.forEach(function (item){
        if(item.value){
          if(item.value === '') emptyCount++
          if(!item.link.validate()) isValid = false
        }
        else {
          emptyCount++
        }
      })

      if(emptyCount === self.images.length){
        self.advertisementData.images.invalidate()
      }

      return isValid
    },

    validateAndSubmit: function (){
      const self = this

      if(self.validate()){
        let countries = []
        let images = []

        self.countryTags.forEach(function (item){
          countries.push(item.code)
        })

        self.images.forEach(function (item){
          if(item.value !== ''){
            let im = {
              image: item.value,
              link: item.link.value
            }
            images.push(im)
          }
        })

        let validFrom = self.formatDate(self.advertisementData.valid_from.value)
        let validTo = self.formatDate(self.advertisementData.valid_to.value)
        validFrom = validFrom.split(' ')[0] + 'T00:00:01'
        validTo = validTo.split(' ')[0] + 'T23:59:59'

        const data = {
          title : self.advertisementData.title.value,
          countries : countries,
          valid_from : validFrom,
          valid_to : validTo,
          images : images,
          disabled : self.advertisementData.disabled.value
        }

        NetworkManager.apiRequest('api/advertisement/create', data, function (e){
          if(e.statusCode === 200){
            const params = {
              type: 'is-success',
              message: 'Advertisement sent for approval'
            }
            self.$buefy.toast.open(params)
            self.$router.go(-1)
          }
          else {
            const params = {
              type: 'is-warning',
              message: 'Advertisement save failed!.'
            }
            self.$buefy.toast.open(params)
          }
        })
      }
    }
  },

  mounted() {
    this.advertisementData.disabled.value = 0
    this.initialData()
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
