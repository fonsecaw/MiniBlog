import { Link } from 'react-router-dom';
import PostDetail from '../../components/posts/PostDetail';
import { useFetchDocuments } from '../../hooks/useFetchDocuments';
import { useQuery } from '../../hooks/useQuery';
import styles from './Search.module.css';

const Search = () => {
  const query = useQuery();
  const search = query.get('q');

  const { documents: posts } = useFetchDocuments('posts', search);

  return (
    <div className={styles.search_container}>
      <h2>Search</h2>
      <div className={styles.search_container}>
        {posts.length === 0 ? (
          <div className={styles.noposts}>
            <p>Não foram encontrados posts a partir da sua pesquisa...</p>
            <Link to='/' className='btn btn_dark'>
              Voltar
            </Link>
          </div>
        ) : (
          posts.map(post => (
            <PostDetail key={post.id} post={post} />
          ))
        )}
      </div>
    </div>
  )
}

export default Search