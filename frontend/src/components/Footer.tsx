export default function Footer() {
    return (
        <footer className="bg-black text-white py-4 border-top border-secondary mt-auto">
            <div className="container text-center">
                {/* Social Icons */}
                <div className="mb-3">
                    <a href="#" className="text-white me-3 fs-5">
                        <i className="bi bi-facebook"></i>
                    </a>
                    <a href="#" className="text-white me-3 fs-5">
                        <i className="bi bi-twitter"></i>
                    </a>
                    <a href="#" className="text-white me-3 fs-5">
                        <i className="bi bi-linkedin"></i>
                    </a>
                    <a href="#" className="text-white fs-5">
                        <i className="bi bi-github"></i>
                    </a>
                </div>

                {/* Contact Info */}
                <div className="mb-2">
                    <p className="mb-1">
                        <i className="bi bi-envelope-fill me-2"></i> contact@technozor.ai
                    </p>
                    <p className="mb-0">
                        <i className="bi bi-telephone-fill me-2"></i> +1 234 567 890
                    </p>
                </div>

                {/* Copyright */}
                <div className="small mt-3">© 2024 TECHNOZOR. All rights reserved.</div>
            </div>
        </footer>
    );
}