import { contractAddresses, abi, abitoken } from "../constants"
import { useMoralis, useWeb3Contract } from "react-moralis"
import { useEffect, useState } from 'react'
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

    const[inputApproveToken, setInputApproveToken] = useState("1")
    const[inputTokenAmount, setInputTokenAmount] = useState("1")

    const[lotteryId, setLotteryIdLocal] = useState("0")
    const[blotTokenAddress, setBlotTokenAddressLocal] = useState("0")
    const[tokenAllowance, setTokenAllowanceLocal] = useState("0")
    const[tokenBalanceSender, setTokenBalanceSenderLocal] = useState("0")
    const[userTicketCount, setUserTicketCountLocal] = useState("0")
    const[tokenBalanceContract, setTokenBalanceContractLocal] = useState("0")
    const[checkUpkeepResponse, setCheckUpkeepResponseLocal] = useState("0")
    const[getRandomWordsResponse, setGetRandomWordsResponseLocal] = useState("0")
    const[lastTimeStamp, setLastTimeStampLocal] = useState("0")
    const[blockTimestamp, setBlockTimestampLocal] = useState("0")
    const[interval, setIntervalLocal] = useState("0")

    const[timeRemaining, setTimeRemainingLocal] = useState("0")


    const { runContractFunction: checkUpkeep } = useWeb3Contract ({
        abi: abi,
        contractAddress: lotteryAddress,
        functionName: "checkUpkeepProxy",
        params: {checkData: "0x00" },
    })

    const { runContractFunction: getBlockTimestamp } = useWeb3Contract ({
        abi: abi,
        contractAddress: lotteryAddress,
        functionName: "getBlockTimestamp",
    })

    const { runContractFunction: getLastTimeStamp } = useWeb3Contract ({
        abi: abi,
        contractAddress: lotteryAddress,
        functionName: "s_lastTimeStamp",
    })

    const { runContractFunction: getInterval } = useWeb3Contract ({
        abi: abi,
        contractAddress: lotteryAddress,
        functionName: "i_interval",
    })

    const { runContractFunction: getRandomWords } = useWeb3Contract ({
        abi: abi,
        contractAddress: lotteryAddress,
        functionName: "getRandomWords",
        params: {},
    })

    const { runContractFunction: performUpkeep } = useWeb3Contract ({
        abi: abi,
        contractAddress: lotteryAddress,
        functionName: "performUpkeepProxy",
        params: {performData: "0x00" },
    })

    const { runContractFunction: fulfillRandomWords } = useWeb3Contract ({
        abi: abi,
        contractAddress: lotteryAddress,
        functionName: "fulfillRandomWordsProxy",
        params: {
            requestId: "1",
            randomWords: [lotteryAddress],
        },
    })

    const { runContractFunction: approve,
        data: enterTxResponse, 
        isLoading,
        isFetching,
    } = useWeb3Contract ({
        abi: abitoken,
        contractAddress: tokenAddress,
        functionName: "approve",
        params: {
            spender: lotteryAddress,
            amount: inputApproveToken
        },
//        msgValue: "0",
    })

    const { runContractFunction: getTicket,
        isLoading : isLoading2,
        isFetching : isFetching2, } = useWeb3Contract ({
        abi: abi,
        contractAddress: lotteryAddress,
        functionName: "getTicket",
        params: {tokenAmount: inputTokenAmount},
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
    
    const { runContractFunction: getTokenBalanceSender } = useWeb3Contract ({
        abi: abi,
        contractAddress: lotteryAddress,
        functionName: "getTokenBalanceSender",
        params: {},
    })

    const { runContractFunction: getUserTicketCount } = useWeb3Contract ({
        abi: abi,
        contractAddress: lotteryAddress,
        functionName: "getUserTicketCount",
        params: {},
    })

    const { runContractFunction: getTokenBalanceContract } = useWeb3Contract ({
        abi: abi,
        contractAddress: lotteryAddress,
        functionName: "getTokenBalanceContract",
        params: {},
    })

    async function updateUI() {
        const lotteryIdFromCall = await getLotteryId()
        setLotteryIdLocal(lotteryIdFromCall)

        const blotTokenAddressFromCall = await getBlotTokenAddress()
        setBlotTokenAddressLocal(blotTokenAddressFromCall)

        // need to handle these gracefully
        // TypeError: [const varname] is undefined
        // using wrong wallet and/or network, also chainid could be wrong

        // ERROR: "Cannot read properties of undefined (reading 'toString')" 
        // Check MM Cache, abi/contractAddresses 
        const getRandomWordsResponseFromCall = await getRandomWords()
        setGetRandomWordsResponseLocal(getRandomWordsResponseFromCall.toString())

        const getLastTimeStampFromCall = await getLastTimeStamp()
        setLastTimeStampLocal(getLastTimeStampFromCall.toString())

        const getBlockTimestampFromCall = await getBlockTimestamp()
        setBlockTimestampLocal(getBlockTimestampFromCall.toString())

        const getIntervalFromCall = await getInterval()
        setIntervalLocal(getIntervalFromCall.toString())

        if ((blockTimestamp-lastTimeStamp) > interval)
            setTimeRemainingLocal("0")
        else
            setTimeRemainingLocal((interval-(blockTimestamp-lastTimeStamp)).toString())

        const checkUpkeepResponseFromCall = await checkUpkeep()
        setCheckUpkeepResponseLocal(checkUpkeepResponseFromCall[0].toString())

        const tokenAllowanceCall = await getTokenAllowance()
        setTokenAllowanceLocal(tokenAllowanceCall.toString())

        const getUserTicketCountFromCall = await getUserTicketCount()
        setUserTicketCountLocal(getUserTicketCountFromCall.toString())       // uint256 needed toString()

        const tokenBalanceSenderFromCall = await getTokenBalanceSender()
        setTokenBalanceSenderLocal(tokenBalanceSenderFromCall.toString())       // uint256 needed toString()

        const tokenBalanceContractFromCall = await getTokenBalanceContract()
        setTokenBalanceContractLocal(tokenBalanceContractFromCall.toString())   // uint256 needed toString()
    }

    useEffect(() => {
        if (isWeb3Enabled) {
            updateUI()
        }
    }, [isWeb3Enabled])

    const handleSuccess = async (tx) => {
        try {
            await tx.wait(1)
            updateUI()
//            handleNewNotification(tx)
        } catch (error) {
            console.log(error)
        }
    }

    return(
        <div>
              {/*toggle visible/collapse*/}
            <table 
                className="visible" cellPadding="5">
                <tbody>
                    <tr>
                        <th align="left" colSpan="2">
                            <label className="block text-gray-700 text-lg font-bold mb-2">DEBUG:</label>
                        </th>
                    </tr>
                    <tr>
                        <td><button className="bg-sky-500 hover:bg-sky-700 text-white font-bold py-2 px-4 rounded-3xl" 
                        onClick=
                        {
                            async () =>
                                await checkUpkeep({
                                    onSuccess: (mess) => {
//                                        handleSuccess()
                                        console.log(mess)
                                    },
                                    onError: (err) => {
                                        console.log(err)
                                    }
                                })
                                                        
                            }
                            >Check Upkeep</button></td>
                        <td align="right">{checkUpkeepResponse}</td>
                    </tr>

                    <tr>
                        <td><button className="bg-sky-500 hover:bg-sky-700 text-white font-bold py-2 px-4 rounded-3xl" 
                        onClick=
                        {
                            async () =>
                                await getRandomWords({
                                    onSuccess: (mess) => {
//                                        handleSuccess()
                                        console.log(mess)
                                    },
                                    onError: (err) => {
                                        console.log(err)
                                    }
                                })
                                                        
                            }
                            >getRandomWords</button></td>
                        <td align="right">{getRandomWordsResponse}</td>
                    </tr>

                    <tr>
                        <td><button className="bg-sky-500 hover:bg-sky-700 text-white font-bold py-2 px-4 rounded-3xl" 
                        onClick=
                        {
                            async () =>
                                await performUpkeep({
                                    onSuccess: (mess) => {
                                        handleSuccess(mess)
                                        console.log(mess)
                                    },
                                    onError: (err) => {
                                        console.log(err)
                                    }
                                })
                                                        
                            }
                            >Perform Upkeep</button></td>
                        <td align="right">(no return data)</td>
                    </tr>

                    <tr>
                        <td><button className="bg-sky-500 hover:bg-sky-700 text-white font-bold py-2 px-4 rounded-3xl" 
                        onClick=
                        {
                            async () =>
                                await fulfillRandomWords({
                                    onSuccess: (mess) => {
                                        handleSuccess(mess)
                                        console.log(mess)
                                    },
                                    onError: (err) => {
                                        console.log(err)
                                    }
                                })
                                                        
                            }
                            >fulfillRandomWords</button></td>
                        <td align="right">(no return data)</td>
                    </tr>


                    <tr>
                        <td>Blotto Contract Address:</td>
                        <td align="right">{lotteryAddress}</td>
                    </tr>
                    <tr>
                        <td>$BLOT Token Address:</td>
                        <td align="right">{blotTokenAddress}</td>
                    </tr>
                    <tr>
                        <td>Blotto Token Balance:</td>
                        <td align="right">{tokenBalanceContract}</td>
                    </tr>
                    <tr>
                        <td>Lottery Id:</td>
                        <td align="right">{lotteryId}</td>
                    </tr>
                    <tr>
                        <td>Block Time Stamp:</td>
                        <td align="right">{blockTimestamp}</td>
                    </tr>
                    <tr>
                        <td>Latest Time Stamp:</td>
                        <td align="right">{lastTimeStamp}</td>
                    </tr>
                    <tr>
                        <td>Time Remaining (interval={interval}):</td>
                        <td align="right">{timeRemaining}</td>
                    </tr>
                    <tr>
                        <td colSpan="2">
                            <nav className="p-3 border-b-2 flex flex-row" />
                        </td>
                    </tr>
                </tbody>
            </table>
            
            <table 
                className="visible" cellPadding="5">
                <tbody>
                    <tr>
                        <th align="left" colSpan="2">
                        <label className="block text-gray-700 text-lg font-bold mb-2">MY BLOTTO INFO:</label>
                        </th>
                    </tr>
                    <tr>
                        <td>Current Lottery ({lotteryId})- Number of Tokens:</td>
                        <td align="right">{userTicketCount}</td>
                    </tr>
                    <tr>
                        <td>$BLOT Balance:</td>
                        <td align="right">{tokenBalanceSender}</td>
                    </tr>
                    <tr>
                        <td>Current Token Allowance:</td>
                        <td align="right">{tokenAllowance}</td>
                    </tr>
                    <tr>
                        <td>Current Lottery - Next Drawing:</td>
                        <td align="right">[need oracle info]]</td>
                    </tr>
                    <tr>
                        <td colSpan="2">
                            <nav className="p-3 border-b-2 flex flex-row" />
                        </td>
                    </tr>
                </tbody>
            </table>

            <label className="block text-gray-700 text-lg font-bold mb-2">ACTIONS:</label>
            <div>Tokens for BLOTTO are based on the ERC20 Standard.  As such, you must first approve tokens for use.</div>
            <br />
            <label className="block text-gray-700 text-sm font-bold mb-2">New Token Allowance:&nbsp;
            <input type="text" id="approveToken" name="approveToken" 
                className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
                value={inputApproveToken}
                onChange={e => { setInputApproveToken(e.currentTarget.value); }}
            />
            &nbsp;
            <button className="bg-sky-500 hover:bg-sky-700 text-white font-bold py-2 px-4 rounded-3xl" 
                onClick=
                {
                    async () =>
                        await approve({
                            onSuccess: (mess) => {
                                handleSuccess(mess)
                                console.log(mess)
                            },
                            onError: (err) => {
                                console.log(err)
                            }
                        })
                                                
                    }
                disabled={isLoading || isFetching}
                >
                {isLoading || isFetching ? (
                    <div className="animate-spin spinner-border bg-sky-500 py-2 px-4 rounded-3xl w-24 border-b-2 rounded-full"></div>
                ) : (
                    "Approve Tokens"
                )}                    
            </button></label>

            <label className="block text-gray-700 text-sm font-bold mb-2">Number of Tokens:&nbsp;
            <input type="text" id="tokenAmount" name="tokenAmount" 
                className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
                value={inputTokenAmount}
                onChange={e => { setInputTokenAmount(e.currentTarget.value); }}
                />
            &nbsp;
            <button className="bg-sky-500 hover:bg-sky-700 text-white font-bold py-2 px-4 rounded-3xl" 
                onClick=
                {
                    async () =>
                        await getTicket({
                            onSuccess: (mess) => {
                                handleSuccess(mess)
                                console.log(mess)
                            },
                            onError: (err) => {
                                console.log(err)
                            }
                        })

                    }
                    disabled={isLoading2 || isFetching2}
                    >
                    {isLoading2 || isFetching2 ? (
                        <div className="animate-spin spinner-border bg-sky-500 py-2 px-4 rounded-3xl w-28 border-b-2 rounded-full"></div>
                    ) : (
                        "Buy Lottery Ticket"
                    )}                    
                </button></label>
        </div>
    )
}
