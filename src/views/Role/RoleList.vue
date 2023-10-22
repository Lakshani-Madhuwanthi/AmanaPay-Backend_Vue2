<template>
  <section>
    <div class="card-header p-3">
      <div class="columns" style="width: 100%">
        <div class="column">
          <b-breadcrumb
              align="is-left"
          >
            <b-breadcrumb-item tag='router-link' to="" active >Roles</b-breadcrumb-item>
          </b-breadcrumb>
        </div>
        <div class="column">
          <b-button v-if="hasPermission('role-create')" type="is-success is-small" class="is-pulled-right" icon-right="plus" @click="navigateTo('CreateRole')">Create Role</b-button>
        </div>
      </div>
    </div>
    <div class="card-content" style="overflow: auto; height: 83vh">
      <change-request v-if="hasPermission('role-approve')" :data="crData" :filter-out="filterOutFromCR" :is-loading="crIsLoading" @approve-or-reject="approve_or_reject" />

      <b-table
          :height="vhToPixels(50)"
          :data="roles"
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

        <b-table-column field="name" label="Name" sortable v-slot="props">
          {{ props.row.role_name.value }}
        </b-table-column>

        <b-table-column field="permissions" label="Permissions" sortable v-slot="props" >
          <b-taglist style="max-width: 300px">
            <b-tag v-for="item in props.row.permissions.value" :key="item.id" type="is-primary is-light">{{ item }}</b-tag>
          </b-taglist>
        </b-table-column>

        <b-table-column field="status" label="Status" sortable v-slot="props">
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
          <b-tooltip v-if="props.row.locked.value === 0 && hasPermission('role-edit')" label="Edit">
            <b-button type="is-danger"
                      size="is-small"
                      @click="navigateTo('EditRole', {id: props.row.id.value})"
                      icon-left="lead-pencil"></b-button>
          </b-tooltip>
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
  </section>
</template>

<script>
import ChangeRequest from "@/components/ChangeRequest"
import NetworkManager from "@/network"

export default {
  name: 'RoleList',
  components: {
    ChangeRequest
  },
  data() {
    return {
      roles: [],
      crData: [],
      crIsLoading: false,
      filterOutFromCR: ['id', 'created_at', 'updated_at', 'locked'],

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
    loadData: function (){
      const  self = this

      self.showFullScreenLoader()

      NetworkManager.apiRequest('api/dutyfree/DFRole/list', {}, function (e){
        if(e.statusCode === 200){
          self.roles = e.data.roles
          self.crData = e.data.changeRequests
        }

        self.hideFullScreenLoader()
      })
    },

    approve_or_reject: function (data){
      const self = this
      this.crIsLoading = true

      NetworkManager.apiRequest('api/dutyfree/DFRole/approve', data, function (e){
        if(e.statusCode === 200){
          const params = {
            type: 'is-success',
            message: 'Role ' + data.actionTaken + ' successfully'
          }
          self.$buefy.toast.open(params)
          location.reload()
        }
        else {
          const params = {
            type: 'is-warning',
            message: 'Role ' + data.actionTaken + ' failed!'
          }
          self.$buefy.toast.open(params)
        }

        self.crIsLoading = false
      })
    }
  },

  mounted() {
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
