import Head from 'next/head'
import getPosts from '../hooks/getPosts'
import styles from '../styles/Home.module.css'
import { useState } from 'react';
import { ethers } from 'ethers';
export default function Home() {
  const { posts, createPost, buyPost } = getPosts();
  const [input, setInput] = useState("");
  const [price, setPrice] = useState("");
  if (!posts) {
    return <div />
  }
  function sendPost() {
    if (!input || !price) return;
    createPost(input, price);
    setInput("");
    setPrice("");
  }
  return (
    <div className={styles.container}>
      <Head>
        <title>Social dApp</title>
        <meta name="description" content="Simple web3 social dapp" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <div className={styles.leftColumn}>
          <h1>Eth Social</h1>
          <input placeholder='Message' className={styles.input} value={input} onChange={(e) => setInput(e.target.value)} />
          <input placeholder='Price' className={styles.input} value={price} onChange={(e) => setPrice(e.target.value)} />
          <div onClick={() => sendPost()} className={styles.button}>Post</div>
        </div>
        <div className={styles.rightColumn}>
          {
            posts.map((post, index) => {
              return <div className={styles.post} key={index}>
                <h3 className={styles.address}>{post.owner}</h3>
                <p className={styles.postText}>{post.text}</p>
                <div onClick={() => buyPost(index)} className={styles.button}>Buy for {ethers.utils.formatEther(post.price)} ETH</div>
              </div>
            })
          }
        </div>
      </main>
    </div>
  )
}