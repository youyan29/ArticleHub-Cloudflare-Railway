import Sidebar from "../components/Sidebar";
import Editor from "../components/Editor";
import History from "../components/History";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api";
import "../styles/layout.css";

export default function EditorPage() {
  const { articleId } = useParams();
  const nav = useNavigate();

  const [chapters, setChapters] = useState([]);
  const [currentChapter, setCurrentChapter] = useState(null);
  const [history, setHistory] = useState([]);
  const [showSidebar, setShowSidebar] = useState(true);
  const [showHistory, setShowHistory] = useState(true);
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
  const [articleTitle, setArticleTitle] = useState("");

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const res = await api.get(`/article/${articleId}`);
        setArticleTitle(res.data.title || "未命名书籍");
      } catch (err) {
        console.log("获取文章失败", err);
      }
    };
    fetchArticle();
  }, [articleId]);

  const refreshAll = async (chapterId) => {
    try {
      const res = await api.get(`/chapters/${articleId}`);
      const data = res.data;
      setChapters(data);
      if (!data.length) {
        setCurrentChapter(null);
        setHistory([]);
        return;
      }

      const savedChapterId = localStorage.getItem(
        `currentChapter_${articleId}`,
      );

      let target =
        data.find((c) => c._id === chapterId) ||
        data.find((c) => c._id === savedChapterId) ||
        data[data.length - 1];
      setCurrentChapter(target);

      const h = await api.get(`/history/${target._id}`);
      setHistory(h.data);
    } catch (err) {
      if (err.response?.status === 401) {
        localStorage.removeItem("token");
        nav("/login");
      }
    }
  };

  const selectChapter = async (chapter) => {
    setCurrentChapter(chapter);
    localStorage.setItem(`currentChapter_${articleId}`, chapter._id);
    const res = await api.get(`/history/${chapter._id}`);
    setHistory(res.data);
  };

  const deleteChapter = async (id) => {
    await api.delete(`/chapter/${id}`);
    if (currentChapter?._id === id) {
      localStorage.removeItem(`currentChapter_${articleId}`);
    }
    await refreshAll(currentChapter?._id === id ? null : currentChapter?._id);
  };

  useEffect(() => {
    refreshAll();
  }, []);
  useEffect(() => {
    localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <div className={`layout ${theme}`}>
      {showSidebar && (
        <Sidebar
          articleId={articleId}
          chapters={chapters}
          onSelectChapter={selectChapter}
          refresh={() => refreshAll(currentChapter?._id)}
          onDeleteChapter={deleteChapter}
        />
      )}

      <div className="editor-area">
        <div className="topbar">
          <button onClick={() => nav("/")}>← Home</button>
          <button onClick={() => setShowSidebar(!showSidebar)}>☰</button>
          <button onClick={() => setShowHistory(!showHistory)}>🕘</button>
          <select value={theme} onChange={(e) => setTheme(e.target.value)}>
            <option value="light">☀ Light</option>
            <option value="dark">🌙 Dark</option>
            <option value="eye">🌿 Eye</option>
          </select>
        </div>

        <Editor
          chapter={currentChapter}
          refresh={() => refreshAll(currentChapter?._id)}
          articleTitle={articleTitle}
        />
      </div>

      {showHistory && (
        <History
          history={history}
          onRestore={() => refreshAll(currentChapter?._id)}
        />
      )}
    </div>
  );
}
