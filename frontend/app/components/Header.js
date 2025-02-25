import Link from 'next/link';

function Header() {
    return (
        <nav className="bg-gray-800 text-white p-4 flex justify-between">
            <div className="flex items-center">
                <Link href="/">
                    Home
                </Link>
            </div>
            <ul className="flex items-center space-x-4">
                <li>
                    <Link href="/sell-your-car">
                        Sell Your Car
                    </Link>
                </li>
                <li>
                    <Link href="/subscribe">
                        Subscribe
                    </Link>
                </li>
            </ul>
        </nav>
    );
}

export default Header;
