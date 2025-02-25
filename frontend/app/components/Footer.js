// components/Footer.js
function Footer() {
    return (
        <footer className="bg-gray-800 text-white p-4 text-center">
            <p>&copy; 2024 Car Auction Marketplace</p>
            <ul className="flex justify-center space-x-4 mt-2">
                <li>
                    <a href="#" className="hover:text-gray-300">Contact Us</a>
                </li>
                <li>
                    <a href="#" className="hover:text-gray-300">FAQs</a>
                </li>
                <li>
                    <a href="#" className="hover:text-gray-300">Terms & Conditions</a>
                </li>
            </ul>
        </footer>
    );
}

export default Footer;
