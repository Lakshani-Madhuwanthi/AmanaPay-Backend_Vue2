<template>
    <div>
        <div class="card" style="margin-left: 10px; margin-right: 10px">
            <div class="card-content">
                <div class="columns" style="padding: 5px">
                    <div class="column">
                        <p><b>Total Number of Duty Free Claims <span style="margin-left: 10px; color: #7A57D5">{{
                            totalDFClaims.tot_df_claims }}</span></b></p>
                    </div>
                    <div class="column">
                        <p><b>Total Number of Customer Request<span style="margin-left: 10px; color: #7A57D5">{{
                            totalDFClaims.tot_customer_request }}</span></b></p>
                    </div>
                    <div class="column">
                        <p><b>Total value of Duty Free Claims(USD)<span style="margin-left: 10px; color: #7A57D5"> {{
                                            totalDFClaims.value_df_claims}}</span></b></p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import NetworkManager from "@/network";


export default {
    name: "TotalNumberOfDutyFreeClaims",
    data() {
        return {
            totalDFClaims: {}
        }
    },

    methods: {
        loadData: function () {
            const self = this

            NetworkManager.apiRequest('api/DFDashboard/total-dutyfree-claims', {}, function (e) {
                if (e.statusCode === 200) {
                    self.totalDFClaims = e.data
                    console.log(e.data);
                }
                else {
                    //
                }
            })
        }
    },

    mounted() {
        this.loadData()
    }
}
</script>

<style></style>