import { Link } from 'react-router-dom';

import styles from './Navbar.module.css';

import Logo from '../../assets/img/logo.png';

// context
import { useContext } from 'react';
import { Context } from '../../context/UserContext';

function Navbar () {
    const { authenticated, logout } = useContext(Context);
    return (
        <nav className={styles.navbar}>
            <div className={styles.navbar_logo}>
                <img src={Logo} alt='Encontra-Posto'/>
                <h2>Encontra-Posto</h2>
            </div>
            <ul>
                <li><Link to='/'>Ver Postos</Link></li>
                { authenticated ? (
                    <>
                        <li><Link to='/user/profile'>Meu Perfil</Link></li>
                        <li><Link to='/fuel/myfuels'>Meus Postos</Link></li>
                        <li onClick={logout}>Sair</li>
                    </>
                ) : (
                    <>
                        <li><Link to='/register'>Cadastrar</Link></li>
                        <li><Link to='/login'>Entrar</Link></li>
                    </>
                )}
            </ul>
        </nav>
    );
}

export default Navbar;