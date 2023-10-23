<template>
  <section>
    <div class="card-header p-3">
      <div class="columns" style="width: 100%">
        <div class="column">
          <b-breadcrumb
              align="is-left"
          >
            <b-breadcrumb-item tag='router-link' to="" active >App Versions</b-breadcrumb-item>
          </b-breadcrumb>
        </div>
        <div class="column">
          <b-button v-if="hasPermission('app-version-create')" type="is-success is-small" class="is-pulled-right" icon-right="plus" @click="navigateTo('AppVersionCreate')">Create AppVersion</b-button>
        </div>
      </div>
    </div>
    <div class="card-content" style="overflow: auto; height: 83vh">
      <change-request v-if="hasPermission('app-version-approve')" :data="crData" :filter-out="filterOutFromCR" :is-loading="crIsLoading" @approve-or-reject="approve_or_reject" />

      <b-table
          :height="vhToPixels(50)"
          :data="appVersions"
          :paginated="tableOptions.isPaginated"
          :per-page="tableOptions.perPage"
          :current-page.sync="tableOptions.currentPage"
          :pagination-simple="tableOptions.isPaginationSimple"
          :pagination-position="tableOptions.paginationPosition"
          :default-sort-direction="tableOptions.defaultSortDirection"
          :pagination-rounded="tableOptions.isPaginationRounded"
          :sort-icon="tableOptions.sortIcon"
          :sort-icon-size="tableOptions.sortIconSize"
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

        <b-table-column field="appVersion_code" label="Version" sortable v-slot="props">
         {{ props.row.version }}
        </b-table-column>

        <b-table-column field="platforms" label="Platforms" sortable v-slot="props">
          <b-taglist >
            <b-tag v-for="platform in props.row.platforms" :key="platform.id" type="is-primary">{{platform}}</b-tag>
          </b-taglist>
        </b-table-column>

        <b-table-column field="force_update" label="Force Update" sortable v-slot="props">
          <b-tag :type="(props.row.force_update === 0 ? '' : 'is-danger') + ' is-light'">{{ props.row.force_update === 0 ? 'No' : 'Yes' }}</b-tag>
        </b-table-column>

        <b-table-column field="created_at" label="Created At" sortable centered v-slot="props">
                <span class="tag is-success">
                    {{ new Date(props.row.created_at).toLocaleString() }}
                </span>
        </b-table-column>

        <b-table-column field="updated_at" label="Updated At" sortable centered v-slot="props">
                <span class="tag is-success">
                    {{ new Date(props.row.updated_at).toLocaleString() }}
                </span>
        </b-table-column>

<!--        <b-table-column field="action" label="Action" v-slot="props" sticky>-->
<!--          <div v-if="props.row.locked === 0">-->
<!--            <div v-if="hasPermission('appVersion-edit')" class="b-tooltips">-->
<!--              <b-tooltip label="Edit" position="is-left" type="is-dark" style="margin-left: 10px">-->
<!--                <b-button type="is-danger"-->
<!--                          size="is-small"-->
<!--                          @click="navigateTo('AppVersionEdit', {id: props.row.id})"-->
<!--                          icon-left="lead-pencil"></b-button>-->
<!--              </b-tooltip>-->
<!--            </div>-->
<!--            <div v-else>-</div>-->
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
import ChangeRequest from "@/components/ChangeRequest"
import NetworkManager from "@/network"
import {appSettings} from "@/appSettings"

export default {
  name: 'AppVersionList',
  components: {
    ChangeRequest
  },
  data() {
    return {
      appVersions: [],
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
        perPage: 15,
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
    getImageUrl: function (path){
      return appSettings.$api_url + "/" + path+ "?" + new Date().getTime()
    },

    loadData: function (){
      const  self = this

      self.showFullScreenLoader()

      NetworkManager.apiRequest('api/appVersion/list', {}, function (e){
        if(e.statusCode === 200){
          self.crData = e.data.changeRequests
          self.appVersions = e.data.list
        }

        self.hideFullScreenLoader()
      })
    },

    approve_or_reject: function (data){
      const self = this
      this.crIsLoading = true

      NetworkManager.apiRequest('api/appVersion/approve', data, function (e){
        if(e.statusCode === 200){
          const params = {
            type: 'is-success',
            message: 'AppVersion ' + data.actionTaken + ' successfully'
          }
          self.$buefy.toast.open(params)
          location.reload()
        }
        else {
          const params = {
            type: 'is-warning',
            message: 'AppVersion ' + data.actionTaken + ' failed!'
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
