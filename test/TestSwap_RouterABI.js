const { expect } = require("chai")
const { ethers } = require("hardhat")
const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");
const routerArtifact = require('@uniswap/v2-periphery/build/UniswapV2Router02.json')
const { abi: UniV3SwapRouterABI} = require('@uniswap/v3-periphery/artifacts/contracts/interfaces/ISwapRouter.sol/ISwapRouter.json')
const erc20Abi = require("../erc20.json")
const wethArtifact = require("../weth.json")
const {routerABI,routerABI_PANCAKE, routerABI_SUSHI} = require("./AbiList");

WETH_ADDRESS= '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2'
USDT_ADDRESS= '0xdAC17F958D2ee523a2206206994597C13D831ec7'
ROUTER_ADDRESS= '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D'
UNISWAPV3_ROUTER_ADDRESS= '0xE592427A0AEce92De3Edee1F18E0157C05861564'
PANCAKE_ROUTER_ADDRESS= '0xEfF92A263d31888d860bD50809A8D171709b7b1c'
SUSHI_ROUTER_ADDRESS= '0xd9e1cE17f2641f24aE83637ab66a2cca9C378B9F'



describe("SWAP TEST",() => {
    const deployFixture= async ()=>{
        const provider = new ethers.JsonRpcProvider('http://127.0.0.1:8545/')
        const wallet = new ethers.Wallet('0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80')//private key for first account in hardhat network
        const signer = wallet.connect(provider)
        const usdt = new ethers.Contract(USDT_ADDRESS, erc20Abi, provider)
        const weth = new ethers.Contract(WETH_ADDRESS, wethArtifact.abi, provider)
        return {
            provider,
            signer,
            usdt,
            weth,
        };
    }

    it("Test swap with UniswapV2",async () =>{
        const {
            provider,
            signer,
            usdt,
            weth,
        } = await loadFixture(deployFixture);
        const router = new ethers.Contract(ROUTER_ADDRESS, routerABI, provider)
        //uniswapv2
        await signer.sendTransaction({
            to: WETH_ADDRESS,
            value: ethers.parseUnits('5', 18),
        })
        
        /********Display Balance Before Swap***********/
        const ethBalance = await provider.getBalance(signer.address)
        const usdtBalance = await usdt.balanceOf(signer.address)
        const wethBalance = await weth.balanceOf(signer.address)
        console.log('--------------------')
        console.log('ETH Balance:', ethers.formatUnits(ethBalance, 18))
        console.log('WETH Balance:', ethers.formatUnits(wethBalance, 18))
        console.log('USDT Balance:', ethers.formatUnits(usdtBalance, 6))
        console.log('--------------------')
        /****************************/
        
        const amountIn = ethers.parseUnits('1', 18)
        const tx1 = await weth.connect(signer).approve(router.target, amountIn)
        tx1.wait()

        const tx2 = await router.connect(signer).swapExactTokensForTokens(
            amountIn,
            0,
            [WETH_ADDRESS, USDT_ADDRESS],
            signer.address,
            Math.floor(Date.now() / 1000) + (60 * 10),
            {
                gasLimit: 1000000
            }
        )
        await tx2.wait()

        /********Display Balance After Swap***********/
        const ethBalance_after = await provider.getBalance(signer.address)
        const usdtBalance_after = await usdt.balanceOf(signer.address)
        const wethBalance_after = await weth.balanceOf(signer.address)
        console.log('--------------------')
        console.log('ETH Balance:', ethers.formatUnits(ethBalance_after, 18))
        console.log('WETH Balance:', ethers.formatUnits(wethBalance_after, 18))
        console.log('USDT Balance:', ethers.formatUnits(usdtBalance_after, 6))
        console.log('--------------------')
        /****************************/
     

    });


    it("Test swap with UniswapV3",async () =>{
        const {
            provider,
            signer,
            usdt,
            weth,
        } = await loadFixture(deployFixture);
        const routerV3 = new ethers.Contract(UNISWAPV3_ROUTER_ADDRESS, UniV3SwapRouterABI, provider)
        //uniswapv2
        await signer.sendTransaction({
            to: WETH_ADDRESS,
            value: ethers.parseUnits('5', 18),
        })
        
        /********Display Balance Before Swap***********/
        const ethBalance = await provider.getBalance(signer.address)
        const usdtBalance = await usdt.balanceOf(signer.address)
        const wethBalance = await weth.balanceOf(signer.address)
        console.log('--------------------')
        console.log('ETH Balance:', ethers.formatUnits(ethBalance, 18))
        console.log('WETH Balance:', ethers.formatUnits(wethBalance, 18))
        console.log('USDT Balance:', ethers.formatUnits(usdtBalance, 6))
        console.log('--------------------')
        /****************************/
        
        const amountIn = ethers.parseUnits('1', 18)
        const tx1 = await weth.connect(signer).approve(routerV3.target, amountIn)
        tx1.wait()
        
        const params = {
            tokenIn: WETH_ADDRESS,
            tokenOut: USDT_ADDRESS,
            fee: 3000,
            recipient: signer.address,
            deadline: Math.floor(Date.now() / 1000) + (60 * 10),
            amountIn: amountIn,
            amountOutMinimum: 0,
            sqrtPriceLimitX96: 0,
        }

        const tx2 = await routerV3.connect(signer).exactInputSingle(
            params,
            {
                gasLimit: 1000000
            }
        )
        await tx2.wait()

        /********Display Balance After Swap***********/
        const ethBalance_after = await provider.getBalance(signer.address)
        const usdtBalance_after = await usdt.balanceOf(signer.address)
        const wethBalance_after = await weth.balanceOf(signer.address)
        console.log('--------------------')
        console.log('ETH Balance:', ethers.formatUnits(ethBalance_after, 18))
        console.log('WETH Balance:', ethers.formatUnits(wethBalance_after, 18))
        console.log('USDT Balance:', ethers.formatUnits(usdtBalance_after, 6))
        console.log('--------------------')
        /****************************/
     

    });

    it("Test swap with PancakeSwap",async () =>{
        const {
            provider,
            signer,
            usdt,
            weth,
        } = await loadFixture(deployFixture);
        const router_pancake = new ethers.Contract(PANCAKE_ROUTER_ADDRESS, routerABI_PANCAKE, provider)
      
        await signer.sendTransaction({
            to: WETH_ADDRESS,
            value: ethers.parseUnits('5', 18),
        })
        
        /********Display Balance Before Swap***********/
        const ethBalance = await provider.getBalance(signer.address)
        const usdtBalance = await usdt.balanceOf(signer.address)
        const wethBalance = await weth.balanceOf(signer.address)
        console.log('--------------------')
        console.log('ETH Balance:', ethers.formatUnits(ethBalance, 18))
        console.log('WETH Balance:', ethers.formatUnits(wethBalance, 18))
        console.log('USDT Balance:', ethers.formatUnits(usdtBalance, 6))
        console.log('--------------------')
        /****************************/
        
        const amountIn = ethers.parseUnits('1', 18)
        const tx1 = await weth.connect(signer).approve(router_pancake.target, amountIn)
        tx1.wait()
        const tx2 = await router_pancake.connect(signer).swapExactTokensForTokens(
            amountIn,
            0,
            [WETH_ADDRESS, USDT_ADDRESS],
            signer.address,
            Math.floor(Date.now() / 1000) + (60 * 10),
            {
                gasLimit: 1000000
            }
        )
        await tx2.wait()

        /********Display Balance After Swap***********/
        const ethBalance_after = await provider.getBalance(signer.address)
        const usdtBalance_after = await usdt.balanceOf(signer.address)
        const wethBalance_after = await weth.balanceOf(signer.address)
        console.log('--------------------')
        console.log('ETH Balance:', ethers.formatUnits(ethBalance_after, 18))
        console.log('WETH Balance:', ethers.formatUnits(wethBalance_after, 18))
        console.log('USDT Balance:', ethers.formatUnits(usdtBalance_after, 6))
        console.log('--------------------')
        /****************************/
   
    });

    it("Test swap with SushiSwap",async () =>{
        
        const {
            provider,
            signer,
            usdt,
            weth,
        } = await loadFixture(deployFixture);
        const router_sushi = new ethers.Contract(SUSHI_ROUTER_ADDRESS, routerABI_SUSHI, provider)
       
        await signer.sendTransaction({
            to: WETH_ADDRESS,
            value: ethers.parseUnits('5', 18),
        })
        
        /********Display Balance Before Swap***********/
        const ethBalance = await provider.getBalance(signer.address)
        const usdtBalance = await usdt.balanceOf(signer.address)
        const wethBalance = await weth.balanceOf(signer.address)
        console.log('--------------------')
        console.log('ETH Balance:', ethers.formatUnits(ethBalance, 18))
        console.log('WETH Balance:', ethers.formatUnits(wethBalance, 18))
        console.log('USDT Balance:', ethers.formatUnits(usdtBalance, 6))
        console.log('--------------------')
        /****************************/
        
        const amountIn = ethers.parseUnits('1', 18)
        const tx1 = await weth.connect(signer).approve(router_sushi.target, amountIn)
        tx1.wait()
        
        const tx2 = await router_sushi.connect(signer).swapExactTokensForTokens(
            amountIn,
            0,
            [WETH_ADDRESS, USDT_ADDRESS],
            signer.address,
            Math.floor(Date.now() / 1000) + (60 * 10),
            {
                gasLimit: 1000000
            }
        )
        await tx2.wait()

        /********Display Balance After Swap***********/
        const ethBalance_after = await provider.getBalance(signer.address)
        const usdtBalance_after = await usdt.balanceOf(signer.address)
        const wethBalance_after = await weth.balanceOf(signer.address)
        console.log('--------------------')
        console.log('ETH Balance:', ethers.formatUnits(ethBalance_after, 18))
        console.log('WETH Balance:', ethers.formatUnits(wethBalance_after, 18))
        console.log('USDT Balance:', ethers.formatUnits(usdtBalance_after, 6))
        console.log('--------------------')
        /****************************/

    });


});