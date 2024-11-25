import User from "../models/User.js";
import Trie from "../models/TrieNode.js";
/* READ */
export const getUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    res.status(200).json(user);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

export const getUserFriends = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);

    const friends = await Promise.all(
      user.friends.map((id) => User.findById(id))
    );
    const formattedFriends = friends.map(
      ({ _id, firstName, lastName, occupation, location, picturePath }) => {
        return { _id, firstName, lastName, occupation, location, picturePath };
      }
    );
    res.status(200).json(formattedFriends);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

/* UPDATE */
export const addRemoveFriend = async (req, res) => {
  try {
    const { id, friendId } = req.params;
    const user = await User.findById(id);
    const friend = await User.findById(friendId);

    if (user.friends.includes(friendId)) {
      user.friends = user.friends.filter((id) => id !== friendId);
      friend.friends = friend.friends.filter((id) => id !== id);
    } else {
      user.friends.push(friendId);
      friend.friends.push(id);
    }
    await user.save();
    await friend.save();

    const friends = await Promise.all(
      user.friends.map((id) => User.findById(id))
    );
    const formattedFriends = friends.map(
      ({ _id, firstName, lastName, occupation, location, picturePath }) => {
        return { _id, firstName, lastName, occupation, location, picturePath };
      }
    );

    res.status(200).json(formattedFriends);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};




export const insertNode=async (req,res)=>{
  try{
    const name = req.body.name;
    const node = await Trie.findById('root');

    
    while(name.length>0){
      node.Children.forEach(async id =>{
        const child = await Trie.findById(id)
        const key = child.Value;
        const commonPrefix = _findCommonPrefix(name,key);
        if(commonPrefix.length>0){
          if(commonPrefix === key){//if child node's value matches fully we move down the trie

          }
        }
        // if (commonPrefix.length > 0) {
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
          //               
      })
    }
  }catch(err){
    res.status(404).json({ message: err.message });
  }
}


//Get user names for auto complete
export const getUserNames= async (req,res)=>{
  
  
  try {
    let name = req.body.name;

    const friends = {
      "1": "abhi",
      "2": "rakesh",
      "3": "aman"
    }
    res.status(200).json(friends);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
}

// Helper function to find the common prefix of two strings
const _findCommonPrefix = (s1, s2)=> {
  let i = 0;
  while (i < s1.length && i < s2.length && s1[i] === s2[i]) {
      i++;
  }
  return s1.slice(0, i);
}