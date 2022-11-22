import { contractAddresses, abi } from "../constants"
import { useMoralis, useWeb3Contract } from "react-moralis"
import { useRef, useEffect, useState } from 'react'
import { useNotification } from "web3uikit"
import { ethers } from "ethers"

export default function GetLotteryToken2() {
//    const {isWeb3Enabled} = useMoralis()
    const { Moralis, isWeb3Enabled, chainId: chainIdHex } = useMoralis()
    // These get re-rendered every time due to our connect button!
    const chainId = parseInt(chainIdHex)
    // console.log(`ChainId is ${chainId}`)
    const lotteryAddress = chainId in contractAddresses ? contractAddresses[chainId][0] : null

    const inputTokenAmount = useRef(0);
    const inputApproveToken = useRef(0);

    const[lotteryId, setLotteryIdLocal] = useState("0")
    const[blotTokenAddress, setBlotTokenAddressLocal] = useState("0")
    const[tokenAllowance, setTokenAllowanceLocal] = useState("0")


    const { runContractFunction: approveTokens } = useWeb3Contract ({
        abi: abi,
        contractAddress: lotteryAddress,
        functionName: "approveTokens",
        params: {tokenAmount: inputApproveToken.current.value},
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
    
    useEffect(() => {
        async function updateUI() {
            const lotteryIdFromCall = await getLotteryId()
            setLotteryIdLocal(lotteryIdFromCall)

            const blotTokenAddressFromCall = await getBlotTokenAddress()
            setBlotTokenAddressLocal(blotTokenAddressFromCall)

            const tokenAllowanceCall = await getTokenAllowance()
            setTokenAllowanceLocal(tokenAllowanceCall.toString())
        }
        if (isWeb3Enabled) {
            updateUI()
        }
    }, [isWeb3Enabled])

    return(
        <div class="mb-4">
            <label class="block text-gray-700 text-sm font-bold mb-2" for="Testlabel">Approve Token Amount:</label>
            <input ref={inputApproveToken} type="text" id="approveToken" name="approveToken" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
            <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" 
                onClick={approveTokens}>Approve Lottery Token</button>
            <br />

            <label class="block text-gray-700 text-sm font-bold mb-2" for="Testlabel">Buy Token Amount:</label>
            <input ref={inputTokenAmount} type="text" id="tokenAmount" name="tokenAmount" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
            <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" 
                onClick={buyTicket}>Get Lottery Token</button>
            <br />
            <br />
            <div>Lottery Address: {lotteryAddress}</div>
            <div>Blot Token Address: {blotTokenAddress}</div>
            <div>Lottery Id: {lotteryId}</div>
            <div>Contract Token Allowance: {tokenAllowance}</div>
            <br />
        </div>
    )
}
