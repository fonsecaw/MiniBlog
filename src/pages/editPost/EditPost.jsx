import styles from './EditPost.module.css'

import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import { useAuthValue } from '../../context/AuthContext';
import { useInsertDocument } from '../../hooks/useInsertDocuments';
import { useFetchDocument } from '../../hooks/useFetchDocument';
import { useUpdateDocument } from '../../hooks/useUpdateDocument';

const EditPost = () => {
  const { id } = useParams();
  const { document: post } = useFetchDocument('posts', id);

  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [image, setImage] = useState(undefined);
  const [body, setBody] = useState('');
  const [tags, setTags] = useState('');
  const [formErrors, setFormErrors] = useState('');

  useEffect(() => {
    if (post) {
      setTitle(post.title);
      setBody(post.body);
      setImage(post.image);

      if (post.tagsArray && Array.isArray(post.tagsArray)) {
        const textTags = post.tagsArray.join(", ");
        setTags(textTags);
      } else {
        setTags('');
      }

    };
  }, [post])

  const { updateDocument, response } = useUpdateDocument('posts');
  const { user } = useAuthValue();

  const handeSubmit = async (e) => {
    e.preventDefault();
    setFormErrors('');

    // validações
    try {
      new URL(image);
    } catch (e) {
      setFormErrors('A imagem precisa ser uma URL')
    }

    const tagsArray = tags.split(',').map(tag => tag.trim().toLowerCase());

    if (!title || !image || !tags || !body) {
      setFormErrors('Por favor, preencha todos os campos')
    }

    if (formErrors) return;

    const data = {
      title,
      image,
      body,
      tagsArray,
      uid: user.uid,
      createdBy: user.displayName
    }

    updateDocument(id, data)

    navigate('/dashboard');
  }

  return (
    <div className={styles.edit_post}>
      {!post && <p>Carregando...</p> }
      {post && (
        <>
          <h2>Editando Post</h2>
          <p>Altere os dados do post como desejar</p>
          <form onSubmit={handeSubmit}>
            <label>
              <span>Título:</span>
              <input
                required
                type="text"
                name="title"
                value={title}
                placeholder='Pense num bom título...'
                onChange={e => setTitle(e.target.value)}
              />
            </label>
            <label>
              <span>URL da imagem:</span>
              <input
                required
                type="text"
                name="image"
                value={image}
                placeholder='Insira uma imagem que representa o seu post'
                onChange={e => setImage(e.target.value)}
              />
            </label>
            <p className={styles.preview}>Preview da imagem atual:</p>
            <img src={image} alt={title} className={styles.img_preview} />
            <label>
              <span>Conteúdo:</span>
              <textarea
                required
                name="body"
                value={body}
                placeholder='Insira o conteúdo do post'
                onChange={e => setBody(e.target.value)}
              ></textarea>
            </label>
            <label>
              <span>Tags:</span>
              <input
                required
                type="text"
                name="tags"
                value={tags}
                placeholder='Insira as tags separadas por vírgula'
                onChange={e => setTags(e.target.value)}
              />
            </label>
            {response.loading ? (
              <button type="submit" className='btn' disabled>Aguarde...</button>
            ) : (
              <button type="submit" className='btn'>Editar</button>
            )}
            {response.error && <p className='error'>{response.error}</p>}
            {formErrors && <p className='error'>{formErrors}</p>}
          </form>
        </>
      )}
    </div>
  )
}

export default EditPost