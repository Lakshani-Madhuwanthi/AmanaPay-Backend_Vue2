<template>
  <section>
    <div class="container" style="height: 78vh; width: 85vw">
      <div class="card-header p-3">
        <div class="columns">
          <div class="column">
            <b-breadcrumb align="is-left">
              <b-breadcrumb-item tag="router-link" to="" active>Duty free SL Customs</b-breadcrumb-item>
            </b-breadcrumb>
          </div>
        </div>
      </div>
      <div class="columns">
        <div class="column is-half">
          <b-field label="Enter Customer Passport/NIC" grouped style="margin-top: 100px; margin-left: 20px">
            <b-input v-model="search" placeholder="Enter passport/NIC" expanded></b-input>
            <p class="control">
              <b-button :disabled="isSearchDisabled" label="Search" @click="getUserData()" type="is-success" />
            </p>
          </b-field>
        </div>
      </div>
      <section v-if="!(requestData.first_name === '' || requestData.first_name === null)
        ">
        <div style="overflow: auto; height: 45vh; width: 77vw">
          <div class="columns m-2">
            <div grouped class="column is-one-fifth">
              <p>Duty free Amount</p>
              <p>Name</p>
              <p>Requested Date</p>
              <p>NIC Number</p>
              <p>Current Passport</p>
              <p><b>Total Duty Free Amount</b></p>
              <p><b>Transaction Amount</b></p>
              <p><b>Remaining Amount</b></p>
            </div>
            <div grouped class="column is-one-fifth">
              <p class="has-text-right">
                {{ requestData.dutyfree_amount }} USD
              </p>
              <p class="has-text-right">
                {{ requestData.first_name + ' ' + requestData.last_name }}
              </p>
              <p class="has-text-right">
                {{ formatDateTime(new Date(requestData.date)) }}
              </p>
              <p class="has-text-right">{{ requestData.nic }}</p>
              <p class="has-text-right">{{ requestData.current_passport }}</p>
              <p class="has-text-right">
                <b>{{ requestData.dutyfree_amount }} USD</b>
              </p>
              <p class="has-text-right">
                <b>{{ requestData.claimed_amount }} USD</b>
              </p>
              <p class="has-text-right">
                <b>{{ requestData.remaining_allowance }} USD</b>
              </p>
            </div>
          </div>
          <div>
            <div class="columns card-content" style="width: 80vw;" >
              <b-table :height="vhToPixels(40)" :data="requestData.purchases" :paginated="tableOptions.isPaginated"
                :per-page="tableOptions.perPage" :current-page.sync="tableOptions.currentPage"
                :pagination-simple="tableOptions.isPaginationSimple"
                :pagination-position="tableOptions.paginationPosition"
                :default-sort-direction="tableOptions.defaultSortDirection"
                :pagination-rounded="tableOptions.isPaginationRounded" :sort-icon="tableOptions.sortIcon"
                :sort-icon-size="tableOptions.sortIconSize" default-sort="id" aria-next-label="Next page"
                aria-previous-label="Previous page" aria-page-label="Page" aria-current-label="Current page"
                :sticky-header="tableOptions.stickyHeaders" :page-input="tableOptions.hasInput"
                :pagination-order="tableOptions.paginationOrder" :page-input-position="tableOptions.inputPosition"
                :debounce-page-input="tableOptions.inputDebounce">
                <b-table-column field="id" label="ID" width="40" sortable numeric v-slot="props" sticky>
                  {{ props.row.id }}
                </b-table-column>

                <b-table-column field="purchase_date" label="Purchase Date" sortable centered v-slot="props">
                  <span class="tag is-success">
                    {{ new Date(props.row.purchase_date).toLocaleString() }}
                  </span>
                </b-table-column>

                <b-table-column field="merchant" centered label="Merchant" sortable v-slot="props" width="200">
                  {{ props.row.merchant }}
                </b-table-column>

                <b-table-column field="invoice_number" centered label="Invoice Number" sortable v-slot="props"
                  width="200">
                  {{ props.row.invoice_number }}
                </b-table-column>

                <b-table-column field="invoice_amount" centered label="Invoice Amount (USD)" sortable v-slot="props"
                  width="200">
                  {{ props.row.invoice_amount }}
                </b-table-column>

                <b-table-column field="claimed_amount" centered label="Claimed Amount (USD)" sortable v-slot="props"
                  width="200">
                  {{ props.row.claimed_amount }}
                </b-table-column>

                <b-table-column field="custom_officer" centered label="Custom Officer" sortable v-slot="props"
                  width="200">
                    {{ props.row.custom_officer }}
                </b-table-column>

                <b-table-column field="status" centered label="Status" sortable v-slot="props" width="100">
                  <span :class="'tag ' + getTagColor(props.row.status)">
                    {{ props.row.status }}
                  </span>
                </b-table-column>
                <b-table-column field="action" centered label="Action" sortable v-slot="props" width="200">
                  <div v-show="props.row.status == 'PENDING'" class="button-group">
                    <b-button type="is-success is-small m-1" @click="selectPurchaseAndOpenModal(true, props.row)"
                      :loading="isLoading">Approve</b-button>
                    <b-button type="is-danger is-small m-1" @click="selectPurchaseAndOpenModal(false, props.row)"
                      :loading="isLoading">Reject</b-button>
                  </div>
                </b-table-column>
              </b-table>
            </div>
          </div>
        </div>
        <hr />
      </section>
      <div v-if="requestData.first_name === null" class="columns m-2">
        <div class="column">
          <p>No active request found</p>
        </div>
      </div>
    </div>

    <b-modal v-model="isRejectModalActive" has-modal-card trap-focus :destroy-on-hide="false" aria-role="dialog"
      aria-label="Example Modal" close-button-aria-label="Close" aria-modal>
      <template>
        <div class="modal-card" style="width: auto">
          <header class="modal-card-head">
            <p class="modal-card-title">
              Are you sure that you want to reject this request?
            </p>
            <button type="button" class="delete" @click="clearCommentAndCloseModal" />
          </header>
          <section class="modal-card-body">
            <b-field label="Reject Reason">
              <b-input v-model="comment" placeholder="Reject Reason" required></b-input>
            </b-field>
          </section>
          <footer class="modal-card-foot is-flex is-justify-content-center">
            <b-button label="Reject" :loading="isLoading" @click="requestApproval()" type="is-danger" />
            <b-button label="Cancel" :loading="isLoading" @click="clearCommentAndCloseModal" />
          </footer>
        </div>
      </template>
    </b-modal>

    <b-modal v-model="isApproveModalActive" has-modal-card trap-focus :destroy-on-hide="false" aria-role="dialog"
      aria-label="Example Modal" close-button-aria-label="Close" aria-modal>
      <template>
        <div class="modal-card" style="width: auto">
          <header class="modal-card-head">
            <p class="modal-card-title">
              Are you sure that you want to approve this request?
            </p>
            <button type="button" class="delete" @click="isApproveModalActive = false" />
          </header>
          <section class="modal-card-body"></section>
          <footer class="modal-card-foot is-flex is-justify-content-center">
            <b-button label="Approve" :loading="isLoading" @click="requestApproval()" type="is-success" />
            <b-button label="Cancel" :loading="isLoading" @click="isApproveModalActive = false" />
          </footer>
        </div>
      </template>
    </b-modal>
  </section>
</template>

<script>
import NetworkManager from '@/network';

export default {
  data() {
    return {
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

      search: '',
      comment: '',
      selectedPurchase: null,
      notFound: false,
      isRejectModalActive: false,
      isApproveModalActive: false,
      isLoading: false,

      requestData: {
        id: '',
        first_name: '',
        last_name: '',
        nic: '',
        current_passport: '',
        date: '',
        reference: '',
        dutyfree_amount: 0,
        claimed_amount: 0,
        remaining_allowance: 0,
        status: '',
        purchases: [],
      },
    };
  },
  computed: {
    isSearchDisabled() {
      return this.search.trim() === '';
    },
  },
  methods: {
    getUserData() {
      const self = this;

      self.requestData = {
        id: '',
        first_name: '',
        last_name: '',
        nic: '',
        current_passport: '',
        previous_passport: '',
        date: '',
        reference: '',
        dutyfree_amount: 0,
        claimed_amount: 0,
        remaining_allowance: 0,
        status: '',
        purchases: [],
      };

      self.showFullScreenLoader();
      NetworkManager.apiRequest(
        'api/dutyfree/DFCustom/customer-data',
        { uid: self.search },
        function (e) {
          if (e.statusCode === 200) {
            self.requestData = e.data.dutyFreeRequest;
            self.notFound = false;
          } else {
            self.notFound = true;
          }
          self.hideFullScreenLoader();
        }
      );
    },
    clearCommentAndCloseModal() {
      this.comment = '';
      this.isRejectModalActive = false;
    },
    selectPurchaseAndOpenModal(approved, purchaseData) {
      this.selectedPurchase = {
        approved: approved,
        purchaseData: purchaseData,
      };

      if (approved) {
        this.isApproveModalActive = true;
      } else {
        this.isRejectModalActive = true;
      }
    },
    requestApproval: function () {
      const self = this;
      const selectedPurchase = this.selectedPurchase;

      if (!selectedPurchase) {
        console.error('No selected purchase.');
        return;
      }

      const data = {
        approved: selectedPurchase.approved,
        purchase_id: selectedPurchase.purchaseData.id,
        rejected_amount: selectedPurchase.purchaseData.claimed_amount,
        comment: self.comment,
      };

      self.isLoading = true;

      NetworkManager.apiRequest('api/dutyfree/DFCustom/request-approve', data, function (e) {
        if (e.statusCode === 200) {
          const params = {
            type: 'is-success',
            message: e.data.message,
          };
          self.$buefy.toast.open(params);
        } else {
          const params = {
            type: 'is-warning',
            message: 'Approve/Reject request failed',
          };
          self.$buefy.toast.open(params);
        }

        self.isLoading = false;
        self.isRejectModalActive = false;
        self.isApproveModalActive = false;

        self.getUserData();
      }
      );
    },

    getStatusColor: function (status) {
      switch (status) {
        case 'PENDING':
          return '#ab981d';
        case 'APPROVED':
          return '#1dab40';
        case 'REJECTED':
          return '#ab1d2b';
        case 'CLAIMED':
          return '#1d5bab';
        default:
          return '#161617';
      }
    },

    getTagColor: function (status) {
      switch (status) {
        case 'PENDING':
          return 'is-warning';
        case 'APPROVED':
          return 'is-success';
        case 'REJECTED':
          return 'is-danger';
        default:
          return 'is-dark';
      }
    },
  },
};
</script>

<style scoped></style>
