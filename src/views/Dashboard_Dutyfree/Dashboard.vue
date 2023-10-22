<template>
    <div class="block">
    <div style=" overflow-y: auto; overflow-x: hidden">
      <div class="container" style="height: 78vh; width: 75vw;">

        <total-number-of-duty-free-claims></total-number-of-duty-free-claims>
        <range-number-of-duty-free-claims></range-number-of-duty-free-claims>

        <div class="columns">
          <div class="column is-three-fifths">
            <all-duty-free-claims-table></all-duty-free-claims-table>
          </div>
          <div class="column ">
            <number-of-allowance-claimed-line-chart></number-of-allowance-claimed-line-chart>
          </div>
        </div>

        <div class="columns">
          <div class="column is-one-fifths">
            <range-of-duty-free-pie-chart></range-of-duty-free-pie-chart>
          </div>
          <div class="column">
            <weekly-claim-amount-bar-chart></weekly-claim-amount-bar-chart>
          </div>
        </div>

        <div class="columns">
          <div class="column is-three-fifths">
            <claim-request-bar-chart></claim-request-bar-chart>
          </div>
          
        </div>
      </div>
    </div>
  </div>
    
</template>
<script>
import TotalNumberOfDutyFreeClaims from "@/views/Dashboard_Dutyfree/Components/TotalNumberOfDutyFreeClaims";
import RangeNumberOfDutyFreeClaims from "@/views/Dashboard_Dutyfree/Components/RangeOfDutyFreeClaims";
import AllDutyFreeClaimsTable from "@/views/Dashboard_Dutyfree/Components/AllDutyFreeClaimsTable";
import NumberOfAllowanceClaimedLineChart from "@/views/Dashboard_Dutyfree/Components/NumberOfAllowanceClaimedLineChart";
import RangeOfDutyFreePieChart from "@/views/Dashboard_Dutyfree/Components/RangeOfDutyFreePieChart";
import WeeklyClaimAmountBarChart from "@/views/Dashboard_Dutyfree/Components/WeeklyClaimAmountBarChart";
import ClaimRequestBarChart from "@/views/Dashboard_Dutyfree/Components/ClaimRequestBarChart";

export default{
    name: "Dashboard_Dutyfree",
    components:{
        TotalNumberOfDutyFreeClaims,
        RangeNumberOfDutyFreeClaims,
        AllDutyFreeClaimsTable,
        NumberOfAllowanceClaimedLineChart,
        RangeOfDutyFreePieChart,
        WeeklyClaimAmountBarChart,
        ClaimRequestBarChart
    }
}
</script>
<style></style>