import { useState } from 'react'
import styles from './CreatePost.module.css'
import { useInsertDocument } from '../../hooks/useInsertDocuments';
import { useAuthValue } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const CreatePost = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [image, setImage] = useState('');
  const [body, setBody] = useState('');
  const [tags, setTags] = useState('');
  const [formErrors, setFormErrors] = useState('');

  const { insertDocument, response } = useInsertDocument('posts');
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

    // envio
    insertDocument({
      title,
      image,
      body,
      tagsArray,
      uid: user.uid,
      createdBy: user.displayName
    })

    navigate('/');
  }

  return (
    <div className={styles.create_post}>
      <h2>Criar Post</h2>
      <p>Escreva sobre o que quiser e compartilhe o seu conhecimento!</p>
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
          <button type="submit" className='btn'>Postar</button>
        )}
        {response.error && <p className='error'>{response.error}</p>}
        {formErrors && <p className='error'>{formErrors}</p>}
      </form>
    </div>
  )
}

export default CreatePost