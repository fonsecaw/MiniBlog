import { useState } from 'react'
import styles from './Home.module.css'
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useFetchDocuments } from '../../hooks/useFetchDocuments';
import PostDetail from '../../components/posts/PostDetail';

const Home = () => {
  const navigate = useNavigate()
  const [query, setQuery] = useState('');
  const {documents: posts, loading, error} = useFetchDocuments('posts');

  const handleSubmit = (e) => {
    e.preventDefault();

    if (query) {
      return navigate(`/pesquisa?q=${query}`);
    }

  }

  return (
    <div className={styles.home}>
        <h1>Veja os nossos posts mais recentes</h1>
        <form onSubmit={handleSubmit} className={styles.search_form}>
          <input
            type="text"
            name='search'
            value={query}
            placeholder='Ou busque por tags...'
            onChange={e => setQuery(e.target.value)}
          />
          <button type='submit' className="btn btn_dark">Pesquisar</button>
        </form>
        <div>
          {loading && <p>Carregando...</p>}
          {!posts && posts.length === 0 ? (
            <div className={styles.noposts}>
              <p>Não foram encontrados posts</p>
              <Link to='/posts/create' className='btn'>Criar primeiro post</Link>
            </div>
          ) : (
            posts.map(post => (
                <PostDetail key={post.id} post={post}/>
            ))
          )}
        </div>
    </div>
  )
}

export default Home