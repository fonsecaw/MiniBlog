import { useEffect, useState } from 'react';
import { useAuthentication } from '../../hooks/useAuthentication';
import styles from './Login.module.css';

const Login = () => {
      const [email, setEmail] = useState('');
      const [password, setPassword] = useState('');
      const [error, setError] = useState('');
    
      const { login, error: authError, loading } = useAuthentication();
    
      const handleSubmit = async (e) => {
        e.preventDefault();
    
        setError('');
    
        const user = {
          email,
          password
        }

        await login(user);
    
        setEmail('');
        setPassword('');
      }
    
      useEffect(() => {
        if (authError) setError(authError)
      }, [authError])
  
    return (
      <div className={styles.login}>
        <h1>Entrar</h1>
        <p>Faça o login para poder utilizar o sistema</p>
        <form onSubmit={handleSubmit}>
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
          {loading ? (
          <button type='submit' className='btn' disabled>Aguarde...</button>
        ) : (
            <button type='submit' className='btn'>Entrar</button>
          )}
          {error && <p className='error'>{error}</p> }
        </form>
      </div>
    )
}

export default Login