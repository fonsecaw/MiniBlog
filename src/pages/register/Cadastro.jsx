import { db } from '../../firebase/config'

import styles from './Cadastro.module.css';
import { useEffect, useState } from 'react';
import { useAuthentication } from '../../hooks/useAuthentication';

const Cadastro = () => {
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const {auth, createUser, error: authError, loading } = useAuthentication();

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError('');

    if (password !== confirmPassword) {
      setError('As senhas precisam ser iguais!')
      return;
    }

    const user = {
      displayName,
      email,
      password
    }

    await createUser(user)

    setDisplayName('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
  }

  useEffect(() => {
    if (authError) setError(authError)
  }, [authError])

  return (
    <div className={styles.register}>
      <h1>Cadastre-se para postar</h1>
      <p>Crie seu usuário e compartilhe suas histórias</p>
      <form onSubmit={handleSubmit}>
        <label>
          <span>Nome:</span>
          <input
            required
            type="text"
            name='displayName'
            value={displayName}
            placeholder='Nome do usuário'
            onChange={e => setDisplayName(e.target.value)}
          />
        </label>
        <label>
          <span>E-mail:</span>
          <input
            required
            type="email"
            name='email'
            value={email}
            placeholder='E-mail do usuário'
            onChange={e => setEmail(e.target.value)}
          />
        </label>
        <label>
          <span>Senha:</span>
          <input
            required
            type="password"
            name='password'
            value={password}
            placeholder='Insira sua senha'
            onChange={e => setPassword(e.target.value)}
          />
        </label>
        <label>
          <span>Confirmação de senha:</span>
          <input
            required
            type="password"
            name='confirmPassword'
            value={confirmPassword}
            placeholder='Confirme sua senha'
            onChange={e => setConfirmPassword(e.target.value)}
          />
        </label>
        {loading ? (
        <button type='submit' className='btn' disabled>Aguarde...</button>
      ) : (
          <button type='submit' className='btn'>Cadastrar</button>
        )}
        {error && <p className='error'>{error}</p> }
      </form>
    </div>
  )
}

export default Cadastro