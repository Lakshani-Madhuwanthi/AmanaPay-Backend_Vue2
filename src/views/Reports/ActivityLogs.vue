<template>
  <section>
    <div class="card-header p-3">
      <div class="columns" style="width: 100%">
        <div class="column">
          <b-breadcrumb
              align="is-left"
          >
            <b-breadcrumb-item tag='router-link' to="" active >Activity Log Report</b-breadcrumb-item>
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
        <b-field class="column is-one-fifths is-small" label="Username" label-position="on-border">
          <b-input v-model="username" @blur="username = username.trim()" maxlength="30" size="is-small"></b-input>
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
          :height="vhToPixels(50)"
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

        <b-table-column field="level" label="Log Level" width="200" sortable numeric v-slot="props" sticky>
          <span :class="'tag is-' + props.row.level.toLowerCase()">{{ props.row.level }}</span>
        </b-table-column>

        <b-table-column field="type" label="Log Type" width="200" sortable numeric v-slot="props" sticky>
          {{ props.row.type }}
        </b-table-column>

        <b-table-column field="user" label="User" width="200" sortable numeric v-slot="props" sticky>
          {{ props.row.user }}
        </b-table-column>

        <b-table-column field="description" label="Description" width="1000" numeric v-slot="props" sticky>
          {{ props.row.description }}
        </b-table-column>

        <b-table-column field="created_at" label="Created At" sortable centered v-slot="props">
                <span class="tag is-success expanded-col">
                    {{ new Date(props.row.created_at).toLocaleString() }}
                </span>
        </b-table-column>

        <b-table-column field="updated_at" label="Updated At" sortable centered v-slot="props">
                <span class="tag is-success expanded-col">
                    {{ new Date(props.row.updated_at).toLocaleString() }}
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
  name: 'ActivityLogs',
  components: {
  },
  data() {
    return {
      fromDate: new Date(),
      toDate: new Date(),
      filterChanged: false,

      username: '',
      transactions: [],
      filteredList: [],

      exportWizard: new TransactionExportWizard("Activity Logs"),

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
          "activityLogs_" + self.formatDate(new Date()),
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
          "activityLogs_" + self.formatDate(new Date()),
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

    loadData: function (){
      const  self = this

      self.fromDate.setSeconds(1)
      self.toDate.setSeconds(0)

      let data = {
        from: self.formatDateTime(self.fromDate),
        to: self.formatDateTime(self.toDate),
        username: self.username
      }

      self.showFullScreenLoader()

      NetworkManager.apiRequest('api/report/get-activity-report', data, function (e){
        if(e.statusCode === 200){
          self.transactions = e.data.logs
          self.filteredList = e.data.filteredList
          self.tableHeaders = e.data.fields
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
    fromDate.setSeconds(1)

    let toDate = new Date()
    toDate.setHours(23)
    toDate.setMinutes(59)
    toDate.setSeconds(0)

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
