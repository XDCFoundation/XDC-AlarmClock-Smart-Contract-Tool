<template>
    <div class="modal fade" id="receivers_modal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
  <div class="modal-dialog modal-dialog-centered modal-lg">
    <div class="modal-content">
      <div class="modal-header">
        <h6 class="modal-title"><strong> RECEIVERS & XDC ALLOTED </strong></h6>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body">
         
            <div class="row bg-white pb-4">
              
              <div class="col">
                <table class="table">
                    <thead>
                        <tr>
                            <th><p class="info-header">Receiver Address</p></th>
                            <th><p class="info-header">XDC Alloted</p></th>
                            <th><p class="info-header">Status</p></th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(receiver, index) in receivers" :key="index">
                            <th><p class="info-value"> <strong> <i class="bi bi-person-check-fill mr-3"></i> {{receiver || '--' }} </strong> </p></th>
                            <th><p class="info-value"><strong> {{funds[index]}} XDC</strong></p></th>
                            <th>
                                <h6 v-if="isReleased"><span class="badge bg-success">Released</span></h6> 
                                <h6 v-else><span class="badge bg-warning text-dark">Pending</span></h6>
                            </th>
                        </tr>
                    </tbody>
                </table>
              </div>
            </div>


      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
      </div>
    </div>
  </div>
</div>

</template>

<script>

export default {
   /**
   * Display the list of receivers and corresponding XDC.
   * The results will be displayed in a modal as it would be cleaner to display it in a modal rather than in the data table
   */
    name: 'Receivers',
    /**
     * Properties to be sent by the importing contract 
     * 
     * 1. List of receivers
     * 2. Corresponding XDX allocated to each receiver
     * 3. Is XDC released to the receivers
     */
    props: {
        receivers: Array,
        funds: Array,
        isReleased: Boolean
    }
}
</script>
