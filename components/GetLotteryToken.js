import { contractAddresses, abi, abitoken } from "../constants"
import { useMoralis, useWeb3Contract } from "react-moralis"
import { useRef, useEffect, useState } from 'react'
import { useNotification } from "web3uikit"
import { ethers } from "ethers"

export default function GetLotteryToken() {
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
    
    const { runContractFunction: getTheBlockNumber } = useWeb3Contract ({
        abi: abi,
        contractAddress: lotteryAddress,
        functionName: "getTheBlockNumber",
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
            const lotteryIdFromCall = await getLotteryId()
            setLotteryIdLocal(lotteryIdFromCall)

            const blotTokenAddressFromCall = await getBlotTokenAddress()
            setBlotTokenAddressLocal(blotTokenAddressFromCall)

            // ERROR: "Cannot read properties of undefined (reading 'toString')" 
            // Check ABI, MM Cache, contractAddresses
            const getBlockCall = await getTheBlockNumber()
            setBlockLocal(getBlockCall.toString())

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
              {/*toggle visible/collapse*/}
            <table 
                class="visible" cellpadding="5">
            <tr>
                <th align="left" colspan="2">
                    <label className="block text-gray-700 text-lg font-bold mb-2">DEBUG VARIABLES:</label>
                </th>
            </tr>
            <tr>
                <td>Lottery Address:</td>
                <td align="right">{lotteryAddress}</td>
            </tr>
            <tr>
                <td>Blot Token Address:</td>
                <td align="right">{blotTokenAddress}</td>
            </tr>
            <tr>
                <td>Lottery Id:</td>
                <td align="right">{lotteryId}</td>
            </tr>
            <tr>
                <td>Token Balance Contract:</td>
                <td align="right">{tokenBalanceContract}</td>
            </tr>
            <tr>
                <td>Block Number:</td>
                <td align="right">{blockNumber}</td>
            </tr>
            <tr>
                <td colspan="2">
                    <nav className="p-3 border-b-2 flex flex-row" />
                </td>
            </tr>
            </table>
            
            <table 
                class="visible" cellpadding="5">
            <tr>
                <th align="left" colspan="2">
                <label className="block text-gray-700 text-lg font-bold mb-2">MY BLOTTO INFO:</label>
                </th>
            </tr>
            <tr>
                <td>My $BLOT Token Balance:</td>
                <td align="right">{tokenBalanceSender}</td>
            </tr>
            <tr>
                <td>Blotto $BLOT Token Allowance:</td>
                <td align="right">{tokenAllowance}</td>
            </tr>
            <tr>
                <td>Current Lottery - Number of Tokens:</td>
                <td align="right">null</td>
            </tr>
            <tr>
                <td>Current Lottery - Next Drawing:</td>
                <td align="right">null</td>
            </tr>
            <tr>
                <td colspan="2">
                    <nav className="p-3 border-b-2 flex flex-row" />
                </td>
            </tr>
            </table>

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
