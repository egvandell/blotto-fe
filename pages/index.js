import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import Header from "../components/Header"
import GetLotteryToken2 from "../components/GetLotteryToken2"
import { useMoralis } from 'react-moralis'

export default function Home() {
  const { isWeb3Enabled } = useMoralis()

  return (
    <div className={styles.container}>
      <Header />
      {isWeb3Enabled ? (
        <GetLotteryToken2 />
      ) : (
        <div>Metamask was not detected</div>
      )}
    </div>
  )
}
