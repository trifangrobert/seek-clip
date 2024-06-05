import pymongo

MONGO_URI = "mongodb://localhost:27017/bt-db"

client = pymongo.MongoClient(MONGO_URI)
db = client["bt-db"]
comments_collection = db["comments"]

def build_comment_tree():
    comments = comments_collection.find()
    comment_tree = {}
    for comment in comments:
        comment_tree[comment["_id"]] = {
            "parentId": comment["parentId"],
            "isDeleted": comment["isDeleted"],
            "children": []
        }
        
    for comment_id, comment_info in comment_tree.items():
        parent_id = comment_info["parentId"]
        if parent_id:
            comment_tree[parent_id]["children"].append(comment_id)

    return comment_tree

def mark_deletable_comments(comment_tree, comment_id, deletable):
    node = comment_tree[comment_id]
    
    if node["isDeleted"]:
        all_children_deletable = True
        for child_id in node["children"]:
            all_children_deletable &= mark_deletable_comments(comment_tree, child_id, deletable)
        
        if all_children_deletable:
            deletable.append(comment_id)
            return True
    
        return False
    else:
        for child_id in node["children"]:
            mark_deletable_comments(comment_tree, child_id, deletable)
        return False
    
def delete_comments(deletable):
    for comment_id in deletable:
        comments_collection.delete_one({'_id': comment_id})
        
def main():
    comment_tree = build_comment_tree()
    deletable = []
    for comment_id, comment_info in comment_tree.items():
        if comment_info['parentId'] is None:
            mark_deletable_comments(comment_tree, comment_id, deletable)
    delete_comments(deletable)
    print(f"Deleted {len(deletable)} comments.")
    
if __name__ == "__main__":
    main()