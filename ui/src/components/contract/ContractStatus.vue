<template>
    <h6 v-if="contractDetails.isWithdrawn"><span class="badge bg-secondary">Withdrawn</span></h6> 
    <h6 v-else-if="!contractDetails.isLinkTransferred"><span class="badge bg-danger">Not Initiated</span></h6> 
    <h6 v-else-if="contractDetails.isReleased"><span class="badge bg-success">Released</span></h6> 
    <h6 v-else><span class="badge bg-warning text-dark">Pending</span></h6>
</template>

<script>

/**
 * Component to derrive the contract status. Status is derrived based on following conditions - 
 * 
 * 1. withdrawn - If XDX is withdrawn from the contract
 * 2. Not Initiated - If LINK token is not transferred to the contarct
 * 3. Released - If allocated XDC is released to all receivers
 * 4. Pending - If XDC is still not released to the receivers 
 * 
 */
export default {
    name: 'ContractStatus',
    props: {
        contractDetails: Object
    }
}
</script>
