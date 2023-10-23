<template>
  <section>

    <div class="card-header p-3">
      <div class="columns" style="width: 100%">
        <div class="column">
          <b-breadcrumb
              align="is-left"
          >
            <b-breadcrumb-item tag='router-link' to="" active >App Users</b-breadcrumb-item>
          </b-breadcrumb>
        </div>
        <div class="column">
        </div>
      </div>
    </div>
    <div class="card-content" style="overflow: auto; height: 83vh">
      <div class="columns" style="margin-top: 10px">
        <b-field class="column is-one-fifths is-small" label="UID" label-position="on-border">
          <b-input v-model="searchParams.uid" @blur="searchParams.uid = searchParams.uid.trim()" maxlength="30" size="is-small"></b-input>
        </b-field>
        <b-field class="column is-one-fifths is-small" label="Country" label-position="on-border">
          <b-select v-model="searchParams.countryCode" placeholder="Select a Country" size="is-small" expanded>
            <option :value="''" selected>All Countries</option>
            <option v-for="country in countryList" :value="country.code" :key="country.code">{{ country.name }}</option>
          </b-select>
        </b-field>
        <b-field class="column is-one-fifths is-small" label="Fetch Count" label-position="on-border">
          <b-select v-model="searchParams.fetchCount" placeholder="Select a Count" size="is-small" expanded>
            <option :value="10" selected>10</option>
            <option :value="25" >25</option>
            <option :value="50" >50</option>
            <option :value="100" >100</option>
            <option :value="99999999" >All</option>
          </b-select>
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

      <change-request v-if="hasPermission('app-user-approve')" :data="crData" :filter-out="filterOutFromCR" :is-loading="crIsLoading" @approve-or-reject="approve_or_reject" />
      
      <b-table
          :height="vhToPixels(50)"
          :data="appUsers"
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

        <b-table-column field="firstName" label="First Name" sortable v-slot="props" width="200">
          {{ props.row.firstName }}
        </b-table-column>

        <b-table-column field="lastName" label="Last Name" sortable v-slot="props" width="200">
          {{ props.row.lastName }}
        </b-table-column>

        <b-table-column field="uidType" label="UID Type" sortable v-slot="props" width="200">
          {{ props.row.uidType }}
        </b-table-column>

        <b-table-column field="uid" label="UID" sortable v-slot="props" width="200">
          {{ props.row.uid }}
        </b-table-column>

        <b-table-column field="contact" label="Contact Number" sortable v-slot="props" width="200">
          {{ props.row.contact }}
        </b-table-column>

        <b-table-column field="email" label="Email" sortable v-slot="props" width="200">
          {{ props.row.email }}
        </b-table-column>

        <b-table-column field="country" label="Country" sortable v-slot="props" width="200">
          {{ props.row.country }}
        </b-table-column>

        <b-table-column field="disabled" label="Status" sortable v-slot="props">
          <b-tag :type="(props.row.status === 'Active' ? 'is-success' : 'is-danger') + ' is-light'">{{ props.row.status }}</b-tag>
        </b-table-column>

        <b-table-column field="updated_at" label="Last Login At" sortable centered v-slot="props">
                <span class="tag is-success">
                    {{ new Date(props.row.updated_at).toLocaleString() }}
                </span>
        </b-table-column>

        <b-table-column field="created_at" label="Registered At" sortable centered v-slot="props">
                <span class="tag is-success">
                    {{ new Date(props.row.created_at).toLocaleString() }}
                </span>
        </b-table-column>

        <b-table-column field="images" label="Images" sortable centered v-slot="props">
          <b-tooltip label="Images" position="is-left" type="is-dark">
            <b-button type="is-primary"
                      size="is-small"
                      @click="showUserImages(props.row)"
                      icon-left="image"></b-button>
          </b-tooltip>
        </b-table-column>

        <b-table-column field="action" label="Action" v-slot="props" sticky>
          <div class="columns">
            <div v-if="props.row.locked === 0" class="column is-one-fifths">
            <div v-if="hasPermission('app-user-edit')" class="b-tooltips" style="width: 100px">
              <b-tooltip v-if="props.row.status === 'Active'" label="Deactivate User" position="is-left" type="is-dark">
                <b-button type="is-danger"
                          size="is-small"
                          @click="disableUser(props.row.id, true)"
                          icon-left="circle-off-outline">Deactivate</b-button>
              </b-tooltip>
              <b-tooltip v-else label="Activate User" position="is-left" type="is-dark" style="margin-left: 10px">
                <b-button type="is-primary"
                          size="is-small"
                          @click="disableUser(props.row.id, false)"
                          icon-left="checkbox-marked-circle-outline">Activate</b-button>
              </b-tooltip>
            </div>
            <div v-else>-</div>
          </div>
          <div v-else class="column">
            <b-tooltip label="Locked" position="is-left" type="is-dark" style="width: 100px;">
              <b-icon
                  icon="lock"
                  size="is-medium">
              </b-icon>
          </b-tooltip>
        </div>
        <div v-if="props.row.locked === 0" class="column is-one-fifths">
          <div v-if="hasPermission('app-user-edit')" class="b-tooltip" style="width: 100px">
              <b-tooltip v-if="props.row.hold === 0" label="Hold User" position="is-left" type="is-dark">
                <b-button type="is-warning"
                          size="is-small"
                          @click="StartAppUserHoldAction(props.row,true)"
                          >Hold</b-button>
              </b-tooltip>
              <b-tooltip v-else label="Unhold User" position="is-left" type="is-dark">
                <b-button type="is-info"
                          size="is-small"
                          @click="StartAppUserHoldAction(props.row,false)"
                          >Unhold</b-button>
              </b-tooltip>
            </div>
            <div v-else>-</div>
        </div>
        <div v-else class="column">
            <b-tooltip label="Locked" position="is-left" type="is-dark" style="width: 100px;">
              <b-icon
                  icon="lock"
                  size="is-medium">
              </b-icon>
          </b-tooltip>
        </div>
          </div>
          
        </b-table-column>
        <b-table-column field="reason" label="Reason" sortable v-slot="props">
          {{ props.row.user_hold_reason }}
        </b-table-column>
      </b-table>
    </div>
    <br />


    <b-modal
        v-model="isImageModalActive"
        has-modal-card
        trap-focus
        :destroy-on-hide="false"
        aria-role="dialog"
        close-button-aria-label="Close"
        aria-modal>
      <div class="modal-card" style="width: auto">
        <header class="modal-card-head">
          <p class="modal-card-title">User Images<b-tag style="margin-left: 10px">{{ selectedAppUser.uid }}</b-tag></p>
          <button
              type="button"
              class="delete"
              @click="isImageModalActive = false"/>
        </header>
        <section class="modal-card-body">
          <div class="columns">
            <b-field
                class="column"
                label="Selfie"
                label-position="on-border"
                >
              <img :src="getImageUrl(selectedAppUser.selfie)" style="height: 150px; border: 1px solid blue">
            </b-field>
            <b-field
                class="column"
                label="UID Front"
                label-position="on-border"
            >
              <img :src="getImageUrl(selectedAppUser.uidFront)" style="height: 150px; border: 1px solid blue">
            </b-field>
            <b-field
                class="column"
                label="UID Back"
                label-position="on-border"
            >
              <img :src="getImageUrl(selectedAppUser.uidBack)" style="height: 150px; border: 1px solid blue">
            </b-field>
          </div>
        </section>
        <footer class="modal-card-foot">
          <b-button
              label="Close"
              @click="isImageModalActive = false" />
        </footer>
      </div>
    </b-modal>

  </section>
</template>

<script>
import NetworkManager from "@/network"
import ChangeRequest from "@/components/ChangeRequest";
import {appSettings} from "@/appSettings";
import {TransactionExportWizard} from "@/views/Reports/Supports";

export default {
  name: 'AppUserList',
  components: {
    ChangeRequest
  },
  data() {
    return {
      isImageModalActive: false,
      filterChanged: false,

      crData: [],
      crIsLoading: false,
      filterOutFromCR: ['id', 'created_at', 'updated_at', 'locked'],

      countryList : [],
      searchParams : {
        uid : '',
        countryCode : '',
        fetchCount : 10,
      },

      appUsers : [],
      selectedAppUser: {},
      tableHeaders: [],

      exportWizard: new TransactionExportWizard("App Users"),

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
    }
  },

  computed: {
  },

  watch: {
    searchParams: {
      handler() {
        this.filterChanged = true
      },
      deep: true
    }
  },

  methods: {

    getImageUrl: function (path){
      return appSettings.$api_url + "/" + path + "?" + new Date().getTime()
    },

    generateXlsx: function (){
      const self = this

      self.exportWizard.exportToXlsx(
          new Date(),
          self.authUser().username,
          new Date(),
          new Date(),
          "appUsers_" + self.formatDate(new Date()),
          self.tableHeaders,
          self.appUsers
      )
    },

    generatePdf: function (){
      const self = this

      self.exportWizard.exportToPDF(
          new Date(),
          self.authUser().username,
          new Date(),
          new Date(),
          "appUsers_" + self.formatDate(new Date()),
          self.tableHeaders,
          self.appUsers
      )
    },

    showUserImages(user){
      console.log(user)
      this.selectedAppUser = {}
      this.selectedAppUser = user
      this.isImageModalActive = true
    },

    loadData: function (){
      const  self = this
      // self.showFullScreenLoader()

      NetworkManager.apiRequest('api/AppUser/list', self.searchParams, function (e){
        if(e.statusCode === 200){
          self.appUsers = e.data.appUsers
          self.countryList = e.data.countries
          self.crData = e.data.changeRequests
          self.tableHeaders = e.data.fields
          self.filterChanged = false
        }

        self.hideFullScreenLoader()
      })
    },

    disableUser: function (id, disable){
      const  self = this
      self.showFullScreenLoader()

      const data = {
        id: id,
        disable: disable
      }

      NetworkManager.apiRequest('api/AppUser/disable', data, function (e){
        if(e.statusCode === 200){
          const params = {
            type: 'is-success',
            message: 'App user sent for approval'
          }
          self.$buefy.toast.open(params)
        }
        else {
          const params = {
            type: 'is-warning',
            message: 'App user disable failed'
          }
          self.$buefy.toast.open(params)
        }

        self.loadData()

        self.hideFullScreenLoader()
      })
    },

  holdAppUser: function (id, desc, hold){
  const  self = this
  self.showFullScreenLoader()

  const data = {
    id: id,
    hold: hold,
    description: desc
  }

  NetworkManager.apiRequest('api/AppUser/hold', data, function (e){
    if(e.statusCode === 200){
      const params = {
        type: 'is-success',
        message: 'App user sent for approval'
      }
      self.$buefy.toast.open(params)
    }
    else {
      const params = {
        type: 'is-warning',
        message: 'App user hold failed'
      }
      self.$buefy.toast.open(params)
    }

    self.loadData()

    self.hideFullScreenLoader()
  })
},
    canHold: function (tran){
      return  tran.ipg_void_status !== 'SUCCESS' && tran.ipg_refund_status !== 'SUCCESS' && tran.ceft_payment_status !== "SUCCESS" &&
          tran.card_payment_status === 'SUCCESS' && this.hasPermission('transaction-hold') && tran.ceft_try_count < 100
    },

    StartAppUserHoldAction: function (user, hold) {
  const self = this;

  if (self.hasRatesUpdated) {
    self.GenerateReport();
  } else {
    self.$buefy.dialog.prompt({
      type: 'is-danger',
      title: "Hold/Unhold App User",
      message: "Confirming this action will hold/unhold the App User (User ID - " + user.id + ").<br>Please provide a comment to proceed:",
      inputAttrs: {
        required: true,
        placeholder: "Enter hold/unhold comment"
      },
      onConfirm: (comment) => {
        if (comment) {
          self.holdAppUser(user.id, comment, hold);
        } else {
          self.$buefy.toast.open({
            message: "Hold/Unhold comment is required.",
            type: 'is-danger',
            position: 'is-top',
            duration: 5000
          });
        }
      }
    });
  }
}
,
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
    approve_or_reject: function (data){
      const self = this
      this.crIsLoading = true

      NetworkManager.apiRequest('api/AppUser/approve', data, function (e){
        if(e.statusCode === 200){
          const params = {
            type: 'is-success',
            message: 'App user ' + data.actionTaken + ' successfully'
          }
          self.$buefy.toast.open(params)
          location.reload()
        }
        else {
          const params = {
            type: 'is-warning',
            message: 'App user ' + data.actionTaken + ' failed!'
          }
          self.$buefy.toast.open(params)
        }

        self.crIsLoading = false
      })
    },

  },

  mounted() {
    this.loadData()
  }
}
</script>


