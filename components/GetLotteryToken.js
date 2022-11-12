import { useWeb3Contract } from "react-moralis"
import {abi} from "../constants/abi.json"

export default function GetLotteryToken() {
    // Get Lottery Token button
    const { runContractFunction: buyTicket } = useWeb3Contract ({
        abi: abi,
        contractAddress: "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512",
        functionName: "buyTicket",
        msgValue: "0",
        params: {},
    })

    return(
        <div>
            <button className="rounded ml-auto font-bold bg-green-500" onClick={async () => {
                await buyTicket()
            }}
            >Get Lottery Token</button>
        </div>
    )
}