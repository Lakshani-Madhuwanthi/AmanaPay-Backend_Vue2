<template>
  <div>
    <section style=" overflow-y: auto; overflow-x: hidden;">
      <div style="height:78vh; width:75vw">
        <div class="card-header p-3">
          <div class="columns" style="width: 100%">
            <div class="column">
              <b-breadcrumb align="is-left">
                <b-breadcrumb-item tag='router-link' to="" active>Duty Free Requests - {{ authUser().branch }}
                </b-breadcrumb-item>
              </b-breadcrumb>
            </div>
          </div>
        </div>
        <b-tabs type="is-toggle" style="padding: 20px;">
          <b-tab-item label="Upload data">
            <div>
              <b-field horizontal label="Name">
                <b-input :value="(dutyFreeRequestData.first_name + ' ' + dutyFreeRequestData.last_name)" expanded
                  readonly></b-input>
              </b-field>
              <b-field horizontal label="NIC Number">
                <b-input :value="dutyFreeRequestData.nic" expanded readonly></b-input>
              </b-field>
              <b-field horizontal label="Current passport">
                <b-input :value="dutyFreeRequestData.current_passport" expanded readonly></b-input>
              </b-field>
              <b-field horizontal label="Start date">
                <b-input :value="new Date(dutyFreeRequestData.last_claimed_date).toLocaleString()" expanded
                  readonly></b-input>
              </b-field>
              <b-field horizontal label="Requested date">
                <b-input :value="new Date(dutyFreeRequestData.date).toLocaleString()" expanded readonly></b-input>
              </b-field>
              <b-field v-if="!request_updated" horizontal label="CSV File">
                <p>(upload csv file size should be less than 50MB)</p>
              </b-field>
              <b-field v-if="request_updated" horizontal label="CSV File">
                <p></p>
              </b-field>
              <b-field v-if="!request_updated" horizontal>
                <csv-upload-component v-model="data" :filter-list="filterList" :fromDate="minDate"
                  :toDate="maxDate"></csv-upload-component>
              </b-field>
              <div v-if="request_updated" class="columns is-flex">
                <div class="column is-one-fifth"></div>
                <div class="column is-justify-content-center">
                  <b-table :data="data" :columns="columns"></b-table>
                </div>
              </div>
              <hr>
              <div class="columns">
                <div class="column"></div>
                <div v-if="requestedBy == authUser().username" class="column is-half">
                  <p class="has-text-danger">You do not have the authority to approve or reject this record. Only another member of your staff can make that decision for the record you entered.</p>
                </div>
                <div class="column is-flex is-justify-content-flex-end mr-5">
                  <div v-if="request_updated && !request_approved">
                    <b-button type="is-success" @click="approve_or_reject('approve')" :disabled="requestedBy == authUser().username">Approve</b-button>
                    <b-button type="is-danger ml-2" @click="approve_or_reject('reject')" :disabled="requestedBy == authUser().username">Reject</b-button>
                    
                  </div>
                  <div v-else-if="!request_updated">
                    <b-button :loading="buttonsLoading" type="is-success ml-2" @click="uploadData">Save</b-button>
                    <b-button :loading="buttonsLoading" type="is-warning ml-2" @click="uploadData(false)">No Data
                      Available</b-button>
                    <b-button :loading="buttonsLoading" type="is-danger ml-2" @click="goBack">Cancel</b-button>
                  </div>
                  <div v-else>
                    <b-button type="is-dark ml-2" @click="goBack" outlined>Cancel</b-button>
                  </div>
                </div>
              </div>
              <b-modal has-modal-card :can-cancel="false" trap-focus v-model="modalActive">
                <div class="modal-card" style="height: 300px; width: 500px;">
                  <header class="modal-card-head">
                    <p class="modal-card-title"
                      style="display: flex; justify-content: center; font-size: 16px; font-weight: bold;">
                      Duty Free Request Submit Successfully</p>
                  </header>
                  <section class="modal-card-body" style="display: flex; justify-content: center; align-items: center;">
                    <img src="../../assets/Vector.png" alt="" style="width: 100px; height: 100px;">
                  </section>
                  <footer class="modal-card-foot" style="display: flex; justify-content: center;">
                    <b-button type="is-primary" @click="navigateTo('dutyFreeRequests')">Done</b-button>
                  </footer>
                </div>
              </b-modal>
            </div>
          </b-tab-item>
          <b-tab-item label="Manual Data Entry">
            <div>
              <b-field horizontal label="Name">
                <b-input :value="(dutyFreeRequestData.first_name + ' ' + dutyFreeRequestData.last_name)" expanded
                  readonly></b-input>
              </b-field>
              <b-field horizontal label="NIC Number">
                <b-input :value="dutyFreeRequestData.nic" expanded readonly></b-input>
              </b-field>
              <b-field horizontal label="Current passport">
                <b-input :value="dutyFreeRequestData.current_passport" expanded readonly></b-input>
              </b-field>
              <b-field horizontal label="Start date">
                <b-input :value="new Date(dutyFreeRequestData.last_claimed_date).toLocaleString()" expanded
                  readonly></b-input>
              </b-field>
              <b-field horizontal label="Requested date">
                <b-input :value="new Date(dutyFreeRequestData.date).toLocaleString()" expanded readonly></b-input>
              </b-field>

              <br>

              <div class="columns is-flex">
                <div class="column is-one-fifth"></div>
                <div class="column">
                  <b-field label="Transaction Date">
                    <b-datepicker v-model="selectedDate" :min-date="minDate" :max-date="maxDate">
                    </b-datepicker>
                  </b-field>
                </div>
                <div class="column">
                  <b-field label="Reference">
                    <b-input v-model="enteredReference"></b-input>
                  </b-field>
                </div>
                <div class="column">
                  <b-field label="Currency">
                    <b-input v-model="enteredCurrency"></b-input>
                  </b-field>
                </div>
                <div class="column">
                  <b-field label="Amount">
                    <b-input v-model="enteredAmount"></b-input>
                  </b-field>
                </div>
                <div class="column">
                  <b-field label="Action">
                    <b-button :loading="buttonsLoading" type="is-info ml-2" @click="addManualEntry" :disabled="request_updated">Add</b-button>
                  </b-field>
                </div>
              </div>

              <div class="columns is-flex">
                <div class="column is-one-fifth"></div>
                <div class="column is-justify-content-center">
                  <b-table :data="data" :columns="columns"></b-table>
                </div>
              </div>
              <hr>
              <div class="columns">
                <div class="column"></div>
                <div v-if="requestedBy == authUser().username" class="column is-half">
                  <p class="has-text-danger">You do not have the authority to approve or reject this record.Only another member of your staff can make that decision for the record you entered.</p>
                </div>
                <div class="column is-flex is-justify-content-flex-end mr-5">
                  <div v-if="request_updated && !request_approved">
                    <b-button type="is-success ml-2" @click="approve_or_reject('approve')" :disabled="requestedBy == authUser().username">Approve</b-button>
                    <!-- <p>{{ authUser().username }}</p>  -->
                    <!-- <p>{{ this.requestedBy }}</p> -->
                    <b-button  type="is-danger ml-2" @click="approve_or_reject('reject')" :disabled="requestedBy == authUser().username">Reject</b-button>
                    
                  </div>
                  <div v-else-if="!request_updated">
                    <b-button :loading="buttonsLoading" type="is-success ml-2" @click="uploadData">Save</b-button>
                    <b-button :loading="buttonsLoading" type="is-warning ml-2" @click="uploadData(false)">No Data
                      Available</b-button>
                    <b-button type="is-danger ml-2" @click="goBack">Cancel</b-button>
                  </div>
                  <div v-else>
                    <b-button type="is-dark ml-2" @click="goBack" outlined>Cancel</b-button>
                  </div>
                </div>
              </div>
            </div>
          </b-tab-item>
          <pop-up-message :is_active="popUpData.active" :type="popUpData.type"
            :message="popUpData.message"></pop-up-message>
        </b-tabs>
      </div>
    </section>

  </div>
</template>

<script>
import { ref } from 'vue'
import NetworkManager from "@/network"
import CsvUploadComponent from '../../components/CsvUploadComponent.vue';
import PopUpMessage from "@/views/DutyFreeRequests/Components/PopUpMessage";


export default {
  components: {
    CsvUploadComponent,
    PopUpMessage
  },
  props: ['value'],
  data() {
    return {
      csvFile: '',
      modalActive: false,
      request_id: '',
      request_approved: false,
      popUpData: {
        active: false,
        type: 'is-success',
        message: ''
      },
      request_updated: false,
      change_request_id: '',
      filterList: [],
      buttonsLoading: false,
      requestedBy: '',
      selectedDate: new Date(),
      minDate: new Date(),
      maxDate: new Date(),
      enteredReference: '',
      enteredCurrency: 'USD',
      enteredAmount: '',

      data: ref([]),
      columns: [
        {
          field: 'date',
          label: 'Date',
          centered: true,
          sortable: true
        },

        {
          field: 'nic',
          label: 'NIC',
          centered: true,
          sortable: true
        },
        {
          field: 'passport',
          label: 'Passport',
          centered: true,
          sortable: true
        },
        {
          field: 'reference',
          label: 'Reference',
          centered: true,
          sortable: true
        },
        {
          field: 'currency',
          label: 'Currency',
          centered: true,
          sortable: true
        },
        {
          field: 'amount',
          label: 'Remitted Amount',
          centered: true,
          sortable: true
        }
        
      ],

      dutyFreeRequestData: {
        first_name: '',
        last_name: '',
        email: '',
        nic: '',
        current_passport: '',
        previous_passport: '',
        date: '',
        last_claimed_date: '',
        id: '',
        dutyfree_profile_id: ''
      },
    }
  },
  methods: {
    addManualEntry: function () {
      const self = this
      let row = {
        date: self.formatDate(self.selectedDate),
        reference: self.enteredReference,
        currency: self.enteredCurrency.trim().replace(',', ''),
        amount: self.enteredAmount,
        nic: self.dutyFreeRequestData.nic,
        passport: self.dutyFreeRequestData.current_passport
      }

      console.log(row)

      let referenceExists = false

      self.data.forEach(function (item) {
        if (item.reference === self.enteredReference) {
          referenceExists = true
        }
      })

      if (referenceExists) {
        let params = {
          type: 'is-warning',
          message: 'Reference already exists'
        }
        self.$buefy.toast.open(params)
      }
      else {
        self.data.push(row)
      }
    },

    uploadData: function (checkData) {
      const self = this
      console.log(self.data)

      if (checkData && self.data.length === 0) {
        let params = {
          type: 'is-warning',
          message: 'No data available to save!'
        }
        self.$buefy.toast.open(params)

        return
      }

      self.buttonsLoading = true

      const data = {
        dutyfree_request_id: self.dutyFreeRequestData.id,
        transactions: self.data
      }
      NetworkManager.apiRequest('api/DFTransaction/create-transactions', data, (response) => {
        if (response.statusCode === 200) {
          const params = {
            type: 'is-success',
            message: 'Exchange rates sent for approval',
            
          };
          self.buttonsLoading = false
          self.$buefy.toast.open(params);
          self.goBack()
        } else {
          const params = {
            type: 'is-warning',
            message: response.data.message,   
          };
          self.$buefy.toast.open(params);
        }
      });
    },
    
    approve_or_reject: function (Action){
      const self = this
       const payload = {
        changeRequestID: self.change_request_id,
        actionTaken: Action
       }

      NetworkManager.apiRequest('api/DFTransaction/approve-transactions', payload, function (e){
        if(e.statusCode === 200){
          const params = {
            type: 'is-success',
            message: 'Transactions ' + payload.actionTaken + ' successfully'
          }
          self.$buefy.toast.open(params)
          self.goBack()
        }
        else {
          const params = {
            type: 'is-warning',
            message: 'Transactions ' + payload.actionTaken + ' failed!'
          }
          self.$buefy.toast.open(params)
        }

        self.crIsLoading = false
      })
    },

    goBack() {
      window.history.back();
    }
  },
  mounted() {
    console.log('params data', this.$route.params.data)
    this.dutyFreeRequestData = this.$route.params.data
    this.filterList = [this.dutyFreeRequestData.nic.toLowerCase(), this.dutyFreeRequestData.current_passport.toLowerCase()]
    this.request_updated = this.dutyFreeRequestData.banks[0].request_updated
    this.request_id = this.dutyFreeRequestData.id
    this.request_approved = this.dutyFreeRequestData.banks[0].request_approved
    this.selectedDate = new Date(this.dutyFreeRequestData.last_claimed_date)
    // this.selectedDate.setDate(this.selectedDate.getDate() + 1)
    if (this.request_updated) {
      // Make an API request to get pending transactions
      const payload = {
        request_id: this.request_id
      }

      NetworkManager.apiRequest('api/DFTransaction/get-pending', payload, (response) => {
        console.log('API Response:', response);
        if (response.statusCode === 200) {
          const transactions = response.data.transactions;
          this.requestedBy = response.data.requested_by
          this.change_request_id = response.data.id
          
          console.log(this.requestedBy);
          this.$nextTick(() => {
            this.data = transactions.map((transaction) => ({
              reference: transaction.reference,
              amount: transaction.amount,
              nic: transaction.nic,
              passport: transaction.passport,
              date: new Date(transaction.date).toLocaleString(),
              currency: transaction.currency,
            }));
          });

        } else {
          // Handle API error if needed
          console.error('API request failed:', response.data.message);
        }
      });
    }
    this.minDate = this.selectedDate
    this.maxDate = new Date(this.dutyFreeRequestData.date)
  }
}
</script>

<style scoped></style>
