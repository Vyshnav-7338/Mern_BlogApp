import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
function PostEdit() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const navigate = useNavigate();
  const { id } = useParams();
  const handlePost = (e) => {
    e.preventDefault();
    axios
      .put("http://localhost:3001/postEdit/" + id, { title, description })
      .then((res) => {
        if (res.data === "Success") {
          navigate("/");
        }
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    axios
      .get("http://localhost:3001/getPostById/" + id)
      .then((result) => {
        setTitle(result.data.title);
        setDescription(result.data.description);
      })
      .catch((err) => console.log(err));
  }, []);
  return (
    <div className="post_container">
      <div className="post_form">
        <form onSubmit={handlePost}>
          <h2>Update Post</h2>
          <input
            type="text"
            placeholder="Enter Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <textarea
            name="desc"
            id="desc"
            cols="30"
            rows="10"
            placeholder="Enter Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          ></textarea>
          <button>Update</button>
        </form>
      </div>
    </div>
  );
}

export default PostEdit;
