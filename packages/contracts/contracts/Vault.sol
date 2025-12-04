// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "hardhat/console.sol";

interface IStrategyRouter {
    function getStrategies() external view returns (address[] memory);

    function withdrawFromStrategies(uint256) external;
}

interface IStrategy {
    function strategyBalance() external view returns (uint256);
}

contract Vault is ERC20, Ownable {
    using SafeERC20 for IERC20;

    IERC20 public immutable asset;
    uint256 public performanceFeeBps;
    address public feeRecipient;
    uint256 public withdrawFeeBps;
    mapping(address => uint256) public netDeposited;
    mapping(address => uint256) public totalWithdrawn;


    event Deposit(address indexed user, uint256 amount, uint256 shares);
    event Withdraw(address indexed user, uint256 amount, uint256 shares);

    constructor(
        address _asset,
        address _feeRecipient,
        uint256 _performanceBps,
        uint256 _withdrawFeeBps
    ) ERC20("Vault Share Token", "VST") Ownable(msg.sender) {
        asset = IERC20(_asset);
        feeRecipient = _feeRecipient;
        performanceFeeBps = _performanceBps;
        withdrawFeeBps = _withdrawFeeBps;
    }

    function totalAssets() public view returns (uint256) {
        return asset.balanceOf(address(this));
    }

    function getNAV() external view returns (uint256) {
        return totalManagedAssets();
    }

    function availableLiquidity() external view returns (uint256) {
        return asset.balanceOf(address(this));
    }

    function convertToShares(uint256 assets) public view returns (uint256) {
        uint256 s = totalSupply();
        return s == 0 ? assets : (assets * s) / totalManagedAssets();
    }

    function convertToAssets(uint256 shares) public view returns (uint256) {
        uint256 s = totalSupply();
        return s == 0 ? shares : (shares * totalManagedAssets()) / s;
    }

    function userGrowth(address user) public view returns (int256) {
        uint256 deposited = netDeposited[user];
        if (deposited == 0) return 0;

        uint256 withdrawn = totalWithdrawn[user];
        uint256 currentValue = convertToAssets(balanceOf(user));

        int256 pnl = int256(currentValue + withdrawn) - int256(deposited);
        return pnl;
    }

    function userGrowthPercent(address user) external view returns (int256) {
        uint256 deposited = netDeposited[user];
        if (deposited == 0) return 0;

        int256 pnl = userGrowth(user);

        return (pnl * 1e18) / int256(deposited);
    }



    function deposit(uint256 amount) external returns (uint256) {
        uint256 shares = convertToShares(amount);

        asset.safeTransferFrom(msg.sender, address(this), amount);
        _mint(msg.sender, shares);

        // Track deposit history
        netDeposited[msg.sender] += amount;

        emit Deposit(msg.sender, amount, shares);
        return shares;
    }


    function withdraw(uint256 shares) external returns (uint256 assetsOut) {
        require(shares > 0, "zero shares");
        require(balanceOf(msg.sender) >= shares, "not enough shares");

        // 1. Convert shares → assets
        assetsOut = convertToAssets(shares);
        require(assetsOut > 0, "zero assets out");

        // 2. Burn user's shares
        _burn(msg.sender, shares);

        // 3. Pull assets from strategies if needed
        uint256 vaultBal = asset.balanceOf(address(this));

        if (vaultBal < assetsOut) {
            uint256 needed = assetsOut - vaultBal;
            require(router != address(0), "router not set");

            IStrategyRouter(router).withdrawFromStrategies(needed);
            require(
                asset.balanceOf(address(this)) >= assetsOut,
                "not enough liquidity after pull"
            );
        }

        // ---------------------------------------------
        // 4. APPLY WITHDRAWAL FEE
        // ---------------------------------------------
        uint256 fee = (assetsOut * withdrawFeeBps) / 10000;
        uint256 userAmount = assetsOut - fee;

        if (fee > 0) {
            asset.safeTransfer(feeRecipient, fee);
        }

        // ---------------------------------------------
        // 5. Send final amount to user
        // ---------------------------------------------
        asset.safeTransfer(msg.sender, userAmount);

        // Track lifetime withdrawals for growth calculation
        totalWithdrawn[msg.sender] += userAmount;

        emit Withdraw(msg.sender, userAmount, shares);
        return userAmount;
    }


    // ─────────────────────────────────────────────
    //   STRATEGY ROUTER ACCESS (ONLY ROUTER)
    // ─────────────────────────────────────────────
    address public router;

    function setRouter(address _router) external onlyOwner {
        router = _router;
    }

    modifier onlyRouter() {
        require(msg.sender == router, "not router");
        _;
    }

    // router moves funds FROM vault → to strategy
    function moveToStrategy(
        address strategy,
        uint256 amount
    ) external onlyRouter {
        console.log("Approving ", amount, " to StrategyUniV3....");
        asset.approve(strategy, amount);
        console.log("Transferring LINK from Vault to StrategyUniV3....");
        asset.safeTransfer(strategy, amount);
        console.log("Transfer Successfull in Vault.sol...");
    }

    // router pulls funds FROM strategy → to vault
    function receiveFromStrategy(uint256 amount) external onlyRouter {
        // strategies call asset.transfer(vault, amount)
        // the vault doesn't pull manually — it just expects transfer
        // this function exists only for router-triggered accounting
    }

    function handleHarvestProfit(uint256 profit) external {
        require(msg.sender == router, "not router");

        if (profit == 0) return;

        uint256 fee = (profit * performanceFeeBps) / 10000;

        if (fee > 0) {
            asset.safeTransfer(feeRecipient, fee);
        }
    }

    function totalManagedAssets() public view returns (uint256) {
        uint256 total = asset.balanceOf(address(this));

        if (router != address(0)) {
            address[] memory strats = IStrategyRouter(router).getStrategies();

            for (uint256 i = 0; i < strats.length; i++) {
                total += IStrategy(strats[i]).strategyBalance();
            }
        }

        return total;
    }
}
