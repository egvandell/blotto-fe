import { ConnectButton } from "web3uikit"

export default function Header() {
    return (
        <nav className="p-5 border-b-2 flex flex-row">
            <h1 className="py-4 px-4 font-bold text-3xl">BLOTTO! The Blockchain Lottery DAO</h1>
            <div className="m1-auto py-2 px-4">
                <ConnectButton moralisAuth={false} />
            </div>
        </nav>
    )

}