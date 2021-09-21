<template>

<div class="sub-header header-ov">
    <div class="container">
        <div class="row">
            <div class="col-sm-12 col-md-5 text-white">
                <h6 class="fs-5 mb-3 mt-3">Time Locked Smart Contract</h6>
                <form id="search_contract">
                    <div class="input-group">
                        <input type="text" class="form-control" v-on:keydown.enter.prevent="emitAddress" placeholder="Search Time Locked Contract by Address" v-model="address" required>
                        <span class="input-group-text em-search" @click="emitAddress">
                            <i class="bi bi-search"></i>
                        </span>
                    </div>
                </form>
                <div class="mb-3" style="color: #e1f2ff"><small>Search time locked smart contract created from your XDC address</small> </div>
            </div>
            <div class="col-2 .d-none .d-md-block "></div>
            <div class="col-sm-12 col-md-5">
                <div class="card" style="width: 25rem;">
                    <div class="card-body">
                        <!-- <h5 class="card-title">Time Locked Contract</h5> -->
                        <p class="card-text fs-6"><small> Create a time locked contract using Chainlink to lockup XDC for a certain amount of time before transferring it to the receiver </small> </p>
                        <div class="text-center">
                            <a href="/contract" class="btn btn-primary"><i class="bi bi-menu-up"></i>  Create Contract</a> 
                        </div>
                        
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

</template>


<script>

/**
 * Component to display the contract search fileds and an action/button to create new Time Locked Contract  
 */
import $ from 'jquery'

export default {
    name: 'SubHeader',
     /**
     * Required data parameters 
     */
    data() {
        return {
            address: ''
        }
    },
    methods: {
        /**
         * Emits the keyed in contract address to Contracts component to load the contract details
         */
        emitAddress() {
            let isFormValid = $(`#search_contract`)[0].reportValidity();

            if(!isFormValid) {
                return false
            }
            this.$emit('searchAddress', this.address)
            this.address = ''
        }
    }
}
</script>
