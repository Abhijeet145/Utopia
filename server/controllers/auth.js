import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Trie from "../models/TrieNode.js";

/* REGISTER USER */
export const register = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      picturePath,
      friends,
      location,
      occupation,
    } = req.body;

    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser = new User({
      firstName,
      lastName,
      email,
      password: passwordHash,
      picturePath,
      friends,
      location,
      occupation,
      viewedProfile: Math.floor(Math.random() * 10000),
      impressions: Math.floor(Math.random() * 10000),
    });
    const savedUser = await newUser.save();

    const fullName = firstName +" "+lastName;
    insertNode(fullName);
    res.status(201).json(savedUser);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* LOGGING IN */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email });
    if (!user) return res.status(400).json({ msg: "User does not exist. " });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials. " });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    delete user.password;
    res.status(200).json({ token, user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

//Compressed Tries

//Adding New user name in trie
// export const insertNode = async (Name)=>{
//   try{
//     let name = Name;
//     let node=null;
//     let root_id='67464b40b88d9cdf15d9b14b';
    
//     while(name.length>0){
//       let foundChild = false;
//       node = await Trie.findById(root_id);
//       node.Children.forEach(async id=>{
//         if(foundChild===false){
//           const child = await Trie.findById(id);
//           const key = child.Value;
//           const commonPrefix = _findCommonPrefix(name,key);
//           if(commonPrefix.length > 0){
//             foundChild = true;
//             if(commonPrefix === key){//if child node's value matches fully we move down the trie
//               root_id = id;
//               name = await name.slice(commonPrefix.length);
//             }else{
//               // Split the current node
//               child.Value = commonPrefix;
//               const remainingKey = key.slice(commonPrefix.length);
//               name = name.slice(commonPrefix.length);//update reamaining word to be inserted

//               const TrieNode = new Trie();

//               TrieNode.Value = remainingKey;//make a new node with remainingKey string 
//               TrieNode.Children = child.Children
//               TrieNode.IsEndOfWord = child.IsEndOfWord;

//               const currId = await TrieNode.save();//and get it's id after saving it
//               child.Children = [];
//               child.Children.push(currId._id);//add new node id as child id of current child
//               child.IsEndOfWord = false;

//               if(name.length > 0){
//                 const TrieNode = new Trie;
//                 TrieNode.Value = name;
//                 TrieNode.IsEndOfWord = true;
//                 const currId = await TrieNode.save();
//                 child.Children.push(currId._id);
//               }else{
//                 child.IsEndOfWord = true;
//               }
//               await Trie.findByIdAndUpdate(id,{Value:child.Value,Children:child.Children,IsEndOfWord:child.IsEndOfWord});//update the child value in db
//             }
//           }
//         }
//       })
//       if(foundChild===false){//if no child exists we make a new node 
//         const TrieNode = new Trie();
  
//         TrieNode.Value = name;
//         TrieNode.IsEndOfWord = true;
//         name = "";
//         const currId = await TrieNode.save();
//         node.Children.push(currId._id);
//         await Trie.findByIdAndUpdate(root_id,{Value:node.Value,Children:node.Children,IsEndOfWord:node.IsEndOfWord});
//       }
//     }
//   }catch(err){
//     console.log(err);
//   }
// }

// // Helper function to find the common prefix of two strings
// const _findCommonPrefix = (s1, s2)=> {
//   let i = 0;
//   while (i < s1.length && i < s2.length && s1[i] === s2[i]) {
//       i++;
//   }
//   return s1.slice(0, i);
// }


//Normal tries

export const insertNode = async (Name)=>{
  try{
    let name = Name;
    let node;
    let root_id='674756c754154a979ce62bc5';
    let ind = 0;
    while(ind < name.length){
      let foundChild = false;
      node = await Trie.findById(root_id);
      node.Children.forEach(async id=>{
        if(foundChild===false){
          const child = await Trie.findById(id);
          const key = child.Value;
          if(key === name[ind]){
            ind++;
            foundChild = true;
            root_id = child._id;
          }
        }
      })
      if(foundChild === false){
        const child = new Trie();
        child.Value = name[ind];
        const curr = await child.save();
        node.Children.push(curr._id);
        await child.save();
        ind++;
        root_id = curr._id;
      }
    }
    
    node.IsEndOfWord = true;
    await node.save();

  }catch(err){
    console.log(err);
  }
}
