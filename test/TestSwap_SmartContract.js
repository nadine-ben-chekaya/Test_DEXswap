const { expect } = require("chai")
const { ethers } = require("hardhat")

const DAI = "0x6B175474E89094C44Da98b954EedeAC495271d0F"
const WETH9 = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2"
const USDC = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48"

describe("SwapExamples", () => {
  let swapExamples
  let accounts
  let weth
  let dai
  let usdc

  before(async () => {
    accounts = await ethers.getSigners()
    console.log("account= ", accounts[0].address)
    console.log("balance of account= ", await ethers.provider.getBalance(accounts[0].address))
    const SwapExamples = await ethers.getContractFactory("SwapExamples")
    swapExamples = await SwapExamples.deploy()
    await swapExamples.waitForDeployment();

    //Initialize the contract using interface
    weth = await ethers.getContractAt("IWETH", WETH9) //(NameOfInterface, AddressOfContract)
    dai = await ethers.getContractAt("IERC20", DAI) // the interface for IERC20 is included in @uniswap package that i install 
    usdc = await ethers.getContractAt("IERC20", USDC)
    
  })

  const logBalances = async () => {
    const ethBalance = await ethers.provider.getBalance(accounts[0].address);
    const wethBalance = await weth.balanceOf(accounts[0].address)
    const daiBalance = await dai.balanceOf(accounts[0].address)
    console.log('--------------------')
    console.log('ETH Balance:', ethers.formatUnits(ethBalance, 18))
    console.log('WETH Balance:', ethers.formatUnits(wethBalance, 18))
    console.log('DAI Balance:', ethers.formatUnits(daiBalance, 6))
    console.log('--------------------')
  }

  it("swapExactInputSingle", async () => {
    const amountIn = 10n ** 18n // n as BigInt (= 1eth)

    // Deposit WETH (send 1eth to wrappedEth contract (weth) )
    await weth.deposit({ value: amountIn })
    await weth.approve(swapExamples.target, amountIn) // because weth is erc20 we need to approve for our contract before we can passed into the swap
    console.log("target:",swapExamples.target)
    console.log("Balances Before swap:")
    await logBalances()
    // Swap
    //const amountIn2 = ethers.parseUnits('1', 18)
    await swapExamples.swapExactInputSingle(amountIn)
    console.log("Balances After swap:")
    await logBalances()
  })

  it("swapExactOutputSingle", async () => {
    const wethAmountInMax = 10n ** 18n
    const daiAmountOut = 100n * 10n ** 18n

    // Deposit WETH
    await weth.deposit({ value: wethAmountInMax })
    await weth.approve(swapExamples.target, wethAmountInMax)
    console.log("Balances Before swap:")
    await logBalances()

    // Swap
    await swapExamples.swapExactOutputSingle(daiAmountOut, wethAmountInMax)
    console.log("Balances After swap:")
    await logBalances()
  })


})