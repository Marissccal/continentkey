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
    uint256 public AL_TIMER;
    uint256 public MAX_MINT = 300;
    uint256 public max_mint_wl = 300;
    uint256 public MAX_AL_MINT = 300;   

    
    
    mapping(uint256 => uint256) public tokenIdToExistingSupply;
    mapping(uint256 => uint256) public tokenIdToMaxSupplyPlusOne; // set in the constructor
    mapping(address => bool) public allowlistsAddresses;
    mapping(address => uint256) public allowlistsPermit;
    mapping(address => uint256) public mintPermit;

    bool private _reentrant = false;
    bool public isAllowlistsActive = false;

    modifier nonReentrant() {
        require(!_reentrant, "No reentrancy");
        _reentrant = true;
        _;
        _reentrant = false;
    }

    address public teamWallet = 0x6666Ec43dEb25910121Dd544E89301a86165Fa6b;

    constructor()
        ERC1155(
            "https://gateway.pinata.cloud/ipfs/QmS1H2woybyLg8bjadR6WVxFrktpzqh1ZzsmHrG6GTJgDM/{id}.json"
        )
    {
        contractUri = "https://gateway.pinata.cloud/ipfs/QmRi4M8wDxvwiMW7RVcb71xyaTdefZuK3VDjuTiAUwYFaN"; // json contract metadata file for OpenSea

        tokenIdToMaxSupplyPlusOne[0] = 800;
        tokenIdToMaxSupplyPlusOne[1] = 800;
        
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

    function setAllowlistsActive(bool _wlEnd) external onlyOwner {
        AL_TIMER = block.timestamp + 7 minutes;
        isAllowlistsActive = _wlEnd;
    }

    function allowlistsUsers(address[] calldata _users) public onlyOwner {
        for (uint256 i = 0; i < _users.length; i++) {
            allowlistsAddresses[_users[i]] = true;
        }
    }

    function setMaxALMint(uint256 _max) public onlyOwner {
        MAX_AL_MINT = _max;
    }

    function allowlistsMint(uint256 _id, uint256 _amount)
        external
        payable
        nonReentrant
    {
        require(
            (isAllowlistsActive),
            "allowlists is not active"
        );

        // WL_Timer is here to lock access for AL only under 24h
        require(
            (AL_TIMER > block.timestamp),
            "allowlists is finish"
        );
        require(
            allowlistsAddresses[msg.sender] == true,
            "You'r not allowlists !"
        );
        
        require(
            allowlistsPermit[msg.sender] + _amount <= MAX_AL_MINT,
            "Only 30 Nfts by allowlists address."
        );
        require(_id < MAX_TOKEN_ID_PLUS_ONE, "id must be < 2");
        require(tokenIdToExistingSupply[_id] + _amount <= 600, "All tokens minted");
        require(_amount > 0 && _amount <= max_mint_wl, "Invalid mint amount");                

        uint256 existingSupply = tokenIdToExistingSupply[_id];

        require(msg.value == _amount * CKNFT_PRICE, "incorrect ETH");
        require(msg.sender == tx.origin, "no smart contracts");

        payable(teamWallet).transfer(_amount * CKNFT_PRICE);    

        unchecked {
            existingSupply += _amount;
        }
        tokenIdToExistingSupply[_id] = existingSupply;      
        
        for (uint256 i = 0; i < _amount; i++) {
                        
            allowlistsPermit[msg.sender]++;   
        }
        _mint(msg.sender, _id, _amount, "");
    }

    function publicMint(uint256 _id, uint256 _amount) external payable {
        require(
            (AL_TIMER != 0),
            "allowlists has not started"
        );
        require(
            (AL_TIMER < block.timestamp),
            "allowlists has not finish"
        );        
        require(_id < MAX_TOKEN_ID_PLUS_ONE, "id must be < 2");

        require(
            allowlistsPermit[msg.sender] + _amount <= MAX_MINT,
            "Only 30 Nfts by address. "
        );

        uint256 existingSupply = tokenIdToExistingSupply[_id];
        require(
            existingSupply + _amount < tokenIdToMaxSupplyPlusOne[_id],
            "supply exceeded"
        );

        require(msg.value == _amount * CKNFT_PRICE, "incorrect ETH");
        require(msg.sender == tx.origin, "no smart contracts");

        payable(teamWallet).transfer(_amount * CKNFT_PRICE);
        
        unchecked {
            existingSupply += _amount;
        }
        tokenIdToExistingSupply[_id] = existingSupply;
        for (uint256 i = 0; i < _amount; i++) {
                        
           allowlistsPermit[msg.sender]++;   
        }
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

            require(_id < MAX_TOKEN_ID_PLUS_ONE, "id must be < 3");
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
}