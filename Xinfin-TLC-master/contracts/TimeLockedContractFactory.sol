pragma solidity ^0.4.24;

import "./TimeLockedContract.sol";

/**
 * 
 * TimeLockedContractFactory is the factory contract which deploy's TimeLockedWallet contract.
 * Once the TimeLockedWallet contract is deployed, the corresponding contract address will be stored against the user (msg.sender)
 * 
 **/
contract TimeLockedContractFactory {
    
    /**
     * 
     * Map to store the list of conract addresses againt the senders and recipients
     * 
     **/
    mapping(address => address[]) private wallets;

    /**
     * Retrive all contracts stored againt the provided address
     * 
     * params - 
     * 
     * -: user - Address of the user for whom the contracts are to be retrieved
     * 
     * returns -
     * 
     * -: List of contracts created the given user
     * 
     **/
    function getWallets(address user) public view returns(address[])
    {
        return wallets[user];
    }
    
    
    /**
     *
     * Creates TimeLockedContract with the given parameters and stores the created contract
     * address against the sender 
     * 
     * -: receivers - List of receivers to whom the XDC will be transferrd to
     * -: funds - Amount of XDC to be sent to each recipient. receivers[] and funds[] follows one to one mapping. Eg: receivers[1] maps to funds[1]
     * -: oracleContractAddr - Address of the Oracle contract deployed to XDC network
     * -: jobId - Job Id retrieved from Chainlink node. Job should includes Alarm Clock in its pipeline
     * -: link - Address of the LINK Token contract deployed to XDC network
     * -: linkFee - Amount of link token required for the transaction
     * -: durationInSeconds - Duration to lockup the XDC
     * 
     **/
    function newTimeLockedContract(address[] receivers, uint256[] funds, address oracleContractAddr, bytes32 jobId, address link, uint256 linkFee, uint256 durationInSeconds) payable public  {
        /**
         * Create a new TimeLockedContract with specified parameters
         **/
        TimeLockedContract wallet = new TimeLockedContract(msg.sender, receivers, funds, oracleContractAddr, jobId, link, msg.value, linkFee, durationInSeconds);
        
        /**
         * Add the contract address to sender's list 
         **/
        wallets[msg.sender].push(wallet);

        /**
         * Transfer the XDC from this transaction to the created contract's wallet. This XDC will be locked up till the unlock duration expires 
         */
        address(wallet).transfer(msg.value);
    }
    
    /**
     * 
     * Prevent accidental sending of XDC to this factory contract
     **/
    function() public {
        revert();
    }
}