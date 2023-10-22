<template>
  <div class="card" style="margin: 5px">
    <div class="card-content">
      <div class="columns">
        <div class="column">
          <b-field :label="title"></b-field>
        </div>
        <div class="column">
          <b-dropdown
              class="is-pulled-right"
              v-model="selectedOption"
              aria-role="list">
            <template #trigger>
              <b-button
                  type="is-primary"
                  size="is-small"
                  icon-right="menu-down">
                {{ selectedOption.text }}
              </b-button>
            </template>

            <b-dropdown-item v-for="item in options" :key="item.id" :value="item" aria-role="listitem">
              <span>{{ item.text }}</span>
            </b-dropdown-item>
          </b-dropdown>
        </div>
        <div></div>
      </div>
      <vue-apex-charts ref="pieChart" type="donut" :options="chartOptions" :series="series"></vue-apex-charts>
    </div>
  </div>
</template>

<script>
import VueApexCharts from "vue-apexcharts"

export default {
  name: "NumericPieChart",
  props: ['title', 'series', 'labels'],
  emits: ['range-changed'],
  components: {VueApexCharts},
  data() {
    return {
      selectedOption: { value: 7, text: 'This Week' },
      options : [
        { value: 7, text: 'This Week' },
        { value: 14, text: 'Last Two Weeks' },
        { value: 30, text: 'Last Month' },
        { value: 90, text: 'Last Three Months' },
        { value: 365, text: 'Last Year' },
      ],

      chartOptions: {
        labels: [],
        dataLabels: {
          enabled: true,
          style: {
            fontSize: "18px",
            fontFamily: "Helvetica, Arial, sans-serif",
            fontWeight: "bold"
          }
        },
        chart: {
          type: 'donut',
        },
        stroke: {
          colors: ['#fff']
        },
        fill: {
          opacity: 0.8
        },
        yaxis: {
          show: true
        },
        legend: {
          position: 'bottom'
        },
        plotOptions: {
          pie: {
            donut: {
              labels: {
                show: true,
                total: {
                  show: true,
                  label: 'Total',
                  formatter: this.getTotal,
                }
              },
            }
          }
        },
        theme: {
          monochrome: {
            enabled: true,
            shadeTo: 'dark',
            shadeIntensity: 0.6,
            color: '#0307fc',
          }
        },
        responsive: [{
          breakpoint: 480,
          options: {
            chart: {
              width: 200
            },
            legend: {
              position: 'bottom'
            }
          }
        }]
      }
    }
  },

  methods: {
    getTotal: function (){
      let tot = 0
      this.series.forEach(function (item){
        tot += item
      })

      return this.numberWithCommas(tot)
    },

    numberWithCommas: function (x) {
      let parts = x.toString().split(".");
      parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      return parts.join(".");
    }
  },

  watch: {
    labels(newVal){
      if(newVal){
        this.$refs.pieChart.updateOptions({ labels: newVal })
      }
    },

    selectedOption(newVal){
      this.$emit('range-changed', newVal.value)
    }
  },

  mounted() {
    this.$refs.pieChart.updateOptions({ labels: this.labels })
  }

}
</script>

<style scoped>

</style>
