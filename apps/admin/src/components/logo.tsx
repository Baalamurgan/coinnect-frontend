import Image from 'next/image';
import Link from 'next/link';

export const Logo = ({
  height = 140,
  width = 563
}: {
  height?: number;
  width?: number;
}) => (
  <Link href='/'>
    <Image src='/logos/logo.svg' alt='logo' height={70} width={174} priority />
  </Link>
);
