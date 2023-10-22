<template>
  <section>
    <div class="card-header p-3">
      <div class="columns" style="width: 100%">
        <div class="column">
          <b-breadcrumb align="is-left">
            <b-breadcrumb-item tag='router-link' to="" active>Duty Free Pending Requests</b-breadcrumb-item>
          </b-breadcrumb>
        </div>
      </div>
    </div>
    <div class="card-content" style="overflow: auto; height: 83vh">
      <change-request v-if="hasPermission('df-bank-view')" :data="crData" :filter-out="filterOutFromCR"
        :is-loading="crIsLoading" @approve-or-reject="approve_or_reject" />

      <b-table :height="vhToPixels(50)" :data="banks" :paginated="tableOptions.isPaginated"
        :per-page="tableOptions.perPage" :current-page.sync="tableOptions.currentPage"
        :pagination-simple="tableOptions.isPaginationSimple" :pagination-position="tableOptions.paginationPosition"
        :default-sort-direction="tableOptions.defaultSortDirection" :pagination-rounded="tableOptions.isPaginationRounded"
        :sort-icon="tableOptions.sortIcon" :sort-icon-size="tableOptions.sortIconSize" default-sort="id"
        aria-next-label="Next page" aria-previous-label="Previous page" aria-page-label="Page"
        aria-current-label="Current page" :sticky-header="tableOptions.stickyHeaders" :page-input="tableOptions.hasInput"
        :pagination-order="tableOptions.paginationOrder" :page-input-position="tableOptions.inputPosition"
        :debounce-page-input="tableOptions.inputDebounce">

        <b-table-column field="id" label="ID" width="40" sortable numeric v-slot="props">
          {{ props.row.id }}
        </b-table-column>

        <b-table-column field="name" label="Reference" sortable v-slot="props">
          {{ props.row.reference }}
        </b-table-column>

        <b-table-column field="name" label="Name" sortable v-slot="props">
          {{ props.row.first_name }} {{ props.row.last_name }}
        </b-table-column>

        <b-table-column field="name" label="NIC" sortable v-slot="props">
          {{ props.row.nic }}
        </b-table-column>

        <b-table-column field="name" label="Passport" sortable v-slot="props">
          {{ props.row.current_passport }}
        </b-table-column>

        <b-table-column field="created_at" label="Request date" sortable centered v-slot="props">
          <span class="tag is-success">
            {{ new Date(props.row.date).toLocaleString() }}
          </span>
        </b-table-column>

        <b-table-column field="status" label="Status" sortable v-slot="props">
          <b-tag :type="(props.row.status === 'Active' ? 'is-success' : 'is-danger') + ' is-light'">{{ props.row.status
          }}</b-tag>
        </b-table-column>
        <b-table-column field="action" label="Action" v-slot="props" sticky>
          <div>
            <div v-if="hasPermission('df-bank-view')" class="b-tooltips">
              <b-tooltip label="Edit" position="is-left" type="is-dark" style="margin-left: 10px">
                <b-button type="is-danger" size="is-small" @click="onEditClick(props.row)"
                  icon-left="lead-pencil"></b-button>
              </b-tooltip>
            </div>
            <div v-else>-</div>
          </div>
        </b-table-column>
      </b-table>
    </div>
    <br />
  </section>
</template>

<script>
import ChangeRequest from "@/components/ChangeRequest"
import NetworkManager from "@/network"
import { FieldValidator } from "@/helpers/validators/fieldValidator"

export default {
  name: 'pendingRequestsTable',
  components: {
    ChangeRequest
  },
  data() {
    return {
      banks: [],
      crData: [],
      crIsLoading: false,
      filterOutFromCR: ['id', 'created_at', 'updated_at', 'locked'],

      isPwChangeModalActive: false,
      isPwChangeModalLoading: false,

      selectedUsername: '',
      newPassword: new FieldValidator(),

      tableOptions: {
        isPaginated: true,
        isPaginationSimple: false,
        isPaginationRounded: false,
        paginationPosition: 'bottom',
        defaultSortDirection: 'asc',
        sortIcon: 'arrow-up',
        sortIconSize: 'is-small',
        currentPage: 1,
        perPage: 5,
        hasInput: false,
        paginationOrder: '',
        inputPosition: '',
        inputDebounce: '',
        stickyHeaders: true,
      }
    };
  },

  computed: {
  },

  methods: {
    onChangePasswordClick: function (username) {
      this.selectedUsername = username
      this.isPwChangeModalActive = true

      this.newPassword.value = ''
      this.newPassword.blur()
    },

    generatePassword: function () {
      const self = this

      self.newPassword.blur()

      self.newPassword.value = self.generateRandomPassword()
    },

    copyToClipboard: function () {
      const self = this

      const dummy = document.createElement("textarea");
      document.body.appendChild(dummy);
      dummy.value = self.newPassword.value
      dummy.select()
      document.execCommand("copy");
      document.body.removeChild(dummy);

      self.$buefy.toast.open({
        message: 'Copied to Clipboard',
      })

    },

    loadData: function () {
      const self = this

      self.showFullScreenLoader()
      NetworkManager.apiRequest('api/Dutyfree/DFRequest/get-bank-request', {}, function (e) {
        if (e.statusCode === 200) {
          self.crData = e.data.changeRequests
          self.banks = e.data.df_data
        }

        self.hideFullScreenLoader()
      })
    },

    onEditClick: function(data){
      const self = this
      console.log(data)
      
      self.navigateTo('DutyFreeRequestsAction', { data: data })

    },

    changePassword: function () {
      const self = this

      if (self.newPassword.validate()) {
        self.isPwChangeModalLoading = true

        const data = {
          username: self.selectedUsername.value,
          password: self.newPassword.value
        }

        self.showFullScreenLoader()

        NetworkManager.apiRequest('api/user/change-password', data, function (e) {
          if (e.statusCode === 200) {
            self.isPwChangeModalActive = false
            self.isPwChangeModalLoading = false

            const params = {
              type: 'is-success',
              message: 'Password changed for user "' + self.selectedUsername.value + '" successfully'
            }
            self.$buefy.toast.open(params)
          }
          else {
            self.isPwChangeModalActive = false
            self.isPwChangeModalLoading = false

            const params = {
              type: 'is-warning',
              message: 'Password change failed!'
            }
            self.$buefy.toast.open(params)
          }

          self.hideFullScreenLoader()
        })
      }
    },

    approve_or_reject: function (data) {
      const self = this
      this.crIsLoading = true

      NetworkManager.apiRequest('api/user/approve', data, function (e) {
        if (e.statusCode === 200) {
          const params = {
            type: 'is-success',
            message: 'User ' + data.actionTaken + ' successfully'
          }
          self.$buefy.toast.open(params)
          location.reload()
        }
        else {
          const params = {
            type: 'is-warning',
            message: 'User ' + data.actionTaken + ' failed!'
          }
          self.$buefy.toast.open(params)
        }

        self.crIsLoading = false
      })
    }

  },

  mounted() {
    this.newPassword.regex = this.regex.passwordValidation
    this.newPassword.errorMessage = "Password should contain minimum 8 characters maximum 32, at least two uppercase letters, two lowercase letters, one number and one special character (@#$!%*?&()[]{}-_+=|/\\:;\"<>?)"
    this.loadData()
  }
};
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
