import { contractAddresses, abi, abitoken } from "../constants"
import { useMoralis, useWeb3Contract } from "react-moralis"
import { useRef, useEffect, useState } from 'react'
import { useNotification } from "web3uikit"
import { ethers } from "ethers"

export default function GetLotteryToken2() {
//    const {isWeb3Enabled} = useMoralis()
    const { Moralis, isWeb3Enabled, chainId: chainIdHex } = useMoralis()
    // These get re-rendered every time due to our connect button!
    const chainId = parseInt(chainIdHex)
    //console.log(`ChainId is ${chainId}`)
    const lotteryAddress = chainId in contractAddresses ? contractAddresses[chainId][0] : null
    const tokenAddress = chainId in contractAddresses ? contractAddresses[chainId][1] : null
//    console.log(`lotteryAddress is ${lotteryAddress}`)
//    console.log(`tokenAddress is ${tokenAddress}`)

//    const user = await Moralis.User.current();

    const inputTokenAmount = useRef(0);
    const inputApproveToken = useRef(0);


    const[lotteryId, setLotteryIdLocal] = useState("0")
    const[blotTokenAddress, setBlotTokenAddressLocal] = useState("0")
    const[tokenAllowance, setTokenAllowanceLocal] = useState("0")
    const[blockNumber, setBlockLocal] = useState("0")
    const[tokenBalanceSender, setTokenBalanceSenderLocal] = useState("0")
    const[tokenBalanceContract, setTokenBalanceContractLocal] = useState("0")


    const { runContractFunction: approve } = useWeb3Contract ({
        abi: abitoken,
        contractAddress: tokenAddress,
        functionName: "approve",
        params: {
            spender: lotteryAddress,
            amount: inputApproveToken.current.value
        },
//        msgValue: "0",
    })

    const { runContractFunction: buyTicket } = useWeb3Contract ({
        abi: abi,
        contractAddress: lotteryAddress,
        functionName: "buyTicket",
        params: {tokenAmount: inputTokenAmount.current.value},
//        msgValue: "0",
    })

    const { runContractFunction: getLotteryId } = useWeb3Contract ({
        abi: abi,
        contractAddress: lotteryAddress,
        functionName: "getLotteryId",
        params: {},
    })

    const { runContractFunction: getBlotTokenAddress } = useWeb3Contract ({
        abi: abi,
        contractAddress: lotteryAddress,
        functionName: "getBlotTokenAddress",
        params: {},
    })

    const { runContractFunction: getTokenAllowance } = useWeb3Contract ({
        abi: abi,
        contractAddress: lotteryAddress,
        functionName: "getTokenAllowance",
        params: {},
    })
    
    const { runContractFunction: getBlockNumber1 } = useWeb3Contract ({
        abi: abi,
        contractAddress: lotteryAddress,
        functionName: "getBlockNumber1",
        params: {},
    })

    const { runContractFunction: getTokenBalanceSender } = useWeb3Contract ({
        abi: abi,
        contractAddress: lotteryAddress,
        functionName: "getTokenBalanceSender",
        params: {},
    })

    const { runContractFunction: getTokenBalanceContract } = useWeb3Contract ({
        abi: abi,
        contractAddress: lotteryAddress,
        functionName: "getTokenBalanceContract",
        params: {},
    })


    
    useEffect(() => {
        async function updateUI() {
            const getBlockCall = await getBlockNumber1()
            setBlockLocal(getBlockCall.toString())

            const lotteryIdFromCall = await getLotteryId()
            setLotteryIdLocal(lotteryIdFromCall)

            const blotTokenAddressFromCall = await getBlotTokenAddress()
            setBlotTokenAddressLocal(blotTokenAddressFromCall)

            const tokenAllowanceCall = await getTokenAllowance()
            setTokenAllowanceLocal(tokenAllowanceCall.toString())

            const tokenBalanceSenderFromCall = await getTokenBalanceSender()
            setTokenBalanceSenderLocal(tokenBalanceSenderFromCall.toString())       // uint256 needed toString()

            const tokenBalanceContractFromCall = await getTokenBalanceContract()
            setTokenBalanceContractLocal(tokenBalanceContractFromCall.toString())   // uint256 needed toString()
        }
        if (isWeb3Enabled) {
            updateUI()
        }
    }, [isWeb3Enabled])

    return(
        <div>
            <div>
            <label className="block text-gray-700 text-lg font-bold mb-2">DEBUG VARIABLES:</label>
                Lottery Address: {lotteryAddress}<br />
                Blot Token Address: {blotTokenAddress}<br />
                Lottery Id: {lotteryId}<br />
                Token Balance Contract: {tokenBalanceContract}<br />
                Block Number: {blockNumber}
            </div>
            <nav className="p-3 border-b-2 flex flex-row" />

            <div>
                <label className="block text-gray-700 text-lg font-bold mb-2">MY BLOTTO INFO:</label>
                <div>My $BLOT Token Balance: {tokenBalanceSender}</div>
                <div>Blotto $BLOT Token Allowance: {tokenAllowance}</div>
                <div>Current Lottery - Number of Tokens: null</div>
                <div>Current Lottery - Next Drawing: null</div>
            </div>

            <nav className="p-3 border-b-2 flex flex-row" />

            <label className="block text-gray-700 text-lg font-bold mb-2">ACTIONS:</label>
            <div>Tokens for BLOTTO are based on the ERC20 Standard.  As such, you must first approve tokens for use.</div>
            <br />
            <label className="block text-gray-700 text-sm font-bold mb-2">Number of Tokens:&nbsp;
            <input ref={inputApproveToken} type="text" id="approveToken" name="approveToken" 
                className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
            &nbsp;
            <button className="bg-sky-500 hover:bg-sky-700 text-white font-bold py-2 px-4 rounded-3xl" 
                onClick={approve}>Approve Tokens</button></label>

            <label className="block text-gray-700 text-sm font-bold mb-2">Number of Tokens:&nbsp;
            <input ref={inputTokenAmount} type="text" id="tokenAmount" name="tokenAmount" 
                className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
            &nbsp;
            <button className="bg-sky-500 hover:bg-sky-700 text-white font-bold py-2 px-4 rounded-3xl" 
                onClick={buyTicket}>Buy Lottery Ticket</button></label>
                
        </div>
    )
}
