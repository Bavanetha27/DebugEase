import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ProfilePage = () => {
  const [snippets, setSnippets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const userEmail = localStorage.getItem('email'); 

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await axios.get(`https://debugease-2ovx.onrender.com/history/${userEmail}`);
        setSnippets(response.data);
      } catch (err) {
        setError('Failed to load history');
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [userEmail]);

  if (loading) return <p className="text-white text-center mt-20 text-lg font-medium">Loading history...</p>;
  if (error) return <p className="text-red-500 text-center mt-20">{error}</p>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-100 p-8 max-w-full mx-auto">
      <header className="mb-12 text-center">
        <h1 className="text-4xl font-extrabold tracking-wide mb-2">Welcome Back!</h1>
        <p className="text-indigo-400 text-lg font-semibold">User: {userEmail}</p>
      </header>

      <section>
        <h2 className="text-3xl font-bold mb-8 border-b border-indigo-600 pb-2">Your Saved Code History</h2>
        {snippets.length === 0 ? (
          <p className="text-gray-400 text-center text-xl mt-20">No snippets saved yet. Start coding!</p>
        ) : (
          snippets.map((snippet, index) => (
            <article
              key={index}
              className="bg-gray-800 rounded-xl shadow-xl p-6 mb-8 transition-transform transform hover:scale-[1.02] hover:shadow-indigo-600/50"
              role="region"
              aria-label={`Code snippet saved on ${new Date(snippet.savedAt).toLocaleString()}`}
            >
              <div className="flex justify-between items-center mb-3">
                <time className="text-sm text-gray-400 italic">
                  Saved at: {new Date(snippet.savedAt).toLocaleString()}
                </time>
                <span className="bg-indigo-600 text-indigo-50 text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wide">
                  {snippet.language}
                </span>
              </div>

              <pre className="bg-gray-900 rounded-lg p-4 overflow-x-auto text-sm font-mono text-indigo-300 whitespace-pre-wrap break-words mb-4">
                <code>{snippet.code}</code>
              </pre>

              <div className="space-y-2 text-gray-200">
                <p>
                  <strong className="text-indigo-400">Explanation:</strong> {snippet.explanation}
                </p>
                <p>
                  <strong className="text-indigo-400">Suggestion:</strong> {snippet.suggestion}
                </p>
              </div>
            </article>
          ))
        )}
      </section>
    </div>
  );
};

export default ProfilePage;
