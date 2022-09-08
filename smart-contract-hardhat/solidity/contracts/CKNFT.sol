// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";


contract CKNFT is ERC1155, Ownable, Pausable {
    
    string public name = "CONTINENT KEY";
    string public symbol = "CKNFT";
    string public contractUri;

    uint256 public constant CKNFT_PRICE = 0.0001 ether;
    uint256 public constant MAX_TOKEN_ID_PLUS_ONE = 2; // 2 tokens numbered 0 and 1 inclusive
    uint256 public WL_TIMER;
    uint256 public MAX_MINT = 20;
    uint256 public MAX_WL_MINT = 20;
    

    uint16 public minted;

    mapping(uint256 => uint256) public tokenIdToExistingSupply;
    mapping(uint256 => uint256) public tokenIdToMaxSupplyPlusOne; // set in the constructor
    mapping(address => bool) public whitelistedAddresses;
    mapping(address => uint256) public whitelistedPermit;

    bool private _reentrant = false;
    bool public isWhiteListActive = false;

    modifier nonReentrant() {
        require(!_reentrant, "No reentrancy");
        _reentrant = true;
        _;
        _reentrant = false;
    }

    constructor()
        ERC1155(
            "https://gateway.pinata.cloud/ipfs/QmWe7jwdM1vr3CcrWD3pmmmr2u1qA3vH3ZoaMm5QGcRDCF/{id}.json"
        )
    {
        contractUri = "https://gateway.pinata.cloud/ipfs/QmRi4M8wDxvwiMW7RVcb71xyaTdefZuK3VDjuTiAUwYFaN"; // json contract metadata file for OpenSea

        tokenIdToMaxSupplyPlusOne[0] = 10000;
        tokenIdToMaxSupplyPlusOne[1] = 10000;
        
        Pausable._pause();
        uint256[] memory _ids = new uint256[](2);
        uint256[] memory _amounts = new uint256[](2);
        for (uint256 i = 0; i < MAX_TOKEN_ID_PLUS_ONE; ++i) {
            _ids[i] = i;
            _amounts[i] = 1;
            tokenIdToExistingSupply[i] = 1;
        }
        _mintBatch(msg.sender, _ids, _amounts, "");
    }

    function setContractURI(string calldata _newURI) external onlyOwner {
        contractUri = _newURI; // updatable in order to change general project info for marketplaces like OpenSea
    }

    /// @dev function for OpenSea that returns uri of the contract metadata
    function contractURI() external view returns (string memory) {
        return contractUri; // OpenSea
    }

    /// @dev function for OpenSea that returns the total quantity of a token ID currently in existence
    function totalSupply(uint256 _id) external view returns (uint256) {
        require(_id < MAX_TOKEN_ID_PLUS_ONE, "id must be < 2");
        return tokenIdToExistingSupply[_id];
    }

    function setPaused(bool _paused) external onlyOwner {
        if (_paused) _pause();
        else _unpause();
    }

    function setWhitelistActive(bool _wlEnd) external onlyOwner {
        WL_TIMER = block.timestamp + 15 minutes;
        isWhiteListActive = _wlEnd;
    }

    function whitelistUsers(address[] calldata _users) public onlyOwner {
        for (uint256 i = 0; i < _users.length; i++) {
            whitelistedAddresses[_users[i]] = true;
        }
    }

    function setMaxWLMint(uint256 _max) public onlyOwner {
        MAX_WL_MINT = _max;
    }

    function whiteListedMint(uint256 _id, uint256 _amount)
        external
        payable
        nonReentrant
    {
        // WL_Timer is here to lock access for WL only under 24h
        require(
            (isWhiteListActive && WL_TIMER > block.timestamp),
            "whitelist is finish"
        );
        require(
            whitelistedAddresses[msg.sender] == true,
            "You'r not whitelisted !"
        );
        
        require(
            whitelistedPermit[msg.sender] + _amount <= MAX_WL_MINT,
            "Only 20 Nfts by whitelisted address. "
        );
        require(_id < MAX_TOKEN_ID_PLUS_ONE, "id must be < 2");
        require(minted + _amount <= 40, "All tokens minted");
        require(_amount > 0 && _amount <= MAX_MINT, "Invalid mint amount");                

        uint256 existingSupply = tokenIdToExistingSupply[_id];

        require(msg.value == _amount * CKNFT_PRICE, "incorrect ETH");
        require(msg.sender == tx.origin, "no smart contracts");

        unchecked {
            existingSupply += _amount;
        }
        tokenIdToExistingSupply[_id] = existingSupply;      
        
        for (uint256 i = 0; i < _amount; i++) {
            minted++;            
            whitelistedPermit[msg.sender]++;   
        }
        _mint(msg.sender, _id, _amount, "");
    }

    function mint(uint256 _id, uint256 _amount) external payable whenNotPaused {
        require(_id < MAX_TOKEN_ID_PLUS_ONE, "id must be < 2");

        uint256 existingSupply = tokenIdToExistingSupply[_id];
        require(
            existingSupply + _amount < tokenIdToMaxSupplyPlusOne[_id],
            "supply exceeded"
        );

        require(msg.value == _amount * CKNFT_PRICE, "incorrect ETH");
        require(msg.sender == tx.origin, "no smart contracts");
        unchecked {
            existingSupply += _amount;
        }
        tokenIdToExistingSupply[_id] = existingSupply;
        _mint(msg.sender, _id, _amount, "");
    }

    function ownerMint(
        address _to,
        uint256 _id,
        uint256 _amount
    ) external onlyOwner {
        require(_id < MAX_TOKEN_ID_PLUS_ONE, "id must be < 2");

        uint256 existingSupply = tokenIdToExistingSupply[_id];
        require(
            existingSupply + _amount < tokenIdToMaxSupplyPlusOne[_id],
            "supply exceeded"
        );
        unchecked {
            existingSupply += _amount;
        }
        tokenIdToExistingSupply[_id] = existingSupply;
        _mint(_to, _id, _amount, "");
    }

    function mintBatch(uint256[] calldata _ids, uint256[] calldata _amounts)
        external
        payable whenNotPaused
    {
        uint256 sumAmounts;
        uint256 arrayLength = _ids.length;
        for (uint256 i = 0; i < arrayLength; ++i) {
            sumAmounts += _amounts[i];
        }

        require(msg.value == sumAmounts * CKNFT_PRICE, "incorrect ETH");

        for (uint256 i = 0; i < arrayLength; ++i) {
            uint256 _id = _ids[i];
            uint256 _amount = _amounts[i];
            uint256 existingSupply = tokenIdToExistingSupply[_id];
            
            require(
                existingSupply + _amount < tokenIdToMaxSupplyPlusOne[_id],
                "supply exceeded"
            );
            require(msg.sender == tx.origin, "no smart contracts");

            unchecked {
                existingSupply += _amount;
            }
            tokenIdToExistingSupply[_id] = existingSupply;
        }
        _mintBatch(msg.sender, _ids, _amounts, "");
    }

    function ownerMintBatch(
        uint256[] calldata _ids,
        uint256[] calldata _amounts
    ) external onlyOwner {
        uint256 arrayLength = _ids.length;

        for (uint256 i = 0; i < arrayLength; ++i) {
            uint256 existingSupply = tokenIdToExistingSupply[_ids[i]];
            uint256 _id = _ids[i];
            uint256 _amount = _amounts[i];

            require(_id < MAX_TOKEN_ID_PLUS_ONE, "id must be < 2");
            require(
                existingSupply + _amount < tokenIdToMaxSupplyPlusOne[_id],
                "supply exceeded"
            );
            require(msg.sender == tx.origin, "no smart contracts");

            unchecked {
                existingSupply += _amount;
            }
            tokenIdToExistingSupply[_id] = existingSupply;
        }
        _mintBatch(msg.sender, _ids, _amounts, "");
    }

    function withdraw() external payable onlyOwner {
        (bool succeed, ) = payable(owner()).call{value: address(this).balance}(
            ""
        );
        require(succeed, "failed to withdraw ETH");
    }
}