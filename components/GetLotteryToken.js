import { useWeb3Contract } from "react-moralis"
import abi from "../constants/abi.json"
import { useRef } from 'react'

export default function GetLotteryToken() {
    const inputEl = useRef(0);

    const { runContractFunction: Tester } = useWeb3Contract ({
        abi: abi,
        contractAddress: "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512",
        functionName: "Tester",
        params: {testint: inputEl.current.value},
    })

    return(
        <div class="mb-4">
            <label class="block text-gray-700 text-sm font-bold mb-2" for="Testlabel">Token Amount:</label>
            <input ref={inputEl} type="text" id="tokenAmount" name="tokenAmount" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
            <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" 
                onClick={Tester}>Get Lottery Token</button>
        </div>
    )
}
