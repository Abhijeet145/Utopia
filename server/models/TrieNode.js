import mongoose from "mongoose";

const TrieSchema = new mongoose.Schema(
  {
    NodeId:{
        type:String,
    },
    Value:{
        type:String,
    },
    IsEndOfWord:{
        type:Boolean,
    },
    Children:{
        type : Array,
        default:[]
    }
}
);

const Trie = mongoose.model("Trie", TrieSchema);
export default Trie;