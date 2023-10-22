<template>
    <section>
      <div class="card-header p-3">
        <div class="columns" style="width: 100%">
          <div class="column">
            <b-breadcrumb
                align="is-left"
            >
              <b-breadcrumb-item tag='router-link' to="/merchants" >Merchants</b-breadcrumb-item>
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
              :type="userData.name.class"
              :message="userData.name.message">
            <template slot="label">Name <span class="has-text-danger">*</span></template>
            <b-input @blur="userData.name.blur()" v-model="userData.name.value" maxlength="100" expanded></b-input>
          </b-field>
          <b-field
              horizontal
              :type="userData.email.class"
              :message="userData.email.message">
            <template slot="label">Email <span class="has-text-danger">*</span></template>
            <b-input @input="userData.email.blur()" v-model="userData.email.value" maxlength="100" expanded></b-input>
          </b-field>
  
          <b-field
              horizontal
              :type="userData.contactNo.class"
              :message="userData.contactNo.message">
            <template slot="label">Contact No <span class="has-text-danger">*</span></template>
            <b-input @blur="userData.contactNo.blur()" v-model="userData.contactNo.value" maxlength="10"></b-input>
          </b-field>
          <b-field horizontal>
            <div class="block"></div>
          </b-field>

          <b-field
              horizontal
              :type="userData.regNo.class"
              :message="userData.regNo.message">
            <template slot="label">Registration No <span class="has-text-danger">*</span></template>
            <b-input @blur="userData.regNo.blur()" v-model="userData.regNo.value" maxlength="10"></b-input>
          </b-field>
          <b-field horizontal>
            <div class="block"></div>
          </b-field>

          <b-field
              horizontal
              :type="userData.address.class"
              :message="userData.address.message">
             <template slot="label">Address<span class="has-text-danger">*</span></template>
             <b-input @blur="userData.address.blur()" v-model="userData.address.value" maxlength="100"></b-input>
          </b-field>
          <b-field horizontal>
            <div class="block"></div>
          </b-field>
  

          <b-field horizontal>
            <div class="block"></div>
          </b-field>
  
          <b-field
              horizontal
              message=" ">
            <template slot="label">Status <span class="has-text-danger">*</span></template>
            <div class="block">
              <b-radio v-model="userData.disabled.value"
  
                       name="status"
                       native-value="0">
                Active
              </b-radio>
              <b-radio v-model="userData.disabled.value"
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
  import {FieldValidator} from "@/helpers/validators/fieldValidator"
 
  
  export default {
    name: "MerchantCreate",
    data() {
      return {
        // branchList: [],
        // roleList: [],
        // permissionsList: [],
        // exchangeHouseList: [],
        // providerList: [],
  
        userData: {
          name: new FieldValidator(
              /^([A-Za-z\d]*\s?[A-Za-z\d]+){3,}$/,
              "Name can only have alphanumeric characters and should be at least 3 characters long"
          ),
          email: new FieldValidator(
              /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/,
              "Please enter a valid email"
          ),
          contactNo: new FieldValidator(
              /^\d{4,32}$/,
              "Please enter a valid contact number"
          ),
          address: new FieldValidator(
            /^[A-Za-z\d@,$!%*?&]{3,}[\w\W]+$/,
              "address can only have alphanumeric characters and should be at least 3 characters long"
          ),
          regNo: new FieldValidator(
            /^[a-zA-Z0-9]{1,32}$/,
              "Please enter a valid registration number"
          ),
          disabled: new FieldValidator()
        },
  
        checkBoxVal: false
      }
    },
  
    computed: {
     
    },
  
    watch: {
      
    },
  
    methods: {
      validate: function (){
      const self = this
      let isValid = true

      Object.keys(self.userData).forEach(function(key) {
        console.log(self.userData[key].validate())
         if(!self.userData[key].validate()) isValid = false
      })

      return isValid
    },
      validateAndSubmit: function (){
        const self = this
  
        if(self.validate()){
          const data = {
            name : self.userData.name.value,
            email : self.userData.email.value,
            contact : self.userData.contactNo.value,
            reg_no : self.userData.regNo.value,
            address : self.userData.address.value,
            disabled : self.userData.disabled.value
          }
  
          NetworkManager.apiRequest('api/dutyfree/DFMerchant/create', data, function (e){
            if(e.statusCode === 200){
              const params = {
                type: 'is-success',
                message: 'Merchant sent for approval'
              }
              self.$buefy.toast.open(params)
              self.$router.go(-1)
            }
            else if(e.statusCode === 400){
              const params = {
                type: 'is-warning',
                message: e.data.message
              }
              self.$buefy.toast.open(params)
            }
            else {
              const params = {
                type: 'is-warning',
                message: 'Merchant save failed!.'
              }
              self.$buefy.toast.open(params)
            }
          })
        }
      }
    },
  
    mounted() {
      this.userData.disabled.value = 0
      
    }
  }
  </script>
  
  <style scoped>

  </style>
  