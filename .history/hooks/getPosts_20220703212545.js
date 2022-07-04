/* eslint-disable react-hooks/rules-of-hooks */
import axios from "axios";
import Post from "../models/post";
import Web3Modal from 'web3modal';
import WalletConnectProvider from "@walletconnect/web3-provider";
import { ethers } from "ethers";
import { contractAddress } from "../constants/ethConstants";
import { useState, useEffect } from 'react';

export default function getPosts() {

    const [posts, setPosts] = useState();
    const abi = ["function purchase(uint256 postId) public payable",
        "function post(string memory text, uint256 price) public",
    ];

    useEffect(() => {
        get();
    }, [])

    async function get() {
        const data = await axios.get('/api/getPosts');
        const result = data.data.map((item) => new Post(item)).reverse();
        setPosts(result);
    }

    async function createPost(text, price) {
        const web3Modal = new Web3Modal({
            cacheProvider: true,
            providerOptions: {
                walletconnect: {
                    package: WalletConnectProvider,
                }
            },
        });
        const instance = await web3Modal.connect();
        const provider = new ethers.providers.Web3Provider(instance);
        const signer = provider.getSigner();
        const smartContract = new ethers.Contract(contractAddress, abi, provider);
        const contractWithSigner = smartContract.connect(signer);
        const tx = await contractWithSigner.post(text, ethers.utils.parseEther(price));
        await tx.wait();
        get();
    }

    async function buyPost(index) {
        const web3Modal = new Web3Modal({
            cacheProvider: true,
            providerOptions: {
                walletconnect: {
                    package: WalletConnectProvider,
                }
            },
        });
        const instance = await web3Modal.connect();
        const provider = new ethers.providers.Web3Provider(instance);
        const signer = provider.getSigner();
        const smartContract = new ethers.Contract(contractAddress, abi, provider);
        const contractWithSigner = smartContract.connect(signer);
        const tx = await contractWithSigner.purchase(posts[index].id, { value: posts[index].price });
        await tx.wait();
        get();
    }
    
    return { posts: posts, createPost: (text, price) => createPost(text, price), buyPost: (index) => buyPost(index) };
}