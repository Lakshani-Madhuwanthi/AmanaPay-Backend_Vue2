<template>
  <section>

    <div class="card-header p-3">
      <div class="columns" style="width: 100%">
        <div class="column">
          <b-breadcrumb align="is-left">
            <b-breadcrumb-item tag='router-link' to="" active>App Users</b-breadcrumb-item>
          </b-breadcrumb>
        </div>
        <div class="column">
        </div>
      </div>
    </div>
    <div class="card-content" style="overflow: auto; height: 83vh">
      <div class="columns" style="margin-top: 10px">
        <b-field class="column is-one-fifths is-small" label="UID" label-position="on-border">
          <b-input v-model="searchParams.uid" @blur="searchParams.uid = searchParams.uid.trim()" maxlength="30"
            size="is-small"></b-input>
        </b-field>
        <b-field class="column is-small" label="KYC Status" label-position="on-border">
          <b-select v-model="searchParams.kycStatus" placeholder="Select a type" size="is-small" expanded>
            <option :value="'PENDING'" selected>Pending</option>
            <option :value="'APPROVED'">Approved</option>
            <option :value="'REJECTED'">Rejected</option>
            <option :value="''">All</option>
          </b-select>
        </b-field>
        <b-field class="column is-one-fifths is-small" label="Fetch Count" label-position="on-border">
          <b-select v-model="searchParams.fetchCount" placeholder="Select a Count" size="is-small" expanded>
            <option :value="10" selected>10</option>
            <option :value="25">25</option>
            <option :value="50">50</option>
            <option :value="100">100</option>
            <option :value="99999999">All</option>
          </b-select>
        </b-field>
        <b-field class="column" label="">
          <div class="buttons">
            <b-button size="is-small" type="is-success" @click="loadData">Search</b-button>
          </div>
        </b-field>
      </div>

      <b-table :height="vhToPixels(50)" :data="KYCUsers" :paginated="tableOptions.isPaginated"
        :per-page="tableOptions.perPage" :current-page.sync="tableOptions.currentPage"
        :pagination-simple="tableOptions.isPaginationSimple" :pagination-position="tableOptions.paginationPosition"
        :default-sort-direction="tableOptions.defaultSortDirection" :pagination-rounded="tableOptions.isPaginationRounded"
        :sort-icon="tableOptions.sortIcon" :sort-icon-size="tableOptions.sortIconSize" default-sort="id"
        aria-next-label="Next page" aria-previous-label="Previous page" aria-page-label="Page"
        aria-current-label="Current page" :sticky-header="tableOptions.stickyHeaders" :page-input="tableOptions.hasInput"
        :pagination-order="tableOptions.paginationOrder" :page-input-position="tableOptions.inputPosition"
        :debounce-page-input="tableOptions.inputDebounce">

        <b-table-column field="id" label="ID" width="40" sortable numeric v-slot="props" sticky>
          {{ props.row.kycId }}
        </b-table-column>

        <b-table-column field="firstName" label="First Name" sortable v-slot="props" width="200">
          {{ props.row.first_name }}
        </b-table-column>

        <b-table-column field="lastName" label="Last Name" sortable v-slot="props" width="200">
          {{ props.row.last_name }}
        </b-table-column>

        <b-table-column field="uidType" label="UID Type" sortable v-slot="props" width="200">
          {{ props.row.uid_type }}
        </b-table-column>

        <b-table-column field="uid" label="UID" sortable v-slot="props" width="200">
          {{ props.row.uid }}
        </b-table-column>

        <b-table-column field="contact" label="Contact Number" sortable v-slot="props" width="200">
          {{ props.row.phone_no }}
        </b-table-column>

        <b-table-column field="email" label="Email" sortable v-slot="props" width="200">
          {{ props.row.email }}
        </b-table-column>

        <b-table-column field="disabled" label="KYC Status" sortable v-slot="props">
          <b-tag :type="getKycStatusClass(props.row.status)" class="is-light">
            {{ props.row.status }}
          </b-tag>
        </b-table-column>

        <b-table-column label="Actions" v-slot="props" width="200">
          <b-button @click="openModal(props.row)" size="is-small" type="is-warning">Review</b-button>
        </b-table-column>

      </b-table>
    </div>
    <br />
    <b-modal v-model="isKycModalActive" title="KYC Information" :destroy-on-hide="false" width="800px" full-screen>
      <template #default>
        <header class="modal-card-head">
          <p class="modal-card-title">KYC Information <b-tag>{{ KYCUser.uid }}</b-tag> <b-tag style="margin-left: 10px"
              :type="getKycStatusClass(KYCUser.status)" class="is-light"> {{
                KYCUser.status }}</b-tag></p>
        </header>
        <section class="modal-card-body">
          <div class="columns">
            <div class="column" v-if="submittedData">
              <p class="subtitle is-5" style="color:rgba(0, 0, 0, 0.349)">Submitted Information [ {{
                formatDateTime(KYCUser.created_at) }} ]</p>
              <p class="subtitle">Personal Details</p>
              <div class="columns">
                <div class="column is-three-fifths">
                  <div class="field-and-switch"
                    v-for="(field, key) in Object.assign({}, ...Object.keys(submittedData).slice(0, -3).map(key => ({ [key]: submittedData[key] })))"
                    :key="key">
                    <b-field :label="field.title" :label-position="labelPosition" class="mt-2 mb-2">
                      <b-input :value="field.value" readonly></b-input>
                    </b-field>
                  </div>
                </div>
                <div class="column switches-column">
                  <div class="field-and-switch"
                    v-for="(field, key) in Object.assign({}, ...Object.keys(submittedData).slice(0, -3).map(key => ({ [key]: submittedData[key] })))"
                    :key="key">
                    <b-switch v-model="field.approved" :type="field.approved ? 'is-success' : 'is-danger'" class="m-4" disabled>
                      <span style="font-weight: bold" :class="field.approved ? 'has-text-success' : 'has-text-danger'">
                        {{ field.approved ? 'Approve' : 'Reject' }}
                      </span>
                    </b-switch>
                  </div>
                </div>
              </div>
              <hr class="mb-4 mt-0" style="background-color: #9c9c9c;border: none;height: 0.5px;">
              <h4 class="subtitle">Personal Documents</h4><br>
              <div class="columns mb-0">
                <b-field class="column" label="UID Front" :label-position="labelPosition">
                  <img :src="getImageUrl(submittedData.uidFrontImage.value)"
                    style="border: 1px solid blue; width: 400px;">
                </b-field>
                <b-field class="column" label="UID Back" :label-position="labelPosition">
                  <img :src="getImageUrl(submittedData.uidBackImage.value)" style="border: 1px solid blue; width: 400px;">
                </b-field>
              </div>
              <div class="columns">
                <div class="column">
                  <b-switch v-model="submittedData.uidFrontImage.approved"
                    :type="submittedData.uidFrontImage.approved ? 'is-danger' : 'is-success'" disabled>
                    <span style="font-weight: bold"
                      :class="submittedData.uidFrontImage.approved === true ? 'has-text-danger' : 'has-text-success'">{{
                        submittedData.uidFrontImage.approved === true ? 'Reject' : 'Approve' }}</span>
                  </b-switch>
                </div>
                <div class="column">
                  <b-switch v-model="submittedData.uidBackImage.approved.rejected"
                    :type="submittedData.uidBackImage.approved === true ? 'is-success' : 'is-danger'" disabled>
                    <span style="font-weight: bold"
                      :class="submittedData.uidBackImage.approved === true ? 'has-text-success' : 'has-text-danger'">{{
                        submittedData.uidBackImage.approved === true ? 'Approve' : 'Reject' }}</span>
                  </b-switch>
                </div>
              </div>
              <div class="columns mt-4">
                <b-field class="column" label="Selfie" :label-position="labelPosition">
                  <img :src="getImageUrl(submittedData.userImage.value)" style="border: 1px solid blue; width: 300px;">
                </b-field>
              </div>
              <div class="columns">
                <div class="column">
                  <b-switch v-model="submittedData.userImage.approved"
                    :type="submittedData.userImage.approved === true ? 'is-danger' : 'is-danger'" disabled>
                    <span style="font-weight: bold"
                      :class="submittedData.userImage.approved === true ? 'has-text-danger' : 'has-text-success'">{{
                        submittedData.userImage.approved === true ? 'Reject' : 'Approve' }}</span>
                  </b-switch>
                </div>
              </div>
            </div>
            <div class="column">
              <p class="subtitle is-5" style="color:rgba(0, 0, 0, 0.349)">Resubmitted Information [ {{
                formatDateTime(KYCUser.created_at) }} ]</p>
              <p class="subtitle">Personal Details</p>
              <!-- submitted fields -->
              <div class="columns">
                <div class="column is-three-fifths">
                  <div class="field-and-switch"
                    v-for="(field, key) in Object.assign({}, ...Object.keys(currentData).slice(0, -3).map(key => ({ [key]: currentData[key] })))"
                    :key="key">
                    <b-field :label="field.title" :label-position="labelPosition" class="mt-2 mb-2">
                      <b-input :value="field.value" readonly></b-input>
                    </b-field>
                  </div>

                </div>
                <div class="column switches-column">
                  <div class="field-and-switch"
                    v-for="(field, key) in Object.assign({}, ...Object.keys(currentData).slice(0, -3).map(key => ({ [key]: currentData[key] })))"
                    :key="key">
                    <b-switch v-model="field.approved" :type="field.approved ? 'is-success' : 'is-danger'" class="m-4">
                      <span style="font-weight: bold" :class="field.approved ? 'has-text-success' : 'has-text-danger'">
                        {{ field.approved ? 'Approve' : 'Reject' }}
                      </span>
                    </b-switch>
                  </div>
                </div>
              </div>
              <hr class="mb-4 mt-0" style="background-color: #9c9c9c;border: none;height: 0.5px;">
              <h4 class="subtitle">Personal Documents</h4><br>
              <div class="columns mb-0">
                <b-field class="column" label="UID Front" :label-position="labelPosition">
                  <img :src="getImageUrl(currentData.uidFrontImage.value)" style="border: 1px solid blue; width: 400px;">
                </b-field>
                <b-field class="column" label="UID Back" :label-position="labelPosition">
                  <img :src="getImageUrl(currentData.uidBackImage.value)" style="border: 1px solid blue; width: 400px;">
                </b-field>
              </div>
              <div class="columns">
                <div class="column">
                  <b-switch v-model="currentData.uidFrontImage.approved"
                    :type="currentData.uidFrontImage.approved ? 'is-success' : 'is-danger'">
                    <span style="font-weight: bold"
                      :class="currentData.uidFrontImage.approved === true ? 'has-text-success' : 'has-text-danger'">{{
                        currentData.uidFrontImage.approved === true ? 'Approve' : 'Reject' }}</span>
                  </b-switch>
                </div>
                <div class="column">
                  <b-switch v-model="currentData.uidBackImage.approved"
                    :type="currentData.uidBackImage.approved === true ? 'is-success' : 'is-danger'">
                    <span style="font-weight: bold"
                      :class="currentData.uidBackImage.approved === true ? 'has-text-success' : 'has-text-danger'">{{
                        currentData.uidBackImage.approved === true ? 'Approve' : 'Reject' }}</span>
                  </b-switch>
                </div>
              </div>
              <div class="columns mt-4">
                <b-field class="column" label="Selfie" :label-position="labelPosition">
                  <img :src="getImageUrl(currentData.userImage.value)" style="border: 1px solid blue; width: 300px;">
                </b-field>
              </div>
              <div class="columns">
                <div class="column">
                  <b-switch v-model="currentData.userImage.approved"
                    :type="currentData.userImage.approved === true ? 'is-success' : 'is-danger'">
                    <span style="font-weight: bold"
                      :class="currentData.userImage.approved === true ? 'has-text-success' : 'has-text-danger'">{{
                        currentData.userImage.approved === true ? 'Approve' : 'Reject' }}</span>
                  </b-switch>
                </div>
              </div>
            </div>
          </div>
        </section>
        <footer class="modal-card-foot" style="display: flex; justify-content: flex-end;">
          <b-button type="is-success" v-if="submittedData !== null" @click="updateRequest(KYCUser.kycId, currentData)">Update
            KYC data</b-button>
          <b-button type="is-success" v-if="submittedData === null"
            @click="createRequest(KYCUser.userId, currentData)">Create KYC request</b-button>

          <b-button @click="isKycModalActive = false">Cancel</b-button>
        </footer>
      </template>
    </b-modal>
  </section>
</template>
  
<script>
import NetworkManager from "@/network"
import { appSettings } from "@/appSettings";
import { TransactionExportWizard } from "@/views/Reports/Supports";

export default {
  name: 'KYC',
  components: {},
  data() {
    return {
      filterChanged: false,
      isKycModalActive: false,
      currentData: {},
      searchParams: {
        uid: '',
        kycStatus: '',
        fetchCount: 10,
      },
      submittedData: {},
      KYCUsers: [],
      KYCUser: {},
      selectedAppUser: {},
      tableHeaders: [],

      exportWizard: new TransactionExportWizard("App Users"),
      labelPosition: 'on-border',
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
    getKycStatusClass() {
      return (status) => {
        if (status === 'APPROVED') {
          return 'is-success';
        } else if (status === 'PENDING') {
          return 'is-warning';
        } else {
          return 'is-danger';
        }
      };
    }
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

    getImageUrl: function (path) {
      console.log(appSettings.$api_url + path + "?" + new Date().getTime());
      return appSettings.$api_url + "/" + path + "?" + new Date().getTime()
    },


    showUserImages(user) {
      console.log(user)
      this.selectedAppUser = {}
      this.selectedAppUser = user
      this.isImageModalActive = true
    },

    loadData: function () {
      const self = this
      self.showFullScreenLoader()

      NetworkManager.apiRequest('api/kyc/get-all', self.searchParams, function (e) {
        if (e.statusCode === 200) {
          self.KYCUsers = e.data.kycList
        }

        self.hideFullScreenLoader()
      })
    },
    openModal(rowData) {
      this.KYCUser = rowData
      this.currentData = rowData.currentData;
      this.submittedData = rowData.submittedData;
      this.isKycModalActive = true;
    },
    createRequest(userId, kycData) {
    const self = this
    const data = {
      userId: userId,
      kycData: kycData
    }
    NetworkManager.apiRequest('api/kyc/create-request', data, function (e) {
      if (e.statusCode === 200) {
        const params = {
          type: 'is-success',
          message: 'KYC request created'
        }
        self.$buefy.toast.open(params)
        location.reload()
      }
      else {
        const params = {
          type: 'is-warning',
          message: 'KYC request create failed!'
        }
        self.$buefy.toast.open(params)
      }

      self.isKycModalActive = false
    })
  },
  updateRequest(kycId, kycData) {
    const self = this
    const data = {
      kycId: kycId,
      kycData: kycData
    }
    NetworkManager.apiRequest('api/kyc/update-status', data, function (e) {
      if (e.statusCode === 200) {
        const params = {
          type: 'is-success',
          message: 'KYC updated successfully'
        }
        self.$buefy.toast.open(params)
        location.reload()
      }
      else {
        const params = {
          type: 'is-warning',
          message: 'KYC update failed!'
        }
        self.$buefy.toast.open(params)
      }

      self.isKycModalActive = false
    })
  },
  }, 
  mounted() {
    this.loadData()
  }
}
</script>
<style>
.field-and-switch {
  display: flex;
  flex-direction: column;
}
</style>
  
  