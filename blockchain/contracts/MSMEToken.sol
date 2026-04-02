// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title MSMEToken
 * @dev ERC-20 token representing fractional equity in an Indian MSME
 * @notice EDUCATIONAL PROTOTYPE ONLY - Not a real security offering
 * @notice Deployed on Polygon Amoy Testnet ONLY
 */
contract MSMEToken is ERC20, ERC20Burnable, Ownable, ReentrancyGuard {
    
    struct MSMEInfo {
        string name;
        string category;
        string city;
        string gstNumber;
        uint256 targetAmount;
        uint256 equityOffered;
        uint256 amountRaised;
        uint256 foundingYear;
        string ipfsHash;
        bool isFundraising;
        bool targetReached;
        bool isRefunded;
    }

    struct VestingSchedule {
        uint256 totalAmount;
        uint256 releasedAmount;
        uint256 startTime;
        uint256 duration;
        bool exists;
    }

    struct Proposal {
        uint256 id;
        string title;
        string description;
        address proposer;
        uint256 forVotes;
        uint256 againstVotes;
        uint256 startTime;
        uint256 endTime;
        bool executed;
        mapping(address => bool) hasVoted;
    }

    MSMEInfo public msmeInfo;
    
    mapping(address => bool) public isWhitelisted;
    address[] public whitelistedAddresses;
    
    mapping(address => VestingSchedule) public vestingSchedules;
    
    uint256 public proposalCount;
    mapping(uint256 => Proposal) public proposals;
    uint256 public constant VOTING_PERIOD = 3 days;
    
    uint256 public totalDividendsDistributed;
    mapping(address => uint256) public dividendsReceived;
    
    mapping(address => uint256) public investmentAmount;
    address[] public investors;
    
    uint256 public constant PLATFORM_FEE_PERCENT = 2;
    address public platformWallet;
    
    uint256 public tokenPrice;
    
    bool public paused;

    event TokensPurchased(address indexed buyer, uint256 amount, uint256 cost, uint256 timestamp);
    event DividendDistributed(uint256 totalAmount, uint256 recipientCount, uint256 timestamp);
    event DividendReceived(address indexed recipient, uint256 amount, uint256 timestamp);
    event InvestorWhitelisted(address indexed investor, uint256 timestamp);
    event InvestorRemovedFromWhitelist(address indexed investor, uint256 timestamp);
    event FundraisingStarted(uint256 targetAmount, uint256 timestamp);
    event FundraisingCompleted(uint256 amountRaised, uint256 timestamp);
    event RefundIssued(address indexed investor, uint256 amount, uint256 timestamp);
    event AllRefundsCompleted(uint256 totalRefunded, uint256 timestamp);
    event ProposalCreated(uint256 indexed proposalId, string title, address proposer, uint256 timestamp);
    event VoteCast(uint256 indexed proposalId, address indexed voter, bool support, uint256 weight, uint256 timestamp);
    event ProposalExecuted(uint256 indexed proposalId, bool passed, uint256 timestamp);
    event VestingCreated(address indexed beneficiary, uint256 amount, uint256 duration, uint256 timestamp);
    event VestingReleased(address indexed beneficiary, uint256 amount, uint256 timestamp);
    event ContractPaused(uint256 timestamp);
    event ContractUnpaused(uint256 timestamp);
    event IPFSHashUpdated(string oldHash, string newHash, uint256 timestamp);

    modifier whenNotPaused() {
        require(!paused, "Contract is paused");
        _;
    }

    modifier onlyWhitelisted() {
        require(isWhitelisted[msg.sender], "Not whitelisted - KYC required");
        _;
    }

    modifier onlyDuringFundraising() {
        require(msmeInfo.isFundraising, "Fundraising is not active");
        require(!msmeInfo.isRefunded, "Project has been refunded");
        _;
    }

    constructor(
        string memory _tokenName,
        string memory _tokenSymbol,
        string memory _msmeName,
        string memory _category,
        string memory _city,
        string memory _gstNumber,
        uint256 _targetAmount,
        uint256 _equityOffered,
        uint256 _foundingYear,
        string memory _ipfsHash,
        uint256 _tokenPrice,
        address _platformWallet,
        address _founderWallet
    ) ERC20(_tokenName, _tokenSymbol) Ownable(_founderWallet) {
        require(_targetAmount > 0, "Target must be greater than 0");
        require(_equityOffered > 0 && _equityOffered <= 20, "Equity must be 1-20%");
        require(_tokenPrice > 0, "Token price must be greater than 0");
        require(_platformWallet != address(0), "Invalid platform wallet");
        require(_founderWallet != address(0), "Invalid founder wallet");

        msmeInfo = MSMEInfo({
            name: _msmeName,
            category: _category,
            city: _city,
            gstNumber: _gstNumber,
            targetAmount: _targetAmount,
            equityOffered: _equityOffered,
            amountRaised: 0,
            foundingYear: _foundingYear,
            ipfsHash: _ipfsHash,
            isFundraising: true,
            targetReached: false,
            isRefunded: false
        });

        tokenPrice = _tokenPrice;
        platformWallet = _platformWallet;
        paused = false;

        isWhitelisted[_founderWallet] = true;
        whitelistedAddresses.push(_founderWallet);
        isWhitelisted[_platformWallet] = true;
        whitelistedAddresses.push(_platformWallet);

        emit FundraisingStarted(_targetAmount, block.timestamp);
    }

    function addToWhitelist(address _investor) external onlyOwner {
        require(_investor != address(0), "Invalid address");
        require(!isWhitelisted[_investor], "Already whitelisted");
        isWhitelisted[_investor] = true;
        whitelistedAddresses.push(_investor);
        emit InvestorWhitelisted(_investor, block.timestamp);
    }

    function addMultipleToWhitelist(address[] calldata _investors) external onlyOwner {
        for (uint256 i = 0; i < _investors.length; i++) {
            if (!isWhitelisted[_investors[i]] && _investors[i] != address(0)) {
                isWhitelisted[_investors[i]] = true;
                whitelistedAddresses.push(_investors[i]);
                emit InvestorWhitelisted(_investors[i], block.timestamp);
            }
        }
    }

    function removeFromWhitelist(address _investor) external onlyOwner {
        require(isWhitelisted[_investor], "Not whitelisted");
        isWhitelisted[_investor] = false;
        emit InvestorRemovedFromWhitelist(_investor, block.timestamp);
    }

    function buyTokens() external payable whenNotPaused onlyWhitelisted onlyDuringFundraising nonReentrant {
        require(msg.value > 0, "Must send MATIC to buy tokens");
        require(msg.value >= tokenPrice, "Minimum purchase is 1 token");

        uint256 tokenAmount = (msg.value * 10**decimals()) / tokenPrice;
        require(tokenAmount > 0, "Token amount too small");

        if (investmentAmount[msg.sender] == 0) {
            investors.push(msg.sender);
        }
        investmentAmount[msg.sender] += msg.value;
        msmeInfo.amountRaised += msg.value;

        _mint(msg.sender, tokenAmount);

        emit TokensPurchased(msg.sender, tokenAmount, msg.value, block.timestamp);

        if (msmeInfo.amountRaised >= msmeInfo.targetAmount) {
            msmeInfo.targetReached = true;
            msmeInfo.isFundraising = false;
            
            uint256 platformFee = (msmeInfo.amountRaised * PLATFORM_FEE_PERCENT) / 100;
            uint256 founderAmount = msmeInfo.amountRaised - platformFee;
            
            (bool feeSuccess, ) = platformWallet.call{value: platformFee}("");
            require(feeSuccess, "Platform fee transfer failed");
            
            (bool founderSuccess, ) = owner().call{value: founderAmount}("");
            require(founderSuccess, "Founder transfer failed");
            
            emit FundraisingCompleted(msmeInfo.amountRaised, block.timestamp);
        }
    }

    function distributeDividends() external payable onlyOwner whenNotPaused nonReentrant {
        require(msg.value > 0, "Must send MATIC for dividends");
        require(totalSupply() > 0, "No tokens in circulation");

        uint256 totalDistributed = 0;
        uint256 recipientCount = 0;

        for (uint256 i = 0; i < investors.length; i++) {
            address investor = investors[i];
            uint256 balance = balanceOf(investor);
            
            if (balance > 0) {
                uint256 dividend = (msg.value * balance) / totalSupply();
                
                if (dividend > 0) {
                    dividendsReceived[investor] += dividend;
                    totalDistributed += dividend;
                    recipientCount++;
                    
                    (bool success, ) = investor.call{value: dividend}("");
                    require(success, "Dividend transfer failed");
                    
                    emit DividendReceived(investor, dividend, block.timestamp);
                }
            }
        }

        totalDividendsDistributed += totalDistributed;
        
        uint256 remaining = msg.value - totalDistributed;
        if (remaining > 0) {
            (bool refundSuccess, ) = owner().call{value: remaining}("");
            require(refundSuccess, "Dust refund failed");
        }

        emit DividendDistributed(totalDistributed, recipientCount, block.timestamp);
    }

    function issueRefunds() external onlyOwner nonReentrant {
        require(!msmeInfo.targetReached, "Target was reached, cannot refund");
        require(!msmeInfo.isRefunded, "Already refunded");
        require(msmeInfo.isFundraising, "Fundraising not active");

        msmeInfo.isFundraising = false;
        msmeInfo.isRefunded = true;

        uint256 totalRefunded = 0;

        for (uint256 i = 0; i < investors.length; i++) {
            address investor = investors[i];
            uint256 amount = investmentAmount[investor];
            
            if (amount > 0) {
                investmentAmount[investor] = 0;
                
                uint256 tokenBalance = balanceOf(investor);
                if (tokenBalance > 0) {
                    _burn(investor, tokenBalance);
                }
                
                totalRefunded += amount;
                
                (bool success, ) = investor.call{value: amount}("");
                require(success, "Refund transfer failed");
                
                emit RefundIssued(investor, amount, block.timestamp);
            }
        }

        emit AllRefundsCompleted(totalRefunded, block.timestamp);
    }

    function createProposal(
        string calldata _title,
        string calldata _description
    ) external whenNotPaused onlyWhitelisted returns (uint256) {
        require(balanceOf(msg.sender) > 0, "Must hold tokens to create proposal");
        require(bytes(_title).length > 0, "Title cannot be empty");

        proposalCount++;
        Proposal storage newProposal = proposals[proposalCount];
        newProposal.id = proposalCount;
        newProposal.title = _title;
        newProposal.description = _description;
        newProposal.proposer = msg.sender;
        newProposal.startTime = block.timestamp;
        newProposal.endTime = block.timestamp + VOTING_PERIOD;
        newProposal.executed = false;

        emit ProposalCreated(proposalCount, _title, msg.sender, block.timestamp);
        return proposalCount;
    }

    function vote(uint256 _proposalId, bool _support) external whenNotPaused onlyWhitelisted {
        Proposal storage proposal = proposals[_proposalId];
        require(proposal.id != 0, "Proposal does not exist");
        require(block.timestamp <= proposal.endTime, "Voting period ended");
        require(!proposal.hasVoted[msg.sender], "Already voted");
        require(balanceOf(msg.sender) > 0, "Must hold tokens to vote");

        uint256 weight = balanceOf(msg.sender);
        proposal.hasVoted[msg.sender] = true;

        if (_support) {
            proposal.forVotes += weight;
        } else {
            proposal.againstVotes += weight;
        }

        emit VoteCast(_proposalId, msg.sender, _support, weight, block.timestamp);
    }

    function executeProposal(uint256 _proposalId) external onlyOwner {
        Proposal storage proposal = proposals[_proposalId];
        require(proposal.id != 0, "Proposal does not exist");
        require(block.timestamp > proposal.endTime, "Voting still active");
        require(!proposal.executed, "Already executed");

        proposal.executed = true;
        bool passed = proposal.forVotes > proposal.againstVotes;

        emit ProposalExecuted(_proposalId, passed, block.timestamp);
    }

    function createVesting(
        address _beneficiary,
        uint256 _amount,
        uint256 _duration
    ) external onlyOwner {
        require(_beneficiary != address(0), "Invalid beneficiary");
        require(_amount > 0, "Amount must be greater than 0");
        require(_duration > 0, "Duration must be greater than 0");
        require(!vestingSchedules[_beneficiary].exists, "Vesting already exists");

        _mint(address(this), _amount);

        vestingSchedules[_beneficiary] = VestingSchedule({
            totalAmount: _amount,
            releasedAmount: 0,
            startTime: block.timestamp,
            duration: _duration,
            exists: true
        });

        emit VestingCreated(_beneficiary, _amount, _duration, block.timestamp);
    }

    function releaseVestedTokens() external whenNotPaused nonReentrant {
        VestingSchedule storage schedule = vestingSchedules[msg.sender];
        require(schedule.exists, "No vesting schedule found");

        uint256 elapsed = block.timestamp - schedule.startTime;
        uint256 vested;

        if (elapsed >= schedule.duration) {
            vested = schedule.totalAmount;
        } else {
            vested = (schedule.totalAmount * elapsed) / schedule.duration;
        }

        uint256 releasable = vested - schedule.releasedAmount;
        require(releasable > 0, "No tokens to release");

        schedule.releasedAmount += releasable;
        _transfer(address(this), msg.sender, releasable);

        emit VestingReleased(msg.sender, releasable, block.timestamp);
    }

    function pause() external onlyOwner {
        paused = true;
        emit ContractPaused(block.timestamp);
    }

    function unpause() external onlyOwner {
        paused = false;
        emit ContractUnpaused(block.timestamp);
    }

    function updateIPFSHash(string calldata _newHash) external onlyOwner {
        string memory oldHash = msmeInfo.ipfsHash;
        msmeInfo.ipfsHash = _newHash;
        emit IPFSHashUpdated(oldHash, _newHash, block.timestamp);
    }

    function getInvestorCount() external view returns (uint256) {
        return investors.length;
    }

    function getWhitelistedCount() external view returns (uint256) {
        return whitelistedAddresses.length;
    }

    function getAllInvestors() external view returns (address[] memory) {
        return investors;
    }

    function getProposalVotes(uint256 _proposalId) external view returns (
        uint256 forVotes, uint256 againstVotes, bool isActive, bool isExecuted
    ) {
        Proposal storage proposal = proposals[_proposalId];
        return (proposal.forVotes, proposal.againstVotes, block.timestamp <= proposal.endTime, proposal.executed);
    }

    function getVestingInfo(address _beneficiary) external view returns (
        uint256 totalAmount, uint256 releasedAmount, uint256 startTime, uint256 duration, bool exists
    ) {
        VestingSchedule storage schedule = vestingSchedules[_beneficiary];
        return (schedule.totalAmount, schedule.releasedAmount, schedule.startTime, schedule.duration, schedule.exists);
    }

    function getMSMEInfo() external view returns (
        string memory name, string memory category, string memory city, string memory gstNumber,
        uint256 targetAmount, uint256 equityOffered, uint256 amountRaised,
        bool isFundraising, bool targetReached, bool isRefunded
    ) {
        return (
            msmeInfo.name, msmeInfo.category, msmeInfo.city, msmeInfo.gstNumber,
            msmeInfo.targetAmount, msmeInfo.equityOffered, msmeInfo.amountRaised,
            msmeInfo.isFundraising, msmeInfo.targetReached, msmeInfo.isRefunded
        );
    }

    function _update(address from, address to, uint256 value) internal override {
        if (from != address(0) && to != address(0) && to != address(this) && from != address(this)) {
            require(isWhitelisted[from], "Sender not whitelisted");
            require(isWhitelisted[to], "Receiver not whitelisted");
            require(!paused, "Transfers paused");
        }
        super._update(from, to, value);
    }

    receive() external payable {}
}