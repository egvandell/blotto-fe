import { useMoralis, useWeb3Contract } from "react-moralis"
import abi from "../constants/abi.json"
import { useRef, useEffect, useState } from 'react'

const CONTRACT_ADDRESS = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512"
// tester address "0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199"
export default function GetLotteryToken() {
    const {isWeb3Enabled} = useMoralis()
    const inputTokenAmount = useRef(0);
    const inputNewCharityAddress = useRef(0);
    const[charityAddress, setCharityAddressLocal] = useState("0")

    const { runContractFunction: buyTicket } = useWeb3Contract ({
        abi: abi,
        contractAddress: CONTRACT_ADDRESS,
        functionName: "buyTicket",
        params: {tokenAmount: inputTokenAmount.current.value},
        msgValue: "0",
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

    const { runContractFunction: Tester } = useWeb3Contract ({
        abi: abi,
        contractAddress: CONTRACT_ADDRESS,
        functionName: "Tester",
        params: {testint: "100"},
    })

    useEffect(() => {
        async function updateUI() {
            const charityAddressFromCall = await getCharityAddress()
            setCharityAddressLocal(charityAddressFromCall)
        }
        if (isWeb3Enabled) {
            updateUI()
        }
    }, [isWeb3Enabled])

    return(
        <div class="mb-4">
            <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" 
                onClick={Tester}>Run Tester</button>

            <label class="block text-gray-700 text-sm font-bold mb-2" for="Testlabel">Token Amount:</label>
            <input ref={inputTokenAmount} type="text" id="tokenAmount" name="tokenAmount" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
            <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" 
                onClick={buyTicket}>Get Lottery Token</button>

            <div>Last Charity Address: {charityAddress}</div>

            <input ref={inputNewCharityAddress} type="text" id="newCharityAddress" name="newCharityAddress" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
            <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" 
                onClick={setCharityAddress}>Set New Charity Address</button>
        </div>
    )
}
