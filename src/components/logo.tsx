import Image from 'next/image';
import logo from './assets/logo.png';

const Logo = () => {
  return <Image src={logo} alt="MiniFyn Logo" width={32} height={32} />;
};

export default Logo;
