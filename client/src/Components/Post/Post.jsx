import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import "./Post.css";
import { userContext } from "../../App";
function Post() {
  const { id } = useParams();
  const [post, setPost] = useState({});
  const navigate = useNavigate();
  const user = useContext(userContext);

  useEffect(() => {
    axios
      .get("http://localhost:3001/getPostById/" + id)
      .then((result) => setPost(result.data))
      .catch((err) => console.log(err));
  }, []);

  const PostDelete = (id) => {
    axios
      .delete("http://localhost:3001/deletePost/" + id)
      .then(() => navigate("/"))
      .catch((err) => console.log(err));
  };
  return (
    <div className="posts" key={post.id}>
      <img src={`http://localhost:3001/Images/${post.file}`} alt="post" />
      <div className="posts_text">
        <h2>{post.title}</h2>
        <p>{post.description}</p>
      </div>
      {user.email === post.email ? (
        <>
          <Link to={`/postEdit/${post._id}`}>
            <button className="btn-edit">Edit</button>
          </Link>
          <button className="btn-delete" onClick={() => PostDelete(post._id)}>
            Delete
          </button>
        </>
      ) : (
        <></>
      )}
    </div>
  );
}

export default Post;
