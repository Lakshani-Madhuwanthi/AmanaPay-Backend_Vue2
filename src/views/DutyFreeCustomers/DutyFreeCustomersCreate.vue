<template>
  <section>
    <div class="card-header p-3">
      <div class="columns" style="width: 100%">
        <div class="column">
          <b-breadcrumb align="is-left">
            <b-breadcrumb-item tag='router-link' to="" active>Duty Free Request</b-breadcrumb-item>
          </b-breadcrumb>
        </div>
      </div>
    </div>
    <section class="mt-5 mr-5">
      <b-field horizontal label="First Name">
        <b-input v-model="requestData.first_name" expanded></b-input>
      </b-field>
      <b-field horizontal label="Last Name">
        <b-input v-model="requestData.last_name" expanded></b-input>
      </b-field>
      <b-field horizontal label="Phone No">
        <b-input v-model="requestData.phone_no" expanded></b-input>
      </b-field>
      <b-field horizontal label="NIC Number">
        <b-input v-model="requestData.nic" expanded></b-input>
      </b-field>
      <b-field horizontal label="Current Passport">
        <b-input v-model="requestData.current_passport" expanded></b-input>
      </b-field>
      <b-field horizontal label="Previous Passport">
        <b-input v-model="requestData.previous_passport" expanded></b-input>
      </b-field>
      <b-field horizontal label="Date">
        <b-input :value="requestData.date" expanded disabled></b-input>
      </b-field>
    </section>
    <hr>
    <div class="columns">
      <div class="column is-half"></div>
      <div class="column is-flex is-justify-content-flex-end mr-5">
        <b-button type="is-success ml-2" @click="creatRequest">Place a Request</b-button>
        <b-button type="is-danger ml-2" @click="navigateTo('dutyFreeCustomers')">Cancel</b-button>
      </div>
    </div>
  </section>
</template>

<script>
import NetworkManager from "@/network";

export default {
  data() {
    return {
      requestData: {
        first_name: '',
        last_name: '',
        phone_no: '',
        date: '',
        nic: '',
        current_passport: '',
        previous_passport: ''
      }
    }
  },

  methods: {
    loadProfile: function (){
      const self = this

      self.showFullScreenLoader()
      NetworkManager.apiRequest('api/DFProfile/get-dutyfree-profile', { uid: self.$route.params.nic }, function (e) {
        if (e.statusCode === 200) {
          let data = e.data.profile_User

          self.requestData = {
            first_name: data.first_name,
            last_name: data.last_name,
            phone_no: data.phone_no,
            nic: data.nic,
            date: self.formatDate(new Date()),
            current_passport: data.current_passport,
            previous_passport: data.previous_passport
          }

          self.hasARequest = true
        } else {
          self.requestData = {
            first_name: '',
            last_name: '',
            phone_no: '',
            date: self.formatDate(new Date()),
            nic: '',
            current_passport: '',
            previous_passport: ''
          }

          self.message = 'No request found for the user'
          self.hasARequest = false
        }
        self.hideFullScreenLoader()
      })
    },

    creatRequest: function (){
      const self = this

      self.showFullScreenLoader()
      NetworkManager.apiRequest('api/Dutyfree/DFRequest/create-request-web', self.requestData, function (e) {
        if (e.statusCode === 200) {
          const params = {
            type: 'is-success',
            message: 'Duty Request Created Successfully'
          }
          self.$buefy.toast.open(params)
          self.navigateTo('dutyFreeCustomers')
        } else {
          const params = {
            type: 'is-warning',
            message: 'Duty Request Create Failed'
          }
          self.$buefy.toast.open(params)
        }
        self.hideFullScreenLoader()
      })
    }
  },

  mounted() {
    this.requestData.date = this.formatDate(new Date())
    this.loadProfile()
  }
}

</script>

<style scoped></style>
  