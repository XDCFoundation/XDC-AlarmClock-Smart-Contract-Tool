<template>
    <div class="modal fade" id="withdraw_contract_modal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered modal-lg">
            <div class="modal-content">
            <div class="modal-header">
                <h6 class="modal-title"><strong> Withdraw XDC </strong></h6>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                
                    <div class="row bg-white pb-4">
                    
                    <div class="col">
                        <h6 class="display-8"> This action will transfer the XDC back to your wallet. Are you sure ? </h6>
                    </div>
                    </div>


            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-primary" @click="withdraw">Withdraw</button>
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
            </div>
            </div>
        </div>
        <loading v-model:active="rpcInProgress" :color="$loaderColor" />
    </div>

</template>

<script>

/**
 * Component to withdraw XDC from the contract to user's wallet.
 * This option will be applicable only if LINK token is not transferred to the contract.
 * A confirmation modal will be displayed to the user before proceeding with the withdrawal 
 */
import web3Util from "@/assets/js/web3-utility";
import common from "@/assets/js/common";
import Loading from "vue-loading-overlay";

import { Modal } from 'bootstrap/dist/js/bootstrap.bundle.min.js'

export default {
    name: 'WithdrawContract',
    /**
     * Required data parameters to withdraw XDC from wallet
     */
    data() {
        return {
            rpcInProgress: false
        }
    },
     /**
     * Properties to be sent by the importing contract 
     * 
     * 1. Contract details
     * 2. Network id selected in XinPay walet
     * 3. Address of the user
     */
    props: {
        contractDetails: Object,
        networkId: Number,
        address: String,

    },
    /**
     * Required components -
     * 
     * 1. Ajax loader with gif
     */
    components: {
        Loading
    },
    methods: {
        /**
         * Method to withdraw XDC from contract to user's wallet
         */
        async withdraw() {
            this.rpcInProgress = true;
            let vm = this
            var tlw = await web3Util.withdrawConract(this, this.contractDetails.walletAddress);
            /**
             * Send the withdrawl request
             */
            tlw.send({ from: this.address}, function (error, transactionHash) {
                if (error) {
                    vm.rpcInProgress = false;
                    return;
                }
                 /**
                 * Wait till the transaction is complete
                 */
                web3Util.waitForReceipt(vm, transactionHash, async function (result) {
                    if (result.error) {
                         /**
                         * In case of any error display the appropriate error
                         */
                        common.notifyError("Error processing the request");
                        vm.rpcInProgress = false;
                        return;
                    }

                     /**
                     * Notify user with success message and hide the modal
                     */
                    common.notifySuccess("XDC withdrawn from contract");
                    vm.rpcInProgress = false;
                    var myModal = Modal.getInstance(document.getElementById('withdraw_contract_modal'))
                    myModal.hide()
                    vm.$emit('withdrawn', vm.contractDetails.walletAddress)
                });
            });
        }
    }
}
</script>
