<template>
  <div class="test">
    <section>
      <div class="card-header p-3">
        <div class="columns" style="width: 100%">
          <div class="column">
            <b-breadcrumb align="is-left">
              <b-breadcrumb-item tag='router-link' to="" active>Duty free Merchant</b-breadcrumb-item>
            </b-breadcrumb>
          </div>
        </div>
      </div>
      <section class="mt-5 mr-6" style="height: 63vh; overflow: auto">
        <b-field horizontal label="Name">
          <b-input v-model="user_request.name" expanded readonly></b-input>
        </b-field>
        <b-field horizontal label="NIC Number">
          <b-input v-model="user_request.nic_number" expanded readonly></b-input>
        </b-field>
        <b-field horizontal label="Current passport">
          <b-input v-model="user_request.current_passport" expanded readonly></b-input>
        </b-field>
        <b-field horizontal label="Date">
          <b-input v-model="user_request.date" expanded readonly></b-input>
        </b-field>
        <b-field horizontal label="Product(s)" required>
          <b-input v-model="user_request.products" expanded required></b-input>
        </b-field>
        <b-field horizontal label="No. of Item Purchases">
          <b-input v-model="user_request.no_of_purchases" type="number" expanded required></b-input>
        </b-field>
        <b-field horizontal label="Reference">
          <b-input v-model="user_request.reference" expanded required></b-input>
        </b-field>
        <b-field horizontal label="Remark">
          <b-input v-model="user_request.remark" expanded required></b-input>
        </b-field>
        <b-field horizontal label="Invoice Number">
          <b-input v-model="user_request.invoice_number" expanded required></b-input>
        </b-field>
        <b-field horizontal label="Invoice Amount (USD)">
          <b-input v-model="user_request.invoice_amount" expanded required></b-input>
        </b-field>
        <b-field horizontal label="Claim Amount (USD)">
          <b-input v-model="user_request.claimed_amount" expanded required></b-input>
        </b-field> 
        <p></p>   
      </section>
      <b-card-footer>
        <div class="columns">
          <div class="column is-flex is-justify-content-flex-end mr-6">
            <b-button type="is-success ml-2" @click="uploadData()">Save</b-button>
            <b-button type="is-danger ml-2" @click="goBack">Cancel</b-button>
          </div>
        </div>
      </b-card-footer>
    </section>
    <pop-up-message :is_active="popUpData.active" :type="popUpData.type" :message="popUpData.message"></pop-up-message>
  </div>
</template>
  
<script>
import moment from 'moment'
import NetworkManager from "@/network"
import PopUpMessage from "@/views/DutyFreeMerchant/Components/PopUpMessage";

export default {
  // props: {
  //     user_request: {
  //         type: Object,
  //         default: () => ({
  //             name: '',
  //             nic_number: '',
  //             current_passport: '',
  //             date: ''
  //         })
  //     }
  // },
  components: {
    PopUpMessage
  },
  data() {
    return {
      popUpData: {
        active: false,
        type: 'is-success',
        message: ''
      },
      user_request: {
        name: '',
        nic_number: '',
        current_passport: '',
        date: '',
        df_request_id: '',
        products: '',
        no_of_purchases: '',
        reference: '',
        remark: '',
        invoice_number: '',
        invoice_amount: '',
        claimed_amount: ''

      }
    }
  },
  computed: {
    isDesktop() {
      return window.innerWidth > 768;
    }
  },
    mounted() {
    console.log(this.$route.query)
    // Prefill form fields with data from DutyFreeMerchant page
    this.user_request.name = this.$route.query.name
    this.user_request.nic_number = this.$route.query.nic_number
    this.user_request.df_request_id = this.$route.query.id
    this.user_request.current_passport = this.$route.query.current_passport
    // Parse the date string to a Moment.js object
    const date = moment(this.$route.query.date)
    // Format the date to desired format (e.g. "YYYY-MM-DD")
    this.user_request.date = date.format('YYYY-MM-DD')
  },
  methods: {
    uploadData: function () {
      const self = this
      // Check if invoice_amount is less than claimed_amount
      if (parseFloat(self.user_request.invoice_amount) < parseFloat(self.user_request.claimed_amount)) {
        self.popUpData.type = 'is-danger';
        self.popUpData.message = 'Claimed amount can not be greater than Invoice amount';
        self.popUpData.active = true;
        return;
      }

      self.buttonsLoading = true

      const data = {
        df_request_id: self.user_request.df_request_id,
        products: self.user_request.products,
        no_of_purchases: self.user_request.no_of_purchases,
        reference: self.user_request.reference,
        remark: self.user_request.remark,
        invoice_number: self.user_request.invoice_number,
        invoice_amount: self.user_request.invoice_amount,
        claimed_amount: self.user_request.claimed_amount

      }
      console.log(data)
      NetworkManager.apiRequest('api/Dutyfree/DFRequest/add-purchase', data, function (e) {
        if (e.statusCode === 200) {
          self.popUpData.type = 'is-success'
          self.popUpData.message = 'Transaction data uploaded successfully'
          self.popUpData.active = true
        } else {
          self.popUpData.type = 'is-danger'
          self.popUpData.message = 'Transaction data upload failed'
          self.popUpData.active = true
        }
      })
    },
    goBack() {
      window.history.back();
    }
  }
}

</script>
  
<style scoped>
@media screen and (max-width: 768px) {
  .test {
    width: 100%;
    margin-left: 10px;
  }
}
</style>
  