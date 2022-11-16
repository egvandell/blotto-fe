import { useWeb3Contract } from "react-moralis"
import abi from "../constants/abi.json"
import { useRef, useState } from 'react'

const CONTRACT_ADDRESS = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512"
export default function GetLotteryToken2() {
    const inputApproveToken = useRef(0);

    const { data, error, runContractFunction, isFetching, isLoading } =
    useWeb3Contract({
        abi: abi,
        contractAddress: CONTRACT_ADDRESS,
        functionName: "approveTokens",
        params: {tokenAmount: inputApproveToken.current.value},
    });

  return (
    <div>
        <label class="block text-gray-700 text-sm font-bold mb-2" for="Testlabel">Approve Token Amount:</label>
        <input ref={inputApproveToken} type="text" id="approveToken" name="approveToken" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
      <button onClick={() => runContractFunction()}>
        Fetch data
      </button>
    </div>
  );

/*
    const { runContractFunction: approveTokens } = useWeb3Contract ({
        abi: abi,
        contractAddress: CONTRACT_ADDRESS,
        functionName: "approveTokens",
        params: {tokenAmount: inputApproveToken.current.value},
//        msgValue: "0",
    })

    return(
        <div class="mb-4">
            <label class="block text-gray-700 text-sm font-bold mb-2" for="Testlabel">Approve Token Amount:</label>
            <input ref={inputApproveToken} type="text" id="approveToken" name="approveToken" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
            <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" 
                onClick={approveTokens}>Approve Lottery Token</button>
            <br />
        </div>
    )
    */
}
