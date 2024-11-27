#include <bits/stdc++.h>
using namespace std;

struct TrieNode{
    string val;
    vector<TrieNode*> children;
    bool isEndofWord;
    TrieNode(string data){
        val = data;
        children = {};
        isEndofWord = true;
    }
};

string getCommonPrefix(string a,string b){
    int i=0;
    while(i<a.size() && i<b.size() && a[i]==b[i]){
        i++;
    }
    return a.substr(0,i);
}

void insertNode(TrieNode*root,string s){
    if(s == "")
        return;
    for(auto child:root->children){
        string key = child->val;
        string commonPrefix = getCommonPrefix(key,s);

        int commonSize = commonPrefix.size();
        string remainingToInsert = s.substr(commonSize);//cut s that is matched and we add remaining

        if(commonSize>0){//if getting some values common
            if(commonPrefix == key){//complete node val matches so we move to child node
                if(remainingToInsert.size()>0){
                    child->isEndofWord = false;
                    insertNode(child,remainingToInsert);//add remaining s in child node
                }
                return;
            }else{//if only partially common
                string remainingVal = key.substr(commonPrefix.size());
                TrieNode *childNode = new TrieNode(remainingVal);//create new node
                childNode->children = child->children;//pass all children to it

                child->children = {};//remove all children form current child node
                child->val = commonPrefix;//and update child node values
                child->isEndofWord = false;

                child->children.push_back(childNode);//and add this new node to its children

                insertNode(child,remainingToInsert);
                return;
            }
        }
    }
    TrieNode *node = new TrieNode(s);
    root->children.push_back(node);
}

void bfs(TrieNode*node,vector<string>&autoComplete,string curr){
    
    if(node->isEndofWord == true){
        autoComplete.push_back(curr);
    }
    for(auto child:node->children){
        string common = curr+child->val;
        bfs(child,autoComplete,common);
    }
}

vector<string> autoComplete(TrieNode* root,string s,string common){
    vector<string> res;
    for(auto child:root->children){
        string key = child->val;
        string commonPrefix = getCommonPrefix(key,s);

        int commonSize = commonPrefix.size();
        string remainingToSearch = s.substr(commonSize);
        
        if(commonSize>0){//if getting some values common
            if(commonPrefix == key && remainingToSearch!=""){
                common += commonPrefix;
                return autoComplete(child,remainingToSearch,common);
            }
            common += key;
            bfs(child,res,common);
            return res;
        }
    }
    return res;
}

void levelOrder(TrieNode *root){
    queue<TrieNode*> q;

    // Enqueue Root
    q.push(root);

    while (q.empty() == false) {
        int size = q.size();
        while(size--){
            // Print front of queue and remove it from queue
            TrieNode* node = q.front();
            cout << node->val << " ";
            q.pop();

            for(auto child:node->children){
                q.push(child);
            }
        }
        cout <<"\n";
    }
}



int main(){
    TrieNode *root = new TrieNode("");
    vector<string> names={
        //Male Names
        "Abhijeet","Abhishek","Ramu","Ramesh","Akash","Avinash","Rahul","Rakesh","Prince","Priyanshu","Ramesh","Vikas""Aarav", "Vivaan", "Aditya", "Vihaan", "Arjun", "Sai", "Krishna", "Om", "Kian", "Lakshay", 
        "Rishi", "Kabir", "Ayaan", "Dev", "Aryan", "Nirav", "Rohan", "Shivansh", "Rudra", "Harsh", 
        "Pranav", "Mihir", "Yash", "Samarth", "Ansh", "Aman", "Ishaan", "Shreyas", "Nikhil", "Tanish", 
        
        //Female Names
        "Aarohi", "Ananya", "Avni", "Diya", "Ishita", "Jhanvi", "Kavya", "Mishka", "Myra", "Nisha", 
        "Prisha", "Riya", "Saanvi", "Shanaya", "Tara", "Trisha", "Vani", "Zara", "Amara", "Arya", 
        "Charvi", "Divya", "Gauri", "Ira", "Ishaani", "Khushi", "Meera", "Nitya", "Pari", "Radhika", 
    };

    for(auto x:names){
        insertNode(root,x);
    }

    levelOrder(root);

    cout <<"Suggested words for autocompletion of A\n";
    vector<string> completed = autoComplete(root,"Ab","");
    for(auto x:completed){
        cout <<x<<" ";
    }
    return 0;
}