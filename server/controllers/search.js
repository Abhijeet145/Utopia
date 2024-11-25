



// class CompressedTrieNode {
//     constructor(value = "") {
//         this.value = value; // string value of the node
//         this.children = new Map(); // children stored as key-value pairs
//         this.isEndOfWord = false; // end of a word
//     }
// }

// class CompressedTrie {
//     constructor() {
//         this.root = new CompressedTrieNode(); // initialises a new node as root
//     }

//     // Insert a word into the compressed trie
//     insert(word) {
//         let node = this.root;

//         while (word.length > 0) {
//             let foundChild = false;

//             for (const [key, child] of node.children) {
//                 const commonPrefix = this._findCommonPrefix(word, key);
//                 if (commonPrefix.length > 0) {
//                     foundChild = true;

//                     if (commonPrefix === key) {
//                         // Move down the trie
//                         node = child;
//                         word = word.slice(commonPrefix.length);
//                     } else {
//                         // Split the current node
//                         const remainingKey = key.slice(commonPrefix.length);
//                         const remainingWord = word.slice(commonPrefix.length);

//                         // Create new nodes
//                         const newChild = new CompressedTrieNode(remainingKey);
//                         newChild.children = child.children;
//                         newChild.isEndOfWord = child.isEndOfWord;

//                         child.value = commonPrefix;
//                         child.children = new Map([[remainingKey, newChild]]);
//                         child.isEndOfWord = false;

//                         if (remainingWord.length > 0) {
//                             child.children.set(
//                                 remainingWord,
//                                 new CompressedTrieNode(remainingWord)
//                             );
//                             child.children.get(remainingWord).isEndOfWord = true;
//                         } else {
//                             child.isEndOfWord = true;
//                         }
//                     }
//                     return;
//                 }
//             }

//             if (!foundChild) {
//                 // Add a new child
//                 node.children.set(word, new CompressedTrieNode(word));
//                 node.children.get(word).isEndOfWord = true;
//                 return;
//             }
//         }

//         node.isEndOfWord = true;
//     }

//     // Search for a word in the compressed trie
//     search(word) {
//         let node = this.root;

//         while (word.length > 0) {
//             let found = false;

//             for (const [key, child] of node.children) {
//                 if (word.startsWith(key)) {
//                     found = true;
//                     word = word.slice(key.length);
//                     node = child;
//                     break;
//                 }
//             }

//             if (!found) {
//                 return false;
//             }
//         }

//         return node.isEndOfWord;
//     }

//     // Helper function to find the common prefix of two strings
//     _findCommonPrefix(s1, s2) {
//         let i = 0;
//         while (i < s1.length && i < s2.length && s1[i] === s2[i]) {
//             i++;
//         }
//         return s1.slice(0, i);
//     }
// }

// // Example usage:
// const trie = new CompressedTrie();
// trie.insert("apple");
// trie.insert("app");
// trie.insert("applesauce");

// console.log(trie.search("apple"));       // Output: true
// console.log(trie.search("applesauce")); // Output: true
// // console.log(trie.search("app"));        // Output: true
// // console.log(trie.search("appl"));       // Output: false




// //Implementing trie in db itself using each node as a seperate document
// async function insertWord(db, rootId, word) {
//     let currentNodeId = rootId;
//     let currentWord = word;

//     while (currentWord.length > 0) {
//         const currentChar = currentWord[0];

//         // Check if a child with the current character exists
//         const currentNode = await db.collection("trie").findOne({ _id: currentNodeId });
//         const childNode = await db.collection("trie").findOne({ _id: { $in: currentNode.children }, value: currentChar });

//         if (childNode) {
//             // Move to the child node and continue
//             currentNodeId = childNode._id;
//             currentWord = currentWord.slice(1);
//         } else {
//             // Create a new node for the remaining characters
//             const newNode = {
//                 _id: new ObjectId().toString(),
//                 value: currentChar,
//                 isEndOfWord: false,
//                 children: []
//             };
//             await db.collection("trie").insertOne(newNode);

//             // Update the current node to reference the new child
//             await db.collection("trie").updateOne(
//                 { _id: currentNodeId },
//                 { $push: { children: newNode._id } }
//             );

//             currentNodeId = newNode._id;
//             currentWord = currentWord.slice(1);
//         }
//     }

//     // Mark the last node as an end of a word
//     await db.collection("trie").updateOne({ _id: currentNodeId }, { $set: { isEndOfWord: true } });
// }


// async function searchWord(db, rootId, word) {
//     let currentNodeId = rootId;
//     let currentWord = word;

//     while (currentWord.length > 0) {
//         const currentChar = currentWord[0];

//         const currentNode = await db.collection("trie").findOne({ _id: currentNodeId });
//         const childNode = await db.collection("trie").findOne({ _id: { $in: currentNode.children }, value: currentChar });

//         if (!childNode) {
//             return false; // Character not found
//         }

//         currentNodeId = childNode._id;
//         currentWord = currentWord.slice(1);
//     }

//     // Check if the last node marks the end of a word
//     const finalNode = await db.collection("trie").findOne({ _id: currentNodeId });
//     return finalNode.isEndOfWord;
// }


// async function initializeTrie(db) {
//     const rootNode = {
//         _id: "root",
//         value: "",
//         isEndOfWord: false,
//         children: []
//     };
//     await db.collection("trie").deleteMany({}); // Clear existing Trie data
//     await db.collection("trie").insertOne(rootNode);
//     return rootNode._id;
// }


// // const { MongoClient } = require("mongodb");

// (async () => {
//     const client = new MongoClient("mongodb://localhost:27017");
//     await client.connect();
//     const db = client.db("trieDB");

//     // Initialize Trie
//     const rootId = await initializeTrie(db);

//     // Insert Words
//     await insertWord(db, rootId, "apple");
//     await insertWord(db, rootId, "app");
//     await insertWord(db, rootId, "bat");

//     // Search Words
//     console.log(await searchWord(db, rootId, "apple")); // Output: true
//     console.log(await searchWord(db, rootId, "app"));   // Output: true
//     console.log(await searchWord(db, rootId, "bat"));   // Output: true
//     console.log(await searchWord(db, rootId, "batman")); // Output: false

//     await client.close();
// })();


// // To implement a Trie directly in MongoDB without compression, you can represent each node of the Trie as a separate document. Each document will store the node's value, whether it marks the end of a word, and references to its child nodes using their IDs.

// // Schema Design
// // Each Trie node can be represented as a document with:

// // _id: A unique identifier for the node.
// // value: The character(s) or string segment stored at the node.
// // isEndOfWord: A boolean indicating if it marks the end of a word.
// // children: An array of child node _ids.
// // Example Structure:
// // json
// // Copy code
// {
//   "_id": "root",
//   "value": "",
//   "isEndOfWord": false,
//   "children": ["node1"]
// }
// {
//   "_id": "node1",
//   "value": "a",
//   "isEndOfWord": false,
//   "children": ["node2", "node3"]
// }
// {
//   "_id": "node2",
//   "value": "p",
//   "isEndOfWord": false,
//   "children": ["node4"]
// }
// {
//   "_id": "node4",
//   "value": "ple",
//   "isEndOfWord": true,
//   "children": []
// }
// // Implementation
// // Below is the implementation to insert, search, and initialize a Trie in MongoDB:

// // 1. Insert a Word
// // javascript
// // Copy code
// async function insertWord(db, rootId, word) {
//     let currentNodeId = rootId;
//     let currentWord = word;

//     while (currentWord.length > 0) {
//         const currentChar = currentWord[0];

//         // Check if a child with the current character exists
//         const currentNode = await db.collection("trie").findOne({ _id: currentNodeId });
//         const childNode = await db.collection("trie").findOne({ _id: { $in: currentNode.children }, value: currentChar });

//         if (childNode) {
//             // Move to the child node and continue
//             currentNodeId = childNode._id;
//             currentWord = currentWord.slice(1);
//         } else {
//             // Create a new node for the remaining characters
//             const newNode = {
//                 _id: new ObjectId().toString(),
//                 value: currentChar,
//                 isEndOfWord: false,
//                 children: []
//             };
//             await db.collection("trie").insertOne(newNode);

//             // Update the current node to reference the new child
//             await db.collection("trie").updateOne(
//                 { _id: currentNodeId },
//                 { $push: { children: newNode._id } }
//             );

//             currentNodeId = newNode._id;
//             currentWord = currentWord.slice(1);
//         }
//     }

//     // Mark the last node as an end of a word
//     await db.collection("trie").updateOne({ _id: currentNodeId }, { $set: { isEndOfWord: true } });
// }
// // 2. Search a Word
// // javascript
// // Copy code
// async function searchWord(db, rootId, word) {
//     let currentNodeId = rootId;
//     let currentWord = word;

//     while (currentWord.length > 0) {
//         const currentChar = currentWord[0];

//         const currentNode = await db.collection("trie").findOne({ _id: currentNodeId });
//         const childNode = await db.collection("trie").findOne({ _id: { $in: currentNode.children }, value: currentChar });

//         if (!childNode) {
//             return false; // Character not found
//         }

//         currentNodeId = childNode._id;
//         currentWord = currentWord.slice(1);
//     }

//     // Check if the last node marks the end of a word
//     const finalNode = await db.collection("trie").findOne({ _id: currentNodeId });
//     return finalNode.isEndOfWord;
// }
// // 3. Initialize a Trie
// // javascript
// // Copy code
// async function initializeTrie(db) {
//     const rootNode = {
//         _id: "root",
//         value: "",
//         isEndOfWord: false,
//         children: []
//     };
//     await db.collection("trie").deleteMany({}); // Clear existing Trie data
//     await db.collection("trie").insertOne(rootNode);
//     return rootNode._id;
// }
// Full Example
// javascript
// Copy code
// const { MongoClient } = require("mongodb");

// (async () => {
//     const client = new MongoClient("mongodb://localhost:27017");
//     await client.connect();
//     const db = client.db("trieDB");

//     // Initialize Trie
//     const rootId = await initializeTrie(db);

//     // Insert Words
//     await insertWord(db, rootId, "apple");
//     await insertWord(db, rootId, "app");
//     await insertWord(db, rootId, "bat");

//     // Search Words
//     console.log(await searchWord(db, rootId, "apple")); // Output: true
//     console.log(await searchWord(db, rootId, "app"));   // Output: true
//     console.log(await searchWord(db, rootId, "bat"));   // Output: true
//     console.log(await searchWord(db, rootId, "batman")); // Output: false

//     await client.close();
// })();

// // Considerations
// // Performance:

// // This approach may require multiple database queries during insertion and search due to the hierarchical nature of the Trie.
// // Index the value and _id fields for faster lookups.
// // Scalability:

// // Use batch updates (e.g., bulkWrite) if inserting many words at once.
// // Consider using Redis or an in-memory database for faster performance if the Trie will be accessed frequently.
// // Atomicity:

// // Use transactions if the application requires guaranteed atomic operations (e.g., to handle concurrent inserts).