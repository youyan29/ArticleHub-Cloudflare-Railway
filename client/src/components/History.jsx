import api from "../api";

function History({ history, onRestore }) {
  const restore = async (v) => {
    await api.post(`http://localhost:5000/restore/${v._id}`);
    onRestore?.();
  };

  const edit = async (v) => {
    const t = prompt("edit", v.message);
    if (!t?.trim()) return;

    await api.put(`http://localhost:5000/history/${v._id}`, {
      message: t.trim(),
    });

    onRestore?.();
  };

  const sortedHistory = [...history].sort(
    (a, b) => new Date(b.time) - new Date(a.time),
  );

  return (
    <div className="history">
      <h3 className="history-title">历史记录</h3>

      <div className="history-list">
        {sortedHistory.map((v) => (
          <div className="history-card" key={v._id}>
            <div className="history-main">
              <div className="history-message">{v.message}</div>

              <div className="history-time">
                {new Date(v.time).toLocaleString()}
              </div>
            </div>

            <div className="history-actions">
              <button onClick={() => edit(v)}>edit</button>

              {!v.isRestore && (
                <button onClick={() => restore(v)}>restore</button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default History;
