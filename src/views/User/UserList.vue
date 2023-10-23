<template>
  <section>
    <div class="card-header p-3">
      <div class="columns" style="width: 100%">
        <div class="column">
          <b-breadcrumb
              align="is-left"
          >
            <b-breadcrumb-item tag='router-link' to="" active >Users</b-breadcrumb-item>
          </b-breadcrumb>
        </div>
        <div class="column">
          <b-button v-if="hasPermission('user-create')" type="is-success is-small" class="is-pulled-right" icon-right="plus" @click="navigateTo('CreateUser')">Create User</b-button>
        </div>
      </div>
    </div>
    <div class="card-content" style="overflow: auto; height: 83vh">
      <change-request v-if="hasPermission('user-approve')" :data="crData" :filter-out="filterOutFromCR" :is-loading="crIsLoading" @approve-or-reject="approve_or_reject" />

      <b-table
          :height="vhToPixels(50)"
          :data="users"
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

        <b-table-column field="id.value" label="ID" width="40" sortable numeric v-slot="props">
          {{ props.row.id.value }}
        </b-table-column>

        <b-table-column field="name" centered label="Name" sortable v-slot="props">
          {{ props.row.name.value }}
        </b-table-column>

        <b-table-column field="email" centered label="Email" sortable v-slot="props">
          {{ props.row.email.value }}
        </b-table-column>

        <b-table-column field="contact_number" centered label="Contact Number" sortable v-slot="props">
          {{ props.row.contact_number.value }}
        </b-table-column>

        <b-table-column field="username" centered label="Username" sortable v-slot="props">
          {{ props.row.username.value }}
        </b-table-column>

        <b-table-column field="branch" centered label="Branch" sortable v-slot="props">
          {{ props.row.branch.value }}
        </b-table-column>

        <b-table-column field="status" centered label="Status" sortable v-slot="props">
          <b-tag :type="(props.row.status.value === 'Active' ? 'is-success' : 'is-danger') + ' is-light'">{{ props.row.status.value }}</b-tag>
        </b-table-column>

        <b-table-column field="created_at" label="Created At" sortable centered v-slot="props">
                <span class="tag is-success">
                    {{ new Date(props.row.created_at.value).toLocaleString() }}
                </span>
        </b-table-column>

        <b-table-column field="updated_at" label="Updated At" sortable centered v-slot="props">
                <span class="tag is-success">
                    {{ new Date(props.row.updated_at.value).toLocaleString() }}
                </span>
        </b-table-column>

        <b-table-column field="action" label="Action" v-slot="props">
          <div class="buttons" v-if="props.row.locked.value === 0">
            <b-tooltip v-if="hasPermission('user-edit')" label="Edit">
              <b-button type="is-danger"
                        size="is-small"
                        @click="navigateTo('EditUser', {id: props.row.id.value})"
                        icon-left="lead-pencil"></b-button>
            </b-tooltip>
            <b-tooltip label="Change Password" position="is-left">
              <b-button v-if="hasPermission('user-password-reset')" type="is-info"
                        size="is-small"
                        @click="onChangePasswordClick(props.row.username)"
                        icon-left="rotate-3d-variant"></b-button>
            </b-tooltip>
          </div>
          <b-tooltip v-else label="Locked">
            <b-icon
                    icon="lock"
                    size="is-medium">
            </b-icon>
          </b-tooltip>
        </b-table-column>

      </b-table>
    </div>
    <br />

    <!-- Password Change Modal -->
    <b-modal
        v-model="isPwChangeModalActive"
        has-modal-card
        :can-cancel="false"
        trap-focus
        :destroy-on-hide="false"
        aria-role="dialog"
        aria-label="Example Modal"
        close-button-aria-label="Close"
        aria-modal>
      <template>
        <div class="modal-card" style="width: auto">
          <header class="modal-card-head">
            <p class="modal-card-title">Change Password</p>
          </header>
          <section class="modal-card-body">
            <b-field
                horizontal
                :type="newPassword.class"
                :message="newPassword.message">
              <template slot="label">Password <span class="has-text-danger">*</span></template>
              <b-field :type="newPassword.class"
                       grouped>
                <b-input
                    @blur="newPassword.blur()"
                    v-model="newPassword.value"
                >
                </b-input>
                <p class="control">
                  <button @click="generatePassword" class="button is-primary">Generate</button>
                </p>

                <p class="control">
                  <button @click="copyToClipboard" class="button is-primary">Copy</button>
                </p>

              </b-field>

            </b-field>
          </section>
          <footer class="modal-card-foot">
            <b-button
                label="Close"
                @click="isPwChangeModalActive = false" />
            <b-button
                :loading="isPwChangeModalLoading"
                label="Change"
                @click="changePassword"
                type="is-primary" />
          </footer>
        </div>
      </template>
    </b-modal>

  </section>
</template>

<script>
import ChangeRequest from "@/components/ChangeRequest"
import NetworkManager from "@/network"
import {FieldValidator} from "@/helpers/validators/fieldValidator"

export default {
  name: 'userTable',
  components: {
    ChangeRequest
  },
  data() {
    return {
      users: [],
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
    onChangePasswordClick: function (username){
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

    copyToClipboard: function(){
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

    loadData: function (){
      const  self = this

      self.showFullScreenLoader()
      NetworkManager.apiRequest('api/User/list', {}, function (e){
        if(e.statusCode === 200){
          self.crData = e.data.changeRequests
          self.users = e.data.users
        }

        self.hideFullScreenLoader()
      })
    },

    changePassword: function (){
      const  self = this

      if(self.newPassword.validate()){
        self.isPwChangeModalLoading = true

        const data = {
          username: self.selectedUsername.value,
          password: self.newPassword.value
        }

        self.showFullScreenLoader()

        NetworkManager.apiRequest('api/dutyfree/DFUser/change-password', data, function (e){
          if(e.statusCode === 200){
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

    approve_or_reject: function (data){
      const self = this
      this.crIsLoading = true

      NetworkManager.apiRequest('api/dutyfree/DFUser/approve', data, function (e){
        if(e.statusCode === 200){
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
