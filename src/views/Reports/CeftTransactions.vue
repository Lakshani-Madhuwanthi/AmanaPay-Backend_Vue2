<template>
  <section>
    <div class="card-header p-3">
      <div class="columns" style="width: 100%">
        <div class="column">
          <b-breadcrumb
              align="is-left"
          >
            <b-breadcrumb-item tag='router-link' to="" active >Send Money Transactions</b-breadcrumb-item>
          </b-breadcrumb>
        </div>
        <div class="column">
        </div>
      </div>
    </div>
    <div class="card-content" style="overflow: auto; height: 83vh">
      <div class="columns" style="margin-top: 10px">
        <b-field class="column is-one-fifths is-small" label="From" label-position="on-border">
          <b-datetimepicker
              v-model="fromDate"
              @input="onFromDateChange()"
              size="is-small"
              :show-week-number="false"
              locale="en-CA"
              placeholder="Click to select..."
              icon="calendar-today"
              trap-focus>
          </b-datetimepicker>
        </b-field>
        <b-field class="column is-one-fifths is-small" label="To" label-position="on-border">
          <b-datetimepicker
              v-model="toDate"
              @input="filterChanged = true"
              size="is-small"
              :min-date="fromDate"
              :show-week-number="false"
              locale="en-CA"
              placeholder="Click to select..."
              icon="calendar-today"
              trap-focus>
          </b-datetimepicker>
        </b-field>
        <b-field class="column is-one-fifths is-small" label="Country" label-position="on-border">
          <b-select v-model="countryCode" placeholder="Select a Country" size="is-small" expanded>
            <option :value="''" selected>All Countries</option>
            <option v-for="country in countryList" :value="country.code" :key="country.code">{{ country.name }}</option>
          </b-select>
        </b-field>
        <b-field class="column is-one-fifths is-small" label="User UID" label-position="on-border">
          <b-input v-model="userUID" size="is-small" expanded></b-input>
        </b-field>
        <b-field  class="column" label="">
          <div class="buttons">
            <b-button size="is-small" type="is-success" @click="loadData">Search</b-button>
            <b-tooltip label="Download as Excel">
              <b-button size="is-small" :disabled="filterChanged" @click="generateXlsx" type="is-info" icon-right="microsoft-excel"></b-button>
            </b-tooltip>
            <b-tooltip label="Download as PDF" style="margin-left: 5px">
              <b-button size="is-small" :disabled="filterChanged" @click="generatePdf" type="is-info" icon-right="file-pdf-box" ></b-button>
            </b-tooltip>
          </div>
        </b-field>
      </div>

      <b-table
          :height="vhToPixels(55)"
          :data="filteredList"
          :paginated="tableOptions.isPaginated"
          :per-page="tableOptions.perPage"
          :current-page.sync="tableOptions.currentPage"
          :pagination-simple="tableOptions.isPaginationSimple"
          :pagination-position="tableOptions.paginationPosition"
          :default-sort-direction="tableOptions.defaultSortDirection"
          :pagination-rounded="tableOptions.isPaginationRounded"
          :sort-icon="tableOptions.sortIcon"
          :sort-icon-size="tableOptions.sortIconSize"
          default-sort="id"
          aria-next-label="Next page"
          aria-previous-label="Previous page"
          aria-page-label="Page"
          aria-current-label="Current page"
          :sticky-header="tableOptions.stickyHeaders"
          :page-input="tableOptions.hasInput"
          :pagination-order="tableOptions.paginationOrder"
          :page-input-position="tableOptions.inputPosition"
          :debounce-page-input="tableOptions.inputDebounce">

        <b-table-column field="id" label="ID" width="40" sortable numeric v-slot="props" sticky>
          {{ props.row.id }}
        </b-table-column>

        <b-table-column field="tran_type" label="Transaction Type" sortable v-slot="props" width="200">
          {{ props.row.tran_type }}
        </b-table-column>

        <b-table-column field="NIC/Passport" label="NIC/Passport" sortable v-slot="props" width="200">
          {{ props.row.uid }}
        </b-table-column>

        <b-table-column field="trace" label="Trace Number" sortable v-slot="props" width="200">
          {{ props.row.trace }}
        </b-table-column>

        <b-table-column field="trace" label="Country" sortable v-slot="props" width="200">
          <div style="width: 100px">{{ props.row.country }}</div>
        </b-table-column>

        <b-table-column field="bank_code" label="Bank Code" sortable v-slot="props" width="200">
          {{ props.row.bank_code }}
        </b-table-column>

        <b-table-column field="initiated_time" label="Tran Initiated Time" sortable v-slot="props">
          <span class="tag is-success expanded-col">{{ getDateTimeForDisplaying(props.row.initiated_time) }}</span>
        </b-table-column>

        <b-table-column field="account_number" label="Account Number" sortable v-slot="props" width="200">
          {{ props.row.account_number }}
        </b-table-column>

        <b-table-column field="currency_code" label="Currency Code" sortable v-slot="props" width="200">
          {{ props.row.currency_code }}
        </b-table-column>

        <b-table-column field="amount" label="Amount" sortable v-slot="props" width="200">
          <p style="width: 100px">{{ numberWithCommas(props.row.amount) + ' ' + props.row.currency_code }}</p>
        </b-table-column>

        <b-table-column field="card_payment_time" label="Card Payment Time" sortable v-slot="props">
          <span class="tag is-success expanded-col">{{ getDateTimeForDisplaying(props.row.card_payment_time) }}</span>
        </b-table-column>

        <b-table-column width="200" field="card_payment_status" label="Card Payment Status" sortable v-slot="props">
          <p class="expanded-col">{{ props.row.card_payment_status }}</p>
        </b-table-column>

        <b-table-column width="200" field="card_payment_description" label="Card Payment Description" sortable v-slot="props">
          <p class="expanded-col" style="width: 200px">{{ props.row.card_payment_description }}</p>
        </b-table-column>

        <b-table-column field="ipg_transaction_id" label="IPG Transaction ID" sortable v-slot="props">
          <p class="expanded-col">{{ props.row.ipg_transaction_id }}</p>
        </b-table-column>

        <b-table-column field="ipg_data" label="IPG Details" sortable v-slot="props">
          <b-collapse :open="false" aria-id="contentIdForA11y1">
            <template #trigger="trigger">
              <b-tooltip label="Click to view">
                <b-button
                    label=""
                    icon-right="arrow-down-drop-circle-outline"
                    size="is-small"
                    type="is-primary"
                    aria-controls="contentIdForA11y1"
                    :aria-expanded="trigger.open" />
              </b-tooltip>
            </template>
            <div class="notification">
              <div class="content" style="width: 20rem">
                <h5>
                  IPG Deduction Details
                </h5>
                <section class="card-content">
                  <div class="content pt-auto">
                    <b-field label="Exchange Rate (LKR)" custom-class="is-small">
                      <b-input :value="props.row.exchange_rate_final" size="is-small" readonly></b-input>
                    </b-field>
                    <b-field label="IPG Rate (%)" custom-class="is-small">
                      <b-input :value="props.row.ipg_rate" size="is-small" readonly></b-input>
                    </b-field>
                    <b-field :label="'IPG Commission (' + props.row.currency_code + ')'" custom-class="is-small">
                      <b-input :value="props.row.ipg_commission" size="is-small" readonly></b-input>
                    </b-field>
                    <b-field :label="'Bank Charge (' + props.row.currency_code + ')'" custom-class="is-small">
                      <b-input :value="props.row.bank_charge" size="is-small" readonly></b-input>
                    </b-field>
                    <b-field label="Refund Commission (%)" custom-class="is-small">
                      <b-input :value="props.row.refund_commission" size="is-small" readonly></b-input>
                    </b-field>
                    <b-field label="Beneficiary Received Amount (LKR)" custom-class="is-small">
                      <b-input :value="numberWithCommas(props.row.beneficiary_received_amount_lkr)" size="is-small" readonly></b-input>
                    </b-field>
                  </div>
                </section>
              </div>
            </div>
          </b-collapse>
        </b-table-column>

        <b-table-column field="ceft_payment_time" label="CEFT Payment Time" sortable v-slot="props">
          <span class="tag is-success expanded-col">{{ getDateTimeForDisplaying(props.row.ceft_payment_time) }}</span>
        </b-table-column>

        <b-table-column field="ceft_payment_status" label="CEFT Payment Status" sortable v-slot="props">
          <p class="expanded-col"> {{ props.row.ceft_payment_status }}</p>
        </b-table-column>

        <b-table-column field="ceft_payment_description" label="CEFT Payment Description" sortable v-slot="props">
          <p class="expanded-col" style="width: 200px"> {{ props.row.ceft_payment_description }}</p>
        </b-table-column>

        <b-table-column field="ceft_transaction_id" label="CEFT Transaction ID" sortable v-slot="props">
          <p class="expanded-col"> {{ props.row.ceft_transaction_id }}</p>
        </b-table-column>

        <b-table-column field="ceft_try_count" label="CEFT Try Count" sortable v-slot="props">
          <p class="expanded-col"> {{ props.row.ceft_try_count }} </p>
        </b-table-column>

        <b-table-column field="ipg_void_payment_time" label="IPG Void Payment Time" sortable v-slot="props">
          <span class="tag is-success expanded-col">{{ getDateTimeForDisplaying(props.row.ipg_void_payment_time) }}</span>
        </b-table-column>

        <b-table-column field="ipg_void_status" label="IPG Void Status" sortable v-slot="props">
          <p class="expanded-col">{{ props.row.ipg_void_status }}</p>
        </b-table-column>

        <b-table-column field="void_data" label="Void Details" sortable v-slot="props">
          <b-collapse :open="false" aria-id="contentIdForA11y1">
            <template #trigger="trigger">
              <b-tooltip label="Click to view">
                <b-button
                    label=""
                    icon-right="arrow-down-drop-circle-outline"
                    size="is-small"
                    type="is-primary"
                    aria-controls="contentIdForA11y1"
                    :aria-expanded="trigger.open" />
              </b-tooltip>
            </template>
            <div class="notification">
              <div class="content" style="width: 20rem">
                <h5>
                  IPG Void Details
                </h5>
                <section class="card-content">
                  <div class="content pt-auto">
                    <b-field label="Void Tran ID" custom-class="is-small">
                      <b-input :value="props.row.ipg_void_tran_id" size="is-small" readonly></b-input>
                    </b-field>
                    <b-field label="Void Description" custom-class="is-small">
                      <b-input :value="props.row.ipg_void_description" size="is-small" readonly></b-input>
                    </b-field>
                    <b-field label="Void Code" custom-class="is-small">
                      <b-input :value="props.row.ipg_void_code" size="is-small" readonly></b-input>
                    </b-field>
                    <b-field label="Void Message" custom-class="is-small">
                      <b-input :value="props.row.ipg_void_message" size="is-small" readonly></b-input>
                    </b-field>
                  </div>
                </section>
              </div>
            </div>
          </b-collapse>
        </b-table-column>

        <b-table-column field="ipg_refund_payment_time" label="IPG Refund Payment Time" sortable v-slot="props">
          <span class="tag is-success expanded-col">{{ getDateTimeForDisplaying(props.row.ipg_refund_payment_time) }}</span>
        </b-table-column>

        <b-table-column field="ipg_void_status" label="IPG Refund Status" sortable v-slot="props">
          <p class="expanded-col">{{ props.row.ipg_refund_status }}</p>
        </b-table-column>

        <b-table-column field="void_data" label="Refund Details" sortable v-slot="props">
          <b-collapse :open="false" aria-id="contentIdForA11y1">
            <template #trigger="trigger">
              <b-tooltip label="Click to view">
                <b-button
                    label=""
                    icon-right="arrow-down-drop-circle-outline"
                    size="is-small"
                    type="is-primary"
                    aria-controls="contentIdForA11y1"
                    :aria-expanded="trigger.open" />
              </b-tooltip>
            </template>
            <div class="notification">
              <div class="content" style="width: 20rem">
                <h5>
                  IPG Refund Details
                </h5>
                <section class="card-content">
                  <div class="content pt-auto">
                    <b-field label="Refund Tran ID" custom-class="is-small">
                      <b-input :value="props.row.ipg_refund_tran_id" size="is-small" readonly></b-input>
                    </b-field>
                    <b-field label="Refund Description" custom-class="is-small">
                      <b-input :value="props.row.ipg_refund_description" size="is-small" readonly></b-input>
                    </b-field>
                    <b-field label="Refund Code" custom-class="is-small">
                      <b-input :value="props.row.ipg_refund_code" size="is-small" readonly></b-input>
                    </b-field>
                    <b-field label="Refund Message" custom-class="is-small">
                      <b-input :value="props.row.ipg_refund_message" size="is-small" readonly></b-input>
                    </b-field>
                  </div>
                </section>
              </div>
            </div>
          </b-collapse>
        </b-table-column>

        <b-table-column field="created_at" label="Created At" sortable centered v-slot="props">
          <span class="tag is-success expanded-col">{{ getDateTimeForDisplaying(props.row.created_at) }}</span>
        </b-table-column>

        <b-table-column field="updated_at" label="Updated At" sortable centered v-slot="props">
          <span class="tag is-success expanded-col">{{ getDateTimeForDisplaying(props.row.updated_at) }}</span>
        </b-table-column>

        <b-table-column field="action" label="Action" v-slot="props" sticky>
          <div class="columns">
            <div v-if="canHold(props.row)" class="column">
              <b-tooltip label="Hold Fund-transfer" position="is-left" type="is-dark" style="margin-left: 10px">
                <b-button type="is-warning"
                          icon-left="timer-stop"
                          size="is-small"
                          @click="StartTransferHoldAction(props.row)"></b-button>
              </b-tooltip>
            </div>
            <div v-if="canFundTransfer(props.row)" class="column">
              <b-tooltip label="Manual Fund transfer" position="is-left" type="is-dark" style="margin-left: 10px">
                <b-button type="is-info"
                          icon-left="autorenew"
                          size="is-small"
                          @click="StartFundTransferAction(props.row)"></b-button>
              </b-tooltip>
            </div>
            <div v-if="canRefund(props.row)" class="column" >
              <div class="b-tooltips" style="width: 150px">
                <b-tooltip v-if="isToday(props.row.card_payment_time)" label="Void Transaction" position="is-left" type="is-dark" style="margin-left: 10px">
                  <b-button type="is-danger"
                            size="is-small"
                            label="Void"
                            @click="StartRefundAction('void', props.row.id)"></b-button>
                </b-tooltip>
                <b-tooltip v-else label="Refund Transaction" position="is-left" type="is-dark" style="margin-left: 10px">
                  <b-button type="is-danger"
                            size="is-small"
                            label="Refund"
                            @click="StartRefundAction('refund', props.row.id)"></b-button>
                </b-tooltip>
              </div>
            </div>
          </div>
        </b-table-column>

      </b-table>
    </div>
    <br />
  </section>
</template>

<script>
import NetworkManager from "@/network"
import {appSettings} from "@/appSettings"
import {TransactionExportWizard} from "@/views/Reports/Supports";

export default {
  name: 'CEFTTransactions',
  components: {
  },
  data() {
    return {
      fromDate: new Date(),
      toDate: new Date(),
      filterChanged: false,

      countryCode: '',
      userUID: '',
      countryList: [],

      transactions: [],
      filteredList: [],

      exportWizard: new TransactionExportWizard("CEFT Transactions"),

      tableOptions: {
        isPaginated: true,
        isPaginationSimple: false,
        isPaginationRounded: false,
        paginationPosition: 'bottom',
        defaultSortDirection: 'asc',
        sortIcon: 'arrow-up',
        sortIconSize: 'is-small',
        currentPage: 1,
        perPage: 10,
        hasInput: false,
        paginationOrder: '',
        inputPosition: '',
        inputDebounce: '',
        stickyHeaders: true,
      },

      tableHeaders: []
    }
  },

  computed: {
  },

  watch: {
    fromDate(){
      this.filterChanged = true
    },

    toDate(){
      this.filterChanged = true
    }
  },

  methods: {

    getImageUrl: function (path){
      return appSettings.$api_url + path+ "?" + new Date().getTime()
    },

    generateXlsx: function (){
      const self = this

      self.exportWizard.exportToXlsx(
          new Date(),
          self.authUser().username,
          self.fromDate,
          self.toDate,
          "ceftTransactions_" + self.formatDateTime(new Date()),
          self.tableHeaders,
          self.filteredList
      )
    },

    generatePdf: function (){
      const self = this

      self.exportWizard.exportToPDF(
          new Date(),
          self.authUser().username,
          self.fromDate,
          self.toDate,
          "ceftTransactions_" + self.formatDateTime(new Date()),
          self.tableHeaders,
          self.filteredList
      )
    },

    onFromDateChange: function (){
      const self = this

      if(self.toDate.getTime() < self.fromDate.getTime()){
        self.toDate = self.fromDate
      }
    },

    canRefund: function (tran){
      return  tran.ipg_void_status !== 'SUCCESS' && tran.ipg_refund_status !== 'SUCCESS' && tran.refund_requested &&
          this.hasPermission('transaction-refund')
    },

    canFundTransfer: function (tran){
      return  tran.ipg_void_status !== 'SUCCESS' && tran.ipg_refund_status !== 'SUCCESS' && tran.ceft_payment_status !== "SUCCESS" &&
          tran.card_payment_status === 'SUCCESS' && this.hasPermission('transaction-retry')
    },

    canHold: function (tran){
      return  tran.ipg_void_status !== 'SUCCESS' && tran.ipg_refund_status !== 'SUCCESS' && tran.ceft_payment_status !== "SUCCESS" &&
          tran.card_payment_status === 'SUCCESS' && this.hasPermission('transaction-hold') && tran.ceft_try_count < 100
    },

    isToday: function (dateStr){
      let today = this.formatDate(new Date().toLocaleString())
      let date = this.formatDate(dateStr)

      return today === date
    },

    loadData: function (){
      const  self = this

      self.fromDate.setSeconds(1)
      self.toDate.setSeconds(0)

      let data = {
        from_date: self.formatDateTime(self.fromDate),
        to_date: self.formatDateTime(self.toDate),
        country_code: self.countryCode,
        user_uid: self.userUID
      }

      self.showFullScreenLoader()

      NetworkManager.apiRequest('api/Transaction/get-ceftTransaction', data, function (e){
        if(e.statusCode === 200){
          self.transactions = e.data.transactions
          self.filteredList = e.data.filteredList
          self.tableHeaders = e.data.fields
          self.countryList = e.data.countries
          self.filterChanged = false
        }

        self.hideFullScreenLoader()
      })
    },

    StartTransferHoldAction: function (tran){
      const self = this
      

      if(self.hasRatesUpdated){
        self.GenerateReport()
      }
      else {

        self.$buefy.dialog.confirm({
          type: 'is-danger',
          title: "Warning!",
          message: "Taking this action will hold the fund-transfer of the customer (Tran ID - " + tran.id + ").<br>" +
              " Do you want to continue?",
          onConfirm: () => self.holdFundTransfer(tran.id, "")
        })
      }
    },

    StartRefundAction: function (type, Id){
      const self = this

      if(self.hasRatesUpdated){
        self.GenerateReport()
      }
      else {

        self.$buefy.dialog.confirm({
          type: 'is-danger',
          title: "Warning!",
          message: "Taking this action will refund the card payment of the customer (Tran ID - " + Id + ").<br>" +
              " Do you want to continue?",
          onConfirm: () => type === 'void' ? self.voidTransaction(Id) : self.refundTransaction(Id)
        })
      }
    },

    StartFundTransferAction: function (tran){
      const self = this

      if(self.hasRatesUpdated){
        self.GenerateReport()
      }
      else {

        self.$buefy.dialog.confirm({
          type: 'is-danger',
          title: "Warning!",
          message: "Taking this action will start a manual fund transferring for this transaction (Tran ID - " + tran.id + "). <br>" +
          "If you not sure funds are availabe, please do not take this action. <br>" +
          "Are you sure to take this action?",
          onConfirm: () => self.manualFundTransfer(tran)
        })
      }
    },

    voidTransaction: function (Id){
      const  self = this

      let data = {
        transactionID: Id
      }

      self.showFullScreenLoader()

      NetworkManager.apiRequest('api/Transaction/ceft/void', data, function (e){
        if(e.statusCode === 200){
          const params = {
            type: 'is-success',
            message: "Transaction voided successfully: Id - " + Id
          }
          self.$buefy.toast.open(params)
          self.loadData()
        }
        else {
          const params = {
            type: 'is-warning',
            message: e.data.message
          }
          self.$buefy.toast.open(params)

          self.hideFullScreenLoader()
        }
      })
    },

    refundTransaction: function (Id){
      const  self = this

      let data = {
        transactionID: Id
      }

      self.showFullScreenLoader()

      NetworkManager.apiRequest('api/Transaction/ceft/refund', data, function (e){
        if(e.statusCode === 200){
          const params = {
            type: 'is-success',
            message: "Transaction refunded successfully: Id - " + Id
          }
          self.$buefy.toast.open(params)
          self.loadData()
        }
        else {
          const params = {
            type: 'is-warning',
            message: e.data.message
          }
          self.$buefy.toast.open(params)

          self.hideFullScreenLoader()
        }
      })
    },

    manualFundTransfer: function (tran){
      const  self = this

      let data = {
        trace: tran.trace
      }

      self.showFullScreenLoader()

      NetworkManager.apiRequest('api/Transaction/ceft/manualFundTransfer', data, function (e){
        if(e.statusCode === 200){
          const params = {
            type: 'is-success',
            message: "Fund transfer successful: Id - " + tran.id
          }
          self.$buefy.toast.open(params)
          self.loadData()
        }
        else {
          const params = {
            type: 'is-warning',
            message: e.data.message
          }
          self.$buefy.toast.open(params)

          self.hideFullScreenLoader()
        }
      })
    },

    holdFundTransfer: function (id, desc){
      const  self = this

      let data = {
        id: id,
        description: desc
      }

      self.showFullScreenLoader()

      NetworkManager.apiRequest('api/Transaction/ceft/hold', data, function (e){
        if(e.statusCode === 200){
          const params = {
            type: 'is-success',
            message: "Transaction hold successful: Id - " + id
          }
          self.$buefy.toast.open(params)
          self.loadData()
        }
        else {
          const params = {
            type: 'is-warning',
            message: e.data.message
          }
          self.$buefy.toast.open(params)

          self.hideFullScreenLoader()
        }
      })
    }

  },

  mounted() {
    let fromDate = new Date()
    fromDate.setHours(0)
    fromDate.setMinutes(0)
    fromDate.setSeconds(0)

    let toDate = new Date()
    toDate.setHours(23)
    toDate.setMinutes(59)
    toDate.setSeconds(59)

    this.fromDate = fromDate
    this.toDate = toDate

    this.loadData()
  }
}
</script>

<style>
.is-sticky-column-one {
  background: #23d160 !important;
  color: white !important;
}
.is-sticky-column-two {
  background: #167df0 !important;
  color: white !important;
}
</style>
