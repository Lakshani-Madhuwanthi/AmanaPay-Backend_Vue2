<template>
    <section>
        <div class="card-header p-3">
            <div class="columns" style="width: 100%">
                <div class="column">
                    <b-breadcrumb align="is-left">
                        <b-breadcrumb-item tag='router-link' to="" active>Duty Free Customer Requests</b-breadcrumb-item>
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
        <b-field class="column is-one-fifths is-small" label="NIC/Passport" label-position="on-border">
          <b-input v-model="uid" @blur="uid = uid.trim()" maxlength="30" size="is-small"></b-input>
        </b-field>
        <b-field  class="column" label="">
          <div class="buttons">
            <b-button size="is-small" type="is-success" @click="loadData">Search</b-button>
            <!-- <b-tooltip label="Download as Excel">
              <b-button size="is-small" :disabled="filterChanged" @click="generateXlsx" type="is-info" icon-right="microsoft-excel"></b-button>
            </b-tooltip>
            <b-tooltip label="Download as PDF" style="margin-left: 5px">
              <b-button size="is-small" :disabled="filterChanged" @click="generatePdf" type="is-info" icon-right="file-pdf-box" ></b-button>
            </b-tooltip> -->
          </div>
        </b-field>
      </div>
            <b-table :height="vhToPixels(50)" :data="df_requests" :paginated="tableOptions.isPaginated"
                :per-page="tableOptions.perPage" :current-page.sync="tableOptions.currentPage"
                :pagination-simple="tableOptions.isPaginationSimple" :pagination-position="tableOptions.paginationPosition"
                :default-sort-direction="tableOptions.defaultSortDirection"
                :pagination-rounded="tableOptions.isPaginationRounded" :sort-icon="tableOptions.sortIcon"
                :sort-icon-size="tableOptions.sortIconSize" default-sort="id" aria-next-label="Next page"
                aria-previous-label="Previous page" aria-page-label="Page" aria-current-label="Current page"
                :sticky-header="tableOptions.stickyHeaders" :page-input="tableOptions.hasInput"
                :pagination-order="tableOptions.paginationOrder" :page-input-position="tableOptions.inputPosition"
                :debounce-page-input="tableOptions.inputDebounce">

                <b-table-column field="id" label="ID" sortable numeric v-slot="props" sticky>
                    {{ props.row.id }}
                </b-table-column>

                <b-table-column field="reference" label="Reference" sortable centered numeric v-slot="props">
                    {{ props.row.reference }}
                </b-table-column>

                <b-table-column field="name" label="Name" width="200" numeric v-slot="props" centered>
                    {{ props.row.first_name + " " + props.row.last_name }}
                </b-table-column>

                <b-table-column field="nic" label="NIC" numeric centered v-slot="props">
                    {{ props.row.nic }}
                </b-table-column>

                <b-table-column field="passport" label="Passport" numeric centered v-slot="props">
                    {{ props.row.current_passport }}
                </b-table-column>

                <b-table-column field="request_date" label="Request Date" centered numeric v-slot="props">
                    {{ new Date(props.row.date).toLocaleDateString() }}
                </b-table-column>

                <b-table-column field="status" label="Status" centered v-slot="props">
                    <span :class="'tag ' + getTagColor(props.row.status)">
                        {{ props.row.status }}
                    </span>
                </b-table-column>

                <b-table-column field="claim/reject_date" label="Claim/Reject Date" numeric centered v-slot="props">
                    {{ new Date(props.row.updated_at).toLocaleDateString() }}
                </b-table-column>

                <b-table-column field="reject_reason" label="Reject Reason" numeric centered v-slot="props">
                    {{ props.row.comment }}
                </b-table-column>

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
    name: 'RequestReport',
    components: {
    },
    data() {
        return {
            fromDate: new Date(),
            toDate: new Date(),
            filterChanged: false,

            uid: '',
            transactions: [],
            filteredList: [],

            exportWizard: new TransactionExportWizard("Request Report"),
            df_requests: [],
            tableHeaders: [],

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
            }
        }
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
      return appSettings.$api_url + "/" + path+ "?" + new Date().getTime()
    },

    generateXlsx: function (){
      const self = this

      self.exportWizard.exportToXlsx(
          new Date(),
          self.authUser().username,
          self.fromDate,
          self.toDate,
          "requestReport_" + self.formatDate(new Date()),
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
          "requestReport_" + self.formatDate(new Date()),
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
        loadData: function () {
            const self = this
            self.fromDate.setSeconds(1)
            self.toDate.setSeconds(0)

            let data = {
                fromDate: self.formatDateTime(self.fromDate),
                toDate: self.formatDateTime(self.toDate),
                uid: self.uid
            }

            self.showFullScreenLoader()
            NetworkManager.apiRequest('api/DutyFreeReport/dfRequests', data, function (e) {
                if (e.statusCode === 200) {
                    self.df_requests = e.data.dfRequests
                    self.tableHeaders = e.data.fields
                }

                self.hideFullScreenLoader()
            })
        },

        getTagColor: function (status) {
            switch (status) {
                case 'PENDING':
                    return 'is-warning'
                case 'APPROVED':
                    return 'is-info'
                case 'REJECTED':
                    return 'is-danger'
                case 'CANCELLED':
                    return 'is-dark'
                default:
                    return 'is-success'
            }
        }

    },

    mounted() {

        this.loadData()
    }
}
</script>
  
  