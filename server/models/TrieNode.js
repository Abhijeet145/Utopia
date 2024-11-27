import mongoose from "mongoose";

const TrieSchema = new mongoose.Schema(
  {
    Value:{
        type:String,
    },
    IsEndOfWord:{
        type:Boolean,
        default:false,
    },
    Children:{
        type : Array,
        default:[]
    }
}
);

const Trie = mongoose.model("Trie", TrieSchema);
export default Trie;