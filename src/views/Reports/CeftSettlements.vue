<template>
  <section>
    <div class="card-header p-3">
      <div class="columns" style="width: 100%">
        <div class="column">
          <b-breadcrumb
              align="is-left"
          >
            <b-breadcrumb-item tag='router-link' to="" active >Settlement Report</b-breadcrumb-item>
          </b-breadcrumb>
        </div>
        <div class="column">
        </div>
      </div>
    </div>
    <div class="card-content" style="overflow: auto; height: 83vh">
      <div class="columns" style="margin-top: 10px">
        <b-field class="column is-one-fifths is-small" label="Date" label-position="on-border">
          <b-datepicker
              v-model="fromDate"
              size="is-small"
              :show-week-number="false"
              locale="en-CA"
              placeholder="Click to select..."
              icon="calendar-today"
              trap-focus>
          </b-datepicker>
        </b-field>
        <b-field  class="column" label="">
          <div class="buttons">
            <b-button size="is-small" type="is-success" @click="loadData(false)">Search</b-button>
            <b-button v-if="isToday && transactions.length === 0" size="is-small" type="is-warning" @click="StartGenerate">Generate Report</b-button>

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
          :data="transactions"
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

        <b-table-column field="trn_date" label="Tran Date" sortable v-slot="props" width="200">
          <span class="tag is-success expanded-col">{{ getDateTimeForDisplaying(props.row.tran_date) }}</span>
        </b-table-column>

        <b-table-column field="batch_date" label="Batch Date" sortable v-slot="props" width="200">
          <span class="tag is-success expanded-col">{{ getDateTimeForDisplaying(props.row.batch_date) }}</span>
        </b-table-column>

        <b-table-column field="currency_code" label="Currency Code" sortable v-slot="props" width="200">
          {{ props.row.currency_code }}
        </b-table-column>

        <b-table-column field="account_number" label="Account Number" sortable v-slot="props" width="200">
          {{ props.row.account_number }}
        </b-table-column>

        <b-table-column field="fc_amount" label="FC Amount" sortable v-slot="props" width="200">
          {{ numberWithCommas(props.row.fc_amount) }}
        </b-table-column>

        <b-table-column field="fc_commission" label="FC Commission" sortable v-slot="props" width="200">
          {{ numberWithCommas(props.row.fc_commission) }}
        </b-table-column>

        <b-table-column field="fc_net_amount" label="FC Net Amount" sortable v-slot="props" width="200">
          {{ numberWithCommas(props.row.fc_net_amount) }}
        </b-table-column>

        <b-table-column field="fc_rate" label="Rate" sortable v-slot="props" width="200">
          {{ numberWithCommas(props.row.fc_rate) }}
        </b-table-column>

        <b-table-column field="lkr_amount" label="LKR Amount" sortable v-slot="props" width="200">
          {{ numberWithCommas(props.row.lkr_amount) }}
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
  name: 'SettlementReport',
  components: {
  },
  data() {
    return {
      fromDate: new Date(),
      filterChanged: false,
      transactions: [],
      filteredList: [],
      hasRatesUpdated: true,
      exportWizard: new TransactionExportWizard("Settlement Report"),
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
    isToday(){
      const self = this
      let today = new Date()
      let selectedDate = new Date(self.formatDate(self.fromDate) + ' 23:59:59')
      return today <= selectedDate
    },
  },
  watch: {
    fromDate(){
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
          self.fromDate,
          "settlementReport_" + self.formatDate(new Date()),
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
          self.fromDate,
          "settlementReport_" + self.formatDate(new Date()),
          self.tableHeaders,
          self.filteredList
      )
    },
    formatDate: function (date) {
      let d = new Date(date),
          month = '' + (d.getMonth() + 1),
          day = '' + d.getDate(),
          year = d.getFullYear();
      if (month.length < 2)
        month = '0' + month;
      if (day.length < 2)
        day = '0' + day;
      return [year, month, day].join('-');
    },
    StartGenerate: function (){
      const self = this
      if(self.hasRatesUpdated){
        self.GenerateReport()
      }
      else {
        self.$buefy.dialog.confirm({
          type: 'is-danger',
          message: "Today's <b>Currency Rates</b> has not been updated yet!." +
              "Generating report now will use currency rates updated yesterday",
          onConfirm: () => self.GenerateReport()
        })
      }
    },
    GenerateReport: function (){
      const  self = this
      self.showFullScreenLoader()
      NetworkManager.apiRequest('api/report/generate-settlement-report', {}, function (e){
        if(e.statusCode === 200){
          const params = {
            type: 'is-success',
            message: 'Settlement report generated successfully'
          }
          self.$buefy.toast.open(params)
        }
        else {
          if(e.statusCode === 422 && e.data.code === 0x9001){
            const params = {
              type: 'is-warning',
              message: 'No pending Send Money transactions'
            }
            self.$buefy.toast.open(params)
          }
          else {
            const params = {
              type: 'is-warning',
              message: 'Settlement report generation failed'
            }
            self.$buefy.toast.open(params)
          }
        }
        self.hideFullScreenLoader()
        self.loadData(false)
      })
    },
    loadData: function (showIPGStatus = false){
      const  self = this
      let data = {
        date: self.formatDate(self.fromDate)
      }
      self.showFullScreenLoader()
      NetworkManager.apiRequest('api/report/get-settlement-report', data, function (e){
        if(e.statusCode === 200){
          self.transactions = e.data.transactions
          self.filteredList = e.data.filteredList
          self.tableHeaders = e.data.fields
          self.hasRatesUpdated = e.data.hasRatesUpdated
          self.filterChanged = false
          let msg = "Today's <b>Currency Rates</b> has not been updated yet!<br>"
          e.data.messages.forEach(function(item){
            msg += "<br>- " + item
          })
          if(!self.hasRatesUpdated && showIPGStatus){
            self.$buefy.dialog.alert({
              title: 'Acknowledgement',
              message: msg,
              type: 'is-danger',
              hasIcon: true
            })
          }
        }
        self.hideFullScreenLoader()
      })
    },
  },
  mounted() {
    this.loadData(true)
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