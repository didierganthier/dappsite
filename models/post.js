export default class Post {
    
    id;
    owner;
    price;
    text;
    originalOwner;

    constructor(data) {
        this.originalOwner = data[0];
        this.price = data[1];
        this.text = data[2];
        this.id = data[3];
        this.owner = data[4];
    }
}