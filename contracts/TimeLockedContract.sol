pragma solidity ^0.4.24;

/**
 * 
 * Import Chainlink client from smartcontractkit library. 
 * 
 * ChainlinkClient provides helper utilities to -
 * 1. Send requests to oracle node 
 * 2. Implement apropriate callback functions
 * 
 **/
import "https://github.com/smartcontractkit/chainlink/blob/develop/contracts/src/v0.4/ChainlinkClient.sol";
// import "https://github.com/smartcontractkit/chainlink/blob/develop/contracts/src/v0.4/interfaces/ERC677Receiver.sol";


/**
 *
 * Contract to implement Time Locked Contracts using Chainlink Oracle.
 * Appropriate Job should be created in Chinlink using the Alarm Clock task. Refer https://docs.chain.link/docs/chainlink-alarm-clock/ for more information on Chainlink Alarm Clock.
 * This contract will be created by TimeLockedContractFactory and the corresponding contract address will be stored in the Factory against the creator
 * 
 * Scenario -
 * 
 * 1. Sender would specify the amount of XDC to be sent to each receipient 
 * 2. Duration to lockup the XDC before being released to each receipient 
 * 3. XDC will be locked up in the contract's wallet  
 * 3. Once the specified duration is elapsed, Chainlink's Alarm Clock would be triggered 
 * 4. Chainlink node will create a transaction on XDC which inturn calls the appropriate callback function in the contract
 * 5. Once the callback function is invoked, locked up XDC will be released to all receipients mentioned in the contract 
 * 
 **/
contract TimeLockedContract is ChainlinkClient {
    
    event Received(address from, uint256 amount);
    event Released(address receiver, uint256 amount);
    
    modifier onlyOracle {
        require(msg.sender == _oracleContractAddr);
        _;
    }
    
    modifier onlyOwner {
        require(msg.sender == _sender);
        _;
    }

    
    /**
     * Private variables - cannot be accessed from external calls 
     **/
    address[] private _receivers;
    uint256[] private _funds;
    address private _sender;
    uint256 private _unlockDate;
    uint256 private _createdDate;
    bool private _isReleased; 
    address private _oracleContractAddr;
    bytes32 private _jobId;
    uint256 private _totalXDC;
    bool private _isLinkTransferred;
    bool private _isWithdrawn;
    uint private _totalLink;
    uint256 private _durationInSeconds;
    uint256 private _linkFee;
    
     /**
      * Constructor to set the initial values in the contract. Constructor will be invoked by TimeLockedContractFactory
      * 
      * params -
      * 
      * -: sender - Address of the user who is creating the contract and locking up XDC to be transferred to recipients
      * -: receivers - List of receivers to whom the XDC will be transferrd to
      * -: funds - Amount of XDC to be sent to each recipient. receivers[] and funds[] follows one to one mapping. Eg: receivers[1] maps to funds[1]
      * -: oracleContractAddr - Address of the Oracle contract deployed to XDC network
      * -: jobId - Job Id retrieved from Chainlink node. Job should includes Alarm Clock in its pipeline
      * -: link - Address of the LINK Token contract deployed to XDC network
      * -: totalXDC - Total XDC allocated across all rceivers
      * -: linkFee - Amount of link token required for the transaction
      * -: durationInSeconds - Duration to lockup the XDC
      * 
      **/
    constructor(address sender, address[] receivers, uint256[] funds, address oracleContractAddr, bytes32 jobId, address link, uint256 totalXDC, uint256 linkFee, uint256 durationInSeconds) public {
        
        /**
         * Set the LINK Token contract address in ChainlinkClient
         **/
        setChainlinkToken(link);
        
        /**
         * Set all the values in time locked contract 
         **/
        _sender = sender;
        _createdDate = now;
        _funds = funds;
        _receivers = receivers;
        _isReleased = false;
        _isLinkTransferred = false;
        _oracleContractAddr = oracleContractAddr;
        _jobId = jobId;
        _isReleased = false;
        _totalXDC = totalXDC;
        _totalLink = 0;
        _linkFee = linkFee;
        _durationInSeconds = durationInSeconds;
        _isWithdrawn = false;
    }
    
    /**
     * Deposit all the XDC received as part of the message to current contrat's wallet  
     **/
    function() payable public { 
        /**
         * Log XDC received from sender 
         **/
        emit Received(msg.sender, msg.value);
    }
    
    /**
    * Function to withdraw XDC back to sender. 
    * This option will be available only when the LINK token is not transferred and Chainlink job is not initiated
    *
    * modifier - 
    * 
    * :- onlyOwner - Restrict any random user from calling the withdraw function. This is to make sure that only the sender of the  
    *
    **/
    function withdraw() onlyOwner public {
        require(_isLinkTransferred == false);
        _sender.transfer(address(this).balance);
        _isWithdrawn = true;
    }
    
    /**
     * Callback function that would be invoked once the LINK token is transferred. Based on spec ERC677Receiver.sol
     **/
    function onTokenTransfer(address sender, uint value, bytes data) public {
        _totalLink = value;
        _isLinkTransferred = true;
        initiateAlarm();
    }
    
    
     /**
     * 
     * Create a Chainlink request to start the alarm job and after
     * the time in seconds is up, return through the callback function
     * 
     */
    function initiateAlarm() public returns (bytes32 requestId) 
    {
        /**
         * Build the Chainlink request by specifying the jobId, current contract addrees and callback function  
         **/
        Chainlink.Request memory request = buildChainlinkRequest(_jobId, address(this), this.releaseFunds.selector);
        
        /**
         * Add received seconds to current timestamp
         **/
        _unlockDate = block.timestamp + _durationInSeconds;
        
        /**
         * "until" parameter will be read by alarm/sleep task in the Chainlink job 
         **/
        request.addUint("until", _unlockDate);
        
        /**
         * Send the request to Chainlink node. Appropriate LINK token will be charged to execute this request  
         **/
        return sendChainlinkRequestTo(_oracleContractAddr, request, _linkFee);
    }
    
    
    /**
     *
     * Retrieve info about the contract
     * 
     * returns -
     * 
     * -: Address of the contract creator
     * -: List of receivers
     * -: Funds alloted to each receiver
     * -: Unlock date i.e. when the funds will be transferred to receipients
     * -: Created Date - Contract creation date
     * -: Current banalce of the contract
     * -: Is the XDC transferred to recipients
     * -: Is LINK token transferred
     * -: Total LINK tokens transferred
     * -: Is the contract withdrawn. This field will be true if sender has withdrawn the XDC 
     **/
    function info() public view returns(address, address[], uint256[], uint256, uint256, uint256, bool, bool, uint, bool) {
        return (_sender, _receivers, _funds, _unlockDate, _createdDate, _totalXDC, _isReleased, _isLinkTransferred, _totalLink, _isWithdrawn);
    }
     
    /**
     * 
     * Callback function to be invoked once the timer / duration is elapsed.
     * Chainlink node creates a transaction on XDC network to invoke the callback function
     * 
     * params -
     * 
     * -: _requestId - Request Id of the transaction from Chainlink node 
     * 
     * modifier - 
     * 
     * :- onlyOracle - Restrict any random user from calling the callback function. 
     * 
     */ 
    function releaseFunds(bytes32 _requestId) onlyOracle public recordChainlinkFulfillment(_requestId)
    {
        /**
         * Validate if the specified duration elapsed before the logic is executed. This is a check to prevent 
         * XDC being released before the unlock date.
         * 
         * onlyOracle modifier - 
         * 
         * This check would not be required if we receive a callback from Chainlink node after the specified duration.
         * This is required to stop any user from calling the callback function manually. 
         * 
         **/
        require(now >= _unlockDate);
        
        /**
         * 
         * Transfer the allocated XDC to receivers. _receivers[] has a one-on-one mapping to _funds[]
         * Eg: 
         * receivers = [receiver-1, receiver-2] 
         * funds = [100, 200]
         * 
         * The logic is to transfer 100 XDC to receiver-1 and 200 XDC to receiver-2
         *
         **/
         for(uint i =0; i < _receivers.length; i++) {
            address(_receivers[i]).transfer(_funds[i]);   
            emit Released(_receivers[i], _funds[i]);
        }
        _isReleased = true;
    }
}