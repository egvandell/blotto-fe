import { useMoralis, useWeb3Contract } from "react-moralis"
import abi from "../constants/abi.json"
import { useRef, useEffect, useState } from 'react'

const CONTRACT_ADDRESS = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512"
// tester address "0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199"
export default function GetLotteryToken() {
    const {isWeb3Enabled} = useMoralis()
    const inputTokenAmount = useRef(0);
    const inputApproveToken = useRef(0);
    const inputNewCharityAddress = useRef(0);
    const[charityAddress, setCharityAddressLocal] = useState("0")
    const[lotteryId, setLotteryIdLocal] = useState("0")
    const[tokenBalanceSender, setTokenBalanceSenderLocal] = useState("0")
    const[tokenBalanceContract, setTokenBalanceContractLocal] = useState("0")
    const[tokenAllowance, setTokenAllowanceLocal] = useState("0")

    const { runContractFunction: approveTokens } = useWeb3Contract ({
        abi: abi,
        contractAddress: CONTRACT_ADDRESS,
        functionName: "approveTokens",
        params: {tokenAmount: inputApproveToken.current.value},
//        msgValue: "0",
    })

    const { runContractFunction: buyTicket } = useWeb3Contract ({
        abi: abi,
        contractAddress: CONTRACT_ADDRESS,
        functionName: "buyTicket",
        params: {tokenAmount: inputTokenAmount.current.value},
//        msgValue: "0",
    })

    const { runContractFunction: getCharityAddress } = useWeb3Contract ({
        abi: abi,
        contractAddress: CONTRACT_ADDRESS,
        functionName: "getCharityAddress",
        params: {},
    })

    const { runContractFunction: setCharityAddress } = useWeb3Contract ({
        abi: abi,
        contractAddress: CONTRACT_ADDRESS,
        functionName: "setCharityAddress",
        params: {_address: inputNewCharityAddress.current.value},
    })

    const { runContractFunction: getLotteryId } = useWeb3Contract ({
        abi: abi,
        contractAddress: CONTRACT_ADDRESS,
        functionName: "getLotteryId",
        params: {},
    })

    const { runContractFunction: getTokenAllowance } = useWeb3Contract ({
        abi: abi,
        contractAddress: CONTRACT_ADDRESS,
        functionName: "getTokenAllowance",
        params: {},
    })
    
    const { runContractFunction: getTokenBalanceSender } = useWeb3Contract ({
        abi: abi,
        contractAddress: CONTRACT_ADDRESS,
        functionName: "getTokenBalanceSender",
        params: {},
    })

    const { runContractFunction: getTokenBalanceContract } = useWeb3Contract ({
        abi: abi,
        contractAddress: CONTRACT_ADDRESS,
        functionName: "getTokenBalanceContract",
        params: {},
    })

    const { runContractFunction: Tester } = useWeb3Contract ({
        abi: abi,
        contractAddress: CONTRACT_ADDRESS,
        functionName: "Tester",
        params: {testint: "100"},
    })

    const { runContractFunction: PayableTester } = useWeb3Contract ({
        abi: abi,
        contractAddress: CONTRACT_ADDRESS,
        functionName: "PayableTester",
        params: {testint: "100"},
        msgValue: "100",
    })

    useEffect(() => {
        async function updateUI() {
            const charityAddressFromCall = await getCharityAddress()
            setCharityAddressLocal(charityAddressFromCall)

            const lotteryIdFromCall = await getLotteryId()
            setLotteryIdLocal(lotteryIdFromCall)

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
            <div>Lottery Id: {lotteryId}</div>
            <br />
            <div>Current Allowance: {tokenAllowance}</div>
            <br />
            <div>Token Balance Sender: {tokenBalanceSender}</div>
            <br />
            <div>Token Balance Contract: {tokenBalanceContract}</div>
            <br />
            <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" 
                onClick={Tester}>Run Tester</button>
            <br />
            <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" 
                onClick={PayableTester}>Run Payable Tester</button>
            <br />
            <div>Last Charity Address: {charityAddress}</div>

            <input ref={inputNewCharityAddress} type="text" id="newCharityAddress" name="newCharityAddress" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
            <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" 
                onClick={setCharityAddress}>Set New Charity Address</button>
        </div>
    )
}
