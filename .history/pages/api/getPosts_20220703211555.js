import { contractAddress, ethEndpoint } from "../../constants/ethConstants";
import { ethers } from "ethers";

export default async function handler(req, res) {
    const provider = new (ethers.providers.getDefaultProvider) (ethEndpoint);
    let abi = [
    "function getPosts() public view   returns(tuple(address,uint256,string,uint256)[] memory, address[] memory)",
    ];
    const smartContract = new ethers.Contract(contractAddress, abi, provider);
    const result = await smartContract.getPosts();
    const posts = result[0].map((post, index) => {
    return [...post, result[1][index]]
     });
    res.status(200).json(posts);
}