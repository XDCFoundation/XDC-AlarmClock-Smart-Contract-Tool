<template>
     <loading v-model:active="rpcInProgress" :color="$loaderColor"/>
</template>

<script>

import web3Util from '@/assets/js/web3-utility'

/**
 * Base component inherited other components which retrieves following user information -
 *
 * NetworkId - Network selected by the user in XinPay
 * Address - Address of the user in XDC network 
 * XDC Balance - Total XDC balance
 * LINK token Balance - Total LINK token balance
 */
export default {
    name: 'Base',
    data() {
        return {
            xdc: 0,
            link: 0,
            address: '',
            rpcInProgress: false,
            networkId: 0,
            isInitialized: false
        }
    },
    /**
     * Retrieves all the required parameters form XinPay wallet 
     */
    async mounted() {
        this.rpcInProgress = true
        this.networkId = await this.$web3js.eth.net.getId() 
        this.address = await web3Util.getAddress(this)
        this.xdc = await web3Util.getBalance(this, this.address)
        this.link = await web3Util.getLINKBalance(this, this.address) 
        this.isInitialized = true
        this.rpcInProgress = false
        
    }
}
</script>
