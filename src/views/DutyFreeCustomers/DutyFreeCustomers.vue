<template>
    <section>
    <div class="container" style="height: 78vh; width: 85vw">
      <div class="card-header p-3">
        <div class="columns" style="width: 100%">
          <div class="column">
            <b-breadcrumb align="is-left">
              <b-breadcrumb-item tag="router-link" to="" active>Duty Free Customers</b-breadcrumb-item>
            </b-breadcrumb>
          </div>
          <div class="column">
            <b-button v-if="hasPermission('df-bank-view')" type="is-success is-small" class="is-pulled-right"
              icon-right="plus" @click="starCreateRequestAction">Add a New Request</b-button>
          </div>
        </div>
      </div>
      <div class="columns">
        <div class="column is-half">
          <b-field label="Enter Customer Passport/NIC" grouped style="margin-top: 100px; margin-left: 20px;">
            <b-input v-model="uid" placeholder="Enter Passport/NIC" expanded></b-input>
            <p class="control">
              <b-button :disabled="isSearchDisabled" @click="getUserData" label="Search" type="is-success" />
            </p>
          </b-field>
        </div>
      </div>

        <div v-if="hasARequest" class="columns m-2">
            <div grouped class="column is-one-fifth">
                <p>Reference</p>
                <p>Name</p>
                <p>Requested Date</p>
                <p>NIC Number</p>
                <p>Current Passport</p>
                <p>Status</p>
            </div>
            <div grouped class="column is-one-fifth">
                <p class="has-text-right">{{requestData.reference}}</p>
                <p class="has-text-right">{{requestData.first_name + ' ' + requestData.last_name}}</p>
                <p class="has-text-right">{{formatDate(requestData.date)}}</p>
                <p class="has-text-right">{{requestData.nic}}</p>
                <p class="has-text-right">{{requestData.current_passport}}</p>
                <p class="has-text-right">{{requestData.status}}</p>
            </div>
        </div>
      <div v-else class="columns m-2">
        <div class="column">{{message}}</div>
      </div>
      
    </div>
    </section>
</template>
  
<script>
import NetworkManager from "@/network";

export default {
    data() {
        return {
          uid: '',
          hasARequest: false,
          message: '',

          requestData: {
            reference: '',
            first_name: '',
            last_name: '',
            email: '',
            date: '',
            nic: '',
            current_passport: '',
            previous_passport: '',
            status: ''
          }
        }
    },
    computed: {
    isSearchDisabled() {
      return this.uid.trim() === ''
    }
  },
    methods: {
      getUserData() {
        const self = this

        self.showFullScreenLoader()
        NetworkManager.apiRequest('api/Dutyfree/DFRequest/get-available-request', { uid: self.uid }, function (e) {
          if (e.statusCode === 200) {
            self.requestData = e.data.requestdata
            self.hasARequest = true
          } else {
            self.requestData = {
              reference: '',
              first_name: '',
              last_name: '',
              email: '',
              date: '',
              nic: '',
              current_passport: '',
              previous_passport: '',
              status: ''
            }

            self.message = 'No request found for the user'
            self.hasARequest = false
          }
          self.hideFullScreenLoader()
        })
      },

      starCreateRequestAction: function (){
        const self = this

        let msg = ''

        if(self.requestData.status === 'PENDING'){
          msg = "Creating a new request will cancel current 'PENDING' request. (Duty Free amount will not be cancelled)"
        }
        else if(self.requestData.status === 'APPROVED'){
          msg = "Creating a new request will cancel current 'APPROVED' request. (Duty Free amount will also be cancelled)"
        }

        self.$buefy.dialog.confirm({
          type: 'is-danger',
          title: "Warning!",
          message: msg + ".<br>" +
              " Do you want to continue?",
          onConfirm: () => self.navigateToCreateRequest()
        })
      },

      navigateToCreateRequest: function (){
        const self = this
        self.navigateTo('CreateDutyFreeCustomers', {nic: self.requestData.nic})
      }

    }
}

</script>
  
<style scoped></style>
  