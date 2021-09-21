<template>
    <div class="sub-header">
        <div class="container header-ov pb-5">
        <div class="row bg-white">
            <div class="col-md-6 col-sm-12 pt-5">
                <h6 class="fs-5 mb-5"><b>Login to XinPay to create Time Locked Smart Contracts</b></h6>
                <ol>
                    <li><p class="fs-6">Install XinPay extension if not installed already. <a target="_blank" href="https://chrome.google.com/webstore/detail/xinpay/bocpokimicclpaiekenaeelehdjllofo?hl=en">Install XinPay</a> </p></li>
                    <li><p class="fs-6">Click on the XinPay extension and login with your password</p>  </li>
                    <li><p class="fs-6">Once logged in to XinPay, click on <b>Access XinPay</b> below </p>  </li>
                </ol>
                <div class="text-center">
                    <a href="/" class="btn btn-sm btn-primary">Access XinPay & Create Time Locked Contracts</a>
                </div>
                <p class="mt-5 fs-7">
                    <i> The XinPay is an extension for accessing Xinfin's XDPoS enabled distributed applications, or "Dapps" in your browser!
                    The extension injects the XinFin's XDPoS web3 API into every website's javascript context, so that dapps can read from the blockchain.
                    The XinFin extension also lets the user create and manage their own identities (via private keys, local client wallet), so when a Dapp wants to perform a transaction and write to the blockchain, the user gets a secure interface to review the transaction, before approving or rejecting it. </i>
                </p>
            </div>
            <div class="col-md-6 col-sm-12 text-center">
                <img src="@/assets/images/login.gif" style="height: auto; width: 70%" class="mt-5">
            </div>
        </div>
    </div>
    </div>
</template>

<script>

/**
 * Component to display the login screen with XinPay installation instructions.
 * This screen will be displayed only if either XinPay is not installed or if the user has not logged into XinPay 
 */
export default {
    name: 'Login'
}

</script>
