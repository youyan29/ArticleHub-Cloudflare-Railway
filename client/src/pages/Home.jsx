import api from "../api";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/home.css";
import "../styles/theme.css";

export default function Home() {
  const nav = useNavigate();
  const [articles, setArticles] = useState([]);
  const [title, setTitle] = useState("");
  const [search, setSearch] = useState("");
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    nav("/login");
  };

  // theme
  useEffect(() => {
    document.body.className = theme;
    localStorage.setItem("theme", theme);
  }, [theme]);

  // load articles
  const load = async () => {
    try {
      const res = await api.get("/articles");
      setArticles(res.data);
    } catch (err) {
      if (err.response?.status === 401) logout();
    }
  };

  useEffect(() => { load(); }, []);

  const create = async () => {
    if (!title.trim()) return;
    try {
      await api.post("/article", { title: title.trim(), cover: { type: "emoji", value: "📘" } });
      setTitle("");
      load();
    } catch (err) { alert(err.response?.data?.message || "create failed"); }
  };

  const editTitle = async (a) => {
    const t = prompt("edit title", a.title);
    if (!t) return;
    try {
      await api.put(`/article/${a._id}`, { title: t });
      load();
    } catch (err) { alert(err.response?.data?.message || "update failed"); }
  };

  const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append("image", file);
    const res = await api.post("/upload", formData);
    return res.data.url;
  };

  const editCover = async (a) => {
    const file = document.createElement("input");
    file.type = "file";
    file.accept = "image/*";
    file.onchange = async (e) => {
      const img = e.target.files[0];
      if (!img) return;
      const url = await uploadImage(img);
      await api.put(`/article/${a._id}`, { title: a.title, cover: { type: "image", value: url } });
      load();
    };
    file.click();
  };

  const del = async (id) => {
    if (!window.confirm("Delete this article?")) return;
    await api.delete(`/article/${id}`);
    load();
  };

  const filtered = articles.filter(a => a.title.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="container">
      <div className="sidebar-nav">
        <h2>ArticleHub</h2>
        <div>🏠 Home</div>
        <button style={{ position: "absolute", bottom: 20, left: 20, width: 80}} onClick={logout}>登出</button>
      </div>

      <div className="main">
        <div className="top">
          <input placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} />
          <select value={theme} onChange={(e) => setTheme(e.target.value)}>
            <option value="light">☀ Light</option>
            <option value="dark">🌙 Dark</option>
            <option value="eye">🌿 Eye</option>
          </select>
        </div>

        <div className="create-row">
          <input placeholder="new article..." value={title} onChange={(e) => setTitle(e.target.value)} />
          <button onClick={create}>＋</button>
        </div>

        <div className="grid">
          {filtered.map((a) => (
            <div key={a._id} className="card" onClick={() => nav(`/editor/${a._id}`)}>
              <div className="card-top">
                <div className="cover" onClick={(e) => { e.stopPropagation(); editCover(a); }}>
                  {a.cover?.type === "image" ? <img src={a.cover.value} /> : (a.cover?.value || "📘")}
                </div>
                <div className="actions">
                  <button onClick={(e) => { e.stopPropagation(); editTitle(a); }}>✎</button>
                  <button onClick={(e) => { e.stopPropagation(); del(a._id); }}>🗑</button>
                </div>
              </div>
              <h2>{a.title}</h2>
              <div>chapters: {a.chapterCount || 0}</div>
              <div>updated: {a.updatedAt ? new Date(a.updatedAt).toLocaleString() : "-"}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}