<template>

    <SubHeader @searchAddress="searchAddress"></SubHeader>

    <div class="container bg-white mt-4 pt-4 mb-3 pb-4" v-if="contractAddress">
        <div class="">
            <figure>
            <blockquote class="blockquote">
                <h6 class="display-8">Contract <b>{{contractAddress}}</b></h6>
            </blockquote>
            </figure>
        </div>

        <ContractInfo :key="contractInfoKey" :walletContractAddress="contractAddress" :address="address" :networkId="networkId"></ContractInfo>
    </div>
    
    <div class="container bg-white mt-5 mb-5 pb-4">
        <ContractsList v-if="address" :address="address" :networkId="networkId" @recordUpdated="reloadTable" :key="listKey"></ContractsList>
    </div>
    <loading v-model:active="rpcInProgress" :color="$loaderColor"/>
</template>


<script>

/**
 * Component to display the list of contracts created by the logged in user along with 
 * the functionality to search for a contract based on address
 */
import Loading from 'vue-loading-overlay';

import SubHeader from './SubHeader.vue';
import ContractsList from './ContractsList';
import ContractInfo from './ContractInfo';
import Base from '@/components/common/Base'

export default {
    name: 'Contracts',
    /**
     * Extend the base component to inherit following parameters - 
     * 
     * NetworkId - Network selected by the user in XinPay
     * Address - Address of the user in XDC network 
     * XDC Balance - Total XDC balance
     * LINK token Balance - Total LINK token balance 
     * 
     */
    extends: Base,
     /**
     * Required data parameters to display the contracts list
     */
    data() {
        return {
            contractAddress: '',
            contractInfoKey: 0,
            listKey: 0
        }
    },
   /**
     * Required components -
     * 
     * 1. Component to display the fields required for searching a new contarct
     * 2. Component to display the list of contracts created by the logged in user
     * 3. Ajax loader with gif
     * 4. Contract info component, which will be displayed at the final step
     */
    components: {
        SubHeader,
        ContractsList,
        Loading,
        ContractInfo
    },
    methods: {
      /**
       * Reload table rows once if any action is performed (only if LINK token is not transferred) i.e
       * 1. Either transferring link token
       * 2. Or Withdrawing the contract  
       */
      reloadTable() {
          this.listKey +=1 
      },
      /**
       * Load the contract details being searched
       */
      async searchAddress(contractAddr) {
          this.contractAddress = contractAddr
          this.contractInfoKey+=1
      }
    }
}
</script>
