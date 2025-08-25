import { useNavigate, useLocation } from "react-router-dom";
import "../styles/components/SubNav.css";

type NavButton = {
    path: string;
    line1: string;
    line2: string;
};

type SubNavProps = {
    buttons: NavButton[];
};

const SubNav = ({ buttons }: SubNavProps) => {
    const navigate = useNavigate();
    const location = useLocation();

    const isActive = (path: string) => location.pathname === path;

    return (
        <div className="subnav-container mb-4">
            <nav className="subnav-nav">
                {buttons.map(({ path, line1, line2 }) => (
                    <button
                        key={path}
                        className={`brutalist-button ${isActive(path) ? "active" : ""}`}
                        onClick={() => navigate(path)}
                        type="button"
                    >
                        <div className="ms-logo">
                            <div className="ms-logo-square"></div>
                            <div className="ms-logo-square"></div>
                            <div className="ms-logo-square"></div>
                            <div className="ms-logo-square"></div>
                        </div>
                        <div className="button-text">
                            <span>{line1}</span>
                            <span>{line2}</span>
                        </div>
                    </button>
                ))}
            </nav>
        </div>
    );
};

export default SubNav;
