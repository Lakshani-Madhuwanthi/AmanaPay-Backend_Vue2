<template>
  <section>
    <div class="card-header p-3">
      <div class="columns" style="width: 100%">
        <div class="column">
          <b-breadcrumb align="is-left">
            <b-breadcrumb-item tag='router-link' to="" active>EChannelling Transactions</b-breadcrumb-item>
          </b-breadcrumb>
        </div>
        <div class="column">
        </div>
      </div>
    </div>
    <div class="card-content" style="overflow: auto; height: 83vh">
      <div class="columns" style="margin-top: 10px">
        <b-field class="column is-one-fifths is-small" label="From" label-position="on-border">
          <b-datetimepicker v-model="fromDate" @input="onFromDateChange()" size="is-small" :show-week-number="false"
            locale="en-CA" placeholder="Click to select..." icon="calendar-today" trap-focus>
          </b-datetimepicker>
        </b-field>
        <b-field class="column is-one-fifths is-small" label="To" label-position="on-border">
          <b-datetimepicker v-model="toDate" @input="filterChanged = true" size="is-small" :min-date="fromDate"
            :show-week-number="false" locale="en-CA" placeholder="Click to select..." icon="calendar-today" trap-focus>
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
        <b-field class="column" label="">
          <div class="buttons">
            <b-button size="is-small" type="is-success" @click="loadData">Search</b-button>
            <b-tooltip label="Download as Excel">
              <b-button size="is-small" :disabled="filterChanged" @click="generateXlsx" type="is-info"
                icon-right="microsoft-excel"></b-button>
            </b-tooltip>
            <b-tooltip label="Download as PDF" style="margin-left: 5px">
              <b-button size="is-small" :disabled="filterChanged" @click="generatePdf" type="is-info"
                icon-right="file-pdf-box"></b-button>
            </b-tooltip>
          </div>
        </b-field>
      </div>

      <b-table :height="vhToPixels(55)" :data="filteredList" :paginated="tableOptions.isPaginated"
        :per-page="tableOptions.perPage" :current-page.sync="tableOptions.currentPage"
        :pagination-simple="tableOptions.isPaginationSimple" :pagination-position="tableOptions.paginationPosition"
        :default-sort-direction="tableOptions.defaultSortDirection" :pagination-rounded="tableOptions.isPaginationRounded"
        :sort-icon="tableOptions.sortIcon" :sort-icon-size="tableOptions.sortIconSize" default-sort="id"
        aria-next-label="Next page" aria-previous-label="Previous page" aria-page-label="Page"
        aria-current-label="Current page" :sticky-header="tableOptions.stickyHeaders" :page-input="tableOptions.hasInput"
        :pagination-order="tableOptions.paginationOrder" :page-input-position="tableOptions.inputPosition"
        :debounce-page-input="tableOptions.inputDebounce">

        <b-table-column field="id" label="ID" width="40" sortable numeric v-slot="props" sticky>
          {{ props.row.id }}
        </b-table-column>

        <b-table-column field="trace" label="Trace Number" sortable v-slot="props" width="200">
          {{ props.row.trace }}
        </b-table-column>

        <b-table-column field="ec_transaction_id" label="Echannelling Reference" sortable v-slot="props" width="200">
          {{ props.row.ec_transaction_id }}
        </b-table-column>

        <b-table-column field="trace" label="Country" sortable v-slot="props" width="200">
          <div style="width: 100px">{{ props.row.country }}</div>
        </b-table-column>

        <b-table-column field="NIC/Passport" label="NIC/Passport" sortable v-slot="props" width="200">
          <div style="width: 100px">{{ props.row.uid }}</div>
        </b-table-column>

        <b-table-column field="patient_name" label="Patient Name" sortable v-slot="props" width="200">
          <p class="expanded-col">{{ props.row.patient_name }}</p>
        </b-table-column>

        <b-table-column field="receiver_name" label="Patient Mobile" sortable v-slot="props" width="200">
          {{ props.row.patient_mobile }}
        </b-table-column>

        <b-table-column field="hospital_name" label="Hospital Name" sortable v-slot="props" width="200">
          <p class="expanded-col">{{ props.row.hospital_name }}</p>
        </b-table-column>

        <b-table-column field="doctor_name" label="Doctor Name" sortable v-slot="props" width="200">
          <p class="expanded-col">{{ props.row.doctor_name }}</p>
        </b-table-column>

        <b-table-column field="appointment_day" label="Appointment Day" sortable v-slot="props" width="200">
          {{ props.row.appointment_day }}
        </b-table-column>

        <b-table-column field="appointment_date" label="Appointment Date" sortable v-slot="props" width="200">
          {{ props.row.appointment_date }}
        </b-table-column>

        <b-table-column field="start_time" label="Start Time" sortable v-slot="props" width="200">
          {{ props.row.start_time }}
        </b-table-column>

        <b-table-column field="initiated_time" label="Tran Initiated Time" sortable v-slot="props">
          <span class="tag is-success expanded-col">{{ getDateTimeForDisplaying(props.row.initiated_time) }}</span>
        </b-table-column>

        <b-table-column field="currency_code" label="Currency Code" sortable v-slot="props" width="200">
          {{ props.row.currency_code }}
        </b-table-column>

        <b-table-column field="amount" label="Amount" v-slot="props" sortable>
          <p style="width: 100px">{{ numberWithCommas(props.row.amount) + ' ' + props.row.currency_code }}</p>
        </b-table-column>

        <b-table-column field="doctor_charge_lkr" label="Doctor Charge (LKR)" v-slot="props" sortable width="200">
          <p style="width: 100px">{{ numberWithCommas(props.row.doctor_charge_lkr) + ' LKR' }}</p>
        </b-table-column>

        <b-table-column field="hospital_charge_lkr" label="Hospital Charge (LKR)" v-slot="props" sortable width="200">
          <p style="width: 100px">{{ numberWithCommas(props.row.hospital_charge_lkr) + ' LKR' }}</p>
        </b-table-column>

        <b-table-column field="ec_charge_lkr" label="EChannelling Charge (LKR)" v-slot="props" sortable width="200">
          <p style="width: 100px">{{ numberWithCommas(props.row.ec_charge_lkr) + ' LKR' }}</p>
        </b-table-column>

        <b-table-column field="total_lkr" label="Total Charge (LKR)" v-slot="props" sortable width="200">
          <p style="width: 100px">{{ numberWithCommas(props.row.total_lkr) + ' LKR' }}</p>
        </b-table-column>

        <b-table-column field="card_payment_time" label="Card Payment Time" sortable v-slot="props">
          <span class="tag is-success expanded-col">{{ getDateTimeForDisplaying(props.row.card_payment_time) }}</span>
        </b-table-column>

        <b-table-column width="200" field="card_payment_status" label="Card Payment Status" sortable v-slot="props">
          <p class="expanded-col">{{ props.row.card_payment_status }}</p>
        </b-table-column>

        <b-table-column width="200" field="card_payment_description" label="Card Payment Description" sortable
          v-slot="props">
          <p class="expanded-col" style="width: 200px">{{ props.row.card_payment_description }}</p>
        </b-table-column>

        <b-table-column field="ipg_transaction_id" label="IPG Transaction ID" sortable v-slot="props">
          <p class="expanded-col">{{ props.row.ipg_transaction_id }}</p>
        </b-table-column>

        <b-table-column field="ipg_data" label="IPG Details" sortable v-slot="props">
          <b-collapse :open="false" aria-id="contentIdForA11y1">
            <template #trigger="trigger">
              <b-tooltip label="Click to view">
                <b-button label="" icon-right="arrow-down-drop-circle-outline" size="is-small" type="is-primary"
                  aria-controls="contentIdForA11y1" :aria-expanded="trigger.open" />
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
                      <b-input :value="props.row.exchange_rate_lkr" size="is-small" readonly></b-input>
                    </b-field>
                    <b-field label="IPG Rate (%)" custom-class="is-small">
                      <b-input :value="props.row.ipg_rate" size="is-small" readonly></b-input>
                    </b-field>
                    <b-field :label="'IPG Commission (' + props.row.currency_code + ')'" custom-class="is-small">
                      <b-input :value="numberWithCommas(props.row.ipg_commission)" size="is-small" readonly></b-input>
                    </b-field>
                    <b-field :label="'Bank Charge (' + props.row.currency_code + ')'" custom-class="is-small">
                      <b-input :value="props.row.bank_charge" size="is-small" readonly></b-input>
                    </b-field>
                    <b-field label="Refund Commission (%)" custom-class="is-small">
                      <b-input :value="props.row.refund_commission" size="is-small" readonly></b-input>
                    </b-field>
                  </div>
                </section>
              </div>
            </div>
          </b-collapse>
        </b-table-column>

        <b-table-column field="ec_booking_time" label="EChannelling Booking Time" sortable v-slot="props">
          <span class="tag is-success expanded-col">{{ getDateTimeForDisplaying(props.row.ec_booking_time) }}</span>
        </b-table-column>

        <b-table-column field="ec_booking_status" label="EChannelling Booking Status" sortable v-slot="props">
          <p class="expanded-col">{{ props.row.ec_booking_status }}</p>
        </b-table-column>

        <b-table-column field="ec_booking_description" label="EChannelling Booking Description" sortable v-slot="props">
          <p class="expanded-col" style="width: 200px">{{ props.row.ec_booking_description }}</p>
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
                <b-button label="" icon-right="arrow-down-drop-circle-outline" size="is-small" type="is-primary"
                  aria-controls="contentIdForA11y1" :aria-expanded="trigger.open" />
              </b-tooltip>
            </template>
            <div class="notification">
              <div class="content" style="width: 20rem">
                <h5>
                  IPG Deduction Details
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

        <b-table-column field="created_at" label="Created At" sortable centered v-slot="props">
          <span class="tag is-success expanded-col">
            {{ getDateTimeForDisplaying(props.row.created_at) }}
          </span>
        </b-table-column>

        <b-table-column field="updated_at" label="Updated At" sortable centered v-slot="props">
          <span class="tag is-success expanded-col">
            {{ getDateTimeForDisplaying(props.row.updated_at) }}
          </span>
        </b-table-column>

        <!--        <b-table-column field="action" label="Action" v-slot="props" sticky>-->
        <!--          <div v-if="props.row.locked === 0">-->
        <!--            <div class="b-tooltips" style="width: 150px">-->
        <!--              <b-tooltip label="Edit" position="is-left" type="is-dark" style="margin-left: 10px">-->
        <!--                <b-button type="is-danger"-->
        <!--                          size="is-small"-->
        <!--                          @click="navigateTo('EditExchangeHouse', {id: props.row.id})"-->
        <!--                          icon-left="lead-pencil"></b-button>-->
        <!--              </b-tooltip>-->
        <!--            </div>-->
        <!--          </div>-->
        <!--          <div v-else>-->
        <!--            <b-tooltip label="Locked" position="is-left" type="is-dark">-->
        <!--              <b-icon-->
        <!--                  icon="lock"-->
        <!--                  size="is-medium">-->
        <!--              </b-icon>-->
        <!--            </b-tooltip>-->
        <!--          </div>-->
        <!--        </b-table-column>-->

      </b-table>
    </div>
    <br />
  </section>
</template>

<script>
import NetworkManager from "@/network"
import { appSettings } from "@/appSettings"
import { TransactionExportWizard } from "@/views/Reports/Supports";

export default {
  name: 'EChannellingTransactions',
  components: {
  },
  data() {
    return {
      fromDate: new Date(),
      toDate: new Date(),
      filterChanged: false,

      countryCode: '',
      countryList: [],
      transactions: [],
      filteredList: [],

      userUID: '',

      exportWizard: new TransactionExportWizard("EChannelling Transactions"),

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
    fromDate() {
      this.filterChanged = true
    },

    toDate() {
      this.filterChanged = true
    }
  },

  methods: {
    getImageUrl: function (path) {
      return appSettings.$api_url + path + "?" + new Date().getTime()
    },

    generateXlsx: function () {
      const self = this

      self.exportWizard.exportToXlsx(
        new Date(),
        self.authUser().username,
        self.fromDate,
        self.toDate,
        "echannellingTransactions_" + self.formatDateTime(new Date()),
        self.tableHeaders,
        self.filteredList
      )
    },

    generatePdf: function () {
      const self = this

      self.exportWizard.exportToPDF(
        new Date(),
        self.authUser().username,
        self.fromDate,
        self.toDate,
        "echannellingTransactions_" + self.formatDateTime(new Date()),
        self.tableHeaders,
        self.filteredList
      )
    },

    onFromDateChange: function () {
      const self = this

      if (self.toDate.getTime() < self.fromDate.getTime()) {
        self.toDate = self.fromDate
      }
    },

    loadData: function () {
      const self = this

      self.fromDate.setSeconds(1)
      self.toDate.setSeconds(0)

      let data = {
        from_date: self.formatDateTime(self.fromDate),
        to_date: self.formatDateTime(self.toDate),
        country_code: self.countryCode,
        user_uid: self.userUID
      }

      self.showFullScreenLoader()

      NetworkManager.apiRequest('api/Transaction/echannellingTransactions', data, function (e) {
        if (e.statusCode === 200) {
          self.transactions = e.data.transactions
          self.filteredList = e.data.filteredList
          self.tableHeaders = e.data.fields
          self.countryList = e.data.countries
          self.filterChanged = false
        }

        self.hideFullScreenLoader()
      })
    },

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
