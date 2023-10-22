<template>
    <section>
      <div class="card-header p-3">
        <div class="columns" style="width: 100%">
          <div class="column">
            <b-breadcrumb
                align="is-left"
            >
              <b-breadcrumb-item tag='router-link' to="" active >Merchants</b-breadcrumb-item>
            </b-breadcrumb>
          </div>
          <div class="column">
            <b-button v-if="hasPermission('df-merchant-create')" type="is-success is-small" class="is-pulled-right" icon-right="plus" @click="navigateTo('CreateMerchant')">Create Merchant</b-button>
          </div>
        </div>
      </div>
      <div class="card-content" style="overflow: auto; height: 83vh">
        <change-request v-if="hasPermission('df-merchant-approve')" :data="crData" :filter-out="filterOutFromCR" :is-loading="crIsLoading" @approve-or-reject="approve_or_reject" />
  
        <b-table
            :height="vhToPixels(50)"
            :data="merchants"
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
  
          <b-table-column field="id" label="ID" width="40" sortable numeric v-slot="props">
            {{ props.row.id }}
          </b-table-column>
  
          <b-table-column field="name" label="Name" centered sortable v-slot="props">
            {{ props.row.name }}
          </b-table-column>

          <b-table-column field="reg_No" label="Registration Number" centered sortable v-slot="props">
            {{ props.row.reg_no }}
          </b-table-column>
  
          <b-table-column field="email" label="Email" centered sortable v-slot="props">
            {{ props.row.email }}
          </b-table-column>
  
          <b-table-column field="contact_number" centered label="Contact Number" sortable v-slot="props">
            {{ props.row.contact }}
          </b-table-column>

          <b-table-column field="address" centered label="Address" sortable v-slot="props">
            {{ props.row.address }}
          </b-table-column>
  
          <b-table-column field="status" label="Status" sortable v-slot="props">
            <b-tag :type="(props.row.disabled === 0 ? 'is-success' : 'is-danger') + ' is-light'">{{ props.row.disabled === 0 ? 'Active' : 'Inactive'  }}</b-tag>
          </b-table-column>
  
          <b-table-column field="action" label="Action" v-slot="props">
            <div class="buttons" v-if="props.row.locked === 0">
              <b-tooltip v-if="hasPermission('df-merchant-edit')" label="Edit">
                <b-button type="is-danger"
                          size="is-small"
                          @click="navigateTo('EditMerchant', {id: props.row.id})"
                          icon-left="lead-pencil"></b-button>
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
  
    </section>
    
  </template>
  
  <script>
  import ChangeRequest from "@/components/ChangeRequest"
  import NetworkManager from "@/network"
  
  export default {
    name: 'merchantTable',
    components: {
      ChangeRequest
    },
    data() {
      return {
        merchants: [],
        crData: [],
        crIsLoading: false,
        filterOutFromCR: ['id', 'created_at', 'updated_at', 'locked'],
  
        isPwChangeModalActive: false,
        isPwChangeModalLoading: false,
  
        selectedmerchantname: '',
        
  
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
        NetworkManager.apiRequest('api/dutyfree/DFMerchant/list', {}, function (e){
          if(e.statusCode === 200){
            self.crData = e.data.changeRequests
            self.merchants = e.data.merchants
          }
  
          self.hideFullScreenLoader()
        })
      },
      approve_or_reject: function (data){
        const self = this
        this.crIsLoading = true
  
        NetworkManager.apiRequest('api/dutyfree/DFMerchant/approve', data, function (e){
          if(e.statusCode === 200){
            const params = {
              type: 'is-success',
              message: 'Merchant ' + data.actionTaken + ' successfully'
            }
            self.$buefy.toast.open(params)
            location.reload()
          }
          else {
            const params = {
              type: 'is-warning',
              message: 'Merchant ' + data.actionTaken + ' failed!'
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
  