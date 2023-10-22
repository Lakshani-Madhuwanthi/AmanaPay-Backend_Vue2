<template>
    <section>
        <div class="card-header p-3">
            <div class="columns" style="width: 100%">
                <div class="column">
                    <b-breadcrumb align="is-left">
                        <b-breadcrumb-item tag='router-link' to="" active>Duty Free Requests -
                            {{ authUser().branch }}</b-breadcrumb-item>
                    </b-breadcrumb>
                </div>
                <div class="column">
                </div>
            </div>
        </div>
        <div class="card-content" style="overflow: auto; height: 83vh">
            <div class="columns" style="margin-top: 10px">
                <b-field class="column is-one-fifths is-small" label="From" label-position="on-border">
                    <b-datetimepicker v-model="fromDate" @input="onFromDateChange()" size="is-small"
                        :show-week-number="false" locale="en-CA" placeholder="Click to select..." icon="calendar-today"
                        trap-focus>
                    </b-datetimepicker>
                </b-field>
                <b-field class="column is-one-fifths is-small" label="To" label-position="on-border">
                    <b-datetimepicker v-model="toDate" @input="filterChanged = true" size="is-small" :min-date="fromDate"
                        :show-week-number="false" locale="en-CA" placeholder="Click to select..." icon="calendar-today"
                        trap-focus>
                    </b-datetimepicker>
                </b-field>
                <b-field class="column is-one-fifths is-small" label="NIC/Passport" label-position="on-border">
                    <b-input v-model="uid" @blur="uid = uid.trim()" maxlength="30" size="is-small"></b-input>
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

            <b-table :height="vhToPixels(50)" :data="allRequests" :paginated="tableOptions.isPaginated"
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

                <b-table-column field="reference" label="Reference" width="200" centered sortable numeric v-slot="props"
                    sticky>
                    {{ props.row.reference }}
                </b-table-column>

                <b-table-column field="name" label="Name" width="200" numeric v-slot="props"  centered>
                    {{ props.row.first_name + " " + props.row.last_name }}
                    <!-- <div class="content has-text-left"></div> -->
                </b-table-column>

                <b-table-column field="nic" label="NIC" width="150" sortable numeric v-slot="props" centered>
                    {{ props.row.nic }}
                </b-table-column>

                <b-table-column field="current_passport" label="Passport" centered width="150" sortable numeric
                    v-slot="props">
                    {{ props.row.current_passport }}
                </b-table-column>

                <b-table-column field="date" label="Requested Date" sortable width="200" centered v-slot="props">
                    <span class="tag is-success">
                        {{ new Date(props.row.date).toLocaleString() }}
                    </span>
                </b-table-column>

                <b-table-column field="status" label="Status" sortable v-slot="props">
                    <span :class="'tag ' + getTagColor(props.row.status)">
                        {{ props.row.status }}
                    </span>
                </b-table-column>

                <b-table-column field="action" label="Action" sortable v-slot="props" width="200">
                    <b-button icon-left="list-box" @click="showPurchaseListModal(props.row)" type="is-primary"
                        size="is-small"></b-button>
                </b-table-column>

            </b-table>
        </div>
        <br />
        <b-modal
        v-model="isModalActive"
        has-modal-card
        trap-focus
        :destroy-on-hide="false"
        aria-role="dialog"
        aria-label="Example Modal"
        close-button-aria-label="Close"
        aria-modal>
      <template>
        <div class="modal-card" style="width: auto">
          <header class="modal-card-head">
            <p class="modal-card-title">{{selectedCustomer.first_name + " " + selectedCustomer.last_name }} - Transactions List</p>
            <button
                type="button"
                class="delete"
                @click="isModalActive = false"/>
          </header>
          <section class="modal-card-body">
            <b-table
                :height="vhToPixels(60)"
                :data="selectedCustomer.transactions"
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

              <b-table-column field="reference" label="Reference No" width="200" centered sortable numeric v-slot="props" sticky>
                {{ props.row.reference }}
              </b-table-column>

              <b-table-column field="currency" label="Currency" width="100" centered numeric v-slot="props" >
                {{ props.row.currency }}
              </b-table-column>

              <b-table-column field="rate" label="Rate" width="100" numeric v-slot="props" >
                {{ props.row.rate }}
              </b-table-column>

              <b-table-column field="amount" label="Amount (LKR)" width="200" centered numeric v-slot="props" >
                {{ props.row.amount }}
              </b-table-column>
              
              <b-table-column field="date" label="Transaction Date" width="200" sortable centered v-slot="props">
                <span class="tag is-success">
                    {{ new Date(props.row.date).toLocaleDateString()}}
                </span>
              </b-table-column>

            </b-table>
          </section>
          <footer class="modal-card-foot">
            <b-button
                label="Close"
                @click="isModalActive = false"/>
          </footer>
        </div>
      </template>
    </b-modal>
    </section>
</template>
  
<script>
import NetworkManager from "@/network"
import { appSettings } from "@/appSettings"
import { TransactionExportWizard } from "@/views/Reports/Supports";

export default {
    name: 'CustomerReport',
    components: {
    },
    data() {
        return {
            fromDate: new Date(),
            toDate: new Date(),
            filterChanged: false,
            isModalActive: false,
            uid: '',
            allRequests: [],
            filteredList: [],
            selectedCustomer: null,

            exportWizard: new TransactionExportWizard("Request Report"),

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
            return appSettings.$api_url + "/" + path + "?" + new Date().getTime()
        },
        showPurchaseListModal: function (customer) {
            const self = this
            self.selectedCustomer = customer

            self.isModalActive = true
        },

        generateXlsx: function () {
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

        generatePdf: function () {
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
                fromDate: self.formatDateTime(self.fromDate),
                toDate: self.formatDateTime(self.toDate),
                uid: self.uid
            }

            self.showFullScreenLoader()

            NetworkManager.apiRequest('api/DutyFreeReport/dfRequests/bank', data, function (e) {
                if (e.statusCode === 200) {
                    self.allRequests = e.data.filteredList
                    self.filteredList = e.data.filteredList
                    self.tableHeaders = e.data.fields
                    self.filterChanged = false
                }

                self.hideFullScreenLoader()
            })
        },

        getTagColor: function (status) {
            switch (status) {
                case 'CANCELED':
                    return 'is-warning'
                case 'APPROVED':
                    return 'is-success'
                case 'REJECTED':
                    return 'is-danger'
                default:
                    return 'is-dark'
            }
        }

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
  