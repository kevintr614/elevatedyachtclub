// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Supply.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract Elevated_Yacht_Club is ERC1155, ERC1155Supply, ReentrancyGuard, Ownable {
    uint256 public constant FOUNDER = 0;
    uint256 public constant VIP = 1;
    uint256[] public maxSupply = [400,1600]; //total supply
    uint256[] public totSupply = [50,100]; //including owner mint on deploy
    uint256[] public presalePrice = [2.5 ether,0.45 ether]; //prices
    uint256[] public mintPrice = [3.5 ether,0.65 ether]; //prices
    uint256[] public currentPrice=[2.5 ether,0.45 ether];
    uint256 public maxMintAmount = 2;
    bool[] public presale = [true,true];
    bool[] public paused = [false,false];
    address public royaltyAddress = 0x7B392a9E2f92eA938431BeCa3D7999B4B5944155; //Change with owner's address
    uint256 public royalty = 75; //==>7.5%
    mapping(address => uint256) public addressClaimedVIP; // mark if claimed
    mapping(address => uint256) public addressClaimedFounder; // mark if claimed
    

    constructor() ERC1155("ipfs://QmRMKSSTFcLFGYvfHVVwg1WpL6CJmi7zrjxBgBzwwtmGP7/{id}.json"){
        _mint(msg.sender, FOUNDER, totSupply[0], "");
        _mint(msg.sender, VIP, totSupply[1], "");
    }

    function Mint(address account, uint256 id, uint256 amount) external payable nonReentrant {
        require(!paused[id], "The Sale is paused!");
        require(id<=maxSupply.length, "Token doesn't exists!");
        require(amount > 0, "Quantity should be above 0!");
        require(totSupply[id] < maxSupply[id], "Sold out!");
        require(totSupply[id] + amount <= maxSupply[id], "Can not Mint that many!");
        //if(presale[id]) require(presalePrice[id] * amount <= msg.value, "Not enough ethers sent!");
        //else require(mintPrice[id] * amount <= msg.value, "Not enough ethers sent!");
        require(currentPrice[id] * amount <= msg.value, "Not enough ethers sent!");
        if(id==0){
            require(addressClaimedFounder[_msgSender()]+amount <= maxMintAmount, "Already Minted or Minting more than allowed!");
            addressClaimedFounder[account]=addressClaimedFounder[account]+amount;
        } else if(id==1){
            require(addressClaimedVIP[_msgSender()]+amount <= maxMintAmount, "Already Minted or Minting more than allowed!");
            addressClaimedVIP[account]=addressClaimedVIP[account]+amount;
        } 
        totSupply[id]+=amount;
        _mint(account, id, amount, "");
    }

    function mintForAddress(address account, uint256 id, uint256 amount) public onlyOwner {
        require(id<=maxSupply.length, "Token doesn't exists!");
        require(amount > 0, "Quantity should be above 0!");
        require(totSupply[id] == maxSupply[id], "Sold out!");
        require(totSupply[id] + amount <= maxSupply[id], "Can not Mint that many!");
        totSupply[id]+=amount;
        _mint(account, id, amount, "");
    }

    function setURI(string memory newuri) public onlyOwner {
        _setURI(newuri);
    }

    function togglePause(uint256 id) public onlyOwner {
        paused[id] = !paused[id];
    }

    function togglePrivate(uint256 id) public onlyOwner {
        presale[id] = !presale[id];
        if(presale[id]) currentPrice[id]=presalePrice[id];
        else currentPrice[id]=mintPrice[id];
    }

    function setPresalePrice(uint256 id, uint256 _amount) public onlyOwner {
        presalePrice[id] = _amount;
        if(presale[id]) currentPrice[id] = _amount;
    }

    function setMintPrice(uint256 id, uint256 _amount) public onlyOwner {
        mintPrice[id] = _amount;
        if(!presale[id]) currentPrice[id] = _amount;
    }

    function setMaxSupply(uint256 id, uint256 _amount) public onlyOwner {
        maxSupply[id] = _amount;
    }

    function setRoyaltyAddress(address _royaltyAddress) public onlyOwner {
        royaltyAddress = _royaltyAddress;
    }

    function setRoyaly(uint256 _royalty) external onlyOwner {
            royalty = _royalty;
    }

    // The following functions are overrides required by Solidity.
    function _beforeTokenTransfer(address operator, address from, address to, uint256[] memory ids, uint256[] memory amounts, bytes memory data) internal override(ERC1155, ERC1155Supply) {
        super._beforeTokenTransfer(operator, from, to, ids, amounts, data);
    }

    function withdraw() public onlyOwner nonReentrant {
        (bool os, ) = payable(owner()).call{value: address(this).balance}('');
        require(os);
    }
}