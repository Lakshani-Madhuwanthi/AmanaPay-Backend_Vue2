<template>
  <section>
      <div class="card-header p-3">
        <div class="columns is-flex" style="width: 100%; justify-content: space-between">
          <div class="column">
            <b-breadcrumb>
              <b-breadcrumb-item tag='router-link' to="" active>Duty Free Merchant</b-breadcrumb-item>
            </b-breadcrumb>
          </div>
          <div class="column">
            <div class="is-pulled-right">
              <b-button v-if="merchant_user && merchant_user.dutyfree_amount > 0" type="is-success is-small"
                icon-right="plus" @click="navigateToPurchase()">Add a Purchase</b-button>
            </div>
          </div>
        </div>
      </div>
    <div class="columns is-multiline is-mobile">
      <div class="column is-half-desktop is-two-thirds-tablet is-full-mobile">
        <b-field label="Enter Customer Passport/NIC" grouped style="margin-top: 100px; margin-left: 20px;">
          <b-input v-model="search" placeholder="Enter passport/NIC" expanded></b-input>
          <p class="control">
            <b-button :disabled="isSearchDisabled" label="Search" type="is-success" @click="getUserData()" />
          </p>
        </b-field>
      </div>
    </div>
    
    <div v-if="merchant_user" class="columns is-flex m-2">
  <div class="column">
    <div class="card" style="width: 50%;">
      <div class="card-content" style="box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">
        <div class="columns is-multiline is-desktop-only is-gapless">
          <div class="column is-two-fifths-desktop is-one-third-tablet">
            <p class="column-label" style="color:blueviolet; white-space: nowrap;"><b>Duty Free Amount (USD)</b></p>
            <p class="column-label" style="white-space: nowrap;">Name</p>
            <p class="column-label" style="white-space: nowrap;">Requested Date</p>
            <p class="column-label" style="white-space: nowrap;">NIC Number</p>
            <p class="column-label" style="white-space: nowrap;">Current Passport</p>
          </div>
          <div class="column">
            <p class="has-text-right column-text" style="color:blueviolet; white-space: nowrap;"><b>{{ merchant_user.dutyfree_amount }}</b></p>
            <p class="has-text-right column-text" style="white-space: nowrap;">{{ merchant_user.first_name + ' ' + merchant_user.last_name }}</p>
            <p class="has-text-right column-text" style="white-space: nowrap;">{{ formatDate(merchant_user.date) }}</p>
            <p class="has-text-right column-text" style="white-space: nowrap;">{{ merchant_user.nic }}</p>
            <p class="has-text-right column-text" style="white-space: nowrap;">{{ merchant_user.current_passport }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
    <div v-if="notFound" class="columns m-2">
      <div class="column">
        <p>User not found</p>
      </div>
    </div>
  </section>
</template>


  
<script>
import NetworkManager from "@/network"

export default {
  data() {
    return {
      search: '',
      merchant_user: null,
      notFound: false,
      user_request: {
        id: '',
        name: '',
        nic_number: '',
        current_passport: '',
        date: '',
      }

    }
  },
  computed: {
    isSearchDisabled() {
      return this.search.trim() === ''
    }
  },
  methods: {
    getUserData() {
      const self = this

      self.showFullScreenLoader()
      NetworkManager.apiRequest('api/Dutyfree/DFRequest/get-merchant-request', { uid: self.search }, function (e) {
        if (e.statusCode === 200) {
          self.merchant_user = e.data.requestdata
          self.notFound = false

          // Get the necessary fields for updating PurchaseDutyFreeMerchant page
          self.user_request.name = e.data.requestdata.first_name + ' ' + e.data.requestdata.last_name;
          self.user_request.nic_number = e.data.requestdata.nic
          self.user_request.id = e.data.requestdata.id
          self.user_request.current_passport = e.data.requestdata.current_passport
          self.user_request.date = e.data.requestdata.date
        } else {
          self.merchant_user = null
          self.user_request = {
            id: '',
            name: '',
            nic_number: '',
            current_passport: '',
            date: ''
          }
          self.notFound = true
        }
        self.hideFullScreenLoader()
      })
    },
    navigateToPurchase() {
      this.$router.push({
        name: 'PurchaseDutyFreeMerchant',
        query: this.user_request
      })
    }
  },
}
</script>
<style scoped>
.columns.is-flex {
  justify-content: space-between;
}

.column-label,
.column-text {
  font-size: 16px;
}
@media screen and (max-width: 1030px) {
  .card {
    width: auto !important;
  }
}
@media screen and (max-width: 768px) {
  .column {
    width: 79vw;
  }

  .columns {
    display: inline-flex;
  }

  .column-label {
    font-size: 14px;
  }

  .column-text {
    font-size: 14px;
  }
  .card{
    width: 100%;
  }
}
</style>

