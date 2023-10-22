<template>
  <div class="card" style="margin: 10px; min-height: 300px">
    <div class="card-content">
      <div class="columns">
        <div class="column is-three-fifths" style="font-weight: bold; margin-left: 10px">All Transactions</div>
        <div class="column">
          <b-field>
            <b-datepicker
                @input="loadData"
                :disabled="isTableLoading"
                v-model="dateRange"
                :mobile-native="false"
                range
            >
              <template v-slot:trigger>
                <b-button
                    icon-left="calendar-month-outline"
                    size="is-small"
                />
              </template>
            </b-datepicker>
          </b-field>
        </div>
        <div class="column">
          <b-dropdown
              @change="loadData"
              :disabled="isTableLoading"
              class="is-pulled-right"
              v-model="selectedFilter"
              aria-role="list">
            <template #trigger>
              <b-button
                  type="is-primary"
                  size="is-small"
                  icon-right="menu-down">
                {{ selectedFilter.text }}
              </b-button>
            </template>

            <b-dropdown-item v-for="item in filters" :key="item.id" :value="item" aria-role="listitem">
              <span>{{ item.text }}</span>
            </b-dropdown-item>
          </b-dropdown>
        </div>
      </div>
      <div class="card-content">
        <b-table
            :loading="isTableLoading"
            :data="data"
            :paginated="isPaginated"
            :per-page="perPage"
            :current-page.sync="currentPage"
            :pagination-simple="isPaginationSimple"
            :pagination-position="paginationPosition"
            :default-sort-direction="defaultSortDirection"
            :pagination-rounded="isPaginationRounded"
            :sort-icon="sortIcon"
            :sort-icon-size="sortIconSize"
            default-sort="user.first_name"
            aria-next-label="Next page"
            aria-previous-label="Previous page"
            aria-page-label="Page"
            aria-current-label="Current page"
            :page-input="hasInput"
            :pagination-order="paginationOrder"
            :page-input-position="inputPosition"
            :debounce-page-input="inputDebounce">

          <b-table-column field="id" label="ID" width="40" sortable numeric v-slot="props">
            {{ props.row.id }}
          </b-table-column>

          <b-table-column field="type" label="Type" sortable v-slot="props">
            {{ props.row.type }}
          </b-table-column>

          <b-table-column field="amount" label="Amount (LKR)" sortable v-slot="props" numeric>
            {{ props.row.amount }}
          </b-table-column>

        </b-table>
      </div>
    </div>
  </div>
</template>

<script>
import NetworkManager from "@/network";

const today = new Date()

export default {
  name: "AllTransactionsTable",
  data() {
    return {
      dateRange: [today, today],
      selectedFilter: { value: 7, text: 'This Week' },
      filters : [
        { value: 7, text: 'This Week' },
        { value: 14, text: 'Last Two Weeks' },
        { value: 30, text: 'Last Month' },
        { value: 90, text: 'Last Three Months' },
        { value: 365, text: 'Last Year' },
        { value: 0, text: 'Custom' },
      ],

      isTableLoading: false,
      data: [],
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
      inputDebounce: ''
    }
  },

  watch: {
    dateRange(){
      this.selectedFilter = { value: 0, text: 'Custom' }
    },
  },

  methods: {
    formatDate: function (date) {
      let d = new Date(date),
          month = '' + (d.getMonth() + 1),
          day = '' + d.getDate(),
          year = d.getFullYear();

      if (month.length < 2)
        month = '0' + month;
      if (day.length < 2)
        day = '0' + day;

      return [year, month, day].join('-');
    },

    loadData: function (){
      const self = this

      self.isTableLoading = true

      setTimeout(() => {
        const data = {
          range: self.selectedFilter.value,
          fromDate: self.formatDate(self.dateRange[0]),
          toDate: self.formatDate(self.dateRange[1])
        }

        NetworkManager.apiRequest('api/DFDashboard/totalTransactionValues', data, function (e){
          if(e.statusCode === 200){
            self.data = e.data.transactions
          }
          else {
            //
          }
          self.isTableLoading = false
        })
      }, 200)
    }
  },

  mounted() {
    this.loadData()
  }
}
</script>

<style scoped>

</style>
